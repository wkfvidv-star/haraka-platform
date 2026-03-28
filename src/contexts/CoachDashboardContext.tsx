import { createContext, useContext } from 'react';

export const CoachDashboardContext = createContext<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
}>({ activeTab: 'overview', setActiveTab: () => {} });

export const useCoachDashboard = () => useContext(CoachDashboardContext);
