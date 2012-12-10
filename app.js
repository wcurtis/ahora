/**
 * App entry point
 */
var express = require('express')
  , fs = require('fs')
  , http = require('http')
  , path = require('path');

app = express()
app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/app/views');
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Bootstrap db connection
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/datwebhook'; 
mongoose.connect(mongoUri)

// Bootstrap models
var models_path = __dirname + '/app/models'
  , model_files = fs.readdirSync(models_path)
model_files.forEach(function (file) {
  // Ignore hidden files like .DS_Store
  if (file.charAt(0) != '.') {
    require(models_path+'/'+file)
  }
})

// Bootstrap socket.io
server = http.createServer(app)
  , io = require('socket.io').listen(server);

// Heroku doesn't support WebSockets but we can use them locally :)
if (!process.env.USE_WEBSOCKET) {
  io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
  });
}
// Make io available everywhere, gotta be a better way
module.exports.io = io;

var activeClients = 0;

function clientDisconnect(socket){
  activeClients -=1;
  console.log(io.sockets.manager.roomClients[socket.id]);
  notifyRoomsOfDisconnect(socket);
  io.sockets.json.send({clients:activeClients})
}

function notifyRoomsOfDisconnect(socket) {
  var rooms = io.sockets.manager.roomClients[socket.id];
  for (var room in rooms) {
    if (room.charAt(0) == '/') {
      var roomKey = room.substring(1);
      var clients = io.sockets.clients(roomKey);
      // We subtract one because this guy who's disconnecting is still in the count
      var numClients = clients.length - 1;
      io.sockets.in(roomKey).emit('message', {clientCount: numClients});
    }
  }
}

function updateRoomCount(roomKey) {
  var clients = io.sockets.clients(roomKey);
  io.sockets.in(roomKey).emit('message', {clientCount: clients.length});
  console.log("Updating count for room " + roomKey + ". Total: " + clients.length);
}

io.sockets.on('connection', function(socket){ 
  activeClients +=1;
  io.sockets.json.send({clients:activeClients})
  socket.on('disconnect', function(){clientDisconnect(socket)});
  socket.on('subscribe', function(data) {
    socket.join(data.key);
    updateRoomCount(data.key);

    socket.on('unsubscribe', function(data) { 
      socket.leave(data.key);
      updateRoomCount(data.key);
    });
  });
}); 

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.env.PORT || 5000
server.listen(port)
console.log('App started on port ' + port)



