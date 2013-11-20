// The model!
function init(Schema, mongoose){
	var TheSchema = new Schema({
		title: String,
		complete: Boolean,
        important: Boolean
	});

	return mongoose.model('Item', TheSchema);
}

module.exports.init = init;