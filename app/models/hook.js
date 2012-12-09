// Article schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var HookSchema = new Schema({
    key: {type: String, index: {unique: true, dropDups: true}}
  , verb: String
  , action: Schema.Types.Mixed
  , createdAt  : {type : Date, default : Date.now}
  , updatedAt  : {type : Date, default : Date.now}
})

HookSchema.methods.log = function () {
    console.log("Hook: " + this);
}

HookSchema.path('verb').validate(function (val) {
  return val.length > 0
}, 'Hook verb cannot be blank')

HookSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

mongoose.model('Hook', HookSchema)
