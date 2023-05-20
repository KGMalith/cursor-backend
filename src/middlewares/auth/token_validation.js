const { verify } = require('jsonwebtoken');

module.exports = {
	checkToken: (req, res, next) => {
		//Get the refresh token from autherization header
		let token = req.get('authorization');
		
		if (token) {
			verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
				if (err) {
					res.status(400).json({
						success: false,
						msg: 'Invalid Access Token',
						showMessage: false
					});
				} else {
					let requestUser = {
						user_email: decoded.user_email,
						user_id: decoded.user_id
					};
					req.user = requestUser;
					next();
				}
			});
		} else {
			res.status(403).json({
				success: false,
				msg: 'Access Denied!',
				showMessage: true
			});
		}
	}
};