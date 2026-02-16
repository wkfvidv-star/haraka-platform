// إعداد نظام المراقبة للبيئة الإنتاجية
// Production Monitoring Setup

import * as fs from 'fs';
import * as path from 'path';

export interface MonitoringConfig {
  enablePrometheus: boolean;
  enableGrafana: boolean;
  enableAlerts: boolean;
  alertEmail?: string;
  slackWebhook?: string;
  logRetentionDays: number;
}

export class MonitoringSetup {
  private config: MonitoringConfig;
  private monitoringDir: string;

  constructor(config: MonitoringConfig) {
    this.config = config;
    this.monitoringDir = path.join(process.cwd(), 'monitoring');
    
    if (!fs.existsSync(this.monitoringDir)) {
      fs.mkdirSync(this.monitoringDir, { recursive: true });
    }
  }

  // إعداد نظام المراقبة الكامل
  async setupMonitoring(): Promise<void> {
    console.log('📊 إعداد نظام المراقبة...');

    try {
      // إعداد Prometheus
      if (this.config.enablePrometheus) {
        await this.setupPrometheus();
      }

      // إعداد Grafana
      if (this.config.enableGrafana) {
        await this.setupGrafana();
      }

      // إعداد التنبيهات
      if (this.config.enableAlerts) {
        await this.setupAlerts();
      }

      // إعداد مراقبة السجلات
      await this.setupLogMonitoring();

      // إعداد مراقبة الأداء
      await this.setupPerformanceMonitoring();

      // إعداد لوحة المعلومات
      await this.setupDashboard();

      console.log('✅ تم إعداد نظام المراقبة بنجاح');

    } catch (error) {
      console.error('❌ خطأ في إعداد نظام المراقبة:', error);
      throw error;
    }
  }

  // إعداد Prometheus
  private async setupPrometheus(): Promise<void> {
    console.log('📈 إعداد Prometheus...');

    const prometheusConfig = `
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

scrape_configs:
  - job_name: 'haraka-platform'
    static_configs:
      - targets: ['haraka-app:9090']
    scrape_interval: 5s
    metrics_path: '/metrics'

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['postgres-exporter:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['redis-exporter:9121']

  - job_name: 'nginx-exporter'
    static_configs:
      - targets: ['nginx-exporter:9113']
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'prometheus.yml'), prometheusConfig);

    // قواعد التنبيهات
    const alertRules = `
groups:
  - name: haraka_alerts
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "استخدام عالي للمعالج"
          description: "استخدام المعالج {{ $value }}% على {{ $labels.instance }}"

      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "استخدام عالي للذاكرة"
          description: "استخدام الذاكرة {{ $value }}% على {{ $labels.instance }}"

      - alert: DiskSpaceLow
        expr: (1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "مساحة القرص منخفضة"
          description: "مساحة القرص {{ $value }}% ممتلئة على {{ $labels.instance }}"

      - alert: ApplicationDown
        expr: up{job="haraka-platform"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "تطبيق حركة متوقف"
          description: "تطبيق حركة غير متاح على {{ $labels.instance }}"

      - alert: DatabaseDown
        expr: up{job="postgres-exporter"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "قاعدة البيانات متوقفة"
          description: "قاعدة البيانات غير متاحة"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "زمن استجابة عالي"
          description: "زمن الاستجابة 95% هو {{ $value }} ثانية"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "معدل أخطاء عالي"
          description: "معدل الأخطاء {{ $value | humanizePercentage }}"
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'alert_rules.yml'), alertRules);

    console.log('  ✅ تم إعداد Prometheus');
  }

  // إعداد Grafana
  private async setupGrafana(): Promise<void> {
    console.log('📊 إعداد Grafana...');

    // تكوين مصادر البيانات
    const datasources = `
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'datasources.yml'), datasources);

    // لوحة معلومات حركة
    const harakaDashboard = {
      dashboard: {
        id: null,
        title: "منصة حركة - لوحة المراقبة",
        tags: ["haraka", "monitoring"],
        timezone: "browser",
        panels: [
          {
            id: 1,
            title: "إجمالي الطلبات",
            type: "stat",
            targets: [
              {
                expr: "sum(rate(http_requests_total[5m]))",
                legendFormat: "طلبات/ثانية"
              }
            ],
            gridPos: { h: 8, w: 12, x: 0, y: 0 }
          },
          {
            id: 2,
            title: "زمن الاستجابة",
            type: "graph",
            targets: [
              {
                expr: "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
                legendFormat: "95th percentile"
              },
              {
                expr: "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
                legendFormat: "50th percentile"
              }
            ],
            gridPos: { h: 8, w: 12, x: 12, y: 0 }
          },
          {
            id: 3,
            title: "استخدام المعالج",
            type: "graph",
            targets: [
              {
                expr: "100 - (avg by(instance) (irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
                legendFormat: "CPU Usage %"
              }
            ],
            gridPos: { h: 8, w: 12, x: 0, y: 8 }
          },
          {
            id: 4,
            title: "استخدام الذاكرة",
            type: "graph",
            targets: [
              {
                expr: "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
                legendFormat: "Memory Usage %"
              }
            ],
            gridPos: { h: 8, w: 12, x: 12, y: 8 }
          },
          {
            id: 5,
            title: "حالة قاعدة البيانات",
            type: "table",
            targets: [
              {
                expr: "pg_up",
                legendFormat: "Database Status"
              },
              {
                expr: "pg_stat_database_numbackends",
                legendFormat: "Active Connections"
              }
            ],
            gridPos: { h: 8, w: 24, x: 0, y: 16 }
          }
        ],
        time: {
          from: "now-1h",
          to: "now"
        },
        refresh: "5s"
      }
    };

    fs.writeFileSync(
      path.join(this.monitoringDir, 'haraka-dashboard.json'),
      JSON.stringify(harakaDashboard, null, 2)
    );

    console.log('  ✅ تم إعداد Grafana');
  }

  // إعداد التنبيهات
  private async setupAlerts(): Promise<void> {
    console.log('🚨 إعداد نظام التنبيهات...');

    const alertmanagerConfig = `
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@haraka-platform.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    email_configs:
      - to: '${this.config.alertEmail || 'admin@haraka-platform.com'}'
        subject: 'تنبيه من منصة حركة: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          التنبيه: {{ .Annotations.summary }}
          التفاصيل: {{ .Annotations.description }}
          الوقت: {{ .StartsAt }}
          {{ end }}
    ${this.config.slackWebhook ? `
    slack_configs:
      - api_url: '${this.config.slackWebhook}'
        channel: '#alerts'
        title: 'تنبيه من منصة حركة'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
    ` : ''}

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'alertmanager.yml'), alertmanagerConfig);

    // سكريبت إرسال التنبيهات المخصص
    const customAlertScript = `#!/bin/bash

ALERT_TYPE="$1"
ALERT_MESSAGE="$2"
ALERT_SEVERITY="$3"

# إرسال تنبيه عبر البريد الإلكتروني
if [ -n "${this.config.alertEmail}" ]; then
    echo "$ALERT_MESSAGE" | mail -s "تنبيه منصة حركة: $ALERT_TYPE" ${this.config.alertEmail}
fi

# إرسال تنبيه عبر Slack
if [ -n "${this.config.slackWebhook}" ]; then
    curl -X POST -H 'Content-type: application/json' \\
        --data "{\\"text\\":\\"🚨 تنبيه من منصة حركة\\\\n**النوع:** $ALERT_TYPE\\\\n**الرسالة:** $ALERT_MESSAGE\\\\n**الخطورة:** $ALERT_SEVERITY\\"}" \\
        ${this.config.slackWebhook}
fi

# تسجيل التنبيه
echo "$(date): [$ALERT_SEVERITY] $ALERT_TYPE - $ALERT_MESSAGE" >> ./logs/alerts.log
`;

    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'send-alert.sh'), customAlertScript);
    fs.chmodSync(path.join(process.cwd(), 'scripts', 'send-alert.sh'), '755');

    console.log('  ✅ تم إعداد نظام التنبيهات');
  }

  // إعداد مراقبة السجلات
  private async setupLogMonitoring(): Promise<void> {
    console.log('📝 إعداد مراقبة السجلات...');

    // سكريبت تنظيف السجلات
    const logCleanupScript = `#!/bin/bash

LOG_DIR="./logs"
RETENTION_DAYS=${this.config.logRetentionDays}

echo "تنظيف السجلات الأقدم من $RETENTION_DAYS يوم..."

# حذف السجلات القديمة
find $LOG_DIR -name "*.log" -mtime +$RETENTION_DAYS -delete
find $LOG_DIR -name "*.log.*" -mtime +$RETENTION_DAYS -delete

# ضغط السجلات الأقدم من 7 أيام
find $LOG_DIR -name "*.log" -mtime +7 ! -name "*.gz" -exec gzip {} \\;

echo "تم تنظيف السجلات"
`;

    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'cleanup-logs.sh'), logCleanupScript);
    fs.chmodSync(path.join(process.cwd(), 'scripts', 'cleanup-logs.sh'), '755');

    // تكوين logrotate
    const logrotateConfig = `
${path.join(process.cwd(), 'logs')}/*.log {
    daily
    missingok
    rotate ${this.config.logRetentionDays}
    compress
    delaycompress
    notifempty
    create 644 root root
    postrotate
        docker-compose restart haraka-app || systemctl reload haraka-platform || true
    endscript
}
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'logrotate.conf'), logrotateConfig);

    console.log('  ✅ تم إعداد مراقبة السجلات');
  }

  // إعداد مراقبة الأداء
  private async setupPerformanceMonitoring(): Promise<void> {
    console.log('⚡ إعداد مراقبة الأداء...');

    const performanceScript = `#!/bin/bash

# مراقبة الأداء والموارد
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="./logs/performance.log"

# معلومات النظام
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
DISK_USAGE=$(df -h / | awk 'NR==2{printf "%s", $5}' | sed 's/%//')

# معلومات التطبيق
APP_RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3001/api/v2/health || echo "N/A")
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/v2/health || echo "000")

# معلومات قاعدة البيانات
DB_CONNECTIONS=$(docker exec postgres psql -U haraka_user -d haraka_production -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null || echo "N/A")

# تسجيل البيانات
echo "$TIMESTAMP,CPU:$CPU_USAGE%,Memory:$MEMORY_USAGE%,Disk:$DISK_USAGE%,AppResponse:${APP_RESPONSE_TIME}s,AppStatus:$APP_STATUS,DBConnections:$DB_CONNECTIONS" >> $LOG_FILE

# فحص التنبيهات
if (( $(echo "$CPU_USAGE > 80" | bc -l) )); then
    ./scripts/send-alert.sh "CPU_HIGH" "استخدام المعالج عالي: $CPU_USAGE%" "warning"
fi

if (( $(echo "$MEMORY_USAGE > 85" | bc -l) )); then
    ./scripts/send-alert.sh "MEMORY_HIGH" "استخدام الذاكرة عالي: $MEMORY_USAGE%" "warning"
fi

if [ "$DISK_USAGE" -gt 90 ]; then
    ./scripts/send-alert.sh "DISK_FULL" "مساحة القرص منخفضة: $DISK_USAGE%" "critical"
fi

if [ "$APP_STATUS" != "200" ]; then
    ./scripts/send-alert.sh "APP_DOWN" "التطبيق غير متاح - كود الاستجابة: $APP_STATUS" "critical"
fi
`;

    fs.writeFileSync(path.join(process.cwd(), 'scripts', 'monitor-performance.sh'), performanceScript);
    fs.chmodSync(path.join(process.cwd(), 'scripts', 'monitor-performance.sh'), '755');

    console.log('  ✅ تم إعداد مراقبة الأداء');
  }

  // إعداد لوحة المعلومات
  private async setupDashboard(): Promise<void> {
    console.log('📋 إعداد لوحة المعلومات...');

    const dashboardHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>لوحة مراقبة منصة حركة</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2em; font-weight: bold; color: #3498db; }
        .metric-label { color: #7f8c8d; margin-top: 5px; }
        .status-good { color: #27ae60; }
        .status-warning { color: #f39c12; }
        .status-error { color: #e74c3c; }
        .logs { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .log-entry { padding: 5px 0; border-bottom: 1px solid #ecf0f1; font-family: monospace; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏥 لوحة مراقبة منصة حركة</h1>
            <p>آخر تحديث: <span id="lastUpdate"></span></p>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value" id="appStatus">تحميل...</div>
                <div class="metric-label">حالة التطبيق</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="responseTime">تحميل...</div>
                <div class="metric-label">زمن الاستجابة (ثانية)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="cpuUsage">تحميل...</div>
                <div class="metric-label">استخدام المعالج (%)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="memoryUsage">تحميل...</div>
                <div class="metric-label">استخدام الذاكرة (%)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="diskUsage">تحميل...</div>
                <div class="metric-label">استخدام القرص (%)</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="dbConnections">تحميل...</div>
                <div class="metric-label">اتصالات قاعدة البيانات</div>
            </div>
        </div>
        
        <div class="logs">
            <h3>آخر الأحداث</h3>
            <div id="logEntries">تحميل السجلات...</div>
        </div>
    </div>

    <script>
        async function updateMetrics() {
            try {
                const response = await fetch('/api/v2/health');
                const data = await response.json();
                
                document.getElementById('appStatus').textContent = response.ok ? 'متاح' : 'غير متاح';
                document.getElementById('appStatus').className = response.ok ? 'metric-value status-good' : 'metric-value status-error';
                
                // تحديث المقاييس الأخرى (يتطلب endpoint إضافي)
                updateSystemMetrics();
                
            } catch (error) {
                document.getElementById('appStatus').textContent = 'خطأ';
                document.getElementById('appStatus').className = 'metric-value status-error';
            }
            
            document.getElementById('lastUpdate').textContent = new Date().toLocaleString('ar-SA');
        }
        
        async function updateSystemMetrics() {
            // هنا يمكن إضافة استدعاءات لجلب مقاييس النظام
            // من Prometheus أو مصادر أخرى
        }
        
        // تحديث كل 30 ثانية
        updateMetrics();
        setInterval(updateMetrics, 30000);
    </script>
</body>
</html>
`;

    fs.writeFileSync(path.join(this.monitoringDir, 'dashboard.html'), dashboardHTML);

    console.log('  ✅ تم إعداد لوحة المعلومات');
  }

  // إنشاء Docker Compose للمراقبة
  generateMonitoringDockerCompose(): string {
    return `
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./monitoring/alert_rules.yml:/etc/prometheus/alert_rules.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--storage.tsdb.retention.time=200h'
      - '--web.enable-lifecycle'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin123
    volumes:
      - ./monitoring/datasources.yml:/etc/grafana/provisioning/datasources/datasources.yml
      - grafana_data:/var/lib/grafana

  alertmanager:
    image: prom/alertmanager:latest
    ports:
      - "9093:9093"
    volumes:
      - ./monitoring/alertmanager.yml:/etc/alertmanager/alertmanager.yml

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.rootfs=/rootfs'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'

volumes:
  prometheus_data:
  grafana_data:
`;
  }
}

export default MonitoringSetup;