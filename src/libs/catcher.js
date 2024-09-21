// @ts-nocheck
/**
 * @file_purpose  Not Write Try catch Every Where Write Once and use Every time
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 */

const response = require("./responseLib");

const catcher = (fn) => {
	/**
	 * @author JyotiPraksh
	 * @Date_Created
	 * @Date_Modified
	 * @function {async} resolve promise .where use middleware and controller :- can not write many try catch to error handel wrap in catcher block .
	 * @functionName catcher
	 * @functionPurpose  receive a function and call that function by closure wrap in try catch
	 *
	 * @functionParam {Function_Object}
	 *
	 * @functionSuccess ....
	 * @functionSuccess .....
	 *
	 * @functionError {Boolean} error error is there.
	 * @functionError {String} message  Description message.
	 */
	return async (req, res, next) => {
		try {
			await fn(req, res, next);
		} catch (e) {
			const apiResponse = response.Generate(true, e.message, null);
			res.send(apiResponse);
		}
	};
};

module.exports = catcher;
