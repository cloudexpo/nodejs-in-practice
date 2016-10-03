var assert = require('assert');
var p = require('./process_demo');


assert.equal(p.arch, 'x64', 'This is not 64 bit');
assert.equal(p.platform, 'win32', 'This is windows');
