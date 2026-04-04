// ══════════════════════════════════════════════════════════════════
// gamificationService.ts
// Manages: Streak, XP, Level, Weekly Progress, Smart Motivation, Challenges
// Storage: localStorage keyed by user ID
// ══════════════════════════════════════════════════════════════════

interface GamificationData {
  xp: number;
  streak: number;
  lastCompletedDate: string | null; // ISO date string 'YYYY-MM-DD'
  weeklyLog: string[];              // ISO date strings for current week
  completedChallenges: string[];    // challenge IDs
  sessionScores: number[];          // last 7 session scores for trend
}

export interface Challenge {
  id: string;
  title: string;
  daysRequired: number;
  rewardXP: number;
  description: string;
  type: '3day' | '7day' | '14day';
}

export const CHALLENGES: Challenge[] = [
  { id: 'c3', title: 'البداية الذكية', daysRequired: 3, rewardXP: 100, description: 'أكمل مهمة يومية 3 أيام متتالية', type: '3day' },
  { id: 'c7', title: 'أسبوع البطل', daysRequired: 7, rewardXP: 500, description: 'أكمل مهمة يومية 7 أيام متتالية', type: '7day' },
  { id: 'c14', title: 'الصمود الحقيقي', daysRequired: 14, rewardXP: 1500, description: 'أكمل مهمة يومية 14 يوماً متتالياً', type: '14day' },
];

const XP_PER_LEVEL = 500;

function getKey(uid: string): string {
  return `haraka_gamification_${uid}`;
}

function getUID(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.id || 'default';
  } catch {
    return 'default';
  }
}

function isoDate(d = new Date()): string {
  return d.toISOString().split('T')[0];
}

function loadData(uid: string): GamificationData {
  try {
    const raw = localStorage.getItem(getKey(uid));
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    xp: 0,
    streak: 0,
    lastCompletedDate: null,
    weeklyLog: [],
    completedChallenges: [],
    sessionScores: [],
  };
}

function saveData(uid: string, data: GamificationData): void {
  localStorage.setItem(getKey(uid), JSON.stringify(data));
}

// ── Current week ISO dates (Mon–Sun) ───────────────────────────────
function getThisWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return isoDate(d);
  });
}

// ══════════════════════════════════════════════════════
// PUBLIC API
// ══════════════════════════════════════════════════════

export const gamificationService = {

  /** Add XP, update streak, weekly log, and auto-complete challenges */
  addXP(amount: number, score: number = 100): { newLevel: boolean; unlockedChallenge: Challenge | null } {
    const uid = getUID();
    const data = loadData(uid);
    const today = isoDate();

    // ── Streak logic ──────────────────────────────────
    if (data.lastCompletedDate === today) {
      // Already completed today — no double-count
    } else {
      const yesterday = isoDate(new Date(Date.now() - 86_400_000));
      data.streak = (data.lastCompletedDate === yesterday) ? data.streak + 1 : 1;
      data.lastCompletedDate = today;

      // Weekly log
      if (!data.weeklyLog.includes(today)) data.weeklyLog.push(today);
      // Keep only this week
      const thisWeek = getThisWeekDates();
      data.weeklyLog = data.weeklyLog.filter(d => thisWeek.includes(d));
    }

    // ── XP & Level ────────────────────────────────────
    const oldLevel = Math.floor(data.xp / XP_PER_LEVEL);
    data.xp += amount;
    const newLevel = Math.floor(data.xp / XP_PER_LEVEL);
    const leveledUp = newLevel > oldLevel;

    // ── Session scores for trend ──────────────────────
    data.sessionScores.push(score);
    if (data.sessionScores.length > 7) data.sessionScores.shift();

    // ── Challenge auto-complete ───────────────────────
    let unlockedChallenge: Challenge | null = null;
    for (const ch of CHALLENGES) {
      if (!data.completedChallenges.includes(ch.id) && data.streak >= ch.daysRequired) {
        data.completedChallenges.push(ch.id);
        data.xp += ch.rewardXP;
        unlockedChallenge = ch;
        break; // unlock one at a time
      }
    }

    saveData(uid, data);
    return { newLevel: leveledUp, unlockedChallenge };
  },

  /** Current streak in days */
  getStreak(): number {
    const uid = getUID();
    const data = loadData(uid);
    // Invalidate if last completed was not today or yesterday
    const today = isoDate();
    const yesterday = isoDate(new Date(Date.now() - 86_400_000));
    if (data.lastCompletedDate !== today && data.lastCompletedDate !== yesterday) {
      // Streak broken
      if (data.streak > 0) {
        data.streak = 0;
        saveData(uid, data);
      }
      return 0;
    }
    return data.streak;
  },

  /** Returns { level, xp, xpInLevel, xpNeeded, progressPct } */
  getLevelInfo() {
    const uid = getUID();
    const { xp } = loadData(uid);
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const xpInLevel = xp % XP_PER_LEVEL;
    const progressPct = Math.round((xpInLevel / XP_PER_LEVEL) * 100);
    return { level, xp, xpInLevel, xpNeeded: XP_PER_LEVEL, progressPct };
  },

  /** Returns { completed, total, trend: 'up'|'same'|'down' } */
  getWeeklyProgress() {
    const uid = getUID();
    const data = loadData(uid);
    const thisWeek = getThisWeekDates();
    const completed = data.weeklyLog.filter(d => thisWeek.includes(d)).length;
    const scores = data.sessionScores;
    let trend: 'up' | 'same' | 'down' = 'same';
    if (scores.length >= 2) {
      const last = scores[scores.length - 1];
      const prev = scores[scores.length - 2];
      trend = last > prev ? 'up' : last < prev ? 'down' : 'same';
    }
    return { completed, total: 7, trend };
  },

  /** Smart motivational message based on behavior */
  getSmartMotivation(phase: 'start' | 'half' | 'final'): string {
    const streak = gamificationService.getStreak();
    const { completed } = gamificationService.getWeeklyProgress();
    const uid = getUID();
    const { lastCompletedDate } = loadData(uid);
    const today = isoDate();
    const isReturning = lastCompletedDate !== null && lastCompletedDate !== today;

    if (phase === 'start') {
      if (streak === 0 && isReturning) return '😤 مرحباً بعودتك! الاستمرارية هي المفتاح، اليوم نبدأ من جديد!';
      if (streak === 0) return '🚀 أهلاً! هذه أولى خطواتك — أكملها واربح +200 XP!';
      if (streak >= 14) return `🏆 ${streak} يوماً متتالياً! أنت مثال حي على الإصرار!`;
      if (streak >= 7) return `🔥 ${streak} أيام متتالية! أسبوع البطل يكتمل! لا توقف!`;
      if (streak >= 3) return `⚡ ${streak} أيام متتالية! استمر وسيُفتح تحدي جديد!`;
      return `💪 اليوم ${streak > 0 ? 'يوم ' + streak : 'الأول'} — أنت قوي! استمر!`;
    }

    if (phase === 'half') {
      if (streak >= 7) return '🔥 نصف الوقت! البطل الحقيقي لا يتوقف!';
      if (completed >= 5) return `📅 نصف الوقت! ${completed}/7 هذا الأسبوع — أداء مذهل!`;
      return '💥 نصف الوقت! أداؤك مبهر — لا تتوقف الآن!';
    }

    // final
    if (streak >= 7) return '🏆 آخر لحظات — البطولة تُصنع هنا!';
    return '🚀 اللحظات الأخيرة! ابذل كل ما لديك الآن!';
  },

  /** All challenges with progress info */
  getChallengesWithProgress(): (Challenge & { progress: number; completed: boolean })[] {
    const uid = getUID();
    const data = loadData(uid);
    const streak = gamificationService.getStreak();
    return CHALLENGES.map(ch => ({
      ...ch,
      progress: Math.min(streak, ch.daysRequired),
      completed: data.completedChallenges.includes(ch.id),
    }));
  },
};
