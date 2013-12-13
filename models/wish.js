var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Wish = new Schema({
    name: String,
    message: String,
    email: String,
    gravatar: String,
    ip: String,
    visible: { type: Boolean, default: true},
    created: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Wish', Wish);