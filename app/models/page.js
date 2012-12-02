// Article schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PageSchema = new Schema({
    type: String
  , key: {type: String, index: {unique: true, dropDups: true}}
  , media: String
  , label: String
  , createdAt  : {type : Date, default : Date.now}
})

PageSchema.methods.log = function () {
    console.log("Page: " + this);
}

PageSchema.path('media').validate(function (media) {
  return media.length > 0
}, 'Hook media cannot be blank')

mongoose.model('Page', PageSchema)
