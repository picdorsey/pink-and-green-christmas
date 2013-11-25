function init(Schema, mongoose){
    var TheSchema = new Schema({
        username: String,
        salt: String,
        password: String
    });

    return mongoose.model('User', TheSchema);
}

module.exports.init = init;
