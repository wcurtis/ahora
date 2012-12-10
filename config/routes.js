
var mongoose = require('mongoose')
  , async = require('async')

module.exports = function (app) {

  var index = require('../app/controllers/index')
  app.get('/', index.index)

  // article routes
  var h = require('../app/controllers/page')
  app.get('/h/new', h.create)
  app.get('/h/:id', h.show)
  app.post('/h/:id', h.post)

  // hook resource
  var hook = require('../app/controllers/hook')
  app.post('/hook', hook.create)
  app.get('/hook/new', hook.createDefault)
  app.post('/hook/:id', hook.update)
  app.get('/hook/:id', hook.get)
  app.post('/hook/:id/delete', hook.delete)


  // Disabled this for now because something keeps pinging us!
  // app.post('/', hook.pingall)
}
