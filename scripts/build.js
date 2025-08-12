#!/usr/bin/env node
const esbuild = require('esbuild');

const banner = `/*! IPG Lightbox Gallery | MIT License */`;

async function run() {
  // Editor JS -> index.min.js (IIFE for WP admin)
  await esbuild.build({
    entryPoints: ['index.js'],
    outfile: 'index.min.js',
    bundle: false,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    banner: { js: banner },
  });

  // Frontend JS -> frontend.min.js
  await esbuild.build({
    entryPoints: ['frontend.js'],
    outfile: 'frontend.min.js',
    bundle: false,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    banner: { js: banner },
  });

  // CSS -> style.min.css
  await esbuild.build({
    entryPoints: ['style.css'],
    outfile: 'style.min.css',
    minify: true,
    loader: { '.css': 'css' },
    banner: { css: banner },
  });

  console.log('Minified assets: index.min.js, frontend.min.js, style.min.css');
}

run().catch((e) => { console.error(e); process.exit(1); });
