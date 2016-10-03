var CounterStream = require('./counterstream');
var counterstream = new CounterStream(/\blord\b/);
var fs = require('fs');
var path = require('path');

fs.createReadStream(path.join(__dirname, 'test_data/test.txt')).pipe(counterstream);
counterstream.on('total', count => {
    console.log('total:' + count); //3094
});
