import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runCommand(command, args, cwd, name) {
    const process = spawn(command, args, { 
        cwd, 
        shell: true, 
        stdio: 'inherit' 
    });

    process.on('error', (err) => {
        console.error(`[${name}] Failed to start:`, err);
    });

    process.on('close', (code) => {
        console.log(`[${name}] Exited with code ${code}`);
    });

    return process;
}

console.log('🚀 Starting Haraka Platform (Frontend + Backend)...');

// Start Backend
const serverDir = path.join(__dirname, 'server');
const backend = runCommand('pnpm', ['run', 'dev'], serverDir, 'Backend');

// Start Frontend
const frontend = runCommand('pnpm', ['run', 'dev'], __dirname, 'Frontend');

// Handle termination
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down all services...');
    backend.kill();
    frontend.kill();
    process.exit(0);
});
