const mongoose = require("mongoose");

const catcher = require("../libs/catcher");
const token = require("../libs/tokenLib");
const check = require("../libs/check");
const Users = mongoose.model("Users");
const responseLib = require("../libs/responseLib");
//Verify User Authorization
const isAuthorized = catcher(async (req, res, next) => {
	const { authorization } = req.headers;

	if (check.isEmpty(authorization)) {
		res.status(400);
		throw new Error("Authorization Header Empty");
	}
	//Verify Token
	const verify = await token.Verify(authorization);

	if (!verify?.data) {
		res.status(401);
		throw new Error("Invalid Token");
	}
	//check user exit or not in database
	const user = await Users.findById({ _id: verify?.data?._id }).lean();
	if (!user) {
		res.status(401);
		throw new Error("Invalid Token");
	}
	req._user = user;
	next();
});

//Get Current log In user Info
const whoAmI = catcher(async (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization) {
		res.status(502);
		throw new Error("Token Must Be Required");
	}

	//Verify Token
	const verify = await token.Verify(authorization);

	if (!verify?.data) {
		res.status(401);
		throw new Error("Invalid Token");
	}
	//check user exit or not in database
	const user = await Users.findById({ _id: verify?.data?._id }).lean();
	console.log("user ----><>::", user)
	if (!user) {
		res.status(404);
		throw new Error("Invalid Token");
	}
	delete user.otp;
	delete user.__v;
	delete user.updatedAt;
	req._user = user;

	const apiResponse = responseLib.Generate(false, "Current Log In User ", user);
	res.status(200);
	return res.send(apiResponse);
});

module.exports = {
	isAuthorized: isAuthorized,
	whoAmI: whoAmI,
};
