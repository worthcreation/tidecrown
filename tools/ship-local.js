// node tools/ship-local.js NN "Build NN: ..."  Run in Claude's clone of the repo.
// Bumps const BUILD, builds (stops if index.html does not parse), packs every file changed against origin/main
// (plus new files) into /mnt/user-data/outputs/tidecrown-bNN.zip, and prints Ross's commit lines and play link.
const { execSync } = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), OUT = '/mnt/user-data/outputs';
const [nn, msg] = process.argv.slice(2);
if (!nn || !msg) { console.log('usage: node tools/ship-local.js NN "Build NN: ..."'); process.exit(1); }
const sh = c => execSync(c, { cwd: root }).toString().trim();
const lines = c => { try { return sh(c).split('\n').filter(Boolean); } catch (e) { return []; } };

const mf = path.join(root, 'src/js/99-main-loop.js');
fs.writeFileSync(mf, fs.readFileSync(mf, 'utf8').replace(/const BUILD=\d+;/, `const BUILD=${nn};`));
execSync('node tools/build.js', { cwd: root, stdio: 'inherit' });

const files = [...new Set(lines('git diff --name-only origin/main').concat(lines('git ls-files --others --exclude-standard')))]
  .filter(f => fs.existsSync(path.join(root, f)));
const deleted = lines('git diff --name-only --diff-filter=D origin/main');
fs.mkdirSync(OUT, { recursive: true });
for (const f of fs.readdirSync(OUT)) if (/^tidecrown-b\d+\.zip$/.test(f)) fs.unlinkSync(path.join(OUT, f));
const zip = `${OUT}/tidecrown-b${nn}.zip`;
execSync(`zip -q ${zip} ${files.map(f => JSON.stringify(f)).join(' ')}`, { cwd: root });
console.log(`packed ${files.length} files into ${zip}:\n  ${files.join('\n  ')}`);
if (deleted.length) console.log(`\nRoss deletes by hand in ~\\tidecrown: ${deleted.join(', ')}`);
const m = msg.replace(/"/g, "'");
console.log(`\nPowerShell:\ncd ~\\tidecrown -ErrorAction Stop; git fetch origin; git reset --hard origin/main; Expand-Archive -Force ~\\Downloads\\tidecrown-b${nn}.zip .; Remove-Item ~\\Downloads\\tidecrown-b${nn}.zip; git add -A; git commit -m "${m}"; git push`);
console.log(`\nzsh:\ncd ~/tidecrown && git fetch origin && git reset --hard origin/main && unzip -o ~/Downloads/tidecrown-b${nn}.zip -d . && rm ~/Downloads/tidecrown-b${nn}.zip && git add -A && git commit -m "${m}" && git push`);
console.log('\nPlay: https://tidecrown.worthcreation.com');
