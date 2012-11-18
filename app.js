var express = require("express");
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var buffer = new Array();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

//js+css files
app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public"+req.url);
});

app.get('/', function(req, res){
  res.render('index');	
});

var activeClients = 0;

function clientDisconnect(client){
  activeClients -=1;
  io.sockets.json.send({clients:activeClients})
}

io.sockets.on('connection', function(client){ 
  activeClients +=1;
  io.sockets.json.send({clients:activeClients})
  client.on('disconnect', function(){clientDisconnect(client)});
}); 

var port = process.env.PORT || 5000;
server.listen(port);
