// ══════════════════════════════════════════════════════════════════
// marketplaceService.ts
// Lightweight Marketplace layer for Haraka Platform
// ══════════════════════════════════════════════════════════════════

import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────

export type CoachSpecialty = 'fitness' | 'speed' | 'focus' | 'rehab' | 'nutrition';

export interface Coach {
  id: string;
  name: string;
  specialty: CoachSpecialty;
  specialtyLabel: string;
  bio: string;
  rating: number;
  reviewCount: number;
  sessionPrice: number;
  avatarInitials: string;
  avatarColor: string;
  challengeId?: string;
  matchPct?: number;
}

export interface Invitation {
  id: string;
  coachId: string;
  coachName: string;
  coachSpecialty: CoachSpecialty;
  coachAvatarInitials: string;
  coachAvatarColor: string;
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface TrainingRequest {
  id: string;
  coachId: string;
  coachName: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: string;
}

export interface Lead {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  goal: string;
  level: string;
  matchScore: number;
  isNew: boolean;
  location: string;
}

export interface MarketStats {
  profileViews: number;
  searchAppearances: number;
  avgMatchScore: number;
  conversionRate: number;
  rankInSpecialty: number;
  earningsThisMonth: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'lesson' | 'exercise' | 'curriculum';
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  thumbnail: string;
}

// ─── Mock Seed Data ───────────────────────────────────────────────

const MOCK_COACHES: Coach[] = [
  { id: 'coach-1', name: 'الكابتن محمد رفيق', specialty: 'speed', specialtyLabel: 'السرعة والرشاقة', bio: 'متخصص في تطوير السرعة الانفجارية لدى الشباب الجزائري. 8 سنوات خبرة.', rating: 4.9, reviewCount: 124, sessionPrice: 120, avatarInitials: 'مر', avatarColor: 'bg-orange-500', challengeId: 'c7' },
  { id: 'coach-2', name: 'أ. رياض منذر', specialty: 'focus', specialtyLabel: 'التركيز الذهني', bio: 'مدرب معتمد في علم النفس الرياضي والأداء العقلي المتوازن.', rating: 4.8, reviewCount: 89, sessionPrice: 100, avatarInitials: 'رم', avatarColor: 'bg-indigo-500', challengeId: 'c3' },
  { id: 'coach-3', name: 'الكابتن حميد مراد', specialty: 'fitness', specialtyLabel: 'اللياقة العامة', bio: 'خبير في بناء اللياقة الشاملة للشباب والمراهقين.', rating: 4.7, reviewCount: 61, sessionPrice: 90, avatarInitials: 'حم', avatarColor: 'bg-emerald-500' },
  { id: 'coach-4', name: 'أ. سمية رفيق', specialty: 'rehab', specialtyLabel: 'إعادة التأهيل', bio: 'فيزيائية رياضية متخصصة في الوقاية من الإصابات الميدانية.', rating: 4.9, reviewCount: 44, sessionPrice: 150, avatarInitials: 'سر', avatarColor: 'bg-rose-500' },
];

const MOCK_INVITATIONS: Invitation[] = [
  { id: 'inv-1', coachId: 'coach-1', coachName: 'الكابتن محمد', coachSpecialty: 'speed', coachAvatarInitials: 'مر', coachAvatarColor: 'bg-orange-500', message: 'مرحباً! رأيت مؤشرات أدائك وأعتقد أن لديك إمكانات كبيرة في السرعة.', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), status: 'pending' },
];

const MOCK_LEADS: Lead[] = [
  { id: 'lead-1', name: 'ياسين ر.', avatarInitials: 'ير', avatarColor: 'bg-blue-500', goal: 'speed', level: 'intermediate', matchScore: 94, isNew: true, location: 'الجزائر العاصمة' },
  { id: 'lead-2', name: 'عمر هـ.', avatarInitials: 'عه', avatarColor: 'bg-emerald-500', goal: 'fitness', level: 'beginner', matchScore: 88, isNew: true, location: 'وهران' },
  { id: 'lead-3', name: 'مريم ب.', avatarInitials: 'مب', avatarColor: 'bg-rose-500', goal: 'rehab', level: 'intermediate', matchScore: 91, isNew: false, location: 'قسنطينة' },
  { id: 'lead-4', name: 'أمين د.', avatarInitials: 'أد', avatarColor: 'bg-indigo-500', goal: 'focus', level: 'advanced', matchScore: 85, isNew: false, location: 'سطيف' },
];

const MOCK_RESOURCES: Resource[] = [
  { id: 'res-1', title: 'دليل الحركات الأساسية للمرحلة الابتدائية', type: 'lesson', author: 'وزارة التربية', downloads: 1250, rating: 4.9, tags: ['توازن', 'تنسيق'], thumbnail: '📚' },
  { id: 'res-2', title: 'تحدي الـ 30 يوماً للياقة الصف الرابع', type: 'curriculum', author: 'أ. أحمد علي', downloads: 850, rating: 4.7, tags: ['لياقة', 'تحدي'], thumbnail: '🏆' },
  { id: 'res-3', title: 'مجموعة تمارين المرونة الصباحية', type: 'exercise', author: 'أ. ليلى حسن', downloads: 2100, rating: 4.8, tags: ['مرونة', 'صباحي'], thumbnail: '🧘' },
];

// ─── Utilities ────────────────────────────────────────────────────

function storageKey(uid: string, suffix: string) {
  return `haraka_marketplace_${suffix}_${uid}`;
}

function getUID(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || 'default';
  } catch { return 'default'; }
}

function computeMatch(coach: Coach, goal: string, level: string): number {
  const specialtyGoalMap: Record<string, CoachSpecialty[]> = {
    fitness:  ['fitness', 'rehab'],
    speed:    ['speed', 'fitness'],
    focus:    ['focus', 'rehab'],
    pro:      ['speed', 'focus', 'fitness'],
  };
  const matched = specialtyGoalMap[goal] ?? [];
  const base = matched.includes(coach.specialty) ? 85 : 65;
  const levelBonus = level === 'advanced' ? 5 : level === 'intermediate' ? 3 : 0;
  const variance = (parseInt(coach.id.slice(-1), 36) % 8);
  return Math.min(98, base + levelBonus + variance);
}

// ══════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════

export const marketplaceService = {

  // Student Methods
  getSuggestedCoaches(): (Coach & { matchPct: number })[] {
    const uid = getUID();
    const goal  = localStorage.getItem(`haraka_student_goal_${uid}`)  || 'fitness';
    const level = localStorage.getItem(`haraka_student_level_${uid}`) || 'beginner';
    return [...MOCK_COACHES]
      .map(c => ({ ...c, matchPct: computeMatch(c, goal, level) }))
      .sort((a, b) => b.matchPct - a.matchPct)
      .slice(0, 3);
  },

  getInvitations(): Invitation[] {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null');
      if (stored) return stored as Invitation[];
    } catch {}
    localStorage.setItem(key, JSON.stringify(MOCK_INVITATIONS));
    return MOCK_INVITATIONS;
  },

  acceptInvitation(id: string): void {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    const invitations = marketplaceService.getInvitations().map(inv =>
      inv.id === id ? { ...inv, status: 'accepted' as const } : inv
    );
    localStorage.setItem(key, JSON.stringify(invitations));
  },

  rejectInvitation(id: string): void {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    const invitations = marketplaceService.getInvitations().map(inv =>
      inv.id === id ? { ...inv, status: 'rejected' as const } : inv
    );
    localStorage.setItem(key, JSON.stringify(invitations));
  },

  requestCoach(coachId: string, coachName: string): TrainingRequest {
    const uid = getUID();
    const key = storageKey(uid, 'requests');
    const existing: TrainingRequest[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (existing.find(r => r.coachId === coachId && r.status === 'pending')) {
      return existing.find(r => r.coachId === coachId)!;
    }
    const newRequest: TrainingRequest = { id: `req-${Date.now()}`, coachId, coachName, studentId: uid, status: 'pending', sentAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify([...existing, newRequest]));
    return newRequest;
  },

  hasRequestedCoach(coachId: string): boolean {
    const uid = getUID();
    const key = storageKey(uid, 'requests');
    const existing: TrainingRequest[] = JSON.parse(localStorage.getItem(key) || '[]');
    return existing.some(r => r.coachId === coachId && r.status === 'pending');
  },

  searchCoaches(query: string, filters: { goal?: string; level?: string }): (Coach & { matchPct: number })[] {
    const q = query.toLowerCase().trim();
    const targetGoal = filters.goal || 'fitness';
    const targetLevel = filters.level || 'beginner';
    return MOCK_COACHES
      .map(c => ({ ...c, matchPct: computeMatch(c, targetGoal, targetLevel) }))
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.specialtyLabel.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q))
      .sort((a, b) => b.matchPct - a.matchPct);
  },

  // Coach Methods
  getMarketStats(): MarketStats {
    return { profileViews: 452, searchAppearances: 1240, avgMatchScore: 88, conversionRate: 12.5, rankInSpecialty: 3, earningsThisMonth: 45000 };
  },

  getPotentialLeads(specialty: CoachSpecialty): Lead[] {
    return MOCK_LEADS.filter(l => {
      if (specialty === 'speed') return l.goal === 'speed' || l.goal === 'pro';
      if (specialty === 'fitness') return l.goal === 'fitness' || l.goal === 'speed';
      if (specialty === 'focus') return l.goal === 'focus' || l.goal === 'pro';
      if (specialty === 'rehab') return l.goal === 'rehab' || l.goal === 'focus';
      return true;
    }).sort((a,b) => b.matchScore - a.matchScore);
  },

  searchLeads(query: string): Lead[] {
    const q = query.toLowerCase().trim();
    return MOCK_LEADS.filter(l => !q || l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.goal.toLowerCase().includes(q));
  },

  updateCoachProfile(coachId: string, updates: Partial<Coach>): void {
    console.log(`[Marketplace] Updating coach ${coachId}`, updates);
  },

  sendOutreach(coachId: string, leadId: string, message: string): void {
    console.log(`[Marketplace] Coach ${coachId} sending invitation to ${leadId}: ${message}`);
    toast.success('تم إرسال الدعوة بنجاح!');
  },

  // Teacher Methods
  getResources(): Resource[] {
    return MOCK_RESOURCES;
  },

  searchResources(query: string): Resource[] {
    const q = query.toLowerCase().trim();
    return MOCK_RESOURCES.filter(r => 
      !q || r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))
    );
  }
};
