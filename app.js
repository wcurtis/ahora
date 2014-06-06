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
var audioSail = "/music/sail.mp3";
var audioScapegoat = "/music/Shieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet.mp3";

//js+css files
app.get('/*.(js|css)', function(req, res){
  res.sendfile("./public"+req.url);
});

app.get('/audio/create/:key', function(req, res){
  var newPage = new Page({
    key: req.params.key,
    type: 'audio',
    media: audioSail,
    label: 'Sale - Awolnation'
  })

  // Create a different audio track if the key is not numeric
  if (isNaN(req.params.key)) {
    newPage.media = audioScapegoat;
    newPage.label = "Shieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet";
  }

  newPage.save(function (err, fluffy) {
    if (err) {
      console.log("Error")
    }
    console.log("Saved it")
  });
  res.render('song', {
    media: 'Created ' + req.params.key,
    key: req.params.key
  }); 
});

app.get('/audio/new', function(req, res) {

  page = createAudioPage();
  page.save();

  res.redirect('/audio/' + page.key);
});

/**
 * Render an audio page if it exists in the db,
 * otherwise 404.
 */
app.get('/audio/:key', function(req, res){

  Page.findOne({ key: req.params.key}, function(err, page) {
    if (page) {
      res.render('song', {
        media: page.label,
        key: req.params.key
      }); 
      return;
    }
    res.send(404); 
  });
  
});



function createAudioPage()
{
  return new Page({
    key: getRandKey(),
    type: 'audio',
    media: audioSail,
    label: 'Sail - Awolnation'
  })
}

function getRandKey()
{
  return Math.random().toString(36).substring(7);
}

/**
 * Send audio action to all connected browsers on this
 * page.
 */
app.post('/audio/:key', function(req, res) {
  Page.findOne({ key: req.params.key}, function(err, page) {
    if (page) {
      io.sockets.in(req.params.key).emit('message', {song: page.media});
      // io.sockets.json.send({song: page.media});
      res.send(200);
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
  io.sockets.json.send({song: audioSail});
});

var activeClients = 0;

function clientDisconnect(client){
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

var port = process.env.PORT || 5000;
server.listen(port);
