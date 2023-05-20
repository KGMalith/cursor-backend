const validationsMiddleware = (schema) => {
	return (req, res, next) => {
		const respond = schema.validate(req.body);
		if (respond.error) {
			const message = respond.error.details.map(i => i.message).join(',');
			return res.status(400).json({ success: false, msg: 'Bad request', reason: message });
		} else {
			next();
		}
	};
};
module.exports = validationsMiddleware;