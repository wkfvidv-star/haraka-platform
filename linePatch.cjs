/**
 * FINAL SAFE PATCH — Uses line numbers to insert code at EXACT positions
 * This is the most reliable approach without any pattern matching issues.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

console.log('[START] Total lines:', lines.length);
if (lines.length < 500) { console.error('File too small!'); process.exit(1); }

// ═══════════════════════════════════════════════
// DETECT KEY LINE NUMBERS dynamically
// ═══════════════════════════════════════════════
let importInsertLine = -1;   // After: import React...
let stateInsertLine = -1;    // After: const [hceInsights...
let returnStartLine = -1;    // The line with: return (
let closingLine = -1;         // Last line: }

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  if (l.includes("import React, { useState, useEffect } from 'react'") && importInsertLine === -1) importInsertLine = i;
  if (l.includes("const [hceInsights, setHceInsights]") && stateInsertLine === -1) stateInsertLine = i;
  if (l.includes("  return (") && returnStartLine === -1 && i > 100) returnStartLine = i;
  if (l.trim() === '}' && i === lines.length - 2) closingLine = i;
}

console.log(`Import line: ${importInsertLine}, State line: ${stateInsertLine}, Return line: ${returnStartLine}`);

if (importInsertLine === -1) { console.error('Import anchor not found!'); process.exit(1); }
if (stateInsertLine === -1) { console.error('State anchor not found!'); process.exit(1); }
if (returnStartLine === -1) { console.error('Return anchor not found!'); process.exit(1); }

// ═══════════════════════════════════════════════
// 1. INSERT IMPORTS after React import
// ═══════════════════════════════════════════════
const newImportLines = [
  `import YouthOnboarding from '@/components/youth-dashboard/YouthOnboarding';`,
  `import YouthQuestionnaire from '@/components/youth-dashboard/YouthQuestionnaire';`,
  `import DigitalBrainOnboarding from '@/components/youth-dashboard/DigitalBrainOnboarding';`,
  `import YouthInitialTest from '@/components/youth-dashboard/YouthInitialTest';`,
  `import CoachBookingModal from '@/components/youth-dashboard/CoachBookingModal';`,
  `import VideoAnalysisModal from '@/components/youth-dashboard/VideoAnalysisModal';`,
  `import ComprehensiveExerciseLibrary from '@/components/youth-dashboard/ComprehensiveExerciseLibrary';`,
  `import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';`,
];

// Filter out existing imports
const toAdd = newImportLines.filter(imp => {
  const name = imp.match(/import (\w+)/)?.[1];
  return name && !lines.some(l => l.includes(`import ${name}`));
});
lines.splice(importInsertLine + 1, 0, ...toAdd);
console.log(`✓ Added ${toAdd.length} imports`);

// Recalculate state line after splice
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("const [hceInsights, setHceInsights]")) { stateInsertLine = i; break; }
}
for (let i = 50; i < lines.length; i++) {
  if (lines[i].includes("  return (")) { returnStartLine = i; break; }
}

// ═══════════════════════════════════════════════
// 2. INSERT STATE VARIABLES after hceInsights
// ═══════════════════════════════════════════════
const stateCode = `  // ── Onboarding state machine ──────────────────────────
  const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'main'>(() => {
    try { return localStorage.getItem('youth_done') === '1' ? 'main' : 'slides'; }
    catch { return 'slides'; }
  });
  const completeOnboarding = () => {
    try { localStorage.setItem('youth_done', '1'); } catch {}
    setOnboardingPhase('main');
  };
  const [showBooking, setShowBooking] = useState(false);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);`;

if (!lines.some(l => l.includes('onboardingPhase'))) {
  lines.splice(stateInsertLine + 1, 0, stateCode);
  console.log('✓ State variables injected');
  // Recalculate return line
  for (let i = 50; i < lines.length; i++) {
    if (lines[i].includes("  return (")) { returnStartLine = i; break; }
  }
} else {
  console.log('! State already present');
}

// ═══════════════════════════════════════════════
// 3. INSERT ONBOARDING GUARD before the main return
// ═══════════════════════════════════════════════
const onboardingGuard = `
  // ── Onboarding Gate ──────────────────────────────────
  if (onboardingPhase === 'slides') return <YouthOnboarding onComplete={() => setOnboardingPhase('questionnaire')} />;
  if (onboardingPhase === 'questionnaire') return <YouthQuestionnaire onComplete={() => setOnboardingPhase('tech-intro')} />;
  if (onboardingPhase === 'tech-intro') return <DigitalBrainOnboarding onComplete={() => setOnboardingPhase('test')} />;
  if (onboardingPhase === 'test') return <YouthInitialTest onComplete={completeOnboarding} />;
`;

if (!lines.some(l => l.includes("onboardingPhase === 'slides'"))) {
  lines.splice(returnStartLine, 0, onboardingGuard);
  console.log('✓ Onboarding guard injected');
  // Recalculate return line again
  for (let i = returnStartLine; i < lines.length; i++) {
    if (lines[i].includes("  return (")) { returnStartLine = i; break; }
  }
} else {
  console.log('! Onboarding guard already present');
}

// ═══════════════════════════════════════════════
// 4. INSERT library CASE in renderContent switch
// ═══════════════════════════════════════════════
const bodyAnalysisIdx = lines.findIndex(l => l.includes("case 'body-analysis': return renderBodyAnalysis()"));
if (bodyAnalysisIdx !== -1 && !lines.some(l => l.includes("case 'library'"))) {
  lines.splice(bodyAnalysisIdx + 1, 0, `      case 'library': return <ComprehensiveExerciseLibrary />;`);
  console.log('✓ Library case added');
} else {
  console.log('! Library case already present');
}

// ═══════════════════════════════════════════════
// 5. INSERT MODALS before last closing </div>
// ═══════════════════════════════════════════════
// Find the closing of the main return:  </div>  then );  then }
const mainReturnCloseIdx = lines.findLastIndex((l, i) => l.trim() === '</div>' && i > lines.length - 30);
if (mainReturnCloseIdx !== -1 && !lines.some(l => l.includes('showBooking &&'))) {
  const modalCode = [
    `      {/* Global Modals */}`,
    `      {showBooking && <CoachBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />}`,
    `      {showVideoAnalysis && <VideoAnalysisModal isOpen={showVideoAnalysis} onClose={() => setShowVideoAnalysis(false)} />}`,
  ];
  lines.splice(mainReturnCloseIdx, 0, ...modalCode);
  console.log('✓ Global modals injected');
} else {
  console.log('! Modals already present or closing div not found at idx:', mainReturnCloseIdx);
}

// ═══════════════════════════════════════════════
// SAFETY CHECKS
// ═══════════════════════════════════════════════
const result = lines.join('\n');
const checks = [
  ['renderDashboard', result.includes('renderDashboard')],
  ['renderTraining', result.includes('renderTraining')],
  ['renderContent', result.includes('renderContent')],
  ['export default', result.includes('export default')],
  ['onboardingPhase', result.includes('onboardingPhase')],
  ['YouthOnboarding', result.includes('YouthOnboarding')],
];

let allOk = true;
for (const [label, pass] of checks) {
  const icon = pass ? '✓' : '✗';
  console.log(`  ${icon} ${label}`);
  if (!pass) allOk = false;
}

if (!allOk) {
  console.error('\n❌ SAFETY CHECK FAILED — file NOT saved!');
  process.exit(1);
}

console.log(`\n[END] Total lines: ${result.split('\n').length}`);
fs.writeFileSync(filePath, result, 'utf8');
console.log('\n✅ SUCCESS — All patches applied safely!');
