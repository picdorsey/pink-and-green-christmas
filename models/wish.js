var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Wish = new Schema({
    name: String,
    message: String,
    email: String,
    created: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Wish', Wish);