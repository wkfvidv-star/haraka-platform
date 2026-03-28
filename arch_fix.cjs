const fs = require('fs');

const fp = 'src/pages/dashboards/YouthDashboard.tsx';
let c = fs.readFileSync(fp, 'utf8');

c = c.replace(
  "className={`flex w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-arabic selection:bg-orange-500/30 ${isRTL ? 'rtl flex-row' : 'ltr flex-row-reverse'}`} dir={isRTL ? 'rtl' : 'ltr'}",
  "className={`flex w-full h-screen overflow-hidden bg-slate-950 text-slate-100 font-arabic selection:bg-orange-500/30 ${isRTL ? 'rtl flex-row' : 'ltr flex-row'}`} dir={isRTL ? 'rtl' : 'ltr'}"
);

fs.writeFileSync(fp, c, 'utf8');
console.log('Fixed LTR/RTL Flex layout direction');
