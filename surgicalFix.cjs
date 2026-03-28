const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Verify file is healthy
const lines = content.split('\n').length;
console.log('File lines before:', lines);
if (lines < 500) {
  console.error('ERROR: File too short, aborting!');
  process.exit(1);
}

// ── 1. ADD MISSING IMPORTS (safe: only if not already present) ──
if (!content.includes("import CoachInboxWidget")) {
  content = content.replace(
    `import React, { useState, useEffect } from 'react';`,
    `import React, { useState, useEffect } from 'react';
import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';
import ComprehensiveExerciseLibrary from '@/components/youth-dashboard/ComprehensiveExerciseLibrary';`
  );
  console.log('✓ Added CoachInboxWidget and ComprehensiveExerciseLibrary imports');
} else {
  console.log('! Imports already present, skipping');
}

// ── 2. ADD library TAB to navigationGroups (safe) ──
if (!content.includes("id: 'library'")) {
  content = content.replace(
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },`,
    `{ id: 'training', label: 'التدريب', icon: Dumbbell },
      { id: 'library', label: 'المكتبة الشاملة', icon: BookOpen },`
  );
  console.log('✓ Added library tab to navigationGroups');
} else {
  console.log('! library tab already present, skipping');
}

// ── 3. INJECT CoachInboxWidget after Welcome card in renderDashboard ──
// The original renderDashboard doesn't have CoachInboxWidget - we inject it
if (!content.includes('<CoachInboxWidget')) {
  // Find the AI Insights card (AGIInsightFlow) or the WearableConnection and inject before
  const injectAfter = `<AIPersonalizationBanner insights={hceInsights} />`;
  if (content.includes(injectAfter)) {
    content = content.replace(
      injectAfter,
      `${injectAfter}

          {/* Coach Inbox Widget */}
          <CoachInboxWidget />`
    );
    console.log('✓ Injected CoachInboxWidget after AIPersonalizationBanner');
  } else {
    // Fallback: search for another anchor
    const anchor2 = `<DailyStateCard`;
    if (content.includes(anchor2)) {
      content = content.replace(
        anchor2,
        `{/* Coach Inbox Widget */}
          <CoachInboxWidget />
          
          ${anchor2}`
      );
      console.log('✓ Injected CoachInboxWidget before DailyStateCard (fallback)');
    } else {
      console.log('! Could not find anchor for CoachInboxWidget injection');
    }
  }
} else {
  console.log('! CoachInboxWidget already injected, skipping');
}

// ── 4. ADD ComprehensiveExerciseLibrary to renderContent switch ──
if (!content.includes("activeTab === 'library'")) {
  // Find the last {activeTab === ... pattern to append after
  const anchor = `{activeTab === 'body-analysis' && renderBodyAnalysis()}`;
  if (content.includes(anchor)) {
    content = content.replace(
      anchor,
      `${anchor}
            {activeTab === 'library' && <ComprehensiveExerciseLibrary />}`
    );
    console.log('✓ Added library tab to renderContent');
  } else {
    // Alternative anchor
    const anchor2 = `{activeTab === 'mental' && <MentalWellBeingSection`;
    if (content.includes(anchor2)) {
      const idx = content.lastIndexOf(anchor2);
      const after = content.indexOf('\n', idx + anchor2.length);
      content = content.substring(0, after) + '\n            {activeTab === \'library\' && <ComprehensiveExerciseLibrary />}' + content.substring(after);
      console.log('✓ Added library tab to renderContent (fallback anchor)');
    } else {
      console.log('! Could not find anchor for library tab injection');
    }
  }
} else {
  console.log('! library already in renderContent, skipping');
}

// ── 5. ADD Development Widget after AI Features card ──
if (!content.includes('قسم التطوير الشامل')) {
  // Find a good place to inject the development widget
  // The AI cards section or the end of the main dashboard column
  const anchor = `</AGIInsightFlow>`;
  if (content.includes(anchor)) {
    content = content.replace(
      anchor,
      `</AGIInsightFlow>

          {/* Comprehensive Development Widget */}
          <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/80 backdrop-blur-md border border-indigo-500/20 shadow-xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-indigo-500/10">
              <CardTitle className="text-white text-lg flex items-center gap-2 font-black">
                <Zap className="w-5 h-5 text-emerald-400" /> قسم التطوير الشامل
              </CardTitle>
              <CardDescription className="text-indigo-200/70 text-xs">مكتبتك الرياضية والتأهيلية الذكية</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "الأداء الحركي", desc: "سرعة ورشاقة", icon: Activity, color: "text-orange-400", bg: "bg-orange-500/10" },
                { title: "المعرفي والنفسي", desc: "تركيز وهدوء", icon: Brain, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                { title: "إعادة التأهيل", desc: "علاج المفاصل", icon: HeartPulse, color: "text-rose-400", bg: "bg-rose-500/10" }
              ].map((item, i) => (
                <button key={i} onClick={() => setActiveTab('library')}
                  className="text-right p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:border-indigo-500/50 transition-all flex flex-col gap-2">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", item.bg)}>
                    <item.icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{item.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>`
    );
    console.log('✓ Added Development Widget after AGIInsightFlow');
  } else {
    console.log('! AGIInsightFlow anchor not found for Development Widget');
  }
} else {
  console.log('! Development Widget already present, skipping');
}


// Final safety check
const newLines = content.split('\n').length;
console.log('File lines after:', newLines);
if (newLines < lines) {
  console.error('ERROR: File got shorter! Something went wrong. NOT saving.');
  process.exit(1);
}

fs.writeFileSync(targetPath, content, 'utf8');
console.log('\n✅ All surgical fixes applied successfully!');
