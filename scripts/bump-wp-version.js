#!/usr/bin/env node
const fs = require('fs');

const files = [
  { filename: 'README.md', regex: /^(# .*?\bVersion:\s*)([0-9]+\.[0-9]+\.[0-9]+(?:[-+][0-9A-Za-z.-]+)?)$/m },
  { filename: 'ipg-lightbox-gallery.php', regex: /^(\s*\*\s*Version:\s*)([0-9A-Za-z.\-+]+)\s*$/m }];

const next = process.argv[2];
if (!next) { console.error('Missing version arg'); process.exit(1); }


for (const file of files) {
  console.log(file.filename)
  let src = fs.readFileSync(file.filename, 'utf8');

  const out = src.replace(file.regex,`$1${next}`
  );

  if (src === out) {
    console.error('Version line not updated. Check header format.');
    process.exit(1);
  }

  fs.writeFileSync(file.filename, out);
  console.log(`Updated ${file.filename} to Version: ${next}`);
}
