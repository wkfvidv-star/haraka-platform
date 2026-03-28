const fs = require('fs');
const fp = 'src/components/youth-dashboard/DeepReportSheets.tsx';
let c = fs.readFileSync(fp, 'utf8');

// 1. Increase Dialog max-width for both Training and Diet
c = c.split('max-w-[800px]').join('w-[95vw] max-w-5xl');

// 2. Increase the inner A4 container to stretch nicely
c = c.split('sm:w-[700px]').join('md:w-[850px] w-full');

// 3. Make Diet grid responsive
c = c.split('grid-cols-4').join('grid-cols-2 lg:grid-cols-4');

// 4. Increase Video Report Dialog width
c = c.split('max-w-[700px]').join('w-[95vw] sm:max-w-3xl');

// 5. Expand Video player height slightly
c = c.split('sm:h-[400px]').join('sm:h-[500px]');

fs.writeFileSync(fp, c, 'utf8');
console.log('Successfully expanded Document Modals for clarity.');
