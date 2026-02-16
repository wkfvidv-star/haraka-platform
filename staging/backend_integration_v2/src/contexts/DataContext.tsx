import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'parent' | 'teacher' | 'principal' | 'coach' | 'ministry';
  avatar?: string;
  school?: string;
  grade?: string;
  class?: string;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  points: number;
  completed: boolean;
  description: string;
  objectives: string[];
  equipment?: string;
  muscleGroups: string[];
  caloriesBurn: number;
  videoUrl?: string;
}

interface Challenge {
  id: string;
  name: string;
  type: 'فردي' | 'جماعي' | 'تنافسي';
  category: string;
  description: string;
  duration: number;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  points: number;
  participants: number;
  maxParticipants?: number;
  status: 'متاح' | 'جاري' | 'مكتمل';
  startDate?: string;
  endDate?: string;
  objectives: string[];
  rewards: string[];
  requirements: string[];
}

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'stable';
  target: number;
  category: string;
  color: string;
}

interface ActivityData {
  steps: number;
  stepsGoal: number;
  distance: number;
  calories: number;
  heartRate: {
    current: number;
    min: number;
    max: number;
    avg: number;
  };
  activeTime: number;
  sedentaryTime: number;
}

interface DataContextType {
  // User data
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Exercise data
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (id: string, updates: Partial<Exercise>) => void;
  
  // Challenge data
  challenges: Challenge[];
  setChallenges: (challenges: Challenge[]) => void;
  addChallenge: (challenge: Challenge) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  
  // Performance data
  performanceMetrics: PerformanceMetric[];
  setPerformanceMetrics: (metrics: PerformanceMetric[]) => void;
  updatePerformanceMetric: (id: string, updates: Partial<PerformanceMetric>) => void;
  
  // Activity data
  activityData: ActivityData | null;
  setActivityData: (data: ActivityData | null) => void;
  
  // General data operations
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  clearData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Exercise operations
  const addExercise = (exercise: Exercise) => {
    setExercises(prev => [...prev, exercise]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === id ? { ...exercise, ...updates } : exercise
    ));
  };

  // Challenge operations
  const addChallenge = (challenge: Challenge) => {
    setChallenges(prev => [...prev, challenge]);
  };

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === id ? { ...challenge, ...updates } : challenge
    ));
  };

  // Performance metric operations
  const updatePerformanceMetric = (id: string, updates: Partial<PerformanceMetric>) => {
    setPerformanceMetrics(prev => prev.map(metric => 
      metric.id === id ? { ...metric, ...updates } : metric
    ));
  };

  // Data refresh function
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API calls - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load data from localStorage or API
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      
      const savedExercises = localStorage.getItem('exercises');
      if (savedExercises) {
        setExercises(JSON.parse(savedExercises));
      }
      
      const savedChallenges = localStorage.getItem('challenges');
      if (savedChallenges) {
        setChallenges(JSON.parse(savedChallenges));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  // Clear all data
  const clearData = () => {
    setCurrentUser(null);
    setExercises([]);
    setChallenges([]);
    setPerformanceMetrics([]);
    setActivityData(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('exercises');
    localStorage.removeItem('challenges');
    localStorage.removeItem('performanceMetrics');
    localStorage.removeItem('activityData');
  };

  // Save data to localStorage when state changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem('exercises', JSON.stringify(exercises));
    }
  }, [exercises]);

  useEffect(() => {
    if (challenges.length > 0) {
      localStorage.setItem('challenges', JSON.stringify(challenges));
    }
  }, [challenges]);

  useEffect(() => {
    if (performanceMetrics.length > 0) {
      localStorage.setItem('performanceMetrics', JSON.stringify(performanceMetrics));
    }
  }, [performanceMetrics]);

  useEffect(() => {
    if (activityData) {
      localStorage.setItem('activityData', JSON.stringify(activityData));
    }
  }, [activityData]);

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const value: DataContextType = {
    // User data
    currentUser,
    setCurrentUser,
    
    // Exercise data
    exercises,
    setExercises,
    addExercise,
    updateExercise,
    
    // Challenge data
    challenges,
    setChallenges,
    addChallenge,
    updateChallenge,
    
    // Performance data
    performanceMetrics,
    setPerformanceMetrics,
    updatePerformanceMetric,
    
    // Activity data
    activityData,
    setActivityData,
    
    // General operations
    loading,
    error,
    refreshData,
    clearData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export type { User, Exercise, Challenge, PerformanceMetric, ActivityData };