export interface CoachClient {
  id: string;
  name: string;
  goal: string;
  status: 'active' | 'resting' | 'inactive';
  lastWorkout: string;
  currentBpm?: number;
  age?: number;
  caloriesBurned: number;
  planCompletion: number;
}

export const coachClients: CoachClient[] = [
  { id: '1', name: 'محمد', goal: 'تضخيم عضلي', status: 'active', lastWorkout: 'الآن', currentBpm: 142, age: 24, caloriesBurned: 500, planCompletion: 80 },
  { id: '2', name: 'رحيم', goal: 'حرق دهون', status: 'resting', lastWorkout: 'منذ ساعتين', currentBpm: 88, age: 28, caloriesBurned: 350, planCompletion: 60 },
  { id: '3', name: 'رامي', goal: 'لياقة شاملة', status: 'inactive', lastWorkout: 'منذ يومين', age: 31, caloriesBurned: 0, planCompletion: 20 },
  { id: '4', name: 'عبد الله', goal: 'تأهيل إصابة', status: 'active', lastWorkout: 'الآن', currentBpm: 115, age: 22, caloriesBurned: 200, planCompletion: 90 },
];

export const getCoachStats = () => {
  const totalClients = coachClients.length;
  const activeClients = coachClients.filter(c => c.status === 'active').length;
  const totalCalories = coachClients.reduce((acc, c) => acc + c.caloriesBurned, 0);
  const averageCompletion = Math.round(coachClients.reduce((acc, c) => acc + c.planCompletion, 0) / totalClients);

  return {
    totalClients,
    activeClients,
    totalCalories,
    averageCompletion
  };
};
