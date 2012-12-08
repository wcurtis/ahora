
var mongoose = require('mongoose')
  , async = require('async')

module.exports = function (app) {

  var index = require('../app/controllers/index')
  app.get('/', index.index)

  // article routes
  var page = require('../app/controllers/page')
  app.get('/h/new', page.create)
  app.get('/h/:id', page.show)
  app.post('/', page.pingall)
  app.post('/h/:id', page.ping)
}
