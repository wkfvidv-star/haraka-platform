/**
 * وسطاء المصادقة والتفويض المتقدم - منصة حركة
 * Advanced Authentication & Authorization Middleware - Haraka Platform
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        name: string;
        permissions: string[];
        sessionId: string;
    };
}

interface JWTPayload {
    sub: string;
    email: string;
    role: string;
    name: string;
    permissions: string[];
    sessionId: string;
    iat: number;
    exp: number;
}

/**
 * وسطاء المصادقة والتفويض
 */
export class AuthMiddleware {
    private supabase;
    private jwtSecret: string;

    constructor() {
        this.supabase = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_KEY!
        );
        this.jwtSecret = process.env.JWT_SECRET || 'haraka-secret-key-change-in-production';
    }

    /**
     * التحقق من صحة التوكن والمصادقة
     */
    authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // استخراج التوكن من الـ header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({
                    success: false,
                    error: 'مطلوب تسجيل الدخول',
                    errorCode: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }

            const token = authHeader.substring(7); // إزالة "Bearer "

            // التحقق من صحة التوكن
            const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;

            // التحقق من انتهاء صلاحية التوكن
            if (decoded.exp < Date.now() / 1000) {
                res.status(401).json({
                    success: false,
                    error: 'انتهت صلاحية جلسة المستخدم',
                    errorCode: 'TOKEN_EXPIRED'
                });
                return;
            }

            // التحقق من وجود المستخدم في قاعدة البيانات
            const { data: user, error } = await this.supabase
                .from('auth.users')
                .select('id, email, role, raw_user_meta_data')
                .eq('id', decoded.sub)
                .single();

            if (error || !user) {
                res.status(401).json({
                    success: false,
                    error: 'مستخدم غير صحيح',
                    errorCode: 'INVALID_USER'
                });
                return;
            }

            // التحقق من حالة المستخدم
            if (user.raw_user_meta_data?.status === 'suspended') {
                res.status(403).json({
                    success: false,
                    error: 'تم تعليق حساب المستخدم',
                    errorCode: 'USER_SUSPENDED'
                });
                return;
            }

            // إضافة معلومات المستخدم للطلب
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role || decoded.role,
                name: user.raw_user_meta_data?.name || decoded.name,
                permissions: decoded.permissions || [],
                sessionId: decoded.sessionId
            };

            // تسجيل نشاط المستخدم
            await this.logUserActivity(req.user.id, req.method, req.path, req.ip);

            next();

        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                res.status(401).json({
                    success: false,
                    error: 'رمز المصادقة غير صحيح',
                    errorCode: 'INVALID_TOKEN'
                });
            } else {
                console.error('خطأ في المصادقة:', error);
                res.status(500).json({
                    success: false,
                    error: 'خطأ داخلي في المصادقة',
                    errorCode: 'AUTHENTICATION_ERROR'
                });
            }
        }
    };

    /**
     * التحقق من الصلاحيات (التفويض)
     */
    authorize = (allowedRoles: string[] = [], requiredPermissions: string[] = []) => {
        return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'مطلوب تسجيل الدخول أولاً',
                        errorCode: 'AUTHENTICATION_REQUIRED'
                    });
                    return;
                }

                // التحقق من الأدوار المسموحة
                if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
                    res.status(403).json({
                        success: false,
                        error: 'ليس لديك صلاحية للوصول لهذا المورد',
                        errorCode: 'INSUFFICIENT_ROLE',
                        details: {
                            userRole: req.user.role,
                            requiredRoles: allowedRoles
                        }
                    });
                    return;
                }

                // التحقق من الصلاحيات المطلوبة
                if (requiredPermissions.length > 0) {
                    const hasAllPermissions = requiredPermissions.every(permission => 
                        req.user!.permissions.includes(permission)
                    );

                    if (!hasAllPermissions) {
                        res.status(403).json({
                            success: false,
                            error: 'ليس لديك الصلاحيات المطلوبة',
                            errorCode: 'INSUFFICIENT_PERMISSIONS',
                            details: {
                                userPermissions: req.user.permissions,
                                requiredPermissions
                            }
                        });
                        return;
                    }
                }

                next();

            } catch (error) {
                console.error('خطأ في التفويض:', error);
                res.status(500).json({
                    success: false,
                    error: 'خطأ داخلي في التفويض',
                    errorCode: 'AUTHORIZATION_ERROR'
                });
            }
        };
    };

    /**
     * التحقق من صلاحية الوصول للملف
     */
    authorizeFileAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'مطلوب تسجيل الدخول',
                    errorCode: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }

            // المديرون يمكنهم الوصول لجميع الملفات
            if (req.user.role === 'admin') {
                next();
                return;
            }

            // التحقق من صلاحية الوصول حسب الدور
            const fileId = req.params.fileId;
            this.checkFileAccessPermission(req.user, fileId)
                .then(hasAccess => {
                    if (hasAccess) {
                        next();
                    } else {
                        res.status(403).json({
                            success: false,
                            error: 'ليس لديك صلاحية للوصول لهذا الملف',
                            errorCode: 'FILE_ACCESS_DENIED'
                        });
                    }
                })
                .catch(error => {
                    console.error('خطأ في التحقق من صلاحية الملف:', error);
                    res.status(500).json({
                        success: false,
                        error: 'خطأ في التحقق من الصلاحيات',
                        errorCode: 'FILE_ACCESS_CHECK_ERROR'
                    });
                });

        } catch (error) {
            console.error('خطأ في تفويض الملف:', error);
            res.status(500).json({
                success: false,
                error: 'خطأ داخلي في تفويض الملف',
                errorCode: 'FILE_AUTHORIZATION_ERROR'
            });
        }
    };

    /**
     * التحقق من صلاحية وصول المستخدم للملف
     */
    private async checkFileAccessPermission(user: any, fileId: string): Promise<boolean> {
        try {
            // جلب معلومات الملف
            const { data: file, error } = await this.supabase
                .from('haraka_encrypted_files_v2')
                .select('*')
                .eq('id', fileId)
                .single();

            if (error || !file) {
                return false;
            }

            // التحقق حسب الدور
            switch (user.role) {
                case 'admin':
                    return true;

                case 'teacher':
                    // المعلمون يمكنهم الوصول لملفات طلابهم
                    if (file.related_student_id) {
                        return await this.isTeacherOfStudent(user.id, file.related_student_id);
                    }
                    return file.related_user_id === user.id;

                case 'parent':
                    // أولياء الأمور يمكنهم الوصول لملفات أطفالهم فقط
                    if (file.related_student_id) {
                        return await this.isParentOfStudent(user.id, file.related_student_id);
                    }
                    return false;

                case 'student':
                    // الطلاب يمكنهم الوصول لملفاتهم الشخصية فقط
                    const studentId = await this.getStudentIdByUserId(user.id);
                    return file.related_student_id === studentId;

                default:
                    return false;
            }

        } catch (error) {
            console.error('خطأ في التحقق من صلاحية الملف:', error);
            return false;
        }
    }

    /**
     * التحقق من أن المعلم يُدرس الطالب
     */
    private async isTeacherOfStudent(teacherId: string, studentId: number): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from('haraka_student_profiles')
                .select('class_name')
                .eq('id', studentId)
                .single();

            if (error || !data) return false;

            // التحقق من أن المعلم يُدرس هذا الصف
            const { data: teacherClass, error: teacherError } = await this.supabase
                .from('teacher_classes') // جدول ربط المعلمين بالصفوف
                .select('class_name')
                .eq('teacher_id', teacherId)
                .eq('class_name', data.class_name)
                .single();

            return !teacherError && !!teacherClass;

        } catch (error) {
            console.error('خطأ في التحقق من علاقة المعلم بالطالب:', error);
            return false;
        }
    }

    /**
     * التحقق من أن ولي الأمر هو والد الطالب
     */
    private async isParentOfStudent(parentId: string, studentId: number): Promise<boolean> {
        try {
            const { data, error } = await this.supabase
                .from('parent_children') // جدول ربط أولياء الأمور بالأطفال
                .select('student_id')
                .eq('parent_id', parentId)
                .eq('student_id', studentId)
                .single();

            return !error && !!data;

        } catch (error) {
            console.error('خطأ في التحقق من علاقة ولي الأمر بالطالب:', error);
            return false;
        }
    }

    /**
     * الحصول على معرف الطالب من معرف المستخدم
     */
    private async getStudentIdByUserId(userId: string): Promise<number | null> {
        try {
            const { data, error } = await this.supabase
                .from('haraka_student_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            return error ? null : data.id;

        } catch (error) {
            console.error('خطأ في الحصول على معرف الطالب:', error);
            return null;
        }
    }

    /**
     * تسجيل نشاط المستخدم
     */
    private async logUserActivity(
        userId: string, 
        method: string, 
        path: string, 
        ipAddress?: string
    ): Promise<void> {
        try {
            await this.supabase
                .from('haraka_activity_log_v2')
                .insert({
                    user_id: userId,
                    action: `${method} ${path}`,
                    resource_type: 'api_endpoint',
                    ip_address: ipAddress,
                    created_at: new Date().toISOString()
                });

        } catch (error) {
            // لا نريد أن يفشل الطلب بسبب فشل التسجيل
            console.error('خطأ في تسجيل نشاط المستخدم:', error);
        }
    }

    /**
     * إنشاء توكن JWT جديد
     */
    generateToken(user: any, sessionId: string): string {
        const payload: JWTPayload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            permissions: user.permissions || [],
            sessionId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 ساعة
        };

        return jwt.sign(payload, this.jwtSecret);
    }

    /**
     * تجديد التوكن
     */
    refreshToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'مطلوب تسجيل الدخول',
                    errorCode: 'AUTHENTICATION_REQUIRED'
                });
                return;
            }

            // إنشاء توكن جديد
            const newSessionId = crypto.randomUUID();
            const newToken = this.generateToken(req.user, newSessionId);

            res.json({
                success: true,
                message: 'تم تجديد التوكن بنجاح',
                data: {
                    token: newToken,
                    expiresIn: 24 * 60 * 60, // 24 ساعة بالثواني
                    user: {
                        id: req.user.id,
                        email: req.user.email,
                        role: req.user.role,
                        name: req.user.name
                    }
                }
            });

        } catch (error) {
            console.error('خطأ في تجديد التوكن:', error);
            res.status(500).json({
                success: false,
                error: 'فشل تجديد التوكن',
                errorCode: 'TOKEN_REFRESH_FAILED'
            });
        }
    };
}

export default AuthMiddleware;