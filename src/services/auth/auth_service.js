let mongoose = require('mongoose');

// DB Schema files
let User = require('../../models/user');

// Other required files
const { hashSync, genSaltSync, compareSync } = require('bcrypt');
let jwt = require('jsonwebtoken');
const moment = require('moment');

// Error Class files
const BadRequestException = require('../../middlewares/exceptions/badRequest_exception');
const UnauthorizedException = require('../../middlewares/exceptions/unautherized_exception');

const uploadService = require('../../functions/upload/upload_service');

module.exports.userSignup = async (requestBody) => {
	//initiate session
	const session = await mongoose.startSession();
	//Start trasaction
	session.startTransaction();

	try {
		let user_email = requestBody.email.toLowerCase();
		let user_password = requestBody.password;
		let user_first_name = requestBody.first_name;
		let user_last_name = requestBody.last_name;

		//check whether the email is already taken
		let duplicateUser = await User.findOne({
			email: user_email,
		});
		//check email already exists
		if (duplicateUser) {
			throw new BadRequestException('Email is already taken.');
		}

		//Encrypt password
		let salt = genSaltSync(10);
		let encrypted_password = hashSync(user_password, salt);


		//creating user object
		const user = {
			email: user_email,
			password: encrypted_password,
			first_name: user_first_name,
			last_name: user_last_name,
		};
		let newUser = new User(user);
		newUser.$session(session);
		userObj = await newUser.save();


		//check createdCompany,userObj,createdCompanyUser are created
		if (userObj) {
			//commit the transaction
			await session.commitTransaction();
			return {
				msg: 'SignUp completed.',
			};
		} else {
			await session.abortTransaction();
			throw new BadRequestException('SignUp failed.');
		}
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
};

module.exports.userSignIn = async (requestBody) => {
	// eslint-disable-next-line no-useless-catch
	try {
		let user_email = requestBody.email.toLowerCase();
		let user_password = requestBody.password;

		let signInUser = await User.findOne({
			email: user_email,
		}).exec();

		if (!signInUser) {
			throw new BadRequestException('Invalid email or password provided');
		}

		//check password is matching
		let passwordMatchResult = compareSync(user_password, signInUser.password);

		if (!passwordMatchResult) {
			throw new BadRequestException('Invalid email or password provided');
		}

		const tokenBody = {
			user_email: signInUser.email,
			user_id: signInUser._id,
		};

		//Generate tokens
		const token = jwt.sign(tokenBody, process.env.JWT_TOKEN_SECRET);

		let user_image = null;
		if (signInUser.image) {
			user_image = await uploadService.getPreSignedurlForViewUserImage(signInUser.image);
		}

		const data = {
			email:signInUser.email,
			first_name: signInUser.first_name,
			last_name: signInUser.last_name,
			image: user_image,
			token: token,
		};

		return {
			msg: 'Signin success!',
			data: data,
		};
	} catch (err) {
		throw err;
	}
};

module.exports.getPreSignedUrlToUploadProfileImage = async (requestUser, requestBody) => {
	// eslint-disable-next-line no-useless-catch
	try {

		let userObj = await User.findById(requestUser.user_id);
		if (!userObj) {
			throw new UnauthorizedException();
		}
		const image_type = (requestBody.image_format_type).toLowerCase();

		//check image types is equal to supported formats
		if (image_type != 'png' && image_type != 'jpg' && image_type != 'jpeg') {
			throw new BadRequestException('Unsupported image format.');
		}

		const image_name = requestUser.user_id + '.' + image_type;

		let preSignedURL = await uploadService.getPreSignedurlForUploadUserImage(image_name);
		let retrunObj = {
			presigned_url: preSignedURL
		};

		return {
			msg: 'User Presigned URL Generated',
			data: retrunObj
		};

	} catch (err) {
		throw err;
	}
};

module.exports.updateUserProfile = async (requestUser, requestBody) => {
	// eslint-disable-next-line no-useless-catch
	try {

		let userObj = await User.findById(requestUser.user_id);
		if (!userObj) {
			throw new UnauthorizedException();
		}

		await User.findByIdAndUpdate(requestUser.user_id, {
			$set: {
				first_name: requestBody.first_name,
				last_name: requestBody.last_name
			}
		});

		return {
			msg: 'User Profile Updated Successfully!'
		};

	} catch (err) {
		throw err;
	}
};

module.exports.updateUserPassword = async (requestUser, requestBody) => {
	// eslint-disable-next-line no-useless-catch
	try {

		let userObj = await User.findById(requestUser.user_id);
		if (!userObj) {
			throw new UnauthorizedException();
		}

		//check current password is matching
		let passwordMatchResult = compareSync(requestBody.current_password, userObj.password);

		if (!passwordMatchResult) {
			throw new BadRequestException('Invalid current password');
		}

		//Encrypt password
		let salt = genSaltSync(10);
		let encrypted_password = hashSync(requestBody.new_password, salt);


		await User.findByIdAndUpdate(requestUser.user_id, {
			$set: {
				password: encrypted_password
			}
		});

		return {
			msg: 'User Password Updated Successfully!'
		};

	} catch (err) {
		throw err;
	}
};

module.exports.getUserProfile = async (requestUser) => {
	// eslint-disable-next-line no-useless-catch
	try {
		let userObj = await User.findById(requestUser.user_id,'email first_name last_name image').exec();
		if (!userObj) {
			throw new UnauthorizedException();
		}

		if (userObj.image) {
			imageUrl = await uploadService.getPreSignedurlForViewUserImage(userObj.image);

			if (imageUrl) {
				userObj.image = imageUrl;
			}
			else {
				userObj.image = null;
			}
		}

		return {
			data:userObj,
			msg: 'User Profile generated Successfully!'
		};

	} catch (err) {
		throw err;
	}
};

module.exports.updateUserImage = async (requestUser, requestBody) => {
	// eslint-disable-next-line no-useless-catch
	try {

		let userObj = await User.findById(requestUser.user_id);
		if (!userObj) {
			throw new UnauthorizedException();
		}

		let checkProfileImageUploaded = false;
		let profile_image_id = null;

		if (requestBody.image_format_type) {

			let profile_image_type = requestBody.image_format_type.toLowerCase();

			//check image types is equal to supported formats
			if (profile_image_type != 'png' && profile_image_type != 'jpg' && profile_image_type != 'jpeg') {
				throw new BadRequestException('Unsupported image format. Images only in png, jpg or jpeg formats are allowed.');
			}

			const profile_image_name = requestUser.user_id + '.' + profile_image_type;

			checkProfileImageUploaded = await uploadService.checkUserImageUploaded(profile_image_name);

			if (checkProfileImageUploaded === false) {
				profile_image_id = null;
			}
			else {
				profile_image_id = profile_image_name;
			}
		}

		await User.findByIdAndUpdate(requestUser.user_id, {
			$set: {
				image: profile_image_id,
			}
		});

		return {
			msg: 'User Profile Image Successfully!'
		};

	} catch (err) {
		throw err;
	}
};

