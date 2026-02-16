// إعداد البيئة الإنتاجية لمنصة حركة
// Production Environment Setup for Haraka Platform

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface ProductionConfig {
  environment: 'production' | 'staging';
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
  };
  supabase: {
    url: string;
    anonKey: string;
    serviceKey: string;
    projectRef: string;
  };
  server: {
    port: number;
    host: string;
    domain: string;
    ssl: boolean;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  monitoring: {
    enabled: boolean;
    logLevel: string;
    metricsPort: number;
  };
}

export class ProductionDeployment {
  private config: ProductionConfig;
  private deploymentPath: string;

  constructor(config: ProductionConfig) {
    this.config = config;
    this.deploymentPath = process.cwd();
  }

  // إعداد البيئة الإنتاجية الكاملة
  async setupProductionEnvironment(): Promise<void> {
    console.log('🚀 بدء إعداد البيئة الإنتاجية لمنصة حركة...\n');

    try {
      // المرحلة 1: إعداد البنية التحتية
      await this.setupInfrastructure();
      
      // المرحلة 2: إعداد قاعدة البيانات
      await this.setupDatabase();
      
      // المرحلة 3: إعداد Supabase
      await this.setupSupabase();
      
      // المرحلة 4: إعداد الخادم
      await this.setupServer();
      
      // المرحلة 5: إعداد المراقبة
      await this.setupMonitoring();
      
      // المرحلة 6: إعداد النسخ الاحتياطية
      await this.setupBackups();
      
      // المرحلة 7: اختبار النشر
      await this.testDeployment();

      console.log('✅ تم إعداد البيئة الإنتاجية بنجاح!');
      this.generateDeploymentReport();

    } catch (error) {
      console.error('❌ خطأ في إعداد البيئة الإنتاجية:', error);
      throw error;
    }
  }

  // إعداد البنية التحتية
  private async setupInfrastructure(): Promise<void> {
    console.log('🏗️ إعداد البنية التحتية...');

    // إنشاء مجلدات النشر
    const directories = [
      'dist',
      'logs',
      'backups',
      'uploads',
      'config',
      'scripts',
      'ssl',
      'monitoring'
    ];

    for (const dir of directories) {
      const dirPath = path.join(this.deploymentPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`  ✅ تم إنشاء مجلد: ${dir}`);
      }
    }

    // إنشاء ملف البيئة الإنتاجية
    await this.createProductionEnvFile();

    // إعداد Docker
    await this.setupDocker();

    // إعداد Nginx
    await this.setupNginx();

    console.log('  ✅ تم إعداد البنية التحتية\n');
  }

  // إنشاء ملف البيئة الإنتاجية
  private async createProductionEnvFile(): Promise<void> {
    const envContent = `
# بيئة الإنتاج لمنصة حركة
NODE_ENV=production
PORT=${this.config.server.port}
HOST=${this.config.server.host}
DOMAIN=${this.config.server.domain}

# قاعدة البيانات
DB_HOST=${this.config.database.host}
DB_PORT=${this.config.database.port}
DB_NAME=${this.config.database.database}
DB_USER=${this.config.database.username}
DB_PASSWORD=${this.config.database.password}
DB_SSL=${this.config.database.ssl}

# Supabase
SUPABASE_URL=${this.config.supabase.url}
SUPABASE_ANON_KEY=${this.config.supabase.anonKey}
SUPABASE_SERVICE_KEY=${this.config.supabase.serviceKey}
SUPABASE_PROJECT_REF=${this.config.supabase.projectRef}

# Redis
REDIS_HOST=${this.config.redis.host}
REDIS_PORT=${this.config.redis.port}
REDIS_PASSWORD=${this.config.redis.password || ''}

# المراقبة
LOG_LEVEL=${this.config.monitoring.logLevel}
METRICS_PORT=${this.config.monitoring.metricsPort}
MONITORING_ENABLED=${this.config.monitoring.enabled}

# الأمان
JWT_SECRET=${this.generateSecretKey()}
ENCRYPTION_KEY=${this.generateSecretKey()}
SESSION_SECRET=${this.generateSecretKey()}

# معدل الطلبات
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# رفع الملفات
MAX_FILE_SIZE=104857600
ALLOWED_FILE_TYPES=mp4,mov,avi,pdf,csv,xlsx

# البريد الإلكتروني (اختياري)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@haraka-platform.com
`.trim();

    fs.writeFileSync(path.join(this.deploymentPath, '.env.production'), envContent);
    console.log('  ✅ تم إنشاء ملف البيئة الإنتاجية');
  }

  // إعداد Docker
  private async setupDocker(): Promise<void> {
    const dockerfileContent = `
FROM node:18-alpine

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ ملفات package
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production && npm cache clean --force

# نسخ الكود المصدري
COPY . .

# بناء التطبيق
RUN npm run build

# إنشاء مستخدم غير root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# تغيير ملكية الملفات
RUN chown -R nextjs:nodejs /app
USER nextjs

# كشف المنفذ
EXPOSE 3001

# بدء التطبيق
CMD ["npm", "start"]
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'Dockerfile'), dockerfileContent);

    const dockerComposeContent = `
version: '3.8'

services:
  haraka-app:
    build: .
    ports:
      - "${this.config.server.port}:3001"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
      - ./backups:/app/backups
    restart: unless-stopped
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${this.config.database.database}
      POSTGRES_USER: ${this.config.database.username}
      POSTGRES_PASSWORD: ${this.config.database.password}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "${this.config.database.port}:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${this.config.redis.password || 'haraka123'}
    ports:
      - "${this.config.redis.port}:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - haraka-app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'docker-compose.yml'), dockerComposeContent);
    console.log('  ✅ تم إنشاء ملفات Docker');
  }

  // إعداد Nginx
  private async setupNginx(): Promise<void> {
    const nginxConfig = `
events {
    worker_connections 1024;
}

http {
    upstream haraka_backend {
        server haraka-app:3001;
    }

    # تحسين الأداء
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # حدود رفع الملفات
    client_max_body_size 100M;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    server {
        listen 80;
        server_name ${this.config.server.domain};
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name ${this.config.server.domain};

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # Security Headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

        location / {
            proxy_pass http://haraka_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files
        location /static/ {
            alias /app/public/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\\n";
            add_header Content-Type text/plain;
        }
    }
}
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'nginx.conf'), nginxConfig);
    console.log('  ✅ تم إنشاء تكوين Nginx');
  }

  // إعداد قاعدة البيانات
  private async setupDatabase(): Promise<void> {
    console.log('🗄️ إعداد قاعدة البيانات...');

    // إنشاء سكريبت إعداد قاعدة البيانات
    const dbSetupScript = `
#!/bin/bash
set -e

echo "إعداد قاعدة البيانات الإنتاجية..."

# إنشاء قاعدة البيانات إذا لم تكن موجودة
createdb -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} ${this.config.database.database} || true

# تشغيل migrations
psql -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} -d ${this.config.database.database} -f ../database/schemas/analysis_reports_v2.sql
psql -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} -d ${this.config.database.database} -f ../database/schemas/student_profiles_v2.sql
psql -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} -d ${this.config.database.database} -f ../database/schemas/school_analytics_v2.sql
psql -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} -d ${this.config.database.database} -f ../database/schemas/notifications_v2.sql

echo "تم إعداد قاعدة البيانات بنجاح!"
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/setup-database.sh'), dbSetupScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/setup-database.sh'), '755');

    console.log('  ✅ تم إنشاء سكريبت إعداد قاعدة البيانات');
  }

  // إعداد Supabase
  private async setupSupabase(): Promise<void> {
    console.log('☁️ إعداد Supabase...');

    const supabaseSetupScript = `
#!/bin/bash
set -e

echo "إعداد Supabase الإنتاجي..."

# تثبيت Supabase CLI إذا لم يكن مثبتاً
if ! command -v supabase &> /dev/null; then
    npm install -g supabase
fi

# تسجيل الدخول (يتطلب token)
# supabase login

# ربط المشروع
supabase link --project-ref ${this.config.supabase.projectRef}

# رفع الـ migrations
supabase db push

# إعداد Storage buckets
supabase storage create haraka-videos --public false
supabase storage create haraka-reports --public false

echo "تم إعداد Supabase بنجاح!"
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/setup-supabase.sh'), supabaseSetupScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/setup-supabase.sh'), '755');

    console.log('  ✅ تم إنشاء سكريبت إعداد Supabase');
  }

  // إعداد الخادم
  private async setupServer(): Promise<void> {
    console.log('🖥️ إعداد الخادم...');

    // إنشاء سكريبت بدء الخادم
    const serverStartScript = `
#!/bin/bash
set -e

echo "بدء خادم منصة حركة..."

# فحص متطلبات النظام
node --version
npm --version

# تثبيت التبعيات
npm ci --production

# بناء التطبيق
npm run build

# بدء الخادم
if [ "$NODE_ENV" = "production" ]; then
    npm start
else
    npm run dev
fi
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/start-server.sh'), serverStartScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/start-server.sh'), '755');

    // إنشاء سكريبت إيقاف الخادم
    const serverStopScript = `
#!/bin/bash
set -e

echo "إيقاف خادم منصة حركة..."

# البحث عن العمليات وإيقافها
pkill -f "node.*haraka" || true
pkill -f "npm.*start" || true

echo "تم إيقاف الخادم"
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/stop-server.sh'), serverStopScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/stop-server.sh'), '755');

    console.log('  ✅ تم إنشاء سكريبتات الخادم');
  }

  // إعداد المراقبة
  private async setupMonitoring(): Promise<void> {
    console.log('📊 إعداد نظام المراقبة...');

    // إعداد PM2
    const pm2Config = {
      apps: [{
        name: 'haraka-platform',
        script: './dist/api/main-server_v2.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'production',
          PORT: this.config.server.port
        },
        log_file: './logs/combined.log',
        out_file: './logs/out.log',
        error_file: './logs/error.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,
        max_memory_restart: '1G',
        node_args: '--max-old-space-size=1024'
      }]
    };

    fs.writeFileSync(
      path.join(this.deploymentPath, 'ecosystem.config.js'),
      `module.exports = ${JSON.stringify(pm2Config, null, 2)};`
    );

    // إعداد مراقبة الصحة
    const healthCheckScript = `
#!/bin/bash

# فحص صحة الخادم
HEALTH_URL="http://localhost:${this.config.server.port}/api/v2/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): الخادم يعمل بشكل طبيعي"
    exit 0
else
    echo "$(date): خطأ في الخادم - كود الاستجابة: $RESPONSE"
    exit 1
fi
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/health-check.sh'), healthCheckScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/health-check.sh'), '755');

    console.log('  ✅ تم إعداد نظام المراقبة');
  }

  // إعداد النسخ الاحتياطية
  private async setupBackups(): Promise<void> {
    console.log('💾 إعداد النسخ الاحتياطية...');

    const backupScript = `
#!/bin/bash
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "بدء النسخ الاحتياطي - $DATE"

# نسخ احتياطي لقاعدة البيانات
pg_dump -h ${this.config.database.host} -p ${this.config.database.port} -U ${this.config.database.username} -d ${this.config.database.database} > $BACKUP_DIR/db_backup_$DATE.sql

# ضغط النسخة الاحتياطية
gzip $BACKUP_DIR/db_backup_$DATE.sql

# نسخ احتياطي للملفات المرفوعة
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz ./uploads/

# حذف النسخ القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "تم إنشاء النسخة الاحتياطية بنجاح"
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/backup.sh'), backupScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/backup.sh'), '755');

    // إعداد cron job للنسخ الاحتياطية
    const cronSetup = `
# النسخ الاحتياطي اليومي في الساعة 2:00 صباحاً
0 2 * * * cd ${this.deploymentPath} && ./scripts/backup.sh >> ./logs/backup.log 2>&1

# فحص الصحة كل 5 دقائق
*/5 * * * * cd ${this.deploymentPath} && ./scripts/health-check.sh >> ./logs/health.log 2>&1
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/crontab'), cronSetup);

    console.log('  ✅ تم إعداد النسخ الاحتياطية');
  }

  // اختبار النشر
  private async testDeployment(): Promise<void> {
    console.log('🧪 اختبار النشر...');

    const testScript = `
#!/bin/bash
set -e

echo "اختبار النشر الإنتاجي..."

# اختبار الاتصال بقاعدة البيانات
echo "فحص الاتصال بقاعدة البيانات..."
pg_isready -h ${this.config.database.host} -p ${this.config.database.port}

# اختبار Redis
echo "فحص الاتصال بـ Redis..."
redis-cli -h ${this.config.redis.host} -p ${this.config.redis.port} ping

# اختبار الخادم
echo "فحص الخادم..."
curl -f http://localhost:${this.config.server.port}/api/v2/health

echo "جميع الاختبارات نجحت!"
`;

    fs.writeFileSync(path.join(this.deploymentPath, 'scripts/test-deployment.sh'), testScript);
    fs.chmodSync(path.join(this.deploymentPath, 'scripts/test-deployment.sh'), '755');

    console.log('  ✅ تم إنشاء سكريبت اختبار النشر');
  }

  // توليد مفتاح سري
  private generateSecretKey(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  // إنشاء تقرير النشر
  private generateDeploymentReport(): void {
    const report = {
      deployment_date: new Date().toISOString(),
      environment: this.config.environment,
      server: {
        domain: this.config.server.domain,
        port: this.config.server.port,
        ssl_enabled: this.config.server.ssl
      },
      database: {
        host: this.config.database.host,
        port: this.config.database.port,
        database: this.config.database.database,
        ssl_enabled: this.config.database.ssl
      },
      supabase: {
        url: this.config.supabase.url,
        project_ref: this.config.supabase.projectRef
      },
      monitoring: {
        enabled: this.config.monitoring.enabled,
        log_level: this.config.monitoring.logLevel
      },
      files_created: [
        '.env.production',
        'Dockerfile',
        'docker-compose.yml',
        'nginx.conf',
        'ecosystem.config.js',
        'scripts/setup-database.sh',
        'scripts/setup-supabase.sh',
        'scripts/start-server.sh',
        'scripts/stop-server.sh',
        'scripts/health-check.sh',
        'scripts/backup.sh',
        'scripts/test-deployment.sh'
      ],
      next_steps: [
        '1. مراجعة ملف .env.production وتحديث القيم',
        '2. الحصول على شهادات SSL ووضعها في مجلد ssl/',
        '3. تشغيل docker-compose up -d',
        '4. تشغيل ./scripts/setup-database.sh',
        '5. تشغيل ./scripts/setup-supabase.sh',
        '6. تشغيل ./scripts/test-deployment.sh',
        '7. إعداد cron jobs من ملف scripts/crontab'
      ]
    };

    fs.writeFileSync(
      path.join(this.deploymentPath, 'deployment-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n📋 تقرير النشر:');
    console.log('================');
    console.log(`📅 تاريخ النشر: ${report.deployment_date}`);
    console.log(`🌐 النطاق: ${report.server.domain}`);
    console.log(`🔌 المنفذ: ${report.server.port}`);
    console.log(`🗄️ قاعدة البيانات: ${report.database.host}:${report.database.port}`);
    console.log(`☁️ Supabase: ${report.supabase.project_ref}`);
    console.log(`📊 المراقبة: ${report.monitoring.enabled ? 'مفعلة' : 'معطلة'}`);
    console.log(`📁 الملفات المُنشأة: ${report.files_created.length} ملف`);
    
    console.log('\n🎯 الخطوات التالية:');
    report.next_steps.forEach((step, index) => {
      console.log(`   ${step}`);
    });

    console.log('\n💾 تم حفظ التقرير الكامل في: deployment-report.json');
  }
}

// تكوين افتراضي للإنتاج
export const defaultProductionConfig: ProductionConfig = {
  environment: 'production',
  database: {
    host: 'localhost',
    port: 5432,
    database: 'haraka_production',
    username: 'haraka_user',
    password: 'CHANGE_ME_SECURE_PASSWORD',
    ssl: true
  },
  supabase: {
    url: 'https://your-project.supabase.co',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    serviceKey: 'YOUR_SUPABASE_SERVICE_KEY',
    projectRef: 'your-project-ref'
  },
  server: {
    port: 3001,
    host: '0.0.0.0',
    domain: 'haraka-platform.com',
    ssl: true
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: 'CHANGE_ME_REDIS_PASSWORD'
  },
  monitoring: {
    enabled: true,
    logLevel: 'info',
    metricsPort: 9090
  }
};

export default ProductionDeployment;