import {readdirSync} from 'node:fs';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';

function jsFiles(folder) {
  return readdirSync(folder, {withFileTypes: true}).flatMap(item => {
    const path = join(folder, item.name);
    return item.isDirectory() ? jsFiles(path) : /\.(js|mjs)$/.test(item.name) ? [path] : [];
  });
}
for (const path of ['src', 'test', 'scripts'].filter(folder => {
  try { readdirSync(folder); return true; } catch { return false; }
}).flatMap(folder => jsFiles(folder))) {
  const result = spawnSync(process.execPath, ['--check', path], {stdio: 'inherit'});
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('✓ Sintaxe JavaScript validada');
