// إعداد شهادات SSL للبيئة الإنتاجية
// SSL Certificate Setup for Production Environment

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface SSLConfig {
  domain: string;
  email: string;
  useLetEncrypt: boolean;
  certPath?: string;
  keyPath?: string;
}

export class SSLSetup {
  private config: SSLConfig;
  private sslDir: string;

  constructor(config: SSLConfig) {
    this.config = config;
    this.sslDir = path.join(process.cwd(), 'ssl');
    
    // إنشاء مجلد SSL إذا لم يكن موجوداً
    if (!fs.existsSync(this.sslDir)) {
      fs.mkdirSync(this.sslDir, { recursive: true });
    }
  }

  // إعداد شهادات SSL
  async setupSSL(): Promise<void> {
    console.log('🔒 إعداد شهادات SSL...');

    try {
      if (this.config.useLetEncrypt) {
        await this.setupLetsEncrypt();
      } else {
        await this.setupCustomCertificate();
      }

      await this.validateCertificates();
      await this.setupAutoRenewal();

      console.log('✅ تم إعداد شهادات SSL بنجاح');

    } catch (error) {
      console.error('❌ خطأ في إعداد شهادات SSL:', error);
      throw error;
    }
  }

  // إعداد Let's Encrypt
  private async setupLetsEncrypt(): Promise<void> {
    console.log('🔐 إعداد Let\'s Encrypt...');

    // فحص وجود Certbot
    try {
      execSync('certbot --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('تثبيت Certbot...');
      
      // تثبيت Certbot حسب النظام
      try {
        // Ubuntu/Debian
        execSync('sudo apt-get update && sudo apt-get install -y certbot', { stdio: 'inherit' });
      } catch (e) {
        try {
          // CentOS/RHEL
          execSync('sudo yum install -y certbot', { stdio: 'inherit' });
        } catch (e2) {
          // macOS
          execSync('brew install certbot', { stdio: 'inherit' });
        }
      }
    }

    // الحصول على الشهادة
    const certbotCommand = `certbot certonly --standalone --non-interactive --agree-tos --email ${this.config.email} -d ${this.config.domain}`;
    
    try {
      execSync(certbotCommand, { stdio: 'inherit' });
      
      // نسخ الشهادات إلى مجلد SSL
      const certSource = `/etc/letsencrypt/live/${this.config.domain}/fullchain.pem`;
      const keySource = `/etc/letsencrypt/live/${this.config.domain}/privkey.pem`;
      
      if (fs.existsSync(certSource) && fs.existsSync(keySource)) {
        fs.copyFileSync(certSource, path.join(this.sslDir, 'cert.pem'));
        fs.copyFileSync(keySource, path.join(this.sslDir, 'key.pem'));
        
        console.log('✅ تم نسخ شهادات Let\'s Encrypt');
      } else {
        throw new Error('لم يتم العثور على ملفات الشهادة');
      }
      
    } catch (error) {
      console.warn('⚠️ فشل في الحصول على شهادة Let\'s Encrypt، سيتم إنشاء شهادة مؤقتة');
      await this.createSelfSignedCertificate();
    }
  }

  // إعداد شهادة مخصصة
  private async setupCustomCertificate(): Promise<void> {
    console.log('📜 إعداد شهادة مخصصة...');

    if (this.config.certPath && this.config.keyPath) {
      // نسخ الشهادات المخصصة
      if (fs.existsSync(this.config.certPath) && fs.existsSync(this.config.keyPath)) {
        fs.copyFileSync(this.config.certPath, path.join(this.sslDir, 'cert.pem'));
        fs.copyFileSync(this.config.keyPath, path.join(this.sslDir, 'key.pem'));
        
        console.log('✅ تم نسخ الشهادات المخصصة');
      } else {
        throw new Error('ملفات الشهادة المخصصة غير موجودة');
      }
    } else {
      // إنشاء شهادة موقعة ذاتياً
      await this.createSelfSignedCertificate();
    }
  }

  // إنشاء شهادة موقعة ذاتياً
  private async createSelfSignedCertificate(): Promise<void> {
    console.log('🔏 إنشاء شهادة موقعة ذاتياً...');

    const opensslCommand = `openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout ${path.join(this.sslDir, 'key.pem')} \
      -out ${path.join(this.sslDir, 'cert.pem')} \
      -subj "/C=SA/ST=Riyadh/L=Riyadh/O=Haraka Platform/CN=${this.config.domain}"`;

    try {
      execSync(opensslCommand, { stdio: 'pipe' });
      console.log('✅ تم إنشاء شهادة موقعة ذاتياً');
      console.warn('⚠️ تحذير: الشهادة الموقعة ذاتياً للتطوير فقط، استخدم Let\'s Encrypt للإنتاج');
    } catch (error) {
      throw new Error('فشل في إنشاء الشهادة الموقعة ذاتياً');
    }
  }

  // التحقق من صحة الشهادات
  private async validateCertificates(): Promise<void> {
    console.log('🔍 التحقق من صحة الشهادات...');

    const certPath = path.join(this.sslDir, 'cert.pem');
    const keyPath = path.join(this.sslDir, 'key.pem');

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      throw new Error('ملفات الشهادة غير موجودة');
    }

    try {
      // فحص صحة الشهادة
      const certInfo = execSync(`openssl x509 -in ${certPath} -text -noout`, { encoding: 'utf8' });
      
      // فحص صحة المفتاح الخاص
      execSync(`openssl rsa -in ${keyPath} -check -noout`, { stdio: 'pipe' });
      
      // فحص تطابق الشهادة والمفتاح
      const certModulus = execSync(`openssl x509 -noout -modulus -in ${certPath}`, { encoding: 'utf8' });
      const keyModulus = execSync(`openssl rsa -noout -modulus -in ${keyPath}`, { encoding: 'utf8' });
      
      if (certModulus !== keyModulus) {
        throw new Error('الشهادة والمفتاح الخاص غير متطابقين');
      }

      // استخراج معلومات الشهادة
      const subjectMatch = certInfo.match(/Subject:.*?CN\s*=\s*([^,\n]+)/);
      const expiryMatch = certInfo.match(/Not After\s*:\s*(.+)/);
      
      const subject = subjectMatch ? subjectMatch[1].trim() : 'غير محدد';
      const expiry = expiryMatch ? expiryMatch[1].trim() : 'غير محدد';

      console.log(`  📋 النطاق: ${subject}`);
      console.log(`  📅 تاريخ الانتهاء: ${expiry}`);
      console.log('  ✅ الشهادات صحيحة ومتطابقة');

    } catch (error) {
      throw new Error(`خطأ في التحقق من الشهادات: ${error}`);
    }
  }

  // إعداد التجديد التلقائي
  private async setupAutoRenewal(): Promise<void> {
    if (!this.config.useLetEncrypt) {
      return; // التجديد التلقائي فقط لـ Let's Encrypt
    }

    console.log('🔄 إعداد التجديد التلقائي...');

    const renewalScript = `#!/bin/bash
set -e

echo "فحص تجديد شهادات SSL..."

# تجديد الشهادات
certbot renew --quiet --no-self-upgrade

# نسخ الشهادات المحدثة
if [ -f "/etc/letsencrypt/live/${this.config.domain}/fullchain.pem" ]; then
    cp /etc/letsencrypt/live/${this.config.domain}/fullchain.pem ${this.sslDir}/cert.pem
    cp /etc/letsencrypt/live/${this.config.domain}/privkey.pem ${this.sslDir}/key.pem
    
    # إعادة تشغيل Nginx
    docker-compose restart nginx || systemctl reload nginx || true
    
    echo "تم تجديد الشهادات بنجاح"
else
    echo "لا توجد شهادات للتجديد"
fi
`;

    const renewalScriptPath = path.join(process.cwd(), 'scripts', 'renew-ssl.sh');
    fs.writeFileSync(renewalScriptPath, renewalScript);
    fs.chmodSync(renewalScriptPath, '755');

    // إضافة cron job للتجديد التلقائي
    const cronJob = `# تجديد شهادات SSL كل يوم في الساعة 3:00 صباحاً
0 3 * * * ${renewalScriptPath} >> ${path.join(process.cwd(), 'logs', 'ssl-renewal.log')} 2>&1`;

    const cronPath = path.join(process.cwd(), 'scripts', 'ssl-crontab');
    fs.writeFileSync(cronPath, cronJob);

    console.log('✅ تم إعداد التجديد التلقائي');
    console.log(`📝 لتفعيل التجديد التلقائي، شغل: crontab ${cronPath}`);
  }

  // إنشاء تكوين SSL لـ Nginx
  generateNginxSSLConfig(): string {
    return `
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;
`;
  }

  // فحص حالة SSL
  async checkSSLStatus(): Promise<any> {
    const certPath = path.join(this.sslDir, 'cert.pem');
    
    if (!fs.existsSync(certPath)) {
      return {
        status: 'not_configured',
        message: 'شهادات SSL غير مكونة'
      };
    }

    try {
      const certInfo = execSync(`openssl x509 -in ${certPath} -text -noout`, { encoding: 'utf8' });
      const expiryMatch = certInfo.match(/Not After\s*:\s*(.+)/);
      const subjectMatch = certInfo.match(/Subject:.*?CN\s*=\s*([^,\n]+)/);
      
      const expiryDate = expiryMatch ? new Date(expiryMatch[1].trim()) : null;
      const domain = subjectMatch ? subjectMatch[1].trim() : 'غير محدد';
      const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

      return {
        status: 'configured',
        domain,
        expiry_date: expiryDate?.toISOString(),
        days_until_expiry: daysUntilExpiry,
        needs_renewal: daysUntilExpiry !== null && daysUntilExpiry < 30
      };

    } catch (error) {
      return {
        status: 'error',
        message: 'خطأ في قراءة معلومات الشهادة',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      };
    }
  }
}

export default SSLSetup;