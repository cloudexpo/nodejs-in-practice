var path = require('path');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var benchmark_demo = require('./benchmark_demo');

var passed = 0;
var test_hello = path.join(__dirname, 'test_data/hello.txt');
var test_file = path.join(__dirname, 'test_data/test.txt');

benchmark_demo(test_hello);

// benchmark_demo(test_file);
