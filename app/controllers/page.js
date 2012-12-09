
var mongoose = require('mongoose')
  , Page = mongoose.model('Page')

// TODO: There's gotta be a cleaner way to access the io socket
var io = require('../../app').io;

var audioSail = "http://billcurtis.ca/public/sail.mp3";
var audioScapegoat = "http://billcurtis.ca/public/Shieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet.mp3";


exports.show = function(req, res) {
  Page.findOne({ key: req.params.id}, function(err, page) {
    if (page) {

      // Only show port in url if not port 80
      var hookPort = '';
      if (server.address().port != 80) {
        hookPort = ':' + server.address().port;
      }

      res.render('page', {
        media: page.label,
        key: req.params.id,
        hook_key: req.params.id,
        hook_url: 'http://' + req.host + hookPort + req.path,
        media_url: page.media
      }); 
      return;
    }
    res.send(404); 
  });
};

/* Will enable once rooms are working again in socket.io
exports.ping = function(req, res) {
  Page.findOne({ key: req.params.id}, function(err, page) {
    if (page) {
      io.sockets.in(req.params.id).emit('message', {song: page.media});
      // io.sockets.json.send({song: page.media});
      res.send(200);
      return;
    }
    res.send(404); 
  });
};
*/

exports.ping = function(req, res) {
  io.sockets.json.send({song: audioSail});
  res.send(200);
};