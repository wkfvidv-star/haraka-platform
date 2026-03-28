import prisma from './prisma/client.js';

console.log('--- Prisma Model Keys ---');
const keys = Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$'));
console.log(keys);
console.log('-------------------------');
process.exit(0);
