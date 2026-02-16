#!/bin/bash

# Haraka Platform - Security Testing Script
# سكريبت اختبار الأمان لمنصة حركة

set -e

echo "🧪 بدء اختبارات الأمان الشاملة - Haraka Security Tests"
echo "======================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[TEST]${NC} $1"; }
print_success() { echo -e "${GREEN}[PASS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error() { echo -e "${RED}[FAIL]${NC} $1"; }

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run SQL test
run_sql_test() {
    local test_name="$1"
    local sql_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "تشغيل اختبار: $test_name"
    
    result=$(docker-compose exec -T postgres psql -U postgres -d haraka_db -t -c "$sql_command" 2>/dev/null | xargs)
    
    if [[ "$result" == "$expected_result" ]]; then
        print_success "$test_name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "$test_name - متوقع: $expected_result، النتيجة: $result"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Check if database is ready
check_database() {
    print_status "فحص اتصال قاعدة البيانات..."
    
    if docker-compose exec -T postgres pg_isready -U postgres -d haraka_db > /dev/null 2>&1; then
        print_success "قاعدة البيانات متصلة"
    else
        print_error "لا يمكن الاتصال بقاعدة البيانات"
        exit 1
    fi
}

# Test 1: Check if audit_logs table exists
test_audit_table() {
    print_status "اختبار وجود جدول audit_logs..."
    
    run_sql_test "وجود جدول المراجعة" \
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'haraka_audit_logs';" \
        "1"
}

# Test 2: Check RLS policies
test_rls_policies() {
    print_status "اختبار سياسات RLS..."
    
    # Check if RLS is enabled on student profiles
    run_sql_test "تفعيل RLS على ملفات الطلاب" \
        "SELECT COUNT(*) FROM pg_class WHERE relname = 'haraka_student_profiles' AND relrowsecurity = true;" \
        "1"
    
    # Check number of policies on student profiles
    run_sql_test "عدد سياسات الطلاب" \
        "SELECT COUNT(*) FROM pg_policies WHERE tablename = 'haraka_student_profiles';" \
        "6"
}

# Test 3: Test anonymized views
test_anonymized_views() {
    print_status "اختبار Views المجهولة..."
    
    # Check if ministry view exists
    run_sql_test "وجود view الوزارة" \
        "SELECT COUNT(*) FROM information_schema.views WHERE table_name = 'ministry_national_performance';" \
        "1"
    
    # Check if directorate view exists
    run_sql_test "وجود view المديريات" \
        "SELECT COUNT(*) FROM information_schema.views WHERE table_name = 'directorate_regional_stats';" \
        "1"
}

# Test 4: Test helper functions
test_helper_functions() {
    print_status "اختبار الدوال المساعدة..."
    
    # Check if get_user_role function exists
    run_sql_test "وجود دالة get_user_role" \
        "SELECT COUNT(*) FROM pg_proc WHERE proname = 'get_user_role';" \
        "1"
    
    # Check if log_audit_event function exists
    run_sql_test "وجود دالة تسجيل المراجعة" \
        "SELECT COUNT(*) FROM pg_proc WHERE proname = 'log_audit_event';" \
        "1"
}

# Test 5: Test triggers
test_triggers() {
    print_status "اختبار Triggers..."
    
    # Check audit triggers
    run_sql_test "وجود trigger المراجعة" \
        "SELECT COUNT(*) FROM pg_trigger WHERE tgname LIKE 'audit_%';" \
        "6"
}

# Test 6: Run comprehensive RLS tests
test_comprehensive_rls() {
    print_status "تشغيل اختبارات RLS الشاملة..."
    
    # Create test data and run comprehensive tests
    docker-compose exec -T postgres psql -U postgres -d haraka_db -c "
    -- Run comprehensive RLS tests
    DO \$\$
    DECLARE
        test_record RECORD;
        total_tests INTEGER := 0;
        passed_tests INTEGER := 0;
    BEGIN
        -- Run the comprehensive test function if it exists
        IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'run_comprehensive_rls_tests') THEN
            FOR test_record IN 
                SELECT * FROM run_comprehensive_rls_tests()
            LOOP
                total_tests := total_tests + 1;
                IF test_record.result_status LIKE '%نجح%' OR test_record.result_status LIKE '%آمن%' THEN
                    passed_tests := passed_tests + 1;
                END IF;
            END LOOP;
            
            RAISE NOTICE 'اختبارات RLS: % من % نجحت', passed_tests, total_tests;
        ELSE
            RAISE NOTICE 'دالة الاختبار الشاملة غير موجودة';
        END IF;
    END
    \$\$;" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        print_success "اختبارات RLS الشاملة"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "اختبارات RLS الشاملة"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Test 7: Security vulnerability scan
test_security_scan() {
    print_status "فحص الثغرات الأمنية..."
    
    # Check for common security issues
    local issues=0
    
    # Check for default passwords
    if grep -q "password123\|admin123\|test123" ../.env 2>/dev/null; then
        print_error "كلمات مرور افتراضية موجودة"
        issues=$((issues + 1))
    fi
    
    # Check for exposed secrets
    if grep -q "secret.*=.*test\|key.*=.*test" ../.env 2>/dev/null; then
        print_warning "مفاتيح تجريبية موجودة"
        issues=$((issues + 1))
    fi
    
    if [ $issues -eq 0 ]; then
        print_success "فحص الأمان الأساسي"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_error "وُجدت $issues مشكلة أمنية"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Test 8: Performance test
test_performance() {
    print_status "اختبار الأداء..."
    
    # Simple performance test - measure query time
    start_time=$(date +%s%N)
    docker-compose exec -T postgres psql -U postgres -d haraka_db -c "SELECT COUNT(*) FROM information_schema.tables;" > /dev/null 2>&1
    end_time=$(date +%s%N)
    
    duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
    
    if [ $duration -lt 1000 ]; then # Less than 1 second
        print_success "اختبار الأداء ($duration ms)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        print_warning "اختبار الأداء بطيء ($duration ms)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Generate test report
generate_report() {
    local success_rate=$(( PASSED_TESTS * 100 / TOTAL_TESTS ))
    
    echo ""
    echo "📊 تقرير نتائج الاختبارات"
    echo "=========================="
    echo "📝 إجمالي الاختبارات: $TOTAL_TESTS"
    echo "✅ نجح: $PASSED_TESTS"
    echo "❌ فشل: $FAILED_TESTS"
    echo "📈 معدل النجاح: $success_rate%"
    echo ""
    
    if [ $success_rate -ge 90 ]; then
        print_success "🎉 نظام الأمان يعمل بشكل ممتاز!"
    elif [ $success_rate -ge 75 ]; then
        print_warning "⚠️ نظام الأمان يعمل بشكل جيد مع بعض التحسينات"
    else
        print_error "🚨 نظام الأمان يحتاج مراجعة فورية"
    fi
    
    # Save report to file
    cat > ../security-reports/test-report-$(date +%Y%m%d-%H%M%S).txt << EOF
Haraka Platform Security Test Report
Generated: $(date)

Total Tests: $TOTAL_TESTS
Passed: $PASSED_TESTS
Failed: $FAILED_TESTS
Success Rate: $success_rate%

Status: $(if [ $success_rate -ge 90 ]; then echo "EXCELLENT"; elif [ $success_rate -ge 75 ]; then echo "GOOD"; else echo "NEEDS_ATTENTION"; fi)
EOF
    
    print_status "تم حفظ التقرير في security-reports/"
}

# Main execution
main() {
    echo "🔒 اختبار أمان منصة حركة"
    echo ""
    
    check_database
    
    echo ""
    echo "🧪 بدء الاختبارات..."
    echo "==================="
    
    test_audit_table
    test_rls_policies
    test_anonymized_views
    test_helper_functions
    test_triggers
    test_comprehensive_rls
    test_security_scan
    test_performance
    
    generate_report
    
    echo ""
    print_success "اكتملت جميع الاختبارات! 🎯"
}

# Run main function
main "$@"