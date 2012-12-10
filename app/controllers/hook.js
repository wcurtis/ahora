
var mongoose = require('mongoose')
  , Hook = mongoose.model('Hook')

var audioSail = "http://billcurtis.ca/public/sail.mp3";

exports.get = function(req, res) {
  // Find the item and return it
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (err)   { res.json(500, {'error': err.message}); return; }
    if (!hook) { res.json(404, {'error': 'Hook not found'}); return; } 
    res.json(hook);
  });
};

exports.create = function(req, res) {
  hook = createAudioHook();
  hook.save();
  res.json(201, hook);
};

exports.update = function(req, res) {
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (err)   { res.json(500, {'error': err.message}); return; }
    if (!hook) { res.json(404, {'error': 'Hook not found'}); return; } 

    for (var key in req.body) {
      hook[key] = req.body[key];
    }

    // Also update the action object in this model 
    // Couldn't find a way to call the update() function on a single model, maybe someday I'll revisit
    for (var key in req.body.action) {
      hook.action[key] = req.body.action[key];
    }

    hook.save(function(err) {
      if (err)   res.json(500, {'error': err.message});
      res.json(hook);
    })
  });
};

exports.createDefault = function(req, res) {
  hook = createAudioHook();
  hook.save();
  res.redirect('/h/' + hook.key);
};

// TODO: Move this so it's a method of the Hook model
function createAudioHook()
{
  return new Hook({
    key: getRandKey(),
    verb: 'POST',
    action: {
      type: 'audio',
      media_url: audioSail,
      label: 'Sail - Awolnation',
    }
  });
}

function getRandKey()
{
  return Math.random().toString(36).substring(7);
}