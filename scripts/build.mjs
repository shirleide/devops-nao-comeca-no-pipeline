import {rmSync, mkdirSync, cpSync, copyFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const check = spawnSync(process.execPath, ['scripts/check.mjs'], {stdio: 'inherit'});
if (check.status !== 0) process.exit(check.status ?? 1);
rmSync('dist', {recursive: true, force: true});
mkdirSync('dist', {recursive: true});
cpSync('src', 'dist/src', {recursive: true});
copyFileSync('package.json', 'dist/package.json');
console.log('✓ Artefato em dist/src/server.js');
