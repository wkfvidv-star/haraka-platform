# Consent Flow Testing Suite - Haraka Platform
# مجموعة اختبارات تدفق الموافقة - منصة حركة
# Created: 2024-01-20
# Environment: Staging Only

## Test Plan Overview / نظرة عامة على خطة الاختبار

### Test Environment Setup
- **Environment**: Staging
- **Database**: PostgreSQL with RLS enabled
- **Frontend**: React with Shadcn-UI
- **Backend**: Next.js API routes
- **Testing Date**: 2024-01-20

### Test Users Setup
```sql
-- Test users for different roles
INSERT INTO users (id, username, full_name, email, role, school_id, created_at) VALUES
('student_test_001', 'ahmed_test', 'أحمد محمد الاختبار', 'ahmed@test.com', 'student', 'school_001', now()),
('guardian_test_001', 'mohamed_test', 'محمد الاختبار', 'mohamed@test.com', 'guardian', null, now()),
('teacher_test_001', 'sara_test', 'سارة أحمد الاختبار', 'sara@test.com', 'teacher', 'school_001', now()),
('admin_test_001', 'admin_test', 'مدير الاختبار', 'admin@test.com', 'admin', null, now());

-- Link guardian to student
INSERT INTO user_relationships (parent_id, child_id, relationship_type, is_active) VALUES
('guardian_test_001', 'student_test_001', 'guardian', true);
```

---

## Test 1: Consent Modal Interface / واجهة نافذة الموافقة

### Test Cases:
1. **Modal Display Before First Upload**
2. **Arabic Text Clarity**
3. **Button Functionality**
4. **Modal Closure After Consent**

### Expected Results:
- ✅ Modal appears before first video upload for minors
- ✅ Arabic text is clear and RTL-formatted
- ✅ Both "أوافق" and "لا أوافق" buttons are functional
- ✅ Modal closes after consent is granted
- ✅ Upload interface becomes available

---

## Test 2: Database and API Endpoints / قاعدة البيانات ونقاط API

### Test Cases:

#### 2.1 GET /api/consents
```bash
# Test getting consent status
curl -X GET "http://localhost:3000/api/consents?childId=student_test_001&guardianId=guardian_test_001" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "consent_id": null,
    "status": "none",
    "granted_at": null,
    "revoked_at": null,
    "version": "v1.0"
  }
}
```

#### 2.2 POST /api/consents
```bash
# Test creating consent
curl -X POST "http://localhost:3000/api/consents" \
  -H "Content-Type: application/json" \
  -d '{
    "childId": "student_test_001",
    "guardianId": "guardian_test_001",
    "scope": "video_upload_analysis",
    "version": "v1.0",
    "consentText": "أوافق على رفع وتحليل مقاطع الفيديو الرياضية",
    "acceptedTerms": {
      "dataCollection": true,
      "videoAnalysis": true,
      "dataStorage": true,
      "dataSharing": true,
      "rightsAcknowledged": true
    }
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "consentId": "uuid-generated",
    "message": "Consent granted successfully"
  }
}
```

#### 2.3 Database Verification
```sql
-- Verify consent record creation
SELECT 
    consent_id,
    child_id,
    guardian_id,
    accepted_at,
    revoked_at,
    scope,
    version,
    ip_address,
    user_agent
FROM consents 
WHERE child_id = 'student_test_001'
ORDER BY created_at DESC;
```

#### 2.4 DELETE /api/consents/:id
```bash
# Test revoking consent
curl -X DELETE "http://localhost:3000/api/consents/{consent_id}?guardianId=guardian_test_001&reason=Test revocation" \
  -H "Content-Type: application/json"
```

---

## Test 3: Video Upload Prevention / منع رفع الفيديو بدون موافقة

### Test Cases:

#### 3.1 Upload Without Consent
```javascript
// Simulate video upload attempt without consent
const testVideoUpload = async () => {
  const formData = new FormData();
  formData.append('video', testVideoFile);
  formData.append('studentId', 'student_test_001');
  
  const response = await fetch('/api/video/upload', {
    method: 'POST',
    body: formData
  });
  
  return response;
};
```

**Expected Behavior:**
- ❌ Upload should be rejected
- 📝 Error message: "Guardian consent required before video upload"
- 📊 Risk score 8 logged in audit_logs
- 🚫 No video file stored

#### 3.2 Upload Attempt Logging
```sql
-- Check blocked upload attempts
SELECT 
    user_id,
    action,
    resource_type,
    success,
    error_message,
    risk_score,
    created_at
FROM audit_logs 
WHERE action = 'UPLOAD_VIDEO_BLOCKED'
AND user_id = 'student_test_001'
ORDER BY created_at DESC;
```

---

## Test 4: Consent Revocation Impact / أثر سحب الموافقة

### Test Cases:

#### 4.1 Revoke Active Consent
```sql
-- Revoke consent and check impact
UPDATE consents 
SET revoked_at = now(), updated_at = now()
WHERE child_id = 'student_test_001' 
AND revoked_at IS NULL;
```

#### 4.2 Video Access After Revocation
```javascript
// Test video access after consent revocation
const testVideoAccess = async (videoId) => {
  const response = await fetch(`/api/video/${videoId}/view`, {
    headers: {
      'Authorization': 'Bearer student_token'
    }
  });
  
  return response.status; // Should be 403 Forbidden
};
```

#### 4.3 Audit Log Verification
```sql
-- Check revocation logging
SELECT 
    user_id,
    action,
    resource_type,
    old_values,
    new_values,
    risk_score,
    created_at
FROM audit_logs 
WHERE action = 'CONSENT_REVOKED'
AND resource_id LIKE '%student_test_001%'
ORDER BY created_at DESC;
```

---

## Test 5: Encryption and Decryption / التشفير وفك التشفير

### Test Cases:

#### 5.1 Video File Encryption
```javascript
// Test video upload with encryption
const testEncryptedUpload = async () => {
  const videoFile = new File(['test video content'], 'test.mp4', {
    type: 'video/mp4'
  });
  
  const startTime = performance.now();
  
  const response = await uploadEncryptedVideo(videoFile, 'student_test_001');
  
  const endTime = performance.now();
  const encryptionLatency = endTime - startTime;
  
  return { response, encryptionLatency };
};
```

#### 5.2 Storage Verification
```bash
# Check that stored file is encrypted (unreadable)
file /storage/videos/encrypted/student_test_001_*.enc
hexdump -C /storage/videos/encrypted/student_test_001_*.enc | head -5
```

**Expected Output:**
```
file: encrypted data
00000000  89 50 4e 47 0d 0a 1a 0a  00 00 00 0d 49 48 44 52  |.PNG........IHDR|
```

#### 5.3 Signed URL Generation
```javascript
// Test signed URL for authorized access
const testSignedURL = async (videoId, userId) => {
  const startTime = performance.now();
  
  const signedUrl = await generateSignedURL(videoId, userId, 3600); // 1 hour
  
  const endTime = performance.now();
  const decryptionLatency = endTime - startTime;
  
  // Verify URL works for authorized user
  const response = await fetch(signedUrl);
  
  return {
    signedUrl,
    decryptionLatency,
    accessible: response.ok
  };
};
```

#### 5.4 Unauthorized Access Test
```javascript
// Test unauthorized access attempt
const testUnauthorizedAccess = async (videoId, unauthorizedUserId) => {
  try {
    const signedUrl = await generateSignedURL(videoId, unauthorizedUserId, 3600);
    return { success: false, error: 'Should not generate URL for unauthorized user' };
  } catch (error) {
    return { success: true, error: error.message };
  }
};
```

---

## Test 6: Row Level Security (RLS) Policies / سياسات الوصول

### Test Cases:

#### 6.1 Student Access Test
```sql
-- Test as student
SET SESSION AUTHORIZATION 'student_test_001';
SELECT * FROM consents WHERE child_id = 'student_test_001'; -- Should work
SELECT * FROM consents WHERE child_id = 'other_student'; -- Should fail
```

#### 6.2 Guardian Access Test
```sql
-- Test as guardian
SET SESSION AUTHORIZATION 'guardian_test_001';
SELECT * FROM consents WHERE guardian_id = 'guardian_test_001'; -- Should work
SELECT * FROM consents WHERE guardian_id = 'other_guardian'; -- Should fail
```

#### 6.3 Teacher Access Test
```sql
-- Test as teacher
SET SESSION AUTHORIZATION 'teacher_test_001';
SELECT c.* FROM consents c
JOIN users u ON c.child_id = u.id
WHERE u.school_id = 'school_001'; -- Should work for same school
```

#### 6.4 Admin Access Test
```sql
-- Test as admin
SET SESSION AUTHORIZATION 'admin_test_001';
SELECT * FROM consents; -- Should work (full access)
```

#### 6.5 Ministry/Directorate Access Test
```sql
-- Test anonymized access
SET SESSION AUTHORIZATION 'ministry_user';
SELECT * FROM anonymized_student_performance; -- Should work
SELECT * FROM consents; -- Should fail (no direct access)
```

---

## Test 7: Comprehensive Audit Logging / سجل التدقيق الشامل

### Test Cases:

#### 7.1 Consent Creation Logging
```sql
-- Verify consent creation is logged
SELECT 
    user_id,
    user_role,
    action,
    resource_type,
    new_values,
    risk_score,
    ip_address,
    created_at
FROM audit_logs 
WHERE action = 'CONSENT_GRANTED'
AND user_id = 'guardian_test_001'
ORDER BY created_at DESC;
```

#### 7.2 Video Upload Attempt Logging
```sql
-- Verify upload attempts are logged
SELECT 
    user_id,
    action,
    resource_type,
    success,
    error_message,
    meta,
    risk_score
FROM audit_logs 
WHERE resource_type = 'exercise_session'
AND user_id = 'student_test_001'
ORDER BY created_at DESC;
```

#### 7.3 Data Decryption Logging
```sql
-- Verify decryption events are logged
SELECT 
    user_id,
    action,
    resource_type,
    new_values->>'purpose' as purpose,
    risk_score,
    created_at
FROM audit_logs 
WHERE action = 'DECRYPT_DATA'
ORDER BY created_at DESC;
```

#### 7.4 Report Viewing Logging
```sql
-- Verify report access is logged
SELECT 
    user_id,
    user_role,
    action,
    resource_id,
    new_values->>'student_id' as accessed_student,
    risk_score
FROM audit_logs 
WHERE action = 'VIEW_REPORT'
ORDER BY created_at DESC;
```

---

## Test Execution Results / نتائج تنفيذ الاختبارات

### Test Results Summary Table

| Test Case | Status | Execution Time | Notes |
|-----------|--------|----------------|-------|
| 1.1 Modal Display | ⏳ Pending | - | - |
| 1.2 Arabic Text | ⏳ Pending | - | - |
| 1.3 Button Function | ⏳ Pending | - | - |
| 2.1 GET API | ⏳ Pending | - | - |
| 2.2 POST API | ⏳ Pending | - | - |
| 2.3 DB Verification | ⏳ Pending | - | - |
| 2.4 DELETE API | ⏳ Pending | - | - |
| 3.1 Upload Prevention | ⏳ Pending | - | - |
| 3.2 Audit Logging | ⏳ Pending | - | - |
| 4.1 Consent Revocation | ⏳ Pending | - | - |
| 4.2 Access Impact | ⏳ Pending | - | - |
| 5.1 Encryption | ⏳ Pending | - | - |
| 5.2 Storage Security | ⏳ Pending | - | - |
| 5.3 Signed URLs | ⏳ Pending | - | - |
| 6.1-6.5 RLS Policies | ⏳ Pending | - | - |
| 7.1-7.4 Audit Logs | ⏳ Pending | - | - |

### Performance Metrics
- **Encryption Latency**: TBD ms
- **Decryption Latency**: TBD ms
- **API Response Time**: TBD ms
- **Database Query Time**: TBD ms

### Issues Found
- [ ] Issue 1: Description
- [ ] Issue 2: Description
- [ ] Issue 3: Description

### Recommendations
1. **Performance Optimization**: TBD
2. **Security Enhancement**: TBD
3. **User Experience**: TBD

---

## Next Steps / الخطوات التالية

1. Execute all test cases systematically
2. Document results with screenshots and logs
3. Fix any identified issues
4. Re-run failed tests
5. Generate final approval report

---

**Note**: This is a comprehensive test plan. Actual execution will be performed step by step with detailed logging and documentation.