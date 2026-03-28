/**
 * SURGICAL YOUTH DASHBOARD PATCH — v3 FINAL
 * Strategy: Add ONLY what's missing using exact string anchors.
 * Touches: imports, state, return wrapper. Never rewrites existing render functions.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let src = fs.readFileSync(filePath, 'utf8');

const before = src.split('\n').length;
console.log(`[START] Lines: ${before}`);

// ══════════════════════════════════════════════════════
// 1. ADD MISSING IMPORTS  (idempotent)
// ══════════════════════════════════════════════════════
const newImports = [
  ["YouthOnboarding",       "@/components/youth-dashboard/YouthOnboarding",       "default"],
  ["YouthQuestionnaire",    "@/components/youth-dashboard/YouthQuestionnaire",    "default"],
  ["DigitalBrainOnboarding","@/components/youth-dashboard/DigitalBrainOnboarding","default"],
  ["YouthInitialTest",      "@/components/youth-dashboard/YouthInitialTest",      "default"],
  ["CoachBookingModal",     "@/components/youth-dashboard/CoachBookingModal",     "default"],
  ["VideoAnalysisModal",    "@/components/youth-dashboard/VideoAnalysisModal",    "default"],
  ["ExerciseLibraryHub",    "@/components/youth-dashboard/ExerciseLibraryHub",    "default"],
];

let importBlock = `\nimport React, { useState, useEffect } from 'react';`;

const IMPORT_ANCHOR = `import React, { useState, useEffect } from 'react';`;
if (!src.includes(IMPORT_ANCHOR)) {
  console.error("ERROR: React import anchor not found!"); process.exit(1);
}

let addedImports = [];
for (const [name, path_, kind] of newImports) {
  if (!src.includes(`import ${name}`) && !src.includes(`from '${path_}'`)) {
    const stmt = `import ${name} from '${path_}';`;
    src = src.replace(IMPORT_ANCHOR, `${IMPORT_ANCHOR}\n${stmt}`);
    addedImports.push(name);
  }
}
console.log('✓ Imports added:', addedImports.join(', ') || 'none needed');

// ══════════════════════════════════════════════════════
// 2. ADD STATE VARIABLES (idempotent)
// ══════════════════════════════════════════════════════
const STATE_ANCHOR = `const [hceInsights, setHceInsights] = useState<HCEInsights | null>(null);`;
if (!src.includes(STATE_ANCHOR)) {
  console.error("ERROR: State anchor not found!"); process.exit(1);
}

const newStates = `
  // ── Onboarding state machine ──────────────────────────
  const [onboardingPhase, setOnboardingPhase] = useState<
    'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'main'
  >(() => {
    try { return (localStorage.getItem('youth_onboarding_done') === '1' ? 'main' : 'slides') as any; }
    catch { return 'slides'; }
  });

  const completeOnboarding = () => {
    try { localStorage.setItem('youth_onboarding_done', '1'); } catch {}
    setOnboardingPhase('main');
  };

  // ── Quick-action modal states ─────────────────────────
  const [showBooking, setShowBooking] = useState(false);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [showLibraryHub, setShowLibraryHub] = useState(false);`;

if (!src.includes('onboardingPhase')) {
  src = src.replace(STATE_ANCHOR, STATE_ANCHOR + newStates);
  console.log('✓ State variables injected');
} else {
  console.log('! State variables already present');
}

// ══════════════════════════════════════════════════════
// 3. WRAP THE MAIN RETURN WITH ONBOARDING GUARD
// ══════════════════════════════════════════════════════
const RETURN_ANCHOR = `  return (\n    <div className={\`expert-dashboard-root`;

if (!src.includes('onboardingPhase === \'slides\'') && src.includes(RETURN_ANCHOR)) {
  const onboardingJSX = `
  // ── Onboarding gate ───────────────────────────────────
  if (onboardingPhase === 'slides') {
    return <YouthOnboarding onComplete={() => setOnboardingPhase('questionnaire')} />;
  }
  if (onboardingPhase === 'questionnaire') {
    return <YouthQuestionnaire onComplete={() => setOnboardingPhase('tech-intro')} />;
  }
  if (onboardingPhase === 'tech-intro') {
    return <DigitalBrainOnboarding onComplete={() => setOnboardingPhase('test')} />;
  }
  if (onboardingPhase === 'test') {
    return <YouthInitialTest onComplete={completeOnboarding} />;
  }

`;
  src = src.replace(RETURN_ANCHOR, onboardingJSX + RETURN_ANCHOR);
  console.log('✓ Onboarding guard injected');
} else {
  console.log('! Onboarding guard already present or return anchor not found');
}

// ══════════════════════════════════════════════════════
// 4. ADD MODALS BEFORE THE CLOSING </div> OF RETURN
// ══════════════════════════════════════════════════════
// The main return ends with:  </div>\n  );\n}
const CLOSE_ANCHOR = `    </div>\n  );\n}`;

const modalJSX = `
      {/* ── Global Modals ─────────────────────────────── */}
      {showBooking && (
        <CoachBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
      )}
      {showVideoAnalysis && (
        <VideoAnalysisModal isOpen={showVideoAnalysis} onClose={() => setShowVideoAnalysis(false)} />
      )}
      {showLibraryHub && (
        <ExerciseLibraryHub isOpen={showLibraryHub} onClose={() => setShowLibraryHub(false)} />
      )}
`;

if (!src.includes('showBooking &&') && src.includes(CLOSE_ANCHOR)) {
  src = src.replace(CLOSE_ANCHOR, modalJSX + CLOSE_ANCHOR);
  console.log('✓ Global modals injected');
} else {
  console.log('! Modals already present or close anchor not found');
}

// ══════════════════════════════════════════════════════
// 5. WIRE ACTION BUTTONS IN THE BENTO DASHBOARD
// ══════════════════════════════════════════════════════
// The "حجز جلسة مع مدرب" button currently goes to setActiveTab('ai-motion')
// We change it to open the booking modal
if (src.includes("label: 'حجز جلسة مع مدرب'")) {
  src = src.replace(
    `{ label: 'حجز جلسة مع مدرب', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-100', tab: 'ai-motion' }`,
    `{ label: 'حجز جلسة مع مدرب', icon: User, color: 'text-indigo-400', bg: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-500/30 text-indigo-100', action: () => setShowBooking(true) }`
  );
  // Update the map to use action instead of tab
  src = src.replace(
    `].map((a, i) => (\n                <button key={i} onClick={() => setActiveTab(a.tab)}`,
    `].map((a: any, i: number) => (\n                <button key={i} onClick={a.action ? a.action : () => setActiveTab(a.tab)}`
  );
  console.log('✓ Booking button wired to modal');
}

if (src.includes("label: 'تحليل فيديو مباشر'")) {
  src = src.replace(
    `{ label: 'تحليل فيديو مباشر', icon: Video, color: 'text-orange-400', bg: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-100', tab: 'ai-motion' }`,
    `{ label: 'تحليل فيديو مباشر', icon: Video, color: 'text-orange-400', bg: 'bg-orange-500/15 hover:bg-orange-500/25 border-orange-500/30 text-orange-100', action: () => setShowVideoAnalysis(true) }`
  );
  console.log('✓ Video analysis button wired to modal');
}

// ══════════════════════════════════════════════════════
// 6. ENSURE EXERCISE LIBRARY HUB CASE IN SWITCH
// ══════════════════════════════════════════════════════
if (!src.includes("case 'library': return <ComprehensiveExerciseLibrary")) {
  src = src.replace(
    `case 'body-analysis': return renderBodyAnalysis();`,
    `case 'body-analysis': return renderBodyAnalysis();
      case 'library': return <ComprehensiveExerciseLibrary />;`
  );
  console.log('✓ Library case added');
} else {
  console.log('! Library case already present');
}

// ══════════════════════════════════════════════════════
// 7. SAFETY CHECK
// ══════════════════════════════════════════════════════
const after = src.split('\n').length;
const checks = [
  ['renderDashboard', src.includes('renderDashboard')],
  ['renderTraining', src.includes('renderTraining')],
  ['renderContent', src.includes('renderContent')],
  ['export default', src.includes('export default')],
  ['onboardingPhase', src.includes('onboardingPhase')],
];

let ok = true;
for (const [label, pass] of checks) {
  if (!pass) { console.error(`FAIL: ${label} missing!`); ok = false; }
  else console.log(`  ✓ ${label}`);
}

if (!ok) { console.error('\nABORTING — safety checks failed!'); process.exit(1); }

console.log(`\n[END] Lines: ${before} → ${after}`);
fs.writeFileSync(filePath, src, 'utf8');
console.log('\n✅ ALL PATCHES APPLIED SAFELY!\n');
