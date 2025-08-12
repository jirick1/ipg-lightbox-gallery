#!/usr/bin/env node
const fs = require('fs');

const file = 'ipg-lightbox-gallery.php';
const next = process.argv[2];
if (!next) { console.error('Missing version arg'); process.exit(1); }

let src = fs.readFileSync(file, 'utf8');

// Replace the WordPress header line: * Version: X.Y.Z
const out = src.replace(
  /^(\s*\*\s*Version:\s*)([0-9A-Za-z.\-+]+)\s*$/m,
  `$1${next}`
);

if (src === out) {
  console.error('Version line not updated. Check header format.');
  process.exit(1);
}

fs.writeFileSync(file, out);
console.log(`Updated ${file} to Version: ${next}`);
