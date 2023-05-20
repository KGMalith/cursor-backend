const authService = require('../../services/auth/auth_service');

module.exports.userSignUp = async (req, res) => {
	try {
		const serviceResponse = await authService.userSignup(req.body);
		return res.status(200).json({ success: true, msg: serviceResponse.msg, showMessage: true });
	} catch (err) {
		return res.status(err.status || 500).json({success: false,msg: err.msg || 'Something went wrong. Try refreshing the page'});
	}
};

module.exports.userSignIn = async (req, res) => {
	try {
		const serviceResponse = await authService.userSignIn(req.body);
		return (res.cookie('refresh_token',serviceResponse.refresh_token,serviceResponse.cookie_options),res.status(200).json({success: true,msg: serviceResponse.msg,data: serviceResponse.data,showMessage: true}));
	} catch (err) {
		return res.status(err.status || 500).json({success: false,msg: err.msg || 'Something went wrong. Try refreshing the page'});
	}
};

module.exports.getPreSignedUrlToUploadProfileImage = async (req, res) => {
	try {
		const serviceResponse = await authService.getPreSignedUrlToUploadProfileImage(req.user,req.body);
		return res.status(200).json({ success: true, msg: serviceResponse.msg, data: serviceResponse.data, showMessage: false });
	} catch (err) {
		return res.status(err.status || 500).json({ success: false, msg: err.msg || 'Something went wrong. Try refreshing the page' });
	}
};

module.exports.updateUserProfile = async (req, res) => {
	try {
		const serviceResponse = await authService.updateUserProfile(req.user, req.body);
		return res.status(200).json({ success: true, msg: serviceResponse.msg, showMessage: false });
	} catch (err) {
		return res.status(err.status || 500).json({ success: false, msg: err.msg || 'Something went wrong. Try refreshing the page' });
	}
};

module.exports.updateUserPassword = async (req, res) => {
	try {
		const serviceResponse = await authService.updateUserPassword(req.user, req.body);
		return res.status(200).json({ success: true, msg: serviceResponse.msg, showMessage: false });
	} catch (err) {
		return res.status(err.status || 500).json({ success: false, msg: err.msg || 'Something went wrong. Try refreshing the page' });
	}
};
