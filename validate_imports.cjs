const fs = require('fs');
const content = fs.readFileSync('src/pages/dashboards/YouthDashboard.tsx', 'utf8');

const regex = /<([A-Z][a-zA-Z0-9]+)/g;
let match;
const tags = new Set();
while ((match = regex.exec(content)) !== null) {
  tags.add(match[1]);
}

const missing = [];
for (const tag of tags) {
  if (!content.includes(`import ${tag}`) && !content.includes(`import { ${tag}`) && !content.includes(`import {  ${tag}`) && !content.includes(tag + " = {")) {
    // some could be imported as multi line { \n TagX \n }
    if (!content.match(new RegExp(`import\\s+\\{[^}]*\\b${tag}\\b[^}]*\\}`))) {
      missing.push(tag);
    }
  }
}

console.log("Locally defined or standard: ", ["AnimatePresence"].join(', '));
console.log("POTENTIALLY MISSING IMPORTS:", missing);
