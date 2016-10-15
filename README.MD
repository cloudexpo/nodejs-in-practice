#Chapter 1 Getting started
##1. how to create a Node project
***Solution:*** 
```
#create project directory  
mkdir day1  
cd day1  
#create project manifest
npm init  
```
##2. how to write your own stream class
***Solution:***    
Extends Stream class
```
var Writable = require("stream").Writable;
var util = require("util");

// inherits from writable
util.inherits(CounterStream, Writable);

function CounterStream(matchText, options) {
    Writable.call(this, options);
    this.count = 0;
    this.matcher = new RegExp(matchText, 'ig');
};
//implements _write
CounterStream.prototype._write = function(chunk, encoding, cb) {
    var matches = chunk.toString().match(this.matcher);
    if (matches) {
        this.count += matches.length;
    }
    cb();
};
```
##3.how to write a simple test and run it
***Solution:***    
module: `assert = require('assert')` usage: `assert.equal(count, 3094);`  
add test script in `package.json`  
```
"scripts": {
    "test": "node test.js"
},
```
run test  
```
npm test  
```

##Chapter 2 Node's environment
###Modules
####install modules  
***Solution:***    
`npm install -g express # install globally`  
`npm install express # install locally`  

####import modules  
***Solution:***    
`var express = require('express');`  
*NOTES: Node's module system is very different from include in C, or even require in Ruby and Python. The main difference is that require in Node returns an object rather than loading code into the current namespace* 

####create and manage modules
***Solution:***        
```
//myclass.js    
function MyClass() {    
}    
MyClass.prototype = {    
    method: function() {    
        return 'Hello';    
}    
};    
var myClass = new MyClass();    
module.exports = myClass;    
```
If you need to export multiple objects, values, methods, just attach them to `exports` 

```
//module-2.js
...
exports.method = function() {
    return 'Hello';
};
exports.method2 = function() {
    return 'Hello again';
};

//test.js
...
//how to import customiezed modules
var myClass = require('./myclass');
var module2 = require('./module-2');
console.log(myClass.method());
console.log(module2.method());
console.log(module2.method2());
```

####load group of related modules  
Node can treat directories as modules, offering opportunities for logically grouping related modules together.
***Solution:***   
Create a file called index.js to load each module and export them as a group and add a package.json file to the directory.

>packages    
>>services    
>>>package.json        
>>>index.js    
>>>userservice.js   
>>>productservice.js    
>>>orderservice.js   
>>>... 


```
//package.json
{ 
    "name" : "group",
    "main" : "./index.js" 
}

//index.js
module.exports = {
    userservice: require('./userservice'),
    productservice: require('./productservice'),
    orderservice: require('./orderservice'),
    ...
};

//test.js
var services = require('services');
var userservice = services.userservice;
//userservice.doStuff();
```

When Node loading modules, it will look for the package.json firstly, if package.json is not present, then it'll look for index.js

####Locate script path  
***Solution:***    
Use `__dirname` or `__filename` to determine the location of the file.

####standard I/O
Text can be piped to a Node process by using command-line tools in Unix or
Windows. e.g. `cat file.txt | node testprocess.js`  
***Solution:***    
Use `process.stdout` and `process.stdin`.

```
// Run with:
// cat file.txt | node process.js
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(text) {
    process.stdout.write(text.toUpperCase());
});
```

####console object and logging
***Solution:***   
`console.log`, `console.info`, `console.error`, and `console.warn`  
String interpolation
`console.log('Hello %s', name);` 

| Placeholder   | Type   | Example                 |
| ------------- |:------:| ------------------------|
| %s            | String | '%s', 'value'           |
| %d            | Number | '%f', 3.14              |
| %j            | JSON   | '%j', { name: 'alex' }  |

####benchmark a program
***Solution:***
Use `console.time()` and `console.timeEnd()`.

```
var benchmark_demo = function(file){
    if(file && file.length){
        console.log('Reading file: ' + file);
        console.time('bench_label');//start benchmark
        var fstream = fs.createReadStream(file);
        fstream.on('end', ()=>{
            console.timeEnd('bench_label');//end benchmark when no more data
        });
        fstream.pipe(process.stdout);//redirect to standard out
    }

};
```

#### built-in assertion

***Solution:***
Use `var assert = require('assert'); assert.equal(1, 1, '1 should equals 1');`

#### Process object
```
console.log("arch: ", process.arch);
console.log("platform: ", process.platform);
console.log("argv: ", process.argv);//get command line arguments
console.log("PID", process.pid);//get process id
```

#Chapter 3 Buffer
##Buffer
Buffers are raw allocations of the heap, exposed to JavaScript in an array-like manner
Create fixed size buffer
`var buf = Buffer.alloc(255); //`  
`var bufUnsafe = Buffer.allocUnsafe(255);// Allocates a new non-zero-filled Buffer of size bytes. `  

*Note: The underlying memory for Buffer instances created by Buffer.allocUnsafe(size) is not initialized. The contents of the newly created Buffer are unknown and may contain sensitive data.*    
*Note: Pay attentation to non-ascii character encoding concatenation using `Buffer` see [小心buffer的拼接问题](http://cnodejs.org/topic/4faf65852e8fb5bc65113403)*

#Chapter 4 EventEmitter
>When the EventEmitter object emits an event, all of the functions attached to that specific event are called synchronously. Any values returned by the called listeners are ignored and will be discarded.

##Inherits EventEmitter

```
var events = require('events');
var util = require('util');

function MusicPlayer() {
    this.is_playing = false;
    events.EventEmitter.call(this); //MusicPlayer will borrow EventEmitter's constructor to create musicplayer object
}

util.inherits(MusicPlayer, events.EventEmitter);

```

###Mixing existing object with EventEmitter
Sometimes you have an existing class and can’t easily rework it to inherit directly from EventEmitter. In these cases, mixing in EventEmitter may work.  
***Solution:***
Using a for-in loop is sufficient for copying the properties from one prototype to another. In this way you can copy the necessary properties from EventEmitter

```
var EventEmitter = require('events').EventEmitter;

function MusicPlayer(track) {
    this.track = track;
    this.playing = false;
    for (var methodName in EventEmitter.prototype) {//copy all methods/props from eventemitter's prototype
        this[methodName] = EventEmitter.prototype[methodName];
    }
}
musicPlayer.on('play', function() {
    this.playing = true;
    console.log(this.toString());
});

```

##register event and event handler
one event can have multiple listeners, they will be called synchronously 
```
var musicPlayer = new MusicPlayer();

function startPlayer(track) {
    this.is_playing = true;
    console.log('start playing');
}

function stopPlayer(track) {
    this.is_playing = false;
    console.log('stop playing');
}

musicPlayer.once('play', startPlayer); //startPlayer will be executed only once
musicPlayer.on('play', foo);
musicPlayer.addListener('play', bar); //add multile listeners to the event
musicPlayer.on('stop', stopPlayer);

```

###remove event listener
```
musicPlayer.removeListener('play', getTitle); //remove listener from event, no more execution when event emitted

```

###error event

```
function errHandler(err) {
    console.log('something going wrong: ' + err);
}
musicPlayer.on('error', errHandler);

```

###categorize your event names using an object
For large project, avoid writing event as a string, Instead, an object can be used with properties that refer to the event name strings which can help people get a centralized list of event names.
```
var e = MusicPlayer.events = {
    play: 'play',
    pause: 'pause',
    stop: 'stop',
    ff: 'ff',
    rw: 'rw',
    addTrack: 'add-track'
};
...
musicPlayer.on(e.play, function() {
    console.log('Now playing');
});
```

###query listners attached to an event
```
musicPlayer.listeners('play')
```

#Chapter 5 Streams
Streams are an event-based API for managing and modeling data, and are wonderfully efficient. By leveraging EventEmitter and Node’s non-blocking I/O libraries, the stream module allows data to be dynamically processed when it’s available, and then released when it’s no longer needed.  
##Type of stream  

| Name | User methods | Description |
| ------------- | ------ | ------------------------ |
| stream.Readable | _read(size) | Used for I/O sources that generate data |
| stream.Writable | _write(chunk, encoding, callback) | Used to write to an underlying output destination |
| stream.Duplex | _read(size), _write(chunk,encoding, callback) | A readable and writable stream,like a network connection |
| stream.Transform | _flush(size), _transform(chunk, encoding, callback) | A duplex stream that changes data in some way, with no limitation on matching input data size with the output |

##Built-in streams
### fs

#### old fashion

```
var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var zlib = require("zlib");
//const querystring = require('querystring');

const test_data_path = path.join(__dirname, '/test_data/');

var routes = new Map();
var register = function(url, fn) {
    return routes.set(url, fn);
};

...
//read file in normal way
register('/test_non_stream', (test_file, req, resp) => {
    fs.readFile(test_file, (err, data) => {
        if (err) {
            resp.statusCode = 500;
            resp.end(String(err));
        }
        resp.end(data);
    });

});

```

#### read file as a stream

```
//read file as a stream
register('/test_stream', (test_file, req, resp) => {
    resp.writeHead(200, { 'Content-type': 'text/plain' });
    fs.createReadStream(test_file).pipe(resp);
});


```

Now instead of reading the entire file into memory, a buffer’s worth will be read at a time and sent to the client, which kind of imporoving efficiency

#### pipe stream

```
//pipe stream
register('/test_stream_zip', (test_file, req, resp) => {
    resp.writeHead(200, { 'content-encoding': 'gzip' });
    fs.createReadStream(test_file).pipe(zlib.createGzip()).pipe(resp);
});

```

Not only read the file as stream, but also compress the file

#### catch stream error
when trying to open a non-exist file, 'error' event to be triggered. The error object passed to the handler    

```

/*Stream with error handler*/
register('/test_stream_error', (non_exist_test_file, req, resp) => {
    resp.writeHead(200, { 'Content-type': 'text/plain' });
    var fstream = fs.createReadStream(non_exist_test_file);
    fstream.pipe(resp);
    fstream.on('error', err => {
        resp.statusCode = 500;
        resp.end(err.stack);//err object
    });
});

```

##custom stream



#Unit Test
The Test script name shold be the same as the source file following by .test.js    
`describe` is a test suite     
`it` is called test case and is the smallest unit.   
##Mocha

example:
```
var describe = require('mocha').describe;
var should = require('should');
describe('buffer_demo_test', function() {
    it('hello should equal hello', function() {
        'hello'.should.equal('hello');
    });

    it('hello should not equal world', function() {
        'hello'.should.equal('world');
    });
    //async call test, should add done in the nested callback to tell mocha the test is done
    it('file content should be hello world', function(done) {
        fs.readFile('hello world.txt', (err, data) => {
            if (err) {
                done(err); //tell mocha there is an error in test case
            }
            data.toString().should.eql('hello world');
            done(); //tell mocha test case is done
        });
    });

});

```
*Notes: Async test should add callback `done` to tell mocha the test is finished*

#FAQ
##Async function return undefined on invocation
I totally stuck in the `undefined` value from async function call, what the hell. Here is my code snippet to defined a function to read file in async fashion and return the file content.

```
// i won't remove you, just keep the really bad case in mind
function readFileAsBufferOld(file) {
    fs.readFile(file, (err, buf) => {
        if (err) {
            console.log('Unable to read file');
        }
        console.log(buf.toString());//here we got 'hello world'
        return buf.toString();
    });
};

var file_content = readFileAsBuffer("small.txt");
console.log(fiel_content);//really???!!!!!!!!!!, undefined


``` 

>See this guy's post: http://cnodejs.org/topic/51b8811df78196a85c85dad3