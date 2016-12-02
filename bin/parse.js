#!/usr/bin/env node
'use strict';

const yargs = require('yargs');
const options = yargs
  .alias('c', 'clean')
  .alias('f', 'format')
  .alias('t', 'trim')
  .alias('v', 'verbose')
  .argv;
const args = options._;

const concat = require('concat-stream');
const ast = require('../ast');
const format = require('../format');
const parse = require('../parse');

var fmt = node => JSON.stringify(node, null, '  ');

if (options.format) {
  fmt = options.format === true
    ? format.defaultFormat
    : format.get(options.format);
}

if (args.length) {
  args.forEach(filename => {
    parse.file(filename, options, (error, node) => {
      // console.warn(filename);
      process.stdout.write(fmt(node));
    });
  });
} else {
  process.stdin.pipe(concat(buffer => {
    const node = parse.buffer(buffer, options);
    process.stdout.write(fmt(node));
  }));
}
