// @ts-nocheck
/**
 * @file_purpose  generate And Verify Jwt Token
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 */

const jwt = require("jsonwebtoken");
const generateToken = (data) => {
	return new Promise((resolve, reject) => {
		try {
			resolve(
				jwt.sign(
					{
						data,
					},
					"secret",
					{ expiresIn: "365h" }
				)
			);
		} catch (e) {
			reject(e);
		}
	});
};

const verifyToken = (data) => {
	return new Promise((resolve, reject) => {
		jwt.verify(data, "secret", function (err, decode) {
			if (err) {
				reject(err);
			} else {
				resolve(decode);
			}
		});
	});
};

module.exports = {
	Generate: generateToken,
	Verify: verifyToken,
};
