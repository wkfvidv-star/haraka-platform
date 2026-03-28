const fs = require('fs');
const fp = 'src/pages/dashboards/YouthDashboard.tsx';
let c = fs.readFileSync(fp, 'utf8');

// 1. Add imports
const importsTarget = `import { PartnersSection } from '@/components/common/PartnersSection';`;
const importsReplace = `import { PartnersSection } from '@/components/common/PartnersSection';\nimport { HarakaChatbot } from '@/components/youth-dashboard/HarakaChatbot';\nimport { SmartMetricsWidget } from '@/components/youth-dashboard/SmartMetricsWidget';`;
if (c.includes(importsTarget) && !c.includes('HarakaChatbot')) {
    c = c.replace(importsTarget, importsReplace);
}

// 2. Inject SmartMetricsWidget
const dailyStateTarget = `          {/* Daily State */}\n          <DailyStateCard activityLevel="Good" focusLevel="Medium" mood="Positive" isSimplified={isSimplifiedMode} />`;
const dailyStateReplace = `          {/* Daily State */}\n          <DailyStateCard activityLevel="Good" focusLevel="Medium" mood="Positive" isSimplified={isSimplifiedMode} />\n\n          {/* Smart Metrics (Wearable & Manual) */}\n          <SmartMetricsWidget />`;
if (c.includes(dailyStateTarget) && !c.includes('<SmartMetricsWidget />')) {
    c = c.replace(dailyStateTarget, dailyStateReplace);
}

// 3. Inject HarakaChatbot
const chatbotTarget = `        {/* Navigation Tabs - Glassmorphic design */}`;
const chatbotReplace = `        {/* Haraka AI Chatbot Floating Component */}\n        <HarakaChatbot />\n\n        {/* Navigation Tabs - Glassmorphic design */}`;
if (c.includes(chatbotTarget) && !c.includes('<HarakaChatbot />')) {
    c = c.replace(chatbotTarget, chatbotReplace);
}

fs.writeFileSync(fp, c, 'utf8');
console.log('Successfully injected Chatbot and Metrics widgets.');
