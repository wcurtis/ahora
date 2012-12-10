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

mongoose.model('Hit', HitSchema);
