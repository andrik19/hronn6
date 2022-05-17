const http = require('http');
const url = require('url');
const math = require('./math');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function (req, res) {
   res.setHeader('Content-Type', 'text/plain');

   var parsedUrl = url.parse(req.url, true);
   if (parsedUrl.pathname === '/divide') {
      if (parsedUrl.query !== undefined && parsedUrl.query.a !== undefined && parsedUrl.query.b !== undefined && Object.keys(parsedUrl.query).length==2) {
         let resultString = math.stringifyDivision(parsedUrl.query.a, parsedUrl.query.b);
         res.statusCode = 200;
         res.end(resultString);
      } else {
         res.statusCode = 405;
         res.end('This operation is not supported.');
      }
   } else {
      res.statusCode = 405;
      res.end('This operation is not supported.');
   }
});

server.listen(port, hostname, function () {
   console.log(`Server running at http://${hostname}:${port}/`);
});