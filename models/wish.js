function init(Schema, mongoose){
	var TheSchema = new Schema({
		name: String,
		message: String,
        email: String,
        created: { type: Date, default: Date.now },
	});

	return mongoose.model('Wish', TheSchema);
}

module.exports.init = init;
