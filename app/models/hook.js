// Article schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var HookSchema = new Schema({
    type: String
  , key: {type: String, index: {unique: true, dropDups: true}}
  , media: String
  , label: String
  , createdAt  : {type : Date, default : Date.now}
})

HookSchema.methods.log = function () {
    console.log("Hook: " + this);
}

HookSchema.path('media').validate(function (media) {
  return media.length > 0
}, 'Hook media cannot be blank')

mongoose.model('Hook', HookSchema)
