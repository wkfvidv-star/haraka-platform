import React, { useState, useEffect } from 'react';
import { useAuth, Environment } from '@/contexts/AuthContext';
import { EnvironmentSelector } from './EnvironmentSelector';
import { InterfaceSelector } from '@/components/auth/InterfaceSelector';
import { ProvinceSelector } from '@/components/directorate/ProvinceSelector';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  School,
  Dumbbell,
  ShieldCheck,
  Check,
  Eye,
  EyeOff,
  User,
  Loader2,
  Zap,
  Star,
  Award
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, register, isLoading, environment, setEnvironment, province, setProvince, selectedRole, setSelectedRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSelectingProvince, setIsSelectingProvince] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [retryCooldown, setRetryCooldown] = useState(0);
  const [skipConfirmation, setSkipConfirmation] = useState(true);

  // مؤقت العد التنازلي عند تجاوز حد الطلبات
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (retryCooldown > 0) {
      timer = setTimeout(() => setRetryCooldown(retryCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [retryCooldown]);

  const handleEnvironmentSelect = (env: Environment) => {
    setEnvironment(env);
    if (env === 'community') {
      setProvince(null);
    }
  };

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
  };

  const handleProvinceSelect = (selectedProv: any) => {
    setProvince(selectedProv);
    setIsSelectingProvince(false);
  };

  const handleBackToEnvironmentSelection = () => {
    setEnvironment(null);
    setProvince(null);
    setEmail('');
    setPassword('');
    setError('');
    setSelectedRole(null);
    setIsSelectingProvince(false);
  };

  const handleOpenProvinceSelection = () => {
    setIsSelectingProvince(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retryCooldown > 0) {
      setError(`يرجى الانتظار ${retryCooldown} ثانية قبل المحاولة مرة أخرى.`);
      return;
    }
    setError('');
    setSuccessMsg('');

    if (!environment) {
      setError('يرجى اختيار البيئة أولاً');
      return;
    }

    if (isRegistering) {
      if (!email || !password || !firstName || !lastName || !selectedRole) {
        setError('يرجى ملء جميع الحقول واختيار الدور');
        return;
      }
      if (password.length < 8) {
        setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        return;
      }
      
      try {
        const result = await register({ email, password, firstName, lastName, role: selectedRole, environment });
        if (result.success) {
          if (skipConfirmation) {
            if ((result as any).isEmergencyEntry) {
              setSuccessMsg('✅ تم تفعيل الدخول المباشر (نظام الطوارئ) لتجاوز ضغط الخادم. جاري التوجيه...');
            } else {
              setSuccessMsg('✅ تم إنشاء الحساب بنجاح! جاري التوجيه تلقائياً، وإذا تأخر ذلك يرجى تفعيل حسابك من البريد الإلكتروني للتمكن من الدخول.');
            }
            
            // التوجيه التلقائي سيحدث عبر AuthContext، ولكن سنضيف تأكيداً
            setTimeout(() => {
              if (!isLoading) {
                // Force redirect if context didn't trigger it
                window.location.href = '/dashboard';
              }
            }, 2000);

          } else {

            setSuccessMsg('✅ تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.');
            setEmail('');
            setPassword('');
          }
          setIsRegistering(false);
        } else {

          // التعامل مع خطأ تجاوز حد الطلبات بشكل خاص - إظهار رسالة مطمئنة كما طلب المستخدم
          if (result.isRateLimit || result.error?.includes('limit exceeded')) {
            setRetryCooldown(2100); // منع المحاولة لمدة 35 دقيقة (2100 ثانية)
            setError('⚠️ عذراً، خادم التسجيل يواجه ضغطاً في طوابير إرسال رسائل التأكيد حالياً. لا تقلق، لقد حفظنا بياناتك ويمكنك المحاولة مرة أخرى بعد 35 دقيقة. نحن نقدر صبرك ותفهمك.');
          } else if (result.error?.toLowerCase().includes('network') || result.error?.toLowerCase().includes('failed to fetch') || result.error?.toLowerCase().includes('econnrefused')) {

            setError('⚠️ تعذر الاتصال بالخادم. تأكد من تشغيل السرفر الخلفي على المنفذ 3001.');
          } else if (result.error === 'EMAIL_TAKEN' || result.error?.includes('Email already exists') || result.error?.includes('مسجّل مسبقاً')) {

            const roleTranslations: Record<string, string> = {
              'STUDENT': 'تلميذ', 'TEACHER': 'معلم', 'PARENT': 'ولي أمر', 'COACH': 'مدرب',
              'ADMIN': 'مدير نظام', 'YOUTH': 'شاب', 'PRINCIPAL': 'مدير مدرسة',
              'DIRECTORATE': 'مديرية', 'MINISTRY': 'وزارة', 'COMPETITION': 'منظم'
            };
            const existingRole = (result as any).existingRole || 'مستخدم';
            const roleNameAr = roleTranslations[existingRole] || existingRole;
            setError(`⚠️ هذا البريد مستخدم مسبقاً كـ (${roleNameAr}). يرجى تسجيل الدخول بدلاً من إنشاء حساب جديد.`);
          } else {
            setError(result.error || 'فشل إنشاء الحساب. حاول مرة أخرى.');
          }
        }
      } catch (err: any) {
        if (err?.code === 'ERR_NETWORK' || err?.message?.toLowerCase().includes('network')) {
          setError('⚠️ تعذر الاتصال بالخادم. تأكد من تشغيل السرفر الخلفي على المنفذ 3001.');
        } else {
          setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
        }
      }
    } else {
      if (!email || !password) {
        setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
      }
      const result = await login(email, password, environment);
      if (!result.success) {
        if (result.error?.includes('Email not confirmed') || result.error?.includes('تأكيد بريدك')) {
          setError('⚠️ يرجى تفعيل حسابك من البريد الإلكتروني أولاً. إذا لم تصلك الرسالة، انتظر دقيقة ثم حاول التسجيل مجدداً لإعادة الإرسال.');
        } else if (result.error?.toLowerCase().includes('network') || result.error?.toLowerCase().includes('econnrefused')) {
          setError('⚠️ تعذر الاتصال بالخادم. تأكد من تشغيل السرفر الخلفي على المنفذ 3001.');
        } else {
          setError(result.error || 'بيانات الدخول غير صحيحة أو غير مخولة للبيئة المختارة');
        }
      }
    }
  };

  const getEnvironmentAccounts = (env: Environment) => {
    if (env === 'school') {
      return [
        { key: 'student', label: 'تلميذ', email: 'student@demo.com' },
        { key: 'parent', label: 'ولي أمر', email: 'parent@demo.com' },
        { key: 'teacher', label: 'معلم', email: 'teacher@demo.com' },
        { key: 'principal', label: 'مدير', email: 'principal@demo.com' },
        { key: 'directorate', label: 'المديرية', email: 'directorate@demo.com' },
        { key: 'ministry', label: 'الوزارة', email: 'ministry@demo.com' },
      ];
    } else {
      return [
        { key: 'youth', label: 'شاب', email: 'youth@demo.com' },
        { key: 'coach', label: 'مدرب', email: 'coach@demo.com' },
        { key: 'competition', label: 'منظم', email: 'competition@demo.com' },
      ];
    }
  };

  const getRoleLabel = (roleKey: string) => {
    const roles = [...getEnvironmentAccounts('school'), ...getEnvironmentAccounts('community')];
    return roles.find(r => r.key === roleKey)?.label || roleKey;
  };

  const isSchool = environment === 'school';

  // Step 1: No environment selected
  if (!environment) {
    return <EnvironmentSelector onSelectEnvironment={handleEnvironmentSelect} />;
  }

  // Step 2: No role selected
  if (environment && !selectedRole && !isSelectingProvince) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
        <div className="absolute inset-0 z-0">
          <img
            src="/auth_bg_kids_sports.png"
            className="w-full h-full object-cover"
            alt="bg"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"; }}
          />
          <div className="absolute inset-0 bg-blue-950/85 backdrop-blur-sm"></div>
        </div>
        <InterfaceSelector
          environment={environment}
          onSelectRole={handleRoleSelect}
          onBack={handleBackToEnvironmentSelection}
        />
      </div>
    );
  }

  // Step 3: Province selection
  if (isSelectingProvince) {
    return (
      <ProvinceSelector
        onProvinceSelect={handleProvinceSelect}
        onBack={() => setIsSelectingProvince(false)}
      />
    );
  }

  // Step 4: Auth form
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
        
        .auth-page * { font-family: 'Cairo', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.4), 0 0 40px rgba(99,102,241,0.2); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.7), 0 0 80px rgba(99,102,241,0.3); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .auth-card { animation: slide-up 0.6s ease-out forwards; }
        .float-1 { animation: float 6s ease-in-out infinite; }
        .float-2 { animation: float 8s ease-in-out infinite 1s; }
        .float-3 { animation: float 7s ease-in-out infinite 2s; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .gradient-btn {
          background: ${isSchool ? 'linear-gradient(135deg, #3b82f6, #6366f1, #8b5cf6)' : 'linear-gradient(135deg, #f97316, #ef4444, #ec4899)'};
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          transition: all 0.3s ease;
        }
        .gradient-btn:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .gradient-btn:active { transform: translateY(0px); }
        .input-field {
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          color: white;
          padding: 14px 48px 14px 16px;
          width: 100%;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
          backdrop-filter: blur(10px);
          font-family: 'Cairo', sans-serif;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.35); font-family: 'Cairo', sans-serif; }
        .input-field:focus {
          border-color: ${isSchool ? 'rgba(99,102,241,0.8)' : 'rgba(249,115,22,0.8)'};
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 4px ${isSchool ? 'rgba(99,102,241,0.15)' : 'rgba(249,115,22,0.15)'};
        }
        .input-wrapper { position: relative; }
        .input-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          transition: color 0.3s ease;
          pointer-events: none;
        }
        .input-wrapper:focus-within .input-icon { color: ${isSchool ? '#818cf8' : '#fb923c'}; }
        .glass-card {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .tab-btn {
          padding: 10px 0;
          font-size: 14px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          outline: none;
          width: 50%;
          font-family: 'Cairo', sans-serif;
        }
        .tab-active {
          background: ${isSchool ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'linear-gradient(135deg, #f97316, #ef4444)'};
          color: white;
          box-shadow: 0 4px 15px ${isSchool ? 'rgba(99,102,241,0.4)' : 'rgba(249,115,22,0.4)'};
        }
        .tab-inactive {
          background: transparent;
          color: rgba(255,255,255,0.5);
        }
        .tab-inactive:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.05); }
        .floating-badge {
          position: absolute;
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          font-family: 'Cairo', sans-serif;
        }
        .error-box {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #fca5a5;
          font-family: 'Cairo', sans-serif;
        }
        .success-box {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #86efac;
          font-family: 'Cairo', sans-serif;
        }
        .back-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          padding: 8px 16px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
          font-family: 'Cairo', sans-serif;
        }
        .back-btn:hover { background: rgba(255,255,255,0.15); color: white; }
        .eye-btn {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.4);
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.8); }
        .label-text {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          margin-bottom: 8px;
          font-family: 'Cairo', sans-serif;
        }
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.2);
          font-size: 12px;
          font-family: 'Cairo', sans-serif;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
      `}</style>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/auth_bg_kids_sports.png"
          alt="Background"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop";
          }}
        />
        <div className={`absolute inset-0 ${isSchool ? 'bg-gradient-to-br from-blue-950/90 via-indigo-950/85 to-purple-950/90' : 'bg-gradient-to-br from-orange-950/90 via-red-950/85 to-pink-950/90'}`}></div>
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated blobs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 float-1 ${isSchool ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 float-2 ${isSchool ? 'bg-purple-500' : 'bg-red-500'}`}></div>
        <div className={`absolute top-3/4 left-3/4 w-64 h-64 rounded-full blur-3xl opacity-10 float-3 ${isSchool ? 'bg-indigo-500' : 'bg-pink-500'}`}></div>
      </div>

      {/* Floating badges - hidden on mobile for cleaner UI */}
      <div className="absolute top-8 left-8 z-10 hidden lg:block">
        <div className={`floating-badge float-1 ${isSchool ? 'bg-blue-900/60' : 'bg-orange-900/60'}`}>
          <Star size={14} className={isSchool ? 'text-yellow-400' : 'text-yellow-400'} />
          <span>منصة حركة الرياضية</span>
        </div>
      </div>
      <div className="absolute bottom-12 left-8 z-10 hidden lg:block">
        <div className={`floating-badge float-2 ${isSchool ? 'bg-indigo-900/60' : 'bg-red-900/60'}`}>
          <Award size={14} className={isSchool ? 'text-blue-400' : 'text-orange-400'} />
          <span>+10,000 مستخدم نشط</span>
        </div>
      </div>
      <div className="absolute top-1/3 right-6 z-10 hidden xl:block">
        <div className={`floating-badge float-3 ${isSchool ? 'bg-purple-900/60' : 'bg-pink-900/60'}`}>
          <Zap size={14} className="text-yellow-400" />
          <span>تعلم · تدرب · تميّز</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[440px] px-2 sm:px-0 relative z-10 auth-card auth-page">

        {/* Back buttons row */}
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 justify-end items-center">
          <button className="back-btn" onClick={() => setSelectedRole(null)}>
            <ArrowRight size={14} />
            <span>تغيير الواجهة</span>
          </button>
          <button
            className="back-btn"
            onClick={environment === 'school' ? handleOpenProvinceSelection : handleBackToEnvironmentSelection}
          >
            <ArrowRight size={14} />
            <span>{environment === 'school' ? 'اختر الولاية' : 'تغيير البيئة'}</span>
          </button>
        </div>

        <div className="glass-card overflow-hidden">

          {/* Top gradient bar */}
          <div className={`h-1.5 w-full ${isSchool ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500'}`}></div>

          {/* Header */}
          <div className="pt-6 sm:pt-8 pb-4 sm:pb-6 px-6 sm:px-8 text-center">
            {/* Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 sm:mb-5 pulse-glow ${isSchool ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
              {isSchool
                ? <School className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                : <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
            </div>

            {/* Role label */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase mb-4 ${isSchool ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'}`}>
              {isSchool ? <School size={12} /> : <Dumbbell size={12} />}
              {isSchool ? 'بوابة المدرسة' : 'بوابة المجتمع'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1 tracking-tight">
              {getRoleLabel(selectedRole)}
            </h1>

            {province && (
              <p className={`font-bold text-sm mb-1 ${isSchool ? 'text-blue-400' : 'text-orange-400'}`}>
                📍 {province.arabicName}
              </p>
            )}

            <p className="text-sm text-white/40 font-medium">
              {isRegistering ? 'إنشاء حساب جديد في Haraka' : 'تسجيل الدخول إلى النظام'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="px-6 sm:px-8 mb-4 sm:mb-6">
            <div className="flex gap-1.5 p-1.5 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                className={`tab-btn ${!isRegistering ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setIsRegistering(false)}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                className={`tab-btn ${isRegistering ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setIsRegistering(true)}
              >
                إنشاء حساب
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">

            {/* Name fields (register only) */}
            {isRegistering && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="label-text">الاسم الأول</label>
                  <div className="input-wrapper">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="حمدي"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="label-text">الاسم الأخير</label>
                  <div className="input-wrapper">
                    <User size={16} className="input-icon" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="حمدون"
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="label-text">البريد الإلكتروني</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-text" style={{ marginBottom: 0 }}>كلمة المرور</label>
                {!isRegistering && (
                  <a href="#" className={`text-xs font-semibold ${isSchool ? 'text-blue-400 hover:text-blue-300' : 'text-orange-400 hover:text-orange-300'} transition-colors`}>
                    نسيت كلمة المرور؟
                  </a>
                )}
              </div>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegistering ? 'على الأقل 8 أحرف' : '••••••••'}
                  className="input-field"
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password strength indicator (register only) */}
            {isRegistering && password.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex gap-1.5">
                  {[0,1,2,3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        password.length > i * 2
                          ? password.length >= 12 ? 'bg-green-500'
                          : password.length >= 8 ? 'bg-yellow-500'
                          : 'bg-red-500'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/40">
                  {password.length < 8 ? 'كلمة المرور ضعيفة - أضف المزيد' : password.length < 12 ? 'كلمة المرور مقبولة' : 'كلمة المرور قوية ✓'}
                </p>
              </div>
            )}

            {/* Skip Confirmation (option) */}
            {isRegistering && (
                <div className="flex items-center gap-2 px-1">
                    <input 
                        type="checkbox" 
                        id="skipConfirm"
                        checked={skipConfirmation}
                        onChange={(e) => setSkipConfirmation(e.target.checked)}
                        className={`w-4 h-4 rounded border-white/20 bg-white/5 active:scale-95 transition-all cursor-pointer ${isSchool ? 'accent-blue-500' : 'accent-orange-500'}`}
                    />
                    <label htmlFor="skipConfirm" className="text-xs font-bold text-white/60 cursor-pointer select-none">
                        التسجيل بدون تأكيد الحساب (دخول مباشر)
                    </label>
                </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-box">
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="success-box">
                <Check size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="gradient-btn w-full h-14 rounded-2xl text-white text-base font-black flex items-center justify-center gap-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>جاري المعالجة...</span>
                </>
              ) : isRegistering ? (
                <>
                  <span>إنشاء حساب جديد</span>
                  <Check size={18} />
                </>
              ) : (
                <>
                  <span>تسجيل الدخول</span>
                  <LogIn size={18} />
                </>
              )}
            </button>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <ShieldCheck size={14} className="text-green-500" />
              <span className="text-xs text-white/30 font-medium">نظام محمي ومشفر بالكامل · SSL 256-bit</span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-white/25 text-xs mt-6 font-medium">
          © 2025 منصة Haraka · وزارة التربية الوطنية
        </p>
      </div>
    </div>
  );
};

export default AuthPage;