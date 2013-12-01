var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Wish = new Schema({
    name: String,
    message: String,
    email: String,
    ip: String,
    created: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Wish', Wish);