# Manual Testing Checklist - Consent Flow
# قائمة الاختبارات اليدوية - تدفق الموافقة

## Pre-Testing Setup / إعداد ما قبل الاختبار

### 1. Environment Verification
- [ ] Confirm testing on STAGING environment only
- [ ] Database connection established
- [ ] Test users created and configured
- [ ] API endpoints accessible

### 2. Test Data Setup
```sql
-- Execute these SQL commands to set up test data
-- تنفيذ هذه الأوامر SQL لإعداد بيانات الاختبار

-- Create test users
INSERT INTO users (id, username, full_name, email, role, school_id, created_at) VALUES
('student_test_001', 'ahmed_test', 'أحمد محمد الاختبار', 'ahmed@test.com', 'student', 'school_001', now()),
('guardian_test_001', 'mohamed_test', 'محمد الاختبار', 'mohamed@test.com', 'guardian', null, now()),
('teacher_test_001', 'sara_test', 'سارة أحمد الاختبار', 'sara@test.com', 'teacher', 'school_001', now()),
('admin_test_001', 'admin_test', 'مدير الاختبار', 'admin@test.com', 'admin', null, now());

-- Link guardian to student
INSERT INTO user_relationships (parent_id, child_id, relationship_type, is_active) VALUES
('guardian_test_001', 'student_test_001', 'guardian', true);

-- Verify setup
SELECT u.username, u.role, ur.relationship_type 
FROM users u 
LEFT JOIN user_relationships ur ON u.id = ur.child_id OR u.id = ur.parent_id
WHERE u.username LIKE '%test%';
```

---

## Test 1: Consent Modal Interface / واجهة نافذة الموافقة

### 1.1 Modal Display Test
**Steps:**
1. Login as student (ahmed_test)
2. Navigate to video upload page
3. Attempt to upload a video file

**Expected Results:**
- [ ] Consent modal appears automatically
- [ ] Modal blocks video upload interface
- [ ] Modal displays in Arabic (RTL)
- [ ] Modal shows student and guardian names correctly

**Screenshot Location:** `screenshots/test1-1-modal-display.png`

### 1.2 Arabic Text Clarity Test
**Steps:**
1. Review all text in the consent modal
2. Check RTL formatting
3. Verify font rendering

**Expected Results:**
- [ ] All Arabic text is clear and readable
- [ ] Text flows right-to-left correctly
- [ ] No text overflow or truncation
- [ ] Proper Arabic typography

**Screenshot Location:** `screenshots/test1-2-arabic-text.png`

### 1.3 Button Functionality Test
**Steps:**
1. Click "لا أوافق" (Disagree) button
2. Observe behavior
3. Reopen modal and click "أوافق" (Agree) button
4. Complete consent process

**Expected Results:**
- [ ] "لا أوافق" shows rejection message
- [ ] "أوافق" is disabled until all terms accepted
- [ ] All checkboxes must be checked to enable "أوافق"
- [ ] Buttons respond correctly to clicks

**Screenshot Location:** `screenshots/test1-3-button-functionality.png`

### 1.4 Modal Closure Test
**Steps:**
1. Complete consent process successfully
2. Verify modal closes
3. Check upload interface availability

**Expected Results:**
- [ ] Modal closes after successful consent
- [ ] Upload interface becomes available
- [ ] No modal reappears on same session

**Screenshot Location:** `screenshots/test1-4-modal-closure.png`

---

## Test 2: Database and API Verification / التحقق من قاعدة البيانات وAPI

### 2.1 GET /api/consents Test
**Steps:**
1. Open browser developer tools
2. Execute API call:
```javascript
fetch('/api/consents?childId=student_test_001&guardianId=guardian_test_001')
  .then(response => response.json())
  .then(data => console.log('GET Response:', data));
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

**Verification:**
- [ ] Response status 200
- [ ] Correct JSON structure
- [ ] Response time < 500ms

**Log Location:** `logs/test2-1-get-api.log`

### 2.2 POST /api/consents Test
**Steps:**
1. Execute consent creation API call:
```javascript
fetch('/api/consents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    childId: 'student_test_001',
    guardianId: 'guardian_test_001',
    scope: 'video_upload_analysis',
    version: 'v1.0',
    consentText: 'أوافق على رفع وتحليل مقاطع الفيديو الرياضية',
    acceptedTerms: {
      dataCollection: true,
      videoAnalysis: true,
      dataStorage: true,
      dataSharing: true,
      rightsAcknowledged: true
    }
  })
})
.then(response => response.json())
.then(data => console.log('POST Response:', data));
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

**Verification:**
- [ ] Response status 201
- [ ] Consent ID generated
- [ ] Response time < 1000ms

**Log Location:** `logs/test2-2-post-api.log`

### 2.3 Database Record Verification
**Steps:**
1. Execute SQL query:
```sql
SELECT 
    consent_id,
    child_id,
    guardian_id,
    accepted_at,
    revoked_at,
    scope,
    version,
    ip_address,
    user_agent,
    consent_text
FROM consents 
WHERE child_id = 'student_test_001'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Results:**
- [ ] Record exists in consents table
- [ ] All fields populated correctly
- [ ] accepted_at timestamp recent
- [ ] revoked_at is NULL
- [ ] IP address captured
- [ ] User agent captured

**Log Location:** `logs/test2-3-database-verification.sql`

### 2.4 DELETE /api/consents/:id Test
**Steps:**
1. Use consent_id from previous test
2. Execute deletion API call:
```javascript
const consentId = 'consent_id_from_previous_test';
fetch(`/api/consents/${consentId}?guardianId=guardian_test_001&reason=Test revocation`, {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log('DELETE Response:', data));
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "message": "Consent revoked successfully"
  }
}
```

**Verification:**
- [ ] Response status 200
- [ ] Consent marked as revoked in database
- [ ] Revocation logged in audit system

**Log Location:** `logs/test2-4-delete-api.log`

---

## Test 3: Video Upload Prevention / منع رفع الفيديو

### 3.1 Upload Without Consent Test
**Steps:**
1. Ensure no active consent for student_test_001
2. Attempt video upload via API or UI
3. Capture error response

**Expected Results:**
- [ ] Upload request rejected
- [ ] Error message: "Guardian consent required before video upload"
- [ ] HTTP status 403 or 400
- [ ] No file stored on server

**API Test:**
```javascript
const formData = new FormData();
formData.append('video', testVideoFile);
formData.append('studentId', 'student_test_001');

fetch('/api/video/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log('Upload Response:', data));
```

**Log Location:** `logs/test3-1-upload-prevention.log`

### 3.2 Audit Log Verification
**Steps:**
1. Check audit_logs table for blocked upload:
```sql
SELECT 
    user_id,
    action,
    resource_type,
    success,
    error_message,
    risk_score,
    ip_address,
    created_at
FROM audit_logs 
WHERE action LIKE '%UPLOAD%'
AND user_id = 'student_test_001'
AND success = false
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- [ ] Blocked upload logged with action 'UPLOAD_VIDEO_BLOCKED'
- [ ] success = false
- [ ] High risk_score (≥ 7)
- [ ] Error message recorded

**Log Location:** `logs/test3-2-audit-verification.sql`

---

## Test 4: Consent Revocation Impact / أثر سحب الموافقة

### 4.1 Revocation Process Test
**Steps:**
1. Create active consent
2. Revoke consent via API
3. Verify revocation in database

**SQL Verification:**
```sql
-- Check revocation
SELECT 
    consent_id,
    child_id,
    guardian_id,
    accepted_at,
    revoked_at,
    updated_at
FROM consents 
WHERE child_id = 'student_test_001'
ORDER BY updated_at DESC;
```

**Expected Results:**
- [ ] revoked_at timestamp populated
- [ ] updated_at reflects revocation time
- [ ] Original accepted_at preserved

**Log Location:** `logs/test4-1-revocation-process.log`

### 4.2 Video Access After Revocation Test
**Steps:**
1. Upload video with active consent
2. Revoke consent
3. Attempt to access uploaded video
4. Verify access denied

**Expected Results:**
- [ ] Video access returns 403 Forbidden
- [ ] Video not visible in student interface
- [ ] Signed URLs not generated for revoked consent

**Log Location:** `logs/test4-2-video-access-denied.log`

### 4.3 Revocation Audit Logging Test
**Steps:**
1. Check audit logs for revocation:
```sql
SELECT 
    user_id,
    user_role,
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

**Expected Results:**
- [ ] Revocation logged with action 'CONSENT_REVOKED'
- [ ] old_values shows revoked_at: null
- [ ] new_values shows revoked_at timestamp
- [ ] Risk score 3-4 (medium)

**Log Location:** `logs/test4-3-revocation-audit.sql`

---

## Test 5: Encryption and Decryption / التشفير وفك التشفير

### 5.1 Video File Encryption Test
**Steps:**
1. Upload test video file
2. Check stored file on disk
3. Verify file is encrypted

**File System Check:**
```bash
# Check encrypted storage
ls -la /storage/videos/encrypted/
file /storage/videos/encrypted/student_test_001_*.enc
hexdump -C /storage/videos/encrypted/student_test_001_*.enc | head -5
```

**Expected Results:**
- [ ] File stored with .enc extension
- [ ] File type shows "encrypted data" or similar
- [ ] Hexdump shows encrypted bytes (not readable video headers)
- [ ] Original file not accessible

**Performance Measurement:**
- [ ] Encryption time: _____ ms
- [ ] File size increase: _____ %

**Log Location:** `logs/test5-1-encryption.log`

### 5.2 Signed URL Generation Test
**Steps:**
1. Request signed URL for authorized user
2. Measure generation time
3. Verify URL structure and expiration

**API Test:**
```javascript
const startTime = performance.now();
fetch(`/api/video/student_test_001_video/signed-url`, {
  headers: { 'Authorization': 'Bearer student_token' }
})
.then(response => response.json())
.then(data => {
  const endTime = performance.now();
  console.log('Signed URL Response:', data);
  console.log('Generation Time:', endTime - startTime, 'ms');
});
```

**Expected Results:**
- [ ] Signed URL generated successfully
- [ ] URL contains expiration timestamp
- [ ] URL accessible by authorized user
- [ ] Generation time < 100ms

**Performance Measurement:**
- [ ] URL generation time: _____ ms

**Log Location:** `logs/test5-2-signed-url.log`

### 5.3 Unauthorized Access Prevention Test
**Steps:**
1. Attempt to generate signed URL for unauthorized user
2. Attempt direct file access
3. Verify access denied

**Expected Results:**
- [ ] Signed URL generation fails for unauthorized user
- [ ] Direct file access returns 403/404
- [ ] Error logged in audit system

**Log Location:** `logs/test5-3-unauthorized-access.log`

---

## Test 6: Row Level Security (RLS) Policies / سياسات الأمان

### 6.1 Student Access Test
**Steps:**
1. Set session authorization to student
2. Query consents table
3. Verify access restrictions

**SQL Test:**
```sql
-- Test as student
SET SESSION AUTHORIZATION 'student_test_001';
SELECT * FROM consents WHERE child_id = 'student_test_001'; -- Should work
SELECT * FROM consents WHERE child_id = 'other_student_id'; -- Should fail
RESET SESSION AUTHORIZATION;
```

**Expected Results:**
- [ ] Student can see own consent records
- [ ] Student cannot see other students' records
- [ ] Appropriate error for unauthorized access

**Log Location:** `logs/test6-1-student-rls.sql`

### 6.2 Guardian Access Test
**SQL Test:**
```sql
-- Test as guardian
SET SESSION AUTHORIZATION 'guardian_test_001';
SELECT * FROM consents WHERE guardian_id = 'guardian_test_001'; -- Should work
SELECT * FROM consents WHERE guardian_id = 'other_guardian_id'; -- Should fail
RESET SESSION AUTHORIZATION;
```

**Expected Results:**
- [ ] Guardian can see consents they granted
- [ ] Guardian cannot see other guardians' consents
- [ ] Proper access control enforced

**Log Location:** `logs/test6-2-guardian-rls.sql`

### 6.3 Teacher Access Test
**SQL Test:**
```sql
-- Test as teacher
SET SESSION AUTHORIZATION 'teacher_test_001';
SELECT c.* FROM consents c
JOIN users u ON c.child_id = u.id
WHERE u.school_id = 'school_001'; -- Should work for same school
RESET SESSION AUTHORIZATION;
```

**Expected Results:**
- [ ] Teacher can see consents for students in their school
- [ ] Teacher cannot see consents for other schools
- [ ] School-based access control working

**Log Location:** `logs/test6-3-teacher-rls.sql`

### 6.4 Admin Access Test
**SQL Test:**
```sql
-- Test as admin
SET SESSION AUTHORIZATION 'admin_test_001';
SELECT * FROM consents; -- Should work (full access)
SELECT * FROM audit_logs; -- Should work
RESET SESSION AUTHORIZATION;
```

**Expected Results:**
- [ ] Admin has full access to all consent records
- [ ] Admin can access audit logs
- [ ] No access restrictions for admin role

**Log Location:** `logs/test6-4-admin-rls.sql`

### 6.5 Ministry/Directorate Access Test
**SQL Test:**
```sql
-- Test anonymized access
SET SESSION AUTHORIZATION 'ministry_user';
SELECT * FROM anonymized_student_performance; -- Should work
SELECT * FROM consents; -- Should fail (no direct access)
RESET SESSION AUTHORIZATION;
```

**Expected Results:**
- [ ] Ministry can access anonymized data only
- [ ] Ministry cannot access personal consent data
- [ ] Anonymization working correctly

**Log Location:** `logs/test6-5-ministry-rls.sql`

---

## Test 7: Comprehensive Audit Logging / سجل التدقيق الشامل

### 7.1 Consent Creation Logging Test
**SQL Verification:**
```sql
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
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- [ ] Consent creation logged with action 'CONSENT_GRANTED'
- [ ] Guardian user_id recorded
- [ ] new_values contains consent details
- [ ] Low risk_score (1-3)
- [ ] IP address captured

**Log Location:** `logs/test7-1-consent-creation-audit.sql`

### 7.2 Video Upload Attempt Logging Test
**SQL Verification:**
```sql
SELECT 
    user_id,
    action,
    resource_type,
    success,
    error_message,
    meta,
    risk_score,
    created_at
FROM audit_logs 
WHERE resource_type = 'exercise_session'
AND user_id = 'student_test_001'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- [ ] Upload attempts logged (both successful and failed)
- [ ] Metadata includes file information
- [ ] Success/failure status recorded
- [ ] Appropriate risk scores assigned

**Log Location:** `logs/test7-2-upload-audit.sql`

### 7.3 Data Decryption Logging Test
**SQL Verification:**
```sql
SELECT 
    user_id,
    action,
    resource_type,
    new_values->>'purpose' as purpose,
    risk_score,
    created_at
FROM audit_logs 
WHERE action = 'DECRYPT_DATA'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- [ ] Decryption events logged
- [ ] Purpose of decryption recorded
- [ ] Higher risk_score (4-6) for decryption
- [ ] User context captured

**Log Location:** `logs/test7-3-decryption-audit.sql`

### 7.4 Report Viewing Logging Test
**SQL Verification:**
```sql
SELECT 
    user_id,
    user_role,
    action,
    resource_id,
    new_values->>'student_id' as accessed_student,
    risk_score,
    created_at
FROM audit_logs 
WHERE action = 'VIEW_REPORT'
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Results:**
- [ ] Report access logged
- [ ] Student ID being accessed recorded
- [ ] User role and context captured
- [ ] Appropriate risk assessment

**Log Location:** `logs/test7-4-report-audit.sql`

---

## Final Verification Checklist / قائمة التحقق النهائية

### System Integration
- [ ] All components working together
- [ ] No critical errors in logs
- [ ] Performance within acceptable limits
- [ ] Security policies enforced

### Data Integrity
- [ ] All test data properly created and cleaned up
- [ ] No data corruption or inconsistencies
- [ ] Audit trail complete and accurate
- [ ] Encryption/decryption working correctly

### User Experience
- [ ] Arabic interface clear and functional
- [ ] Consent flow intuitive and complete
- [ ] Error messages helpful and appropriate
- [ ] Performance acceptable for end users

### Security Compliance
- [ ] RLS policies preventing unauthorized access
- [ ] All sensitive operations logged
- [ ] Encryption protecting data at rest
- [ ] Access controls working as designed

---

## Test Results Summary Table / جدول ملخص النتائج

| Test Category | Total Tests | Passed | Failed | Pending | Success Rate |
|---------------|-------------|--------|--------|---------|--------------|
| Modal Interface | 4 | ___ | ___ | ___ | ___% |
| API Endpoints | 4 | ___ | ___ | ___ | ___% |
| Upload Prevention | 2 | ___ | ___ | ___ | ___% |
| Consent Revocation | 3 | ___ | ___ | ___ | ___% |
| Encryption | 3 | ___ | ___ | ___ | ___% |
| RLS Policies | 5 | ___ | ___ | ___ | ___% |
| Audit Logging | 4 | ___ | ___ | ___ | ___% |
| **TOTAL** | **25** | **___** | **___** | **___** | **___%** |

### Performance Metrics / مقاييس الأداء

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| API Response Time | < 500ms | ___ms | ___ |
| Encryption Latency | < 200ms | ___ms | ___ |
| Decryption Latency | < 100ms | ___ms | ___ |
| Database Query Time | < 50ms | ___ms | ___ |

### Issues Found / المشاكل المكتشفة

| Priority | Issue Description | Recommendation | Status |
|----------|-------------------|----------------|--------|
| HIGH | ___ | ___ | ___ |
| MEDIUM | ___ | ___ | ___ |
| LOW | ___ | ___ | ___ |

### Final Recommendation / التوصية النهائية

**Overall Assessment:** _______________

**Approval Status:** 
- [ ] ✅ APPROVED - Ready for production
- [ ] ⚠️ CONDITIONAL - Fix issues first
- [ ] ❌ REJECTED - Major issues found

**Signature:** _________________ **Date:** _________

---

**Note:** Complete all tests systematically and document results with screenshots, logs, and SQL outputs. This checklist ensures comprehensive validation of the consent flow system before production deployment.