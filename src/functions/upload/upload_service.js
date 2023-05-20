const s3 = require('./s3');

module.exports = {
	getPreSignedurlForUploadUserImage: async function (filekey) {
		const bucket = process.env.CURSOR_USER_BUCKET;
		const key = filekey;

		try {
			let response = await s3.getSignedUrlForPut(bucket, key);
			return response;
		} catch (err) {
			return err;
		}
	},

	getPreSignedurlForViewUserImage: async function (filekey) {
		const bucket = process.env.CURSOR_USER_BUCKET;
		const key = filekey;

		try {
			let response = await s3.getSignedUrlForGet(bucket, key);
			return response;
		} catch (err) {
			return err;
		}
	},

	checkUserImageUploaded: async function (filekey) {
		const bucket = process.env.CURSOR_USER_BUCKET;
		const key = filekey;

		try {
			let response = await s3.checkObjectExists(bucket, key);
			return response;
		} catch (err) {
			return err;
		}
	},
};