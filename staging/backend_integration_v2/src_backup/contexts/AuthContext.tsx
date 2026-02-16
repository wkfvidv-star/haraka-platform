import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'youth' | 'parent' | 'teacher' | 'principal' | 'coach' | 'directorate' | 'ministry' | 'competition' | 'admin';
export type Environment = 'school' | 'community';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  environment: Environment;
  avatar?: string;
  xp?: number;
  level?: number;
  badges?: string[];
  playCoins?: number;
}

interface AuthContextType {
  user: User | null;
  environment: Environment | null;
  login: (email: string, password: string, environment: Environment) => Promise<boolean>;
  logout: () => void;
  setEnvironment: (env: Environment) => void;
  updateUserStats: (stats: Partial<Pick<User, 'xp' | 'level' | 'badges' | 'playCoins'>>) => void;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedEnvironment = localStorage.getItem('environment') as Environment;
    
    if (savedUser && savedEnvironment) {
      setUser(JSON.parse(savedUser));
      setEnvironmentState(savedEnvironment);
    }
  }, []);

  const login = async (email: string, password: string, selectedEnvironment: Environment): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // School Environment Accounts
      const schoolAccounts: Record<string, { name: string; role: UserRole }> = {
        'student@demo.com': { name: 'أحمد محمد', role: 'student' },
        'parent@demo.com': { name: 'محمد الأحمد', role: 'parent' },
        'teacher@demo.com': { name: 'فاطمة الزهراء', role: 'teacher' },
        'principal@demo.com': { name: 'عبد الله الصالح', role: 'principal' },
        'directorate@demo.com': { name: 'مديرية التعليم', role: 'directorate' },
        'ministry@demo.com': { name: 'وزارة التربية', role: 'ministry' },
      };

      // Community Environment Accounts
      const communityAccounts: Record<string, { name: string; role: UserRole }> = {
        'youth@demo.com': { name: 'سارة علي', role: 'youth' },
        'coach@demo.com': { name: 'خالد الرياضي', role: 'coach' },
        'competition@demo.com': { name: 'إدارة المسابقات', role: 'competition' },
      };

      // Admin can access both environments
      const adminAccounts: Record<string, { name: string; role: UserRole }> = {
        'admin@demo.com': { name: 'مدير النظام', role: 'admin' },
      };

      const allAccounts = {
        ...schoolAccounts,
        ...communityAccounts,
        ...adminAccounts
      };

      if (password === 'demo123' && allAccounts[email]) {
        const account = allAccounts[email];
        
        // Validate environment access
        if (selectedEnvironment === 'school' && !schoolAccounts[email] && !adminAccounts[email]) {
          setIsLoading(false);
          return false;
        }
        
        if (selectedEnvironment === 'community' && !communityAccounts[email] && !adminAccounts[email]) {
          setIsLoading(false);
          return false;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: account.name,
          email,
          role: account.role,
          environment: selectedEnvironment,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.name}`,
          xp: Math.floor(Math.random() * 5000) + 1000, // Random XP between 1000-6000
          level: Math.floor(Math.random() * 20) + 1, // Random level 1-20
          badges: ['🏆', '⭐', '🎯'].slice(0, Math.floor(Math.random() * 3) + 1), // Random badges
          playCoins: Math.floor(Math.random() * 1000) + 100 // Random coins 100-1100
        };
        
        setUser(newUser);
        setEnvironmentState(selectedEnvironment);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('environment', selectedEnvironment);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setEnvironmentState(null);
    localStorage.removeItem('user');
    localStorage.removeItem('environment');
  };

  const setEnvironment = (env: Environment) => {
    setEnvironmentState(env);
    localStorage.setItem('environment', env);
    
    // Update user environment if user exists
    if (user) {
      const updatedUser = { ...user, environment: env };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
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
    login,
    logout,
    setEnvironment,
    updateUserStats,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};