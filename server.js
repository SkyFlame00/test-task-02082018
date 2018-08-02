let http = require('http');
let staticServer = require('node-static');
let fs = require('fs');
let file = new staticServer.Server('.');

http.createServer(function(req, res) {
  if (req.url == '/products.json') {
    let file = fs.readFileSync('products.json', 'utf8');
    return res.end(file)
  }

  file.serve(req, res);
}).listen(8080);

console.log('The server is now running');
