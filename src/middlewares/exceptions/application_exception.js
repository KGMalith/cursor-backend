class ApplicationException extends Error {
	constructor(msg, status) {

		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.msg = msg || 'Something went wrong. Try refreshing the page';

		this.status = status || 500;
	}

}

module.exports = ApplicationException;