import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabaseClient';

export type UserRole = 'student' | 'youth' | 'parent' | 'teacher' | 'principal' | 'coach' | 'directorate' | 'ministry' | 'competition' | 'admin';
export type Environment = 'school' | 'community';

// Define a minimal Province type here to avoid circular dependencies if we imported from component
export interface ProvinceContext {
  id: string;
  name: string;
  arabicName: string;
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: UserRole;
  environment: Environment;
  avatar?: string;
  xp?: number;
  level?: number;
  badges?: string[];
  playCoins?: number;
  provinceId?: string; // Track province in user profile
  digitalId?: string;
  qrToken?: string;
  subscriptionStatus?: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'SUSPENDED';
}

interface AuthContextType {
  user: User | null;
  environment: Environment | null;
  province: ProvinceContext | null; // Added province
  login: (email: string, password: string, environment: Environment) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; userId?: string; error?: string; isRateLimit?: boolean }>;
  logout: () => void;
  setEnvironment: (env: Environment | null) => void;
  setProvince: (province: ProvinceContext | null) => void;
  updateUserStats: (stats: Partial<Pick<User, 'xp' | 'level' | 'badges' | 'playCoins'>>) => void;
  refreshProfiles: () => Promise<void>;
  isLoading: boolean;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [environment, setEnvironmentState] = useState<Environment | null>(null);
  const [province, setProvinceState] = useState<ProvinceContext | null>(null);
  const [selectedRole, setSelectedRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEnvironment = localStorage.getItem('environment') as Environment;
    const savedProvince = localStorage.getItem('province');
    const savedRole = localStorage.getItem('selectedRole') as UserRole;

    if (savedEnvironment) {
      setEnvironmentState(savedEnvironment);
    }
    if (savedProvince) {
      setProvinceState(JSON.parse(savedProvince));
    }
    if (savedRole) {
      setSelectedRoleState(savedRole);
    }

    // Initialize session from local storage (Node.js Backend Auth)
    const initSession = async () => {
      setIsLoading(true);
      try {
        const savedToken = localStorage.getItem('token');
        const savedUserData = localStorage.getItem('user');
        const savedEnvironment = localStorage.getItem('environment') as Environment;
        const savedProvince = localStorage.getItem('province');

        if (savedToken && savedUserData) {
          const parsedUser = JSON.parse(savedUserData);
          setUser(parsedUser);
          if (savedEnvironment) setEnvironmentState(savedEnvironment);
          if (savedProvince) setProvinceState(JSON.parse(savedProvince));
        } else {
          // Fallback to anonymous/guest check if needed, or stay null
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const login = async (email: string, password: string, selectedEnvironment: Environment): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { success, user: backendUser, token, error } = await authService.login(email, password, selectedEnvironment);

      if (success && backendUser && token) {
        const mappedUser: User = {
          ...backendUser,
          name: backendUser.name || `${backendUser.firstName} ${backendUser.lastName}`,
          environment: (backendUser.environment as Environment) || selectedEnvironment,
          avatar: backendUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.firstName}`,
          badges: backendUser.badges || [],
          subscriptionStatus: backendUser.subscriptionStatus || 'ACTIVE'
        };

        // PERSISTENCE FIX: Save token and user to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        localStorage.setItem('environment', selectedEnvironment);

        setUser(mappedUser);
        setEnvironmentState(selectedEnvironment);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: error || 'بيانات الدخول غير صحيحة' };
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      return {
        success: false,
        error: error.message || 'فشل الاتصال بخادم المصادقة'
      };
    }
  };

  const refreshProfiles = async () => {
    if (user?.id) {
      try {
        // جلب بيانات التقدم من Supabase
        const { data: progress } = await supabase
          .from('students_progress')
          .select('xp, level')
          .eq('user_id', user.id)
          .single();

        // جلب الملف الشخصي من Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        setUser(prev => prev ? ({
          ...prev,
          xp: progress?.xp ?? prev.xp,
          level: progress?.level ?? prev.level,
          name: profile ? `${profile.first_name} ${profile.last_name}` : prev.name,
          firstName: profile?.first_name ?? prev.firstName,
          lastName: profile?.last_name ?? prev.lastName,
          avatar: profile?.avatar_url ?? prev.avatar,
        }) : null);
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    }
  };

  const register = async (data: any): Promise<{ success: boolean; userId?: string; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setIsLoading(false);
      
      if (!response.success && response.error) {
        let errorMessage = response.error;
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.map((e: any) => e.message || e.path?.join('.')).join(', ');
        } else if (typeof errorMessage !== 'string') {
          errorMessage = JSON.stringify(errorMessage);
        }
        return { ...response, error: errorMessage, isRateLimit: (response as any).isRateLimit };
      }
      
      return response;
    } catch (error: any) {
      console.error('Register error details:', error);
      setIsLoading(false);

      let errorMessage = 'Registration failed';
      if (error.response?.data?.error) {
        const beErr = error.response.data.error;
        if (Array.isArray(beErr)) {
          errorMessage = beErr.map((e: any) => e.message || e.path?.join('.')).join(', ');
        } else {
          errorMessage = typeof beErr === 'string' ? beErr : JSON.stringify(beErr);
        }
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setEnvironmentState(null);
    setProvinceState(null);
    // setSelectedRoleState(null); // We keep the selected role to allow re-login into the same interface
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('environment');
    localStorage.removeItem('province');
    // localStorage.removeItem('selectedRole'); 
    // تسجيل الخروج من Supabase بشكل صامت
    supabase.auth.signOut().catch(() => {});
  };

  const setEnvironment = (env: Environment | null) => {
    setEnvironmentState(env);
    if (env) {
      localStorage.setItem('environment', env);
    } else {
      localStorage.removeItem('environment');
    }

    // Update user environment if user exists
    if (user && env) {
      const updatedUser = { ...user, environment: env };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const setProvince = (prov: ProvinceContext | null) => {
    setProvinceState(prov);
    if (prov) {
      localStorage.setItem('province', JSON.stringify(prov));
    } else {
      localStorage.removeItem('province');
    }
  };

  const setSelectedRole = (role: UserRole | null) => {
    setSelectedRoleState(role);
    if (role) {
      localStorage.setItem('selectedRole', role);
    } else {
      localStorage.removeItem('selectedRole');
    }
  };

  const updateUserStats = async (stats: Partial<Pick<User, 'xp' | 'level' | 'badges' | 'playCoins'>>) => {
    if (user) {
      const updatedUser = { ...user, ...stats };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // مزامنة XP مع Supabase مباشرة
      try {
        if (stats.xp !== undefined || stats.level !== undefined) {
          await supabase
            .from('students_progress')
            .upsert({
              user_id: user.id,
              xp: updatedUser.xp,
              level: updatedUser.level,
              last_active_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });
        }
      } catch (err) {
        console.error('Failed to sync XP with Supabase:', err);
      }
    }
  };

  const value: AuthContextType = {
    user,
    environment,
    province,
    login,
    register,
    logout,
    setEnvironment,
    setProvince,
    updateUserStats,
    refreshProfiles,
    isLoading,
    selectedRole,
    setSelectedRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};