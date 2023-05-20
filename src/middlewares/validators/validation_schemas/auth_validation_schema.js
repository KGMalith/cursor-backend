const Joi = require('joi');
const authRoutesValidationsSchemas = {

	//validations for sign up
	signUp: Joi.object().keys({
		first_name: Joi.string().regex(/^[^<>=]*$/).required(),
		last_name: Joi.string().regex(/^[^<>=]*$/).required(),
		email: Joi.string().regex(/^[^<>=]*$/).email().required(),
		password: Joi.string().required()
	}),
	
	//validations user login
	signIn: Joi.object().keys({
		email: Joi.string().regex(/^[^<>=]*$/).email().required(),
		password: Joi.string().required()
	}),

	//get presigned url to upload user profile image
	uploadProfileImage: Joi.object().keys({
		image_format_type: Joi.string().regex(/^[^<>=]*$/).trim().allow(null || '')
	}),

	//update user profile
	updateUserProfile: Joi.object().keys({
		first_name: Joi.string().regex(/^[^<>=]*$/).required(),
		last_name: Joi.string().regex(/^[^<>=]*$/).required(),
	}),

	//update user password
	updateUserPassword: Joi.object().keys({
		current_password: Joi.string().required(),
		new_password: Joi.string().required(),
	}),

	//update user image
	updateUserImage: Joi.object().keys({
		image_format_type: Joi.string().regex(/^[^<>=]*$/).trim().allow(null || '')
	}),

};
module.exports = authRoutesValidationsSchemas;