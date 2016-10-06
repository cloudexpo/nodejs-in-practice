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
//read file as a stream
register('/test_stream', (test_file, req, resp) => {
    resp.writeHead(200, { 'Content-type': 'text/plain' });
    fs.createReadStream(test_file).pipe(resp);
});

/*Stream with error handler*/
register('/test_stream_error', (test_file, req, resp) => {
    resp.writeHead(200, { 'Content-type': 'text/plain' });
    var fstream = fs.createReadStream(test_file);
    fstream.pipe(resp);
    fstream.on('error', err => {
        resp.statusCode = 500;
        resp.end(err.stack);
    });
});
//pipe stream
register('/test_stream_zip', (test_file, req, resp) => {
    resp.writeHead(200, { 'content-encoding': 'gzip' });
    fs.createReadStream(test_file).pipe(zlib.createGzip()).pipe(resp);
});

register('/404', (req, resp) => {
    resp.statusCode = 404;
    resp.end('Unkonwn request');
});

//pipe stream return zip file
register('/test_stream_zip_file', (test_file, req, resp) => {
    resp.writeHead(200, { 'Content-type': 'application/gzip' });
    fs.createReadStream(test_file).pipe(zlib.createGzip()).pipe(resp);
});

var server = http.createServer(function(req, resp) {
    var req_url = url.parse(req.url);
    var pathname = req_url.pathname;
    console.log(req_url.pathname);
    console.log(routes);
    if (pathname && pathname.startsWith('/test_')) {
        var test_file = path.join(test_data_path, req_url.query.substr(req_url.query.indexOf('=') + 1));
        routes.get(pathname)(test_file, req, resp);
    } else {
        routes.get('/404')(req, resp);
    }

});


server.listen(8090);
