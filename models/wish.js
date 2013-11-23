var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

Wish = function(host, port) {
  this.db = new Db('christmas', new Server(host, port, {auto_reconnect: true}, {}), {safe:false});
  this.db.open(function(){});
};

Wish.prototype.getCollection= function(callback) {
  this.db.collection('wishes', function(error, wish_collection) {
    if(error) callback(error);
    else callback(null, wish_collection);
  });
};

Wish.prototype.findAll = function(callback) {
    this.getCollection(function(error, wish_collection) {
      if(error) callback(error)
      else {
        wish_collection.find().toArray(function(error, results) {
          if(error) callback(error)
          else callback(null, results)
        });
      }
    });
};

Wish.prototype.findById = function(id, callback) {
    this.getCollection(function(error, wish_collection) {
      if(error) callback(error)
      else {
        wish_collection.findOne({_id: wish_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if(error) callback(error)
          else callback(null, result)
        });
      }
    });
};

Wish.prototype.save = function(wishes, callback) {
    this.getCollection(function(error, wish_collection) {
      if(error) callback(error)
      else {
        if(!(wishes instanceof Array))
          wishes = [wishes];

        for(var i = 0; i < wishes.length; i++) {
          wish = wishes[i];
          wish.created_at = new Date();
        }

        console.log(wishes);
        wish_collection.insert(wishes, function() {
          callback(null, wishes);
        });
      }
    });
};

exports.Wish = Wish;