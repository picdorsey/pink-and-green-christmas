var passportLocalMongoose = require('passport-local-mongoose');

function init(Schema, mongoose){
    var TheSchema = new Schema({
    });
    
    TheSchema.plugin(passportLocalMongoose);
    return mongoose.model('User', TheSchema);
}



module.exports.init = init;
