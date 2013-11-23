// The model!
function init(Schema, mongoose){
	var TheSchema = new Schema({
		name: String,
		message: String,
        email: String,
        created: new Date()
	});

	return mongoose.model('Wish', TheSchema);
}

module.exports.init = init;