// node tools/build.js: builds index.html (play) and test.html (test) at the repo root from src/. CSS files in src/css and JS files in
// src/js are concatenated in filename order (numeric prefixes set load order; all JS shares one closure).
// The two differ only in const MODE ('play' or 'test'), injected at the top of the script.
// Then checks the built script parses and exits 1 if not. First runs tools/world-graph.js (world memory registry checks,
// writes docs/world-graph.md) and stops if it fails.
// Options: --watch rebuilds on every save; --serve serves the game at http://localhost:5173 (test build at /test.html) (phone on the
// same Wi-Fi: http://<computer-ip>:5173). npm run dev does both.
const fs = require('fs'), path = require('path'), http = require('http');
const root = path.join(__dirname, '..'), src = path.join(root, 'src');
// files ending in -test.js or -test.css go into test.html only
const cat = (dir, mode) => fs.readdirSync(dir).filter(f => !f.startsWith('.') && (mode === 'test' || !/-test\.(js|css)$/.test(f))).sort().map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('');

function one(mode, file) {
  let html = fs.readFileSync(path.join(src, 'index.html'), 'utf8');
  html = html.replace('/*@CSS*/\n', () => cat(path.join(src, 'css'), mode)).replace('//@JS\n', () => `const MODE='${mode}';\n` + cat(path.join(src, 'js'), mode));
  if (mode === 'test') html = html.replace(/<title>([^<]*)<\/title>/, '<title>$1 (test)</title>');
  try { new Function(html.match(/<script>([\s\S]*)<\/script>/)[1]); }
  catch (e) { console.log(file + ' does not parse: ' + e.message + ' (not written)'); return false; }
  fs.writeFileSync(path.join(root, file), html);
  console.log(`built ${file} (${(html.match(/\n/g) || []).length} lines, ${(html.length / 1024).toFixed(0)} KB)`);
  return true;
}
function build() { delete require.cache[require.resolve('./world-graph.js')]; return require('./world-graph.js').run() && one('play', 'index.html') && one('test', 'test.html'); }

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
    const f = p === '/test.html' ? 'test.html' : (p === '/' || p === '/index.html') ? 'index.html' : null;
    if (!f) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
    fs.createReadStream(path.join(root, f)).pipe(res);
  }).listen(port, () => console.log(`serving http://localhost:${port}`));
}
