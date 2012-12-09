
var mongoose = require('mongoose')
  , Page = mongoose.model('Page')

var audioSail = "http://billcurtis.ca/public/sail.mp3";

exports.get = function(req, res) {
  // Find the item and return it
  Page.findOne({ key: req.params.id}, function(err, page) {
    if (err)   res.json(500, {'error': err.message})
    if (!page) res.json(404, {'error': 'Hook not found'}); 
    res.json(page);
  });
};

exports.create = function(req, res) {
  page = createAudioPage();
  page.save();
  res.json(201, page);
};

exports.update = function(req, res) {
  Page.findOne({ key: req.params.id}, function(err, page) {
    if (err)   res.json(500, {'error': err.message})
    if (!page) res.json(404, {'error': 'Hook not found'}); 

    for (var key in req.body) {
      page[key] = req.body[key];
    }
    page.save(function(err) {
      if (err)   res.json(500, {'error': err.message});
      res.json(page);
    })
  });
};

// TODO: Move this so it's a method of the Page model
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