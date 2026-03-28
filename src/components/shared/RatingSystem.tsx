import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp, Send, Award, TrendingUp } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RatingEntry {
  id: string;
  fromName: string;
  fromRole: string;
  toId: string;
  toName: string;
  stars: number;          // 1–5
  comment: string;
  timestamp: string;      // ISO
  category: string;       // 'performance' | 'behavior' | 'attendance' | ...
}

interface RatingTarget {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface RatingSystemProps {
  /** Role of the person GIVING ratings */
  raterRole: string;
  raterName: string;
  /** List of people this role can rate */
  targets?: RatingTarget[];
  /** ID of the person RECEIVING ratings (to show received ratings) */
  receiverId?: string;
  receiverName?: string;
  mode?: 'rate' | 'view' | 'both';
  storageKey?: string;
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY = 'haraka_ratings_v2';

function loadRatings(): RatingEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveRating(entry: RatingEntry) {
  const all = loadRatings();
  all.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

// ─── StarPicker ───────────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-125"
        >
          <Star
            className={`w-7 h-7 ${(hover || value) >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Category labels ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'performance', label: 'الأداء الأكاديمي / الرياضي' },
  { id: 'behavior',   label: 'السلوك والانضباط' },
  { id: 'attendance', label: 'الحضور والالتزام' },
  { id: 'progress',   label: 'التطور والتقدم' },
];

// ─── RatingForm ───────────────────────────────────────────────────────────────
function RatingForm({ targets, raterName, raterRole }: {
  targets: RatingTarget[];
  raterName: string;
  raterRole: string;
}) {
  const [selectedTarget, setSelectedTarget] = useState<RatingTarget | null>(
    targets.length === 1 ? targets[0] : null
  );
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('performance');
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTarget || stars === 0) return;
    const entry: RatingEntry = {
      id: `${Date.now()}-${Math.random()}`,
      fromName: raterName,
      fromRole: raterRole,
      toId: selectedTarget.id,
      toName: selectedTarget.name,
      stars,
      comment,
      timestamp: new Date().toISOString(),
      category,
    };
    saveRating(entry);
    setSent(true);
    setTimeout(() => { setSent(false); setStars(0); setComment(''); }, 2500);
  }

  return (
    <form onSubmit={submit} className="space-y-4" dir="rtl">
      {/* Target selector */}
      {targets.length > 1 && (
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">اختر الشخص المُقَيَّم</label>
          <div className="grid grid-cols-2 gap-2">
            {targets.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTarget(t)}
                className={`p-3 rounded-2xl border-2 font-bold text-sm text-right transition-all ${
                  selectedTarget?.id === t.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <p className="font-black">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">فئة التقييم</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                category === c.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stars */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">
          التقييم
          {stars > 0 && (
            <span className="mr-2 text-amber-500">
              {['', '⭐ ضعيف', '⭐⭐ مقبول', '⭐⭐⭐ جيد', '⭐⭐⭐⭐ جيد جداً', '⭐⭐⭐⭐⭐ ممتاز'][stars]}
            </span>
          )}
        </label>
        <StarPicker value={stars} onChange={setStars} />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-black text-slate-700 mb-2">ملاحظات (اختياري)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="أضف ملاحظاتك هنا..."
          rows={3}
          className="w-full border border-slate-200 rounded-2xl p-3 text-sm font-medium resize-none focus:outline-none focus:border-orange-400 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={!selectedTarget || stars === 0}
        className={`w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
          sent ? 'bg-emerald-500 text-white' :
          (!selectedTarget || stars === 0)
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30'
        }`}
      >
        {sent ? (
          <><Award className="w-4 h-4" /> تم إرسال التقييم ✓</>
        ) : (
          <><Send className="w-4 h-4" /> إرسال التقييم</>
        )}
      </button>
    </form>
  );
}

// ─── ReceivedRatings ──────────────────────────────────────────────────────────
function ReceivedRatings({ receiverId, receiverName }: { receiverId: string; receiverName: string }) {
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const all = loadRatings().filter(r => r.toId === receiverId || r.toName === receiverName);
    setRatings(all.reverse());
  }, [receiverId, receiverName]);

  const avg = ratings.length ? (ratings.reduce((s, r) => s + r.stars, 0) / ratings.length) : 0;
  const visible = showAll ? ratings : ratings.slice(0, 3);

  if (ratings.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Award className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm font-bold">لا توجد تقييمات بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      {/* Summary */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-4xl font-black text-amber-500">{avg.toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`w-4 h-4 ${avg >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5,4,3,2,1].map(s => {
            const count = ratings.filter(r => r.stars === s).length;
            const pct = ratings.length ? (count / ratings.length) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 w-4">{s}</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-400 w-5">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="text-left">
          <p className="font-black text-slate-900 text-lg">{ratings.length}</p>
          <p className="text-xs font-bold text-slate-400">تقييم</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {visible.map(r => (
          <div key={r.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-black text-slate-900 text-sm">{r.fromName}</p>
                <p className="text-xs text-slate-400 font-bold">{r.fromRole} · {new Date(r.timestamp).toLocaleDateString('ar-DZ')}</p>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${r.stars >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
            </div>
            {r.comment && <p className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 rounded-xl p-2">{r.comment}</p>}
            <span className="inline-block mt-2 text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-xl">
              {CATEGORIES.find(c => c.id === r.category)?.label}
            </span>
          </div>
        ))}
      </div>

      {ratings.length > 3 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="w-full text-sm font-black text-slate-500 hover:text-orange-500 flex items-center justify-center gap-1 transition-colors"
        >
          {showAll ? <><ChevronUp className="w-4 h-4" /> إخفاء</> : <><ChevronDown className="w-4 h-4" /> عرض الكل ({ratings.length})</>}
        </button>
      )}
    </div>
  );
}

// ─── Main RatingSystem export ─────────────────────────────────────────────────
export function RatingSystem({
  raterRole,
  raterName,
  targets = [],
  receiverId,
  receiverName,
  mode = 'both',
}: RatingSystemProps) {
  const [panel, setPanel] = useState<'rate' | 'view'>(
    mode === 'view' ? 'view' : 'rate'
  );

  const canRate = mode !== 'view' && targets.length > 0;
  const canView = mode !== 'rate' && !!receiverId;

  return (
    <div className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg">نظام التقييم</h3>
              <p className="text-white/70 text-xs font-bold">تقييم احترافي موثوق</p>
            </div>
          </div>
          {/* Panel switcher */}
          {canRate && canView && (
            <div className="flex bg-white/20 rounded-xl p-1 gap-1">
              {[{ id: 'rate', label: 'تقييم' }, { id: 'view', label: 'نتائجي' }].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPanel(p.id as 'rate' | 'view')}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    panel === p.id ? 'bg-white text-orange-600' : 'text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {panel === 'rate' && canRate && (
          <RatingForm targets={targets} raterName={raterName} raterRole={raterRole} />
        )}
        {panel === 'view' && canView && (
          <ReceivedRatings receiverId={receiverId!} receiverName={receiverName || ''} />
        )}
        {panel === 'rate' && !canRate && (
          <div className="text-center py-6 text-slate-400">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold">لا يوجد تقييم متاح لهذا الدور</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RatingSystem;
