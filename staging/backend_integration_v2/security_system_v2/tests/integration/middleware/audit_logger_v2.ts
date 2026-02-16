/**
 * نظام تسجيل المراجعة المتقدم - منصة حركة
 * Advanced Audit Logging System - Haraka Platform
 */

import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

interface AuditLogEntry {
    operation: string;
    userId?: string;
    userRole?: string;
    resourceType?: string;
    resourceId?: string;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    error?: string;
    executionTime?: number;
    timestamp: Date;
}

interface FileOperationLog extends AuditLogEntry {
    fileId?: string;
    fileName?: string;
    fileSize?: number;
    accessType?: string;
    shareUrl?: string;
    token?: string;
    reason?: string;
}

/**
 * نظام تسجيل المراجعة والأمان
 */
export class AuditLogger {
    private supabase;
    private logBuffer: AuditLogEntry[] = [];
    private bufferSize = 100;
    private flushInterval = 30000; // 30 ثانية

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );

        // تفريغ المخزن المؤقت دورياً
        setInterval(() => {
            this.flushBuffer();
        }, this.flushInterval);

        // تفريغ المخزن عند إغلاق التطبيق
        process.on('SIGINT', () => {
            this.flushBuffer();
            process.exit(0);
        });

        process.on('SIGTERM', () => {
            this.flushBuffer();
            process.exit(0);
        });
    }

    /**
     * وسطاء تسجيل الطلبات
     */
    logRequest = (req: Request, res: Response, next: NextFunction): void => {
        const startTime = Date.now();
        const user = (req as any).user;

        // تسجيل بداية الطلب
        const requestLog: AuditLogEntry = {
            operation: `${req.method} ${req.path}`,
            userId: user?.id,
            userRole: user?.role,
            resourceType: 'http_request',
            details: {
                method: req.method,
                path: req.path,
                query: req.query,
                headers: this.sanitizeHeaders(req.headers),
                body: this.sanitizeBody(req.body)
            },
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            success: true, // سيتم تحديثه لاحقاً
            timestamp: new Date()
        };

        // حفظ معلومات الطلب في الاستجابة لاستخدامها لاحقاً
        (res as any).auditLog = requestLog;

        // تسجيل الاستجابة
        const originalSend = res.send;
        res.send = function(body: any) {
            const executionTime = Date.now() - startTime;
            
            requestLog.executionTime = executionTime;
            requestLog.success = res.statusCode < 400;
            
            if (!requestLog.success) {
                requestLog.error = `HTTP ${res.statusCode}`;
                requestLog.details.responseBody = typeof body === 'string' ? body : JSON.stringify(body);
            }

            // إضافة السجل للمخزن المؤقت
            this.addToBuffer(requestLog);

            return originalSend.call(this, body);
        }.bind(res);

        next();
    };

    /**
     * تسجيل عمليات الملفات
     */
    async logFileOperation(operation: FileOperationLog): Promise<void> {
        const logEntry: AuditLogEntry = {
            operation: operation.operation,
            userId: operation.userId,
            userRole: operation.userRole,
            resourceType: 'encrypted_file',
            resourceId: operation.fileId,
            details: {
                fileName: operation.fileName,
                fileSize: operation.fileSize,
                accessType: operation.accessType,
                shareUrl: operation.shareUrl,
                token: operation.token,
                reason: operation.reason,
                ...operation.details
            },
            ipAddress: operation.ipAddress,
            userAgent: operation.userAgent,
            success: operation.success,
            error: operation.error,
            executionTime: operation.executionTime,
            timestamp: new Date()
        };

        this.addToBuffer(logEntry);

        // للعمليات الحرجة، احفظ فوراً
        if (this.isCriticalOperation(operation.operation)) {
            await this.flushBuffer();
        }
    }

    /**
     * تسجيل عمليات الأمان
     */
    async logSecurityEvent(event: {
        eventType: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        userId?: string;
        details: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void> {
        const logEntry: AuditLogEntry = {
            operation: `SECURITY_${event.eventType}`,
            userId: event.userId,
            resourceType: 'security_event',
            details: {
                severity: event.severity,
                eventType: event.eventType,
                ...event.details
            },
            ipAddress: event.ipAddress,
            userAgent: event.userAgent,
            success: true,
            timestamp: new Date()
        };

        this.addToBuffer(logEntry);

        // للأحداث الأمنية الحرجة، احفظ فوراً
        if (event.severity === 'critical' || event.severity === 'high') {
            await this.flushBuffer();
        }
    }

    /**
     * تسجيل الأخطاء
     */
    async logError(error: {
        error: string;
        stack?: string;
        endpoint?: string;
        method?: string;
        userId?: string;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void> {
        const logEntry: AuditLogEntry = {
            operation: 'APPLICATION_ERROR',
            userId: error.userId,
            resourceType: 'application_error',
            details: {
                error: error.error,
                stack: error.stack,
                endpoint: error.endpoint,
                method: error.method
            },
            ipAddress: error.ipAddress,
            userAgent: error.userAgent,
            success: false,
            error: error.error,
            timestamp: new Date()
        };

        this.addToBuffer(logEntry);
        
        // احفظ الأخطاء فوراً
        await this.flushBuffer();
    }

    /**
     * تسجيل عمليات تدوير المفاتيح
     */
    async logKeyRotation(rotation: {
        keyId: string;
        oldKeyId?: string;
        newKeyId?: string;
        success: boolean;
        error?: string;
        affectedFiles?: number;
        executionTime?: number;
    }): Promise<void> {
        const logEntry: AuditLogEntry = {
            operation: 'KEY_ROTATION',
            resourceType: 'encryption_key',
            resourceId: rotation.keyId,
            details: {
                oldKeyId: rotation.oldKeyId,
                newKeyId: rotation.newKeyId,
                affectedFiles: rotation.affectedFiles,
                rotationType: 'scheduled'
            },
            success: rotation.success,
            error: rotation.error,
            executionTime: rotation.executionTime,
            timestamp: new Date()
        };

        this.addToBuffer(logEntry);
        await this.flushBuffer(); // تدوير المفاتيح حرج
    }

    /**
     * تسجيل محاولات الوصول المشبوهة
     */
    async logSuspiciousActivity(activity: {
        activityType: string;
        userId?: string;
        ipAddress?: string;
        userAgent?: string;
        details: any;
        riskScore: number;
    }): Promise<void> {
        const logEntry: AuditLogEntry = {
            operation: `SUSPICIOUS_${activity.activityType}`,
            userId: activity.userId,
            resourceType: 'suspicious_activity',
            details: {
                activityType: activity.activityType,
                riskScore: activity.riskScore,
                ...activity.details
            },
            ipAddress: activity.ipAddress,
            userAgent: activity.userAgent,
            success: false,
            timestamp: new Date()
        };

        this.addToBuffer(logEntry);

        // للنشاطات المشبوهة عالية الخطورة، احفظ فوراً
        if (activity.riskScore >= 80) {
            await this.flushBuffer();
        }
    }

    /**
     * إضافة سجل للمخزن المؤقت
     */
    private addToBuffer(logEntry: AuditLogEntry): void {
        this.logBuffer.push(logEntry);

        // إذا امتلأ المخزن، فرغه
        if (this.logBuffer.length >= this.bufferSize) {
            this.flushBuffer();
        }
    }

    /**
     * تفريغ المخزن المؤقت وحفظ السجلات في قاعدة البيانات
     */
    private async flushBuffer(): Promise<void> {
        if (this.logBuffer.length === 0) return;

        const logsToSave = [...this.logBuffer];
        this.logBuffer = [];

        try {
            // تحويل السجلات لتنسيق قاعدة البيانات
            const dbLogs = logsToSave.map(log => ({
                user_id: log.userId,
                user_role: log.userRole,
                action: log.operation,
                resource_type: log.resourceType || 'unknown',
                resource_id: log.resourceId,
                details: log.details || {},
                ip_address: log.ipAddress,
                user_agent: log.userAgent,
                success: log.success,
                error_message: log.error,
                execution_time_ms: log.executionTime,
                created_at: log.timestamp.toISOString()
            }));

            // حفظ في قاعدة البيانات
            const { error } = await this.supabase
                .from('haraka_activity_log_v2')
                .insert(dbLogs);

            if (error) {
                console.error('خطأ في حفظ سجلات المراجعة:', error);
                
                // إعادة إضافة السجلات للمخزن في حالة الفشل
                this.logBuffer.unshift(...logsToSave);
            } else {
                console.log(`✅ تم حفظ ${dbLogs.length} سجل مراجعة`);
            }

        } catch (error) {
            console.error('خطأ فادح في تفريغ سجلات المراجعة:', error);
            
            // إعادة إضافة السجلات للمخزن
            this.logBuffer.unshift(...logsToSave);
        }
    }

    /**
     * تنظيف headers الحساسة
     */
    private sanitizeHeaders(headers: any): any {
        const sanitized = { ...headers };
        
        // إزالة المعلومات الحساسة
        delete sanitized.authorization;
        delete sanitized.cookie;
        delete sanitized['x-api-key'];
        
        return sanitized;
    }

    /**
     * تنظيف body الحساس
     */
    private sanitizeBody(body: any): any {
        if (!body || typeof body !== 'object') return body;

        const sanitized = { ...body };
        
        // إزالة كلمات المرور والمعلومات الحساسة
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.secret;
        delete sanitized.key;
        
        return sanitized;
    }

    /**
     * تحديد ما إذا كانت العملية حرجة
     */
    private isCriticalOperation(operation: string): boolean {
        const criticalOperations = [
            'FILE_UPLOAD_ENCRYPTED',
            'FILE_DELETION',
            'KEY_ROTATION',
            'UNAUTHORIZED_ACCESS_ATTEMPT',
            'SECURITY_BREACH',
            'DATA_EXPORT',
            'ADMIN_ACTION'
        ];

        return criticalOperations.some(critical => operation.includes(critical));
    }

    /**
     * الحصول على إحصائيات سجلات المراجعة
     */
    async getAuditStatistics(timeframe: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<any> {
        try {
            const timeMap = {
                '1h': 1,
                '24h': 24,
                '7d': 24 * 7,
                '30d': 24 * 30
            };

            const hoursBack = timeMap[timeframe];
            const since = new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();

            const { data, error } = await this.supabase
                .from('haraka_activity_log_v2')
                .select('action, success, user_role, created_at')
                .gte('created_at', since);

            if (error) {
                throw error;
            }

            // تحليل الإحصائيات
            const stats = {
                totalOperations: data.length,
                successfulOperations: data.filter(log => log.success).length,
                failedOperations: data.filter(log => !log.success).length,
                operationsByType: this.groupBy(data, 'action'),
                operationsByRole: this.groupBy(data, 'user_role'),
                timeframe
            };

            return stats;

        } catch (error) {
            console.error('خطأ في الحصول على إحصائيات المراجعة:', error);
            throw error;
        }
    }

    /**
     * تجميع البيانات حسب حقل معين
     */
    private groupBy(array: any[], key: string): Record<string, number> {
        return array.reduce((groups, item) => {
            const group = item[key] || 'unknown';
            groups[group] = (groups[group] || 0) + 1;
            return groups;
        }, {});
    }

    /**
     * البحث في سجلات المراجعة
     */
    async searchAuditLogs(criteria: {
        userId?: string;
        operation?: string;
        resourceType?: string;
        success?: boolean;
        startDate?: Date;
        endDate?: Date;
        limit?: number;
    }): Promise<any[]> {
        try {
            let query = this.supabase
                .from('haraka_activity_log_v2')
                .select('*')
                .order('created_at', { ascending: false });

            if (criteria.userId) {
                query = query.eq('user_id', criteria.userId);
            }

            if (criteria.operation) {
                query = query.ilike('action', `%${criteria.operation}%`);
            }

            if (criteria.resourceType) {
                query = query.eq('resource_type', criteria.resourceType);
            }

            if (criteria.success !== undefined) {
                query = query.eq('success', criteria.success);
            }

            if (criteria.startDate) {
                query = query.gte('created_at', criteria.startDate.toISOString());
            }

            if (criteria.endDate) {
                query = query.lte('created_at', criteria.endDate.toISOString());
            }

            if (criteria.limit) {
                query = query.limit(criteria.limit);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }

            return data || [];

        } catch (error) {
            console.error('خطأ في البحث في سجلات المراجعة:', error);
            throw error;
        }
    }
}

export default AuditLogger;