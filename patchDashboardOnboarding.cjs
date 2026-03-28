const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Add Import for YouthTechIntro
if (!content.includes('import YouthTechIntro')) {
    content = content.replace(
        `import YouthInitialTest from '@/components/youth-dashboard/YouthInitialTest';`,
        `import YouthInitialTest from '@/components/youth-dashboard/YouthInitialTest';\nimport YouthTechIntro from '@/components/youth-dashboard/YouthTechIntro';`
    );
}

// 2. Adjust State Type to include 'tech-intro'
content = content.replace(
    `useState<'slides' | 'questionnaire' | 'test' | 'completed'>`,
    `useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'completed'>`
);

// 3. Inject YouthTechIntro step in the render logic
// The previous logic was: after 'questionnaire' it goes to 'test'
// We change: questionnaire -> tech-intro -> test
content = content.replace(
    `setOnboardingPhase('test');\n          }}\n        />\n      )}`,
    `setOnboardingPhase('tech-intro');\n          }}\n        />\n      )}\n      {onboardingPhase === 'tech-intro' && (\n        <YouthTechIntro userName={user?.name || ''} onComplete={() => setOnboardingPhase('test')} />\n      )}`
);

// 4. Hook up the DailyMissionCard button 'onStart'
content = content.replace(
    `<DailyMissionCard />`,
    `<DailyMissionCard onStart={() => setActiveTab('competitions')} />`
);
// And because there's two occurrences of DailyMissionCard in YouthDashboard right now:
content = content.replace(
    `<DailyMissionCard />`,
    `<DailyMissionCard onStart={() => setActiveTab('competitions')} />`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('YouthDashboard Pathched successfully');
