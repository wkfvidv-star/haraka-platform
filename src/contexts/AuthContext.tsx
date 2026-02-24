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
  register: (data: any) => Promise<{ success: boolean; userId?: string; error?: string }>;
  logout: () => void;
  setEnvironment: (env: Environment | null) => void;
  setProvince: (province: ProvinceContext | null) => void;
  updateUserStats: (stats: Partial<Pick<User, 'xp' | 'level' | 'badges' | 'playCoins'>>) => void;
  refreshProfiles: () => Promise<void>;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedEnvironment = localStorage.getItem('environment') as Environment;
    const savedProvince = localStorage.getItem('province');

    if (savedEnvironment) {
      setEnvironmentState(savedEnvironment);
    }
    if (savedProvince) {
      setProvinceState(JSON.parse(savedProvince));
    }

    // Initialize session from Supabase
    const initSession = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch profile and progress for the initial load
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const { data: stats } = await supabase
          .from('students_progress')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          const mappedUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile.name || '',
            firstName: profile.name?.split(' ')[0] || '',
            lastName: profile.name?.split(' ').slice(1).join(' ') || '',
            role: profile.role || 'student',
            environment: savedEnvironment || 'school',
            xp: stats?.xp || 0,
            level: stats?.level || 1,
            badges: [], // Placeholder
            playCoins: 0,
            avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`
          };
          setUser(mappedUser);
        }
      }
      setIsLoading(false);
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, selectedEnvironment: Environment): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { success, user: backendUser, error } = await authService.login(email, password, selectedEnvironment);

      if (success && backendUser) {
        const mappedUser: User = {
          ...backendUser,
          name: `${backendUser.firstName} ${backendUser.lastName}`,
          environment: selectedEnvironment,
          avatar: backendUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.firstName}`,
          badges: [],
          subscriptionStatus: 'ACTIVE'
        };

        setUser(mappedUser);
        setEnvironmentState(selectedEnvironment);
        localStorage.setItem('environment', selectedEnvironment);
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
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      const { data: stats } = await supabase
        .from('students_progress')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        setUser(prev => prev ? ({
          ...prev,
          xp: stats?.xp || 0,
          level: stats?.level || 1,
          name: profile.name || prev.name,
          avatar: profile.avatar_url || prev.avatar
        }) : null);
      }
    }
  };

  const register = async (data: any): Promise<{ success: boolean; userId?: string; error?: string }> => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setIsLoading(false);
      return response;
    } catch (error: any) {
      console.error('Register error details:', error);
      setIsLoading(false);

      let errorMessage = 'Registration failed';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setEnvironmentState(null);
    setProvinceState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('environment');
    localStorage.removeItem('province');
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

  const updateUserStats = (stats: Partial<Pick<User, 'xp' | 'level' | 'badges' | 'playCoins'>>) => {
    if (user) {
      const updatedUser = { ...user, ...stats };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};