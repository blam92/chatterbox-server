var url = require('url');
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var idCounter = 2;

let messages = {results: [
  {
    username: 'user',
    text: 'test message 1',
    roomname: 'floor 6',
    objectId: 0,
    createdAt: new Date()
  },
  {
    username: 'fishsticks',
    text: 'test message 2',
    roomname: 'floor 8',
    objectId: 1,
    createdAt: new Date()
  }
]};

var requestHandler = function(request, response) {
  var headers = defaultCorsHeaders;
  console.log(request.method, request.url);
  var currentUrl = url.parse(request.url, false).pathname;
  if (request.method === 'GET' && currentUrl === '/classes/messages') {
    var statusCode = 200;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);  
    response.end(JSON.stringify(messages));

  } else if (request.method === 'POST' && currentUrl === '/classes/messages') {
    var statusCode = 201;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    request.on('data', (message) => {
      console.log(message.toString());
      let q = url.parse(request.url + '/?' + message.toString(), true);
      let messageObj = q.query;
      console.log(q.query);
      messageObj.objectId = idCounter;
      idCounter++;
      messageObj.createdAt = new Date();
      messages.results.push(messageObj);
    });

    request.on('end', () => {
      response.end(JSON.stringify(messages));
    }); 
  } else if (request.method === 'OPTIONS' && currentUrl === '/classes/messages') {
    response.writeHead(200, headers);
    response.end();
  
  } else {
    response.writeHead(404, headers);
    response.end('Error');
  }
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;

