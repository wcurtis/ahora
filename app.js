var express = require("express");
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// Heroku doesn't support WebSockets but we can use them locally :)
if (!process.env.USE_WEBSOCKET) {
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
}

var buffer = new Array();

require('jade');
app.set('view engine', 'jade');
app.set('view options', {layout: false});

//js+css files
app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public"+req.url);
});

app.get('/audio/:key', function(req, res){
  // Render raw html instead of jade for now
  res.render('song', {media: req.params.key}); 
});

app.get('/', function(req, res){
  // Render raw html instead of jade for now
  res.render('index');	
});

app.post('/', function(req, res){
  // Play default song
  io.sockets.json.send({song:"http://billcurtis.ca/public/sail.mp3"});
});

app.post('/song/:path', function(req, res){
  if(req.params.path){
    // Send url for all sockets to play
    io.sockets.json.send({song:req.params.path}); 
    res.send('Got it: ' + req.params.path, 200) 
  }else{
    res.send('No dice. Make sure you url encode your path string', 403)
  }
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
