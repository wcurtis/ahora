
var mongoose = require('mongoose')
  , async = require('async')

module.exports = function (app) {

  var index = require('../app/controllers/index')
  app.get('/', index.index)

  // article routes
  var hook = require('../app/controllers/hook')
  app.get('/h/new', hook.create)
  app.get('/h/:id', hook.show)
  app.post('/h/:id', hook.ping)
  app.post('/', hook.pingall)
}
