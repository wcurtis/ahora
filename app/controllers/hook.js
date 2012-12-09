
var mongoose = require('mongoose')
  , Hook = mongoose.model('Hook')

var audioSail = "http://billcurtis.ca/public/sail.mp3";

exports.get = function(req, res) {
  // Find the item and return it
  Hook.findOne({ key: req.params.id}, function(err, hook) {
    if (err)   res.json(500, {'error': err.message})
    if (!hook) res.json(404, {'error': 'Hook not found'}); 
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
    if (err)   res.json(500, {'error': err.message})
    if (!hook) res.json(404, {'error': 'Hook not found'}); 

    for (var key in req.body) {
      hook[key] = req.body[key];
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
    type: 'audio',
    media: audioSail,
    label: 'Sail - Awolnation'
  })
}

function getRandKey()
{
  return Math.random().toString(36).substring(7);
}