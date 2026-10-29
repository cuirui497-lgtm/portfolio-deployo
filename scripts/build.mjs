import { cp, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'dist');
const files = ['index.html', 'portfolio.html', '_headers'];
const directories = ['assets', 'static'];
for (const name of [...files, ...directories]) {
  const item = await stat(path.join(root, name));
  if (directories.includes(name) !== item.isDirectory()) throw new Error(`Invalid source: ${name}`);
}
await mkdir(out, { recursive: true });
for (const name of [...files, ...directories]) await cp(path.join(root, name), path.join(out, name), { recursive: true });
const pages = await Promise.all(files.slice(0, 2).map(name => readFile(path.join(out, name), 'utf8')));
let checked = 0;
for (const page of pages) {
  for (const match of page.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const href = match[1].split(/[?#]/)[0];
    if (/^[a-z]+:/i.test(href)) continue;
    const resolved = path.resolve(out, href);
    if (!resolved.startsWith(out + path.sep)) throw new Error(`Invalid local URL: ${href}`);
    await stat(resolved);
    checked++;
  }
}
// .nojekyll is harmless on Pages and prevents asset processing on GitHub Pages.
await writeFile(path.join(out, '.nojekyll'), '');
console.log(`Static build ready: dist/ (${checked} page references verified). No dependencies required.`);
