const fs = require('fs');
const fp = 'src/pages/dashboards/YouthDashboard.tsx';
let c = fs.readFileSync(fp, 'utf8');

// 1. Add ProfileSettings import
const importTarget = `import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';`;
const importReplace = `import CoachInboxWidget from '@/components/youth-dashboard/CoachInboxWidget';\nimport { ProfileSettings } from '@/components/youth-dashboard/ProfileSettings';`;
c = c.replace(importTarget, importReplace);

// 2. Forced Onboarding
const stateTarget = `  const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'main'>(() => {\n    try { return localStorage.getItem('youth_done') === '1' ? 'main' : 'slides'; }\n    catch { return 'slides'; }\n  });`;
const stateReplace = `  const [onboardingPhase, setOnboardingPhase] = useState<'slides' | 'questionnaire' | 'tech-intro' | 'test' | 'main'>('slides');`;
c = c.replace(stateTarget, stateReplace);

// 3. renderContent Settings Case
const settingsTarget = `      case 'library': return <ComprehensiveExerciseLibrary />;\n      default: return renderDashboard();`;
const settingsReplace = `      case 'library': return <ComprehensiveExerciseLibrary />;\n      case 'settings': return <ProfileSettings />;\n      default: return renderDashboard();`;
c = c.replace(settingsTarget, settingsReplace);

// 4. Avatar Clickable
const avatarTarget = `                <motion.div\n                  whileHover={{ scale: 1.1 }}\n                  className="w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar"`;
const avatarReplace = `                <motion.div\n                  onClick={() => setActiveTab('settings')}\n                  whileHover={{ scale: 1.1 }}\n                  whileTap={{ scale: 0.95 }}\n                  className="cursor-pointer hover:border-orange-500 w-14 h-14 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl relative overflow-hidden group/avatar"`;
c = c.replace(avatarTarget, avatarReplace);

fs.writeFileSync(fp, c, 'utf8');
console.log('Safe upgrade complete.');
