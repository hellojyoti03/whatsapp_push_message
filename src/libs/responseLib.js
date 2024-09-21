// @ts-nocheck
/**
 * @file_purpose Generate Response Template
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 */

const generate = (err, message, data) => {
	let response = {
		err: err,
		message: message,
		data: data,
	};
	return response;
};

module.exports = {
	Generate: generate,
};
