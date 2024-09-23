// @ts-nocheck
/**
 * @file_purpose  Start Server From This File
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 */

const responseLib = require("../libs/responseLib");

//Client and Server Error Handel
const errorHandler = (err, req, res, next) => {
	console.log(err);
	const apiResponse = responseLib.Generate(true, "Some Error Happen In Global Label", null);
	res.status(500);
	res.send(apiResponse);
};

//Route not found
const routeNotFound = (req, res, next) => {
	const apiResponse = responseLib.Generate(true, "Route Not Found", null);
	res.status(404);
	return res.send(apiResponse);
};

module.exports = {
	globalErrorMiddleware: errorHandler,
	globalRouteMiddleware: routeNotFound,
};
