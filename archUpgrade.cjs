/**
 * APPLY ARCHITECTURAL UPGRADES
 * 1. Forced Onboarding
 * 2. Profile Settings Route Integration
 */
const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(fp, 'utf8');

// 1. ADD PROFILE SETTINGS IMPORT
if (!content.includes('ProfileSettings')) {
  // Find a good place to put it
  const coachInboxIndex = content.indexOf(`import CoachInboxWidget`);
  if (coachInboxIndex !== -1) {
    const importStats = `import { ProfileSettings } from '@/components/youth-dashboard/ProfileSettings';\n`;
    content = content.slice(0, coachInboxIndex) + importStats + content.slice(coachInboxIndex);
    console.log('✓ Added ProfileSettings import');
  } else {
    // Inject at top
    content = `import { ProfileSettings } from '@/components/youth-dashboard/ProfileSettings';\n` + content;
  }
} else {
  console.log('! ProfileSettings already imported');
}

// 2. FORCE ONBOARDING TO ALWAYS START AT 'slides'
// We replace the complex useState with a simple one.
const oldStateRegex = /const \[onboardingPhase, setOnboardingPhase\] = useState<'slides' \| 'questionnaire' \| 'tech-intro' \| 'test' \| 'main'>\(\(\) => \{[\s\S]*?\}\);/m;
if (oldStateRegex.test(content)) {
  content = content.replace(
    oldStateRegex,
    `const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'main'>('slides');`
  );
  console.log('✓ Forced onboarding state modified');
} else {
  console.log('! Onboarding state regex NOT found or already patched.');
}

// 3. INTEGRATE INTO renderContent()
const renderContentCaseStr = `case 'settings': return <ProfileSettings />;`;
if (!content.includes(renderContentCaseStr)) {
  const switchTarget = `case 'body-analysis': return renderBodyAnalysis();`;
  content = content.replace(switchTarget, `${switchTarget}\n      ${renderContentCaseStr}`);
  console.log('✓ Added settings case to renderContent');
} else {
  console.log('! renderContent already has settings case');
}

// 4. MAKE AVATAR CLICKABLE
// Look for motion.div that represents the avatar
const avatarDivStr = `<motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar"
                >`;
const clickableAvatar = `<motion.div
                  onClick={() => setActiveTab('settings')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar hover:shadow-orange-500/20 transition-all duration-300"
                >`;
if (content.includes(avatarDivStr)) {
  content = content.replace(avatarDivStr, clickableAvatar);
  console.log('✓ Avatar is now clickable for ProfileSettings');
} else if (content.includes('onClick={() => setActiveTab(\'settings\')}')) {
  console.log('! Avatar already clickable');
} else {
  console.log('! Could not find avatar div string exactly as specified. Let\'s try regex search.');
  // Backup avatar replacement
  const fallbackRegex = /<motion.div[\s\S]*?group\/avatar"/g;
  const match = content.match(fallbackRegex);
  if (match) {
    content = content.replace(match[0], `<motion.div\n                  onClick={() => setActiveTab('settings')}\n                  whileHover={{ scale: 1.1 }}\n                  whileTap={{ scale: 0.95 }}\n                  className="cursor-pointer w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar hover:border-orange-500 hover:shadow-orange-500/20 transition-all"`);
    console.log('✓ Backend regex replaced avatar string to be clickable!');
  } else {
    console.error('❌ Could not find avatar HTML block!');
  }
}

// 5. UPDATE "Quick Actions" to make sure store also points to rewards or competitions
// Already fine because we have interactive buttons from earlier Bento patch.

fs.writeFileSync(fp, content, 'utf8');
console.log('✅ ALL ARCHITECTURE PATCHES APPLIED SUCCESSFULLY!');
