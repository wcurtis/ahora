// Article schema

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  ;

var HitSchema = new Schema({
    _hookId    : Schema.Types.ObjectId
  , verb      : String
  , body      : Schema.Types.Mixed
  , params    : Schema.Types.Mixed
  , createdAt : {type : Date, default : Date.now}
});

HitSchema.statics.getCountByHookId = function (hookId, cb) {
  this.count({ _hookId: hookId }, cb);
}

HitSchema.statics.getLastHitByHookId = function (hookId, cb) {
  // this.find({ _hookId: hookId }, {sort: {createdAt: -1}, limit: 1}, cb);
  this.find({_hookId: hookId}).sort('createdAt').limit(1).find(cb);
}

mongoose.model('Hit', HitSchema);
