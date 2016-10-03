var fs = require("fs");
var Writable = require("stream").Writable;
var util = require("util");

module.exports = CounterStream;

// inherits from writable
util.inherits(CounterStream, Writable);

function CounterStream(matchText, options) {
    Writable.call(this, options);
    this.count = 0;
    this.matcher = new RegExp(matchText, 'ig');
};

CounterStream.prototype._write = function(chunk, encoding, cb) {
    var matches = chunk.toString().match(this.matcher);
    if (matches) {
        this.count += matches.length;
    }
    cb();
};

CounterStream.prototype.end = function() {
    this.emit('total', this.count);
};
