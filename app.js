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
  require(models_path+'/'+file)
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
  io.sockets.json.send({clients:activeClients})
}

io.sockets.on('connection', function(socket){ 
  activeClients +=1;
  io.sockets.json.send({clients:activeClients})
  socket.on('disconnect', function(){clientDisconnect(socket)});
  socket.on('subscribe', function(data) {
    socket.join(data.key);
    console.log("Joined room " + data.key + ". Total: " + io.sockets.clients(data.key));
  });
}); 

// Bootstrap routes
require('./config/routes')(app)

// Start the app by listening on <port>
var port = process.env.PORT || 5000
server.listen(port)
console.log('App started on port ' + port)



