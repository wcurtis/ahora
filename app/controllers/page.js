
var mongoose = require('mongoose')
  , Hook = mongoose.model('Hook')
  , Hit = mongoose.model('Hit')

// TODO: There's gotta be a cleaner way to access the io socket
var io = require('../../app').io;

var audioSail = "http://billcurtis.ca/public/sail.mp3";
var audioScapegoat = "http://billcurtis.ca/public/Shieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet.mp3";


exports.show = function(req, res) {
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (err)   { res.json(500, {'error': err.message}); return; }
    if (!hook) { res.json(404, {'error': 'Hook not found'}); return; } 

    // Only show port in url if not port 80
    var hookPort = '';
    if (server.address().port != 80) {
      hookPort = ':' + server.address().port;
    }

    Hit.getCountByHookId(hook._id, function(err, count) {
      if (err)   { res.json(500, {'error': err.message}); return; }

      Hit.getLastHitByHookId(hook._id, function(err, lastHit) {
        if (err)   { res.json(500, {'error': err.message}); return; }

          console.log('Last hit: ' + typeof lastHit[0]);

        var lastHitDate = 'Never';
        if (typeof lastHit[0] === 'object') {
          lastHitDate = lastHit[0].createdAt.toDateString()
        }

        // Render the page
        res.render('page', {
          key: req.params.id,
          hook_key: req.params.id,
          hook_url: 'http://' + req.host + hookPort + req.path,
          hook_verb: hook.verb,
          media_url: hook.action.media_url,
          hit_count: count,
          last_hit: lastHitDate
        });
      }) 
    }); 
  });
};

/* Will enable once rooms are working again in socket.io
exports.ping = function(req, res) {
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (hook) {
      io.sockets.in(req.params.id).emit('message', {song: hook.media});
      // io.sockets.json.send({song: hook.media});
      res.send(200);
      return;
    }
    res.send(404); 
  });
};
*/

exports.post = function(req, res) {
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (err)   { res.json(500, {'error': err.message}); return; }
    if (!hook) { res.json(404, {'error': 'Hook not found'}); return; } 

    hit = new Hit({
      '_hookId': hook._id,
      'verb': 'POST',
      'body': req.body,
      'params': req.params
    });

    hit.save(function (err, docs) {
      Hit.count({_hookId: hook._id}, function(err, count) {
        io.sockets.json.send({hits: count});
        console.log('Total hits: ' + count);
      });
      io.sockets.json.send({lastHit: hit.createdAt.toDateString()});
      // TODO: Change this to the real audio url
      io.sockets.json.send({song: audioSail});
    });
    
    res.send(200);
  });
};