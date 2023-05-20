const AWS = require('aws-sdk');

AWS.config.update({
	region: process.env.AWS_REGION,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({
	signatureVersion: 'v4'
});

module.exports = {
	getSignedUrlForPut: async function (bucket, key) {
		return new Promise((resolve, reject) => {
			let params = { Bucket: bucket, Key: key };
			s3.getSignedUrl('putObject', params, (err, url) => {
				if (err) reject(err);
				resolve(url);
			});
		});
	},
	getSignedUrlForGet: async function (bucket, key) {
		return new Promise((resolve, reject) => {
			let params = { Bucket: bucket, Key: key };
			s3.getSignedUrl('getObject', params, (err, url) => {
				if (err) reject(err);
				resolve(url);
			});
		});
	},
	checkObjectExists: async function (bucket, key) {
		return new Promise((resolve) => {
			let params = { Bucket: bucket, Key: key };
			s3.headObject(params, (err) => {
				if (err) resolve(false);
				resolve(true);
			});
		});
	},
};
