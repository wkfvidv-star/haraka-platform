const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'dashboards', 'YouthDashboard.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

// The replacements will upgrade the visual tier
content = content.replace(/bg-orange-50 dark:bg-orange-900\/20/g, 'bg-orange-900/10 border border-orange-500/20 backdrop-blur-sm text-orange-100');
content = content.replace(/bg-green-50 dark:bg-green-900\/20/g, 'bg-green-900/10 border border-green-500/20 backdrop-blur-sm text-green-100');
content = content.replace(/bg-purple-50 dark:bg-purple-900\/20/g, 'bg-purple-900/10 border border-purple-500/20 backdrop-blur-sm text-purple-100');
content = content.replace(/bg-gray-50 dark:bg-gray-800/g, 'bg-white/5 border border-white/10 backdrop-blur-sm text-slate-300');

// General strays - avoid overriding hover states unless necessary, but basically making them glass 
content = content.replace(/\bbg-blue-50(?![\/])/g, 'bg-blue-900/20 border border-blue-500/10 text-blue-200');
content = content.replace(/\bbg-purple-50(?![\/])/g, 'bg-purple-900/20 border border-purple-500/10 text-purple-200');
content = content.replace(/\bbg-green-50(?![\/])/g, 'bg-green-900/20 border border-green-500/10 text-green-200');
content = content.replace(/\bbg-orange-50(?![\/])/g, 'bg-orange-900/20 border border-orange-500/10 text-orange-200');
content = content.replace(/\bbg-red-50(?![\/])/g, 'bg-red-900/20 border border-red-500/10 text-red-200');
content = content.replace(/\bbg-yellow-50(?![\/])/g, 'bg-yellow-900/20 border border-yellow-500/10 text-yellow-200');

content = content.replace(/\bbg-orange-100(?![\/])/g, 'bg-orange-900/40 border-orange-500/20');
content = content.replace(/\bbg-green-100(?![\/])/g, 'bg-green-900/40 border-green-500/20');
content = content.replace(/\bbg-purple-100(?![\/])/g, 'bg-purple-900/40 border-purple-500/20');

// Fix text contrasts
content = content.replace(/\btext-gray-500\b/g, 'text-slate-400');
content = content.replace(/\btext-gray-600\b/g, 'text-slate-300');

// Replace exact bg-white (without opacity slashes) into transparent glass
// Some components might have `bg-white`, so we will change `bg-white` to `bg-white/5 backdrop-blur-sm border border-white/10`
content = content.replace(/(?<!-)\bbg-white\b(?![\/])/g, 'bg-white/5 backdrop-blur-sm border border-white/10');

// Also remove generic TextColor references like text-slate-900 when used on backgrounds that are now dark
content = content.replace(/\btext-slate-900\b/g, 'text-white');
content = content.replace(/\btext-slate-800\b/g, 'text-slate-200');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('UI Harmonized Successfully!');
