const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// The replacements will upgrade the visual tier
content = content.replace(/bg-orange-50 dark:bg-orange-900\/20/g, 'bg-orange-900/10 border border-orange-500/20 backdrop-blur-sm text-orange-100');
content = content.replace(/bg-green-50 dark:bg-green-900\/20/g, 'bg-green-900/10 border border-green-500/20 backdrop-blur-sm text-green-100');
content = content.replace(/bg-purple-50 dark:bg-purple-900\/20/g, 'bg-purple-900/10 border border-purple-500/20 backdrop-blur-sm text-purple-100');
content = content.replace(/bg-gray-50 dark:bg-gray-800/g, 'bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300');

// General strays
content = content.replace(/bg-blue-50/g, 'bg-blue-900/20 border border-blue-500/10 text-blue-200');
content = content.replace(/bg-purple-50/g, 'bg-purple-900/20 border border-purple-500/10 text-purple-200');
content = content.replace(/bg-green-50/g, 'bg-green-900/20 border border-green-500/10 text-green-200');
content = content.replace(/bg-orange-50/g, 'bg-orange-900/20 border border-orange-500/10 text-orange-200');
content = content.replace(/bg-red-50/g, 'bg-red-900/20 border border-red-500/10 text-red-200');
content = content.replace(/bg-yellow-50/g, 'bg-yellow-900/20 border border-yellow-500/10 text-yellow-200');

content = content.replace(/bg-orange-100/g, 'bg-orange-900/40 border border-orange-500/20');
content = content.replace(/bg-green-100/g, 'bg-green-900/40 border border-green-500/20');
content = content.replace(/bg-purple-100/g, 'bg-purple-900/40 border border-purple-500/20');

// Fix text contrasts
content = content.replace(/text-gray-500/g, 'text-slate-400');
content = content.replace(/text-gray-600/g, 'text-slate-300');

// Fix text contrasts for headers that had dark gray/black colors
content = content.replace(/text-slate-900/g, 'text-white');
content = content.replace(/text-slate-800/g, 'text-slate-200');

// Remove white padding inside Card components safely if it exists inside rendering loops
content = content.replace(/bg-white/g, 'bg-white/5 backdrop-blur-sm border-white/10');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('UI Harmonized Successfully!');
