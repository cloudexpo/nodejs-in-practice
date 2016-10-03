var CounterStream = require('./counterstream_demo');
var counterstream = new CounterStream(/\blord\b/);
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var passed = 0;

fs.createReadStream(path.join(__dirname, 'test_data/test.txt')).pipe(counterstream);
counterstream.on('total', count => {
    assert.equal(count, 3094);
    passed++;
    // console.log('total:' + count);//3094
});

process.on('exit', ()=>{
	console.log('Assertions passed: ', passed);
});
