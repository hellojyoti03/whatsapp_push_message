// @ts-nocheck
/**
 * @file_purpose  Validate User Input
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 * @Updated_Log send OTP and Reset Password
 */

const joi = require("joi");
const catcher = require("../libs/catcher");
const responseLib = require("../libs/responseLib");
const { parsePhoneNumberFromString } = require("libphonenumber-js");
/* -------------------------------------------------------------------
						sign Up  Router Validate
--------------------------------------------------------------------*/

const signUp = catcher(async (req, res, next) => {
	const { name, email, password, profile } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		name: joi
			.string()
			.regex(/^[A-Za-z\s]+$/)
			.min(4)
			.max(30)
			.required(),
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		password: joi.string().min(6).max(15).required(),
		profile: joi.string().uri().required(),
	});

	try {
		const value = await schema.validateAsync({
			name,
			email,
			password,
			profile,
		});
		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

/* -------------------------------------------------------------------
						sign In  Router Validate
--------------------------------------------------------------------*/

const signIn = catcher(async (req, res, next) => {
	const { email, password } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		password: joi.string().min(6).max(15).required(),
	});
	try {
		const value = await schema.validateAsync({ email, password });

		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

/* -------------------------------------------------------------------
						social sign In  Router Validate
--------------------------------------------------------------------*/

const socialSignIn = catcher(async (req, res, next) => {
	const { email, name, profile, uid } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		name: joi
			.string()
			.regex(/^[A-Za-z\s]+$/)
			.min(4)
			.max(30)
			.required(),
		profile: joi.string().uri().required(),
		uid: joi.string().required(),
	});
	try {
		const value = await schema.validateAsync({ email, name, profile, uid });

		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

/* -------------------------------------------------------------------
						send otp  Router Validate
--------------------------------------------------------------------*/

const sendOTP = catcher(async (req, res, next) => {
	const { email } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
	});
	try {
		const value = await schema.validateAsync({ email });
		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

/* -------------------------------------------------------------------
						Verify OTP Router Validate
--------------------------------------------------------------------*/

const verifyOTP = catcher(async (req, res, next) => {
	const { email, OTP } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		OTP: joi
			.string()
			.length(6)
			.pattern(/^[0-9]+$/)
			.required(),
	});

	try {
		const value = await schema.validateAsync({
			email,
			OTP,
		});
		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

/* -------------------------------------------------------------------
						Reset Password  Router Validate
--------------------------------------------------------------------*/

const resetPassword = catcher(async (req, res, next) => {
	const { email, password, confirmPassword, OTP } = req.body;

	//Joi Schema For Validation
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		password: joi.string().min(6).max(15).required(),
		confirmPassword: joi.string().min(6).max(15).required(),
		OTP: joi
			.string()
			.length(6)
			.pattern(/^[0-9]+$/)
			.required(),
	});

	try {
		const value = await schema.validateAsync({
			email,
			password,
			confirmPassword,
			OTP,
		});
		if (value) next();
	} catch (e) {
		res.status(403);
		throw new Error(e.message);
	}
});

const userRegister = async (req, res, next) => {
	const { email, name, phone_no, iso_code, calling_code } = req.body;
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		phone_no: joi.string().required(),
		iso_code: joi.string().required(),
		calling_code: joi.string().required(),
		name: joi.string().required(),
	});

	try {
		const value = await schema.validateAsync({
			email,
			name,
			phone_no,
			iso_code,
			calling_code,
		});
	
		if (Object.keys(value)?.length) {
			if (!validatePhoneNumber(phone_no, iso_code)) {
				throw new Error("Invalid phone number ");
			}
			next();
		} else {
			throw new Error("Validation Failed");
		}
	} catch (e) {
		let message = e?.message || "Validation Failed";
		res.status(400);
		const apiResponse = responseLib.Generate(true, message, null);
		res.send(apiResponse);
	}
};
const userLogin = async (req, res, next) => {
	try {
		let schema;
		let value = undefined;

		switch (req?.body?.sign_in_mode) {
			case "ideal":
				schema = joi.object({
					email: joi.string()
						.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
						.required(),
					password: joi.string().min(6).max(15).required(),
					sign_in_mode: joi.string().required()
					
				});
				value = await schema.validateAsync(req.body);
				break;

			case "google":
			case "fb":
				schema = joi.object({
					social_uid: joi.string().required(),
					user_name: joi.string().required(),
					profile_picture: joi.string(),
					email: joi.string()
						.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
						.required(),
					sign_in_mode: joi.string().required()
				});
				value = await schema.validateAsync(req.body);
				break;

			case "phone":
				console.log("PHONE SCHEMA")
				schema = joi.object({
					phone_no: joi.string().required(),
					iso_code: joi.string().required(),
					calling_code: joi.string().required(),
					sign_in_mode: joi.string().required()
				});
				value = await schema.validateAsync(req.body);
				if (!validatePhoneNumber(req.body.phone_no, req.body.iso_code)) {
					throw new Error("Invalid phone number ");
				}
				
				break;

			default:
				throw new Error("Invalid sign in mode");
		}

		if (Object.keys(value)?.length) {
			next();
		} else {
			throw new Error("Validation Failed");
		}
	} catch (e) {
		console.log(e, "err")
		const message = e?.message || "Validation Failed";
		res.status(400);
		const apiResponse = responseLib.Generate(true, message, null);
		res.send(apiResponse);
	}
};
const userEditProfile = async (req, res, next) => {
	try {
		const schema = joi.object({
			email: joi
				.string()
				.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
				.required(),
			phone_no: joi.string().required(),
			iso_code: joi.string().required(),
			calling_code: joi.string().required(),
			user_name: joi.string().required(),
			gender: joi.string().valid('m', 'f', 'o').required(),
		});
		const value = await schema.validateAsync({
			email: req.body.email,
			phone_no: req.body.phone_no,
			iso_code: req.body.iso_code,
			calling_code: req.body.calling_code,
			user_name: req.body.user_name,
			gender: req.body.gender
		});
		if (Object.keys(value)?.length) {
			if (!validatePhoneNumber(req.body.phone_no, req.body.iso_code)) {
				throw new Error("Invalid phone number ");
			}
			next();
		} else {
			throw new Error("Validation Failed");
		}
	} catch (e) {
		const message = e?.message || "Validation Failed";
		res.status(400);
		const apiResponse = responseLib.Generate(true, message, null);
		res.send(apiResponse);
	}
};
const validatePhoneNumber = (phone_no, isoCode) => {
	if (!phone_no || !isoCode) {
		return false;
	}
	const parsedPhoneNumber = parsePhoneNumberFromString(phone_no, isoCode);

	if (!parsedPhoneNumber || !parsedPhoneNumber.isValid()) {
		return false;
	}

	return true;
};

const adminRegister = async (req, res, next) => {
	const { email, password} = req.body;
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		password: joi.string().min(6).max(15).required(),
	});

	try {
		const value = await schema.validateAsync({
			email,
			password,
			
		});
	
		if (Object.keys(value)?.length) {
			
			next();
		} else {
			throw new Error("Validation Failed");
		}
	} catch (e) {
		let message = e?.message || "Validation Failed";
		res.status(400);
		const apiResponse = responseLib.Generate(true, message, null);
		res.send(apiResponse);
	}
};
const adminLogin = async (req, res, next) => {
	const { email, password} = req.body;
	const schema = joi.object({
		email: joi
			.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required(),
		password: joi.string().min(6).max(15).required(),
	});

	try {
		const value = await schema.validateAsync({
			email,
			password,
			
		});
	
		if (Object.keys(value)?.length) {
			
			next();
		} else {
			throw new Error("Validation Failed");
		}
	} catch (e) {
		let message = e?.message || "Validation Failed";
		res.status(400);
		const apiResponse = responseLib.Generate(true, message, null);
		res.send(apiResponse);
	}
};
module.exports = {
	//! Auth Router Validate
	adminRegister: adminRegister,
adminLogin: adminLogin,
	SocialSignIn: socialSignIn,
	SignUp: signUp,
	SignIn: signIn,
	verifyOTP: verifyOTP,
	OTP: sendOTP,
	Reset: resetPassword,
	userRegister: userRegister,
	userLogin: userLogin,
	userEditProfile: userEditProfile,
};
