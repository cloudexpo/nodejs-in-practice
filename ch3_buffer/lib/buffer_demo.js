var fs = require('fs');
var buffer_demo = {
    'createBuffer': createBuffer,
    'createUnsafeBuffer': createUnsafeBuffer,
    'readFileAsBuffer': readFileAsBuffer,
    'encodeBase64': encodeBase64
};


function createBuffer(size, eoncding) {
    return Buffer.alloc(size);
};

function createUnsafeBuffer(size) {
    return Buffer.allocUnsafe(size);
};

/*
// i won't remove you, just keep the bad case in mind
function readFileAsBufferOld(file) {
    fs.readFile(file, (err, buf) => {
        if (err) {
            console.log('Unable to read file');
        }
        console.log(buf.toString());
        return buf.toString();
    });
};

var file_content = readFileAsBuffer("small.txt");
console.log(fiel_content);
*/


function readFileAsBuffer(file, callback) {
    fs.readFile(file, (err, buf) => {
        if (err) {
            console.log('Unable to read file');
        }
        callback(buf);
    });
};


function encodeBase64(img) {
    var mime = 'image/png';
    var encoding = 'base64';
    var data = fs.readFileSync(img).toString('base64');
    return uri = 'data:' + mime + ';' + encoding + ',' + data;
};

module.exports = buffer_demo;
