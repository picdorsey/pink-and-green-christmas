// The model!
function init(Schema, mongoose){
	var TheSchema = new Schema({
		name: String,
		message: String,
        email: String,
        created: Number
	});

	return mongoose.model('Wish', TheSchema);
}

module.exports.init = init;