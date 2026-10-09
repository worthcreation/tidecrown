// node tools/build.js: builds index.html at the repo root from src/. CSS files in src/css and JS files in
// src/js are concatenated in filename order (numeric prefixes set load order; all JS shares one closure).
// Then checks the built script parses and exits 1 if not.
// Options: --watch rebuilds on every save; --serve serves the game at http://localhost:5173 (phone on the
// same Wi-Fi: http://<computer-ip>:5173). npm run dev does both.
const fs = require('fs'), path = require('path'), http = require('http');
const root = path.join(__dirname, '..'), src = path.join(root, 'src'), out = path.join(root, 'index.html');
const cat = dir => fs.readdirSync(dir).filter(f => !f.startsWith('.')).sort().map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('');

function build() {
  let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
  html = html.replace('/*@CSS*/\n', () => cat(path.join(src, 'css'))).replace('//@JS\n', () => cat(path.join(src, 'js')));
  try { new Function(html.match(/<script>([\s\S]*)<\/script>/)[1]); }
  catch (e) { console.log('index.html does not parse: ' + e.message + ' (not written)'); return false; }
  fs.writeFileSync(out, html);
  console.log(`built index.html (${(html.match(/\n/g) || []).length} lines, ${(html.length / 1024).toFixed(0)} KB)`);
  return true;
}

const ok = build(), args = process.argv.slice(2);
if (!ok && !args.includes('--watch')) process.exit(1);
if (args.includes('--watch')) {
  let t; fs.watch(src, { recursive: true }, () => { clearTimeout(t); t = setTimeout(build, 80); });
  console.log('watching src/ ...');
}
if (args.includes('--serve')) {
  const port = +process.env.PORT || 5173;
  http.createServer((req, res) => {
    const p = decodeURIComponent(req.url.split('?')[0]);
    if (p !== '/' && p !== '/index.html') { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
    fs.createReadStream(out).pipe(res);
  }).listen(port, () => console.log(`serving http://localhost:${port}`));
}
