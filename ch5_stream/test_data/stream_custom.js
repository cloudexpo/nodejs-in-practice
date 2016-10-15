var stream = require('stream');
var fs = require('fs');
var util = require('util');

var path = require('path');
var test_file_small = path.join(__dirname, 'small.txt');
var test_file_large = path.join(__dirname, 'large.txt');


/*function MyReader(options) {
    stream.Readable.call(this.options);
}

//Object.create(proto, [,propertiesObject])
MyReader.prototype = Object.create(stream.Readable.prototype, { constructor: { value: MyReader } });

*/

function MyReader(source) {
    stream.Readable.call(this);
    this.source = source;
    this._buffer = "";

    source.on('readable', function() {
        this.read();
    }.bind(this));
}

util.inherits(MyReader, stream.Readable);

MyReader.prototype._read = function(size) {
    var chunk;
    var line;
    var lineIndex;
    if (this._buffer.length === 0) {
        chunk = this.source.read();
        this._buffer += chunk;
    }
    lineIndex = this._buffer.indexOf('\n');
    if (lineIndex !== -1) {
        line = this._buffer.slice(0, lineIndex);
        this._buffer = this._buffer.slice(lineIndex + 1);
        this.emit('newline', line);
        this.push(line);
    }

};

var sample = fs.createReadStream(test_file_small);

var myreader = new MyReader(sample);

myreader.on('newline', function(line) {
    console.log("line: " + line);
});
