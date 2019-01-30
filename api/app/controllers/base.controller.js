class BaseController {

	filterParams(params, whitelist) {
		const filtered = {};
		for (const key in params) {
			if (whitelist.indexOf(key) > -1) {
				filtered[key] = params[key];
			}
		}
		return filtered;
	}

	formatMongoError(err) {
		let error = '';

		if(err.name === 'MongoError') {
			if(err.code === 11000) {
				let field = /index:\s{1}(.*)_\d+/g.exec(err.errmsg);
				error = (field !== null && field.length === 2 ? field[1] : 'Field') + ' must be unique';
			}
		}

	  return error;
	}

	formatMongooseErrors(err) {
	  let errors = [];
	  //Loop over the errors object of the Validation Error
		if(err.errors) {
			Object.keys(err.errors).forEach((field) => {
		  	let error = err.errors[field];
				errors.push(error.message);
		  });
		}

	  return errors;
	}

	formatApiError(err) {
		if (!err) {
			// eslint-disable-next-line no-console
			return console.error('Provide an error');
		}

		const formatted = {
			message: err.message,
		};

		if (err.errors) {
			formatted.errors = {};
			const errors = err.errors;
			for (const type in errors) {
				if (errors.hasOwnProperty(type)) {
					formatted.errors[type] = errors[type].message;
				}
			}
		}

		return formatted;
	}
}

export default BaseController;
