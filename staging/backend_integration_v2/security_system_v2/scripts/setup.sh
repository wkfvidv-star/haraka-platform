#!/bin/bash

# Haraka Platform - Docker Setup Script
# تسكريبت إعداد منصة حركة

set -e

echo "🚀 بدء إعداد منصة حركة - Haraka Platform Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_status "فحص Docker..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker غير مثبت. يرجى تثبيت Docker أولاً."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose غير مثبت. يرجى تثبيت Docker Compose أولاً."
        exit 1
    fi
    
    print_success "Docker و Docker Compose مثبتان بنجاح"
}

# Create necessary directories
create_directories() {
    print_status "إنشاء المجلدات المطلوبة..."
    
    mkdir -p config/grafana/dashboards
    mkdir -p config/grafana/datasources
    mkdir -p logs
    mkdir -p uploads
    mkdir -p security-reports
    mkdir -p backups
    
    print_success "تم إنشاء المجلدات بنجاح"
}

# Copy environment file
setup_environment() {
    print_status "إعداد متغيرات البيئة..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        print_warning "تم إنشاء ملف .env من .env.example"
        print_warning "يرجى مراجعة وتحديث المتغيرات في ملف .env"
    else
        print_success "ملف .env موجود بالفعل"
    fi
}

# Generate secure passwords
generate_passwords() {
    print_status "إنشاء كلمات مرور آمنة..."
    
    # Generate random passwords
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
    REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Update .env file with generated passwords
    sed -i "s/haraka_secure_2024/${DB_PASSWORD}/g" .env
    sed -i "s/your-super-secret-jwt-token-with-at-least-32-characters/${JWT_SECRET}/g" .env
    sed -i "s/redis_secure_2024/${REDIS_PASSWORD}/g" .env
    
    print_success "تم إنشاء كلمات المرور الآمنة"
}

# Start services
start_services() {
    print_status "بدء الخدمات..."
    
    # Start basic services
    docker-compose up -d postgres redis pgadmin
    
    print_status "انتظار بدء قاعدة البيانات..."
    sleep 30
    
    # Check if database is ready
    until docker-compose exec -T postgres pg_isready -U postgres -d haraka_db; do
        print_status "انتظار قاعدة البيانات..."
        sleep 5
    done
    
    print_success "تم بدء الخدمات الأساسية بنجاح"
}

# Run database migrations
run_migrations() {
    print_status "تشغيل ملفات قاعدة البيانات..."
    
    # Copy SQL files to container and execute
    docker-compose exec -T postgres psql -U postgres -d haraka_db -f /docker-entrypoint-initdb.d/audit_logging_system.sql
    docker-compose exec -T postgres psql -U postgres -d haraka_db -f /docker-entrypoint-initdb.d/rls_policies/anonymized_views_enhanced.sql
    
    print_success "تم تشغيل ملفات قاعدة البيانات بنجاح"
}

# Run security tests
run_security_tests() {
    print_status "تشغيل اختبارات الأمان..."
    
    docker-compose exec -T postgres psql -U postgres -d haraka_db -f /docker-entrypoint-initdb.d/rls_policies/comprehensive_rls_tests.sql
    
    print_success "تم تشغيل اختبارات الأمان بنجاح"
}

# Display connection information
display_info() {
    echo ""
    print_success "🎉 تم إعداد منصة حركة بنجاح!"
    echo "=================================================="
    echo ""
    echo "📊 معلومات الاتصال:"
    echo "  🗄️  PostgreSQL: localhost:5432"
    echo "  🔧 pgAdmin: http://localhost:8080"
    echo "  📈 Redis: localhost:6379"
    echo ""
    echo "🔐 معلومات تسجيل الدخول:"
    echo "  pgAdmin: admin@haraka.edu.sa / admin_secure_2024"
    echo ""
    echo "📁 الملفات المهمة:"
    echo "  📝 البيئة: .env"
    echo "  📋 السجلات: logs/"
    echo "  📤 الرفع: uploads/"
    echo "  🛡️  تقارير الأمان: security-reports/"
    echo ""
    echo "🚀 الخطوات التالية:"
    echo "  1. مراجعة ملف .env وتحديث المتغيرات"
    echo "  2. تشغيل: docker-compose logs -f لمتابعة السجلات"
    echo "  3. زيارة pgAdmin لإدارة قاعدة البيانات"
    echo ""
}

# Optional services menu
optional_services_menu() {
    echo ""
    print_status "خدمات اختيارية متاحة:"
    echo "1. Supabase (بديل سحابي لقاعدة البيانات)"
    echo "2. Grafana (مراقبة الأمان)"
    echo "3. Security Scanner (فحص الأمان)"
    echo "4. تشغيل جميع الخدمات"
    echo "5. تخطي"
    echo ""
    read -p "اختر رقم الخدمة (1-5): " choice
    
    case $choice in
        1)
            print_status "بدء Supabase..."
            docker-compose --profile supabase up -d
            ;;
        2)
            print_status "بدء Grafana..."
            docker-compose --profile monitoring up -d
            echo "Grafana: http://localhost:3002 (admin/monitor_secure_2024)"
            ;;
        3)
            print_status "بدء Security Scanner..."
            docker-compose --profile security-testing up -d
            ;;
        4)
            print_status "بدء جميع الخدمات..."
            docker-compose --profile supabase --profile monitoring --profile security-testing up -d
            ;;
        5)
            print_status "تم تخطي الخدمات الاختيارية"
            ;;
        *)
            print_warning "خيار غير صحيح، تم التخطي"
            ;;
    esac
}

# Main execution
main() {
    echo "🏗️  إعداد منصة حركة - نظام إدارة التربية البدنية"
    echo ""
    
    check_docker
    create_directories
    setup_environment
    
    # Ask if user wants to generate new passwords
    read -p "هل تريد إنشاء كلمات مرور جديدة آمنة؟ (y/n): " generate_pass
    if [[ $generate_pass == "y" || $generate_pass == "Y" ]]; then
        generate_passwords
    fi
    
    start_services
    run_migrations
    
    # Ask if user wants to run security tests
    read -p "هل تريد تشغيل اختبارات الأمان؟ (y/n): " run_tests
    if [[ $run_tests == "y" || $run_tests == "Y" ]]; then
        run_security_tests
    fi
    
    optional_services_menu
    display_info
    
    print_success "الإعداد مكتمل! 🎉"
}

# Run main function
main "$@"