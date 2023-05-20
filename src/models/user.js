let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var UserSchema = new Schema({
	email: {
		type: String,
		index: true,
		unique: true,
		default: null,
		required: true
	},
	password: {
		type: String
	},
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	image: {
		type: String
	},
}, {
	timestamps: {
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	}
});



module.exports = mongoose.model('User', UserSchema);