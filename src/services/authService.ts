import api from './api';

export const authService = {
    login: async (email: string, password: string, environment: string) => {
        // ── DEV BYPASS (password: devx) ────────────────────────────────────
        // Email format: "role:ROLENAME@x" e.g. "role:parent@x" for parent dashboard
        if (password === 'devx') {
            const roleFromEmail = email.startsWith('role:')
                ? email.split(':')[1]?.split('@')[0] || 'student'
                : 'student';
            const envMap: Record<string, string> = {
                parent: 'school', student: 'school', teacher: 'school',
                principal: 'school', directorate: 'school', ministry: 'school',
                youth: 'community', coach: 'community', competition: 'community'
            };
            const mockUser = {
                id: 'dev-001',
                firstName: 'مستخدم',
                lastName: 'تجريبي',
                name: 'مستخدم تجريبي',
                email: email || 'dev@test.com',
                role: roleFromEmail,
                environment: envMap[roleFromEmail] || environment,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=dev`,
                xp: 340,
                level: 3,
                badges: [],
                subscriptionStatus: 'ACTIVE'
            };
            const mockToken = 'dev-token-' + Date.now();
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('environment', mockUser.environment);
            return { success: true, token: mockToken, user: mockUser };
        }
        // ───────────────────────────────────────────────────────────────────
        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                environment
            });

            if (response.data.success) {
                return {
                    success: true,
                    token: response.data.token,
                    user: response.data.user
                };
            }
            return {
                success: false,
                error: response.data.error || 'فشل تسجيل الدخول'
            };
        } catch (error: any) {
            console.error('Login service error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'تعذر الاتصال بخادم المصادقة'
            };
        }
    },


    register: async (userData: any) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error: any) {
            console.error('Registration service error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('environment');
        localStorage.removeItem('province');
    }
};
