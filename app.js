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

// Mongo
var mongoose = require('mongoose');
var mongoUri = process.env.MONGOLAB_URI || 'mongodb://localhost/datwebhook'; 
var db = mongoose.createConnection(mongoUri);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("DB Opened")
});

var pageSchema = new mongoose.Schema({
    type: String,
    key: {type: String, index: {unique: true, dropDups: true}},
    media: String,
    label: String,
})

pageSchema.methods.log = function () {
    console.log("Page: " + this);
}

var Page = db.model('Page', pageSchema);
var defaultAudio = "http://billcurtis.ca/public/sail.mp3";

//js+css files
app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public"+req.url);
});

app.get('/audio/create/:key', function(req, res){
  var newPage = new Page({
    key: req.params.key,
    type: 'audio',
    media: defaultAudio,
    label: 'Sale - Awolnation'
  })
  newPage.save(function (err, fluffy) {
    if (err) {
      console.log("Error")
    }
    console.log("Saved it")
  });
  res.render('song', {media: req.params.key});
});

/**
 * Render an audio page if it exists in the db,
 * otherwise 404.
 */
app.get('/audio/:key', function(req, res){

  Page.findOne({ key: req.params.key}, function(err, page) {
    if (page) {
      res.render('song', {media: page.label}); 
      return;
    }
    res.send(404); 
  });
  
});

app.get('/', function(req, res){
  // Render raw html instead of jade for now
  res.render('index');	
});

app.post('/', function(req, res){
  // Play default song
  io.sockets.json.send({song: defaultAudio});
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
