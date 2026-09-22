import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.dirname(path.dirname(__filename));
const source = path.join(root, 'dist/client');
const output = path.join(root, 'dist/pages');
const base = process.env.PAGES_BASE || '/deepgrid-dr-silicon_new/';
const domain = (process.env.PAGES_DOMAIN || '').trim();

fs.rmSync(output, {recursive: true, force: true});
fs.cpSync(source, output, {recursive: true});

if (base !== '/') {
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (/\.(html|js|rsc|json|css)$/.test(file)) {
        let text = fs.readFileSync(file, 'utf8').replaceAll('/_next/', base + '_next/');
        if (file.endsWith('.js')) text = text.replaceAll('"_next/static/', '"' + base.slice(1) + '_next/static/');
        fs.writeFileSync(file, text);
      }
    }
  };
  walk(output);
}

fs.writeFileSync(path.join(output, '.nojekyll'), '');
fs.writeFileSync(path.join(output, 'build-info.json'), JSON.stringify({
  commit: process.env.GITHUB_SHA || 'local',
  base,
  domain: domain || null,
  builtAt: new Date().toISOString()
}));
console.log(`Pages package ready at base ${base}${domain ? ' for ' + domain : ''}`);