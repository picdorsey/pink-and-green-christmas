// The model!
function init(Schema, mongoose){
	var TheSchema = new Schema({
		name: String,
		message: String,
        email: String
	});

	return mongoose.model('Wish', TheSchema);
}

module.exports.init = init;