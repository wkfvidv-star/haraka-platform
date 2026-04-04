// ══════════════════════════════════════════════════════════════════
// marketplaceService.ts
// Lightweight Marketplace layer for Youth Dashboard
//
// Data Structure is production-ready: swap MOCK_* arrays with real
// API calls later without changing any consumer component.
// ══════════════════════════════════════════════════════════════════

// ─── Types (matches future real API shape) ────────────────────────

export type CoachSpecialty = 'fitness' | 'speed' | 'focus' | 'rehab' | 'nutrition';

export interface Coach {
  id: string;
  name: string;
  specialty: CoachSpecialty;
  specialtyLabel: string;
  bio: string;
  rating: number;       // 0-5
  reviewCount: number;
  sessionPrice: number; // SAR
  avatarInitials: string;
  avatarColor: string;  // tailwind bg class
  challengeId?: string; // linked challenge from gamificationService
  matchPct?: number;    // computed per-user, not stored
}

export interface Invitation {
  id: string;
  coachId: string;
  coachName: string;
  coachSpecialty: CoachSpecialty;
  coachAvatarInitials: string;
  coachAvatarColor: string;
  message: string;
  date: string;         // ISO string
  status: 'pending' | 'accepted' | 'rejected';
  // Future: linkedProgramId?: string;
}

export interface TrainingRequest {
  id: string;
  coachId: string;
  coachName: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: string;       // ISO string
}

// ─── Mock Seed Data ───────────────────────────────────────────────
// ⚠️ To connect to real API: replace MOCK_COACHES with an API call
// and replace MOCK_INVITATIONS with a WebSocket/polling endpoint.

const MOCK_COACHES: Coach[] = [
  {
    id: 'coach-1',
    name: 'الكابتن أحمد المنصوري',
    specialty: 'speed',
    specialtyLabel: 'السرعة والرشاقة',
    bio: 'متخصص في تطوير السرعة الانفجارية لدى الشباب. 8 سنوات خبرة.',
    rating: 4.9,
    reviewCount: 124,
    sessionPrice: 120,
    avatarInitials: 'أم',
    avatarColor: 'bg-orange-500',
    challengeId: 'c7',
  },
  {
    id: 'coach-2',
    name: 'م. ليلى الأحمدي',
    specialty: 'focus',
    specialtyLabel: 'التركيز الذهني',
    bio: 'مدربة معتمدة في علم النفس الرياضي والأداء العقلي.',
    rating: 4.8,
    reviewCount: 89,
    sessionPrice: 100,
    avatarInitials: 'لأ',
    avatarColor: 'bg-indigo-500',
    challengeId: 'c3',
  },
  {
    id: 'coach-3',
    name: 'م. كريم الزهراني',
    specialty: 'fitness',
    specialtyLabel: 'اللياقة العامة',
    bio: 'خبير في بناء اللياقة الشاملة للمراحل العمرية من 15-25.',
    rating: 4.7,
    reviewCount: 61,
    sessionPrice: 90,
    avatarInitials: 'كز',
    avatarColor: 'bg-emerald-500',
  },
  {
    id: 'coach-4',
    name: 'م. سارة العتيبي',
    specialty: 'rehab',
    specialtyLabel: 'إعادة التأهيل',
    bio: 'فيزيائية رياضية متخصصة في الوقاية من الإصابات.',
    rating: 4.9,
    reviewCount: 44,
    sessionPrice: 150,
    avatarInitials: 'سع',
    avatarColor: 'bg-rose-500',
  },
];

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: 'inv-1',
    coachId: 'coach-1',
    coachName: 'الكابتن أحمد',
    coachSpecialty: 'speed',
    coachAvatarInitials: 'أم',
    coachAvatarColor: 'bg-orange-500',
    message: 'مرحباً! رأيت مؤشرات أدائك وأعتقد أن لديك إمكانات كبيرة في السرعة. أدعوك للانضمام لبرنامجي المكثف لمدة 30 يوماً.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'pending',
  },
];

// ─── Storage Keys ─────────────────────────────────────────────────

function storageKey(uid: string, suffix: string) {
  return `haraka_marketplace_${suffix}_${uid}`;
}

function getUID(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || 'default';
  } catch { return 'default'; }
}

// ─── Match Algorithm ──────────────────────────────────────────────
// Matches coach specialty to user's goal saved during onboarding.
// Replace with server-side scoring when connecting real API.

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
  // Small pseudo-random variation per coach id so results feel organic
  const variance = (parseInt(coach.id.slice(-1), 36) % 8);
  return Math.min(98, base + levelBonus + variance);
}

// ══════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════

export const marketplaceService = {

  /** Returns top 3 coaches ranked by match score for the current user */
  getSuggestedCoaches(): (Coach & { matchPct: number })[] {
    const uid = getUID();
    const goal  = localStorage.getItem(`haraka_student_goal_${uid}`)  || 'fitness';
    const level = localStorage.getItem(`haraka_student_level_${uid}`) || 'beginner';

    return [...MOCK_COACHES]
      .map(c => ({ ...c, matchPct: computeMatch(c, goal, level) }))
      .sort((a, b) => b.matchPct - a.matchPct)
      .slice(0, 3);
  },

  /** Returns all invitations (pending first) */
  getInvitations(): Invitation[] {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null');
      if (stored) return stored as Invitation[];
    } catch {}
    // First visit: seed with mock data, persist it
    localStorage.setItem(key, JSON.stringify(MOCK_INVITATIONS));
    return MOCK_INVITATIONS;
  },

  /** Accept an invitation */
  acceptInvitation(id: string): void {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    const invitations = marketplaceService.getInvitations().map(inv =>
      inv.id === id ? { ...inv, status: 'accepted' as const } : inv
    );
    localStorage.setItem(key, JSON.stringify(invitations));
  },

  /** Reject an invitation */
  rejectInvitation(id: string): void {
    const uid = getUID();
    const key = storageKey(uid, 'invitations');
    const invitations = marketplaceService.getInvitations().map(inv =>
      inv.id === id ? { ...inv, status: 'rejected' as const } : inv
    );
    localStorage.setItem(key, JSON.stringify(invitations));
  },

  /** Send a training request to a coach */
  requestCoach(coachId: string, coachName: string): TrainingRequest {
    const uid = getUID();
    const key = storageKey(uid, 'requests');
    const existing: TrainingRequest[] = JSON.parse(localStorage.getItem(key) || '[]');

    // Prevent duplicate pending requests
    if (existing.find(r => r.coachId === coachId && r.status === 'pending')) {
      return existing.find(r => r.coachId === coachId)!;
    }

    const newRequest: TrainingRequest = {
      id: `req-${Date.now()}`,
      coachId,
      coachName,
      studentId: uid,
      status: 'pending',
      sentAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify([...existing, newRequest]));
    return newRequest;
  },

  /** Check if a request to a coach already exists */
  hasRequestedCoach(coachId: string): boolean {
    const uid = getUID();
    const key = storageKey(uid, 'requests');
    const existing: TrainingRequest[] = JSON.parse(localStorage.getItem(key) || '[]');
    return existing.some(r => r.coachId === coachId && r.status === 'pending');
  },

  /** Search coaches by name or specialty with optional filters */
  searchCoaches(query: string, filters: { goal?: string; level?: string }): (Coach & { matchPct: number })[] {
    const q = query.toLowerCase().trim();
    const targetGoal = filters.goal || 'fitness';
    const targetLevel = filters.level || 'beginner';

    return MOCK_COACHES
      .map(c => ({ ...c, matchPct: computeMatch(c, targetGoal, targetLevel) }))
      .filter(c => {
        const matchesQuery = !q || 
          c.name.toLowerCase().includes(q) || 
          c.specialtyLabel.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q);
        
        const matchesGoal = !filters.goal || c.specialty === filters.goal; // Optional strict goal match
        
        return matchesQuery;
      })
      .sort((a, b) => b.matchPct - a.matchPct);
  },
};
