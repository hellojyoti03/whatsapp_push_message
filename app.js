// @ts-nocheck
/**
 * @file_purpose  Start Server From This File
 * @author Jyoti Prakash
 * @Date_Created
 * @Date_Modified
 **/



const dotenv = require("dotenv");

dotenv.config();
// if (config.error) {
// 	console.log("ERROR", config.error)
// 	throw config.error;
// }
const express = require("express");


const {
	globalRouteMiddleware,
	globalErrorMiddleware,
} = require("./src/middleware/appErrorHandler");
const appConfig = require("./config/appConfig");
const routerLogger = require("./src/middleware/routeLogger");
const fs = require("fs");
const database = require("./www/db/db");
const app = express();



app.use(express.json());
app.use(routerLogger.logIp);


app.all(appConfig.allowedCorsOrigin, (req, res, next) => {
	res.header("Access-Control-Allow-Origin", appConfig.allowedCorsOrigin);
	res.header(
		"Access-Control-Allow-Headers",
		"Accept-Encoding, Connection,Origin, X-Requested-With, Content-Type, Accept,Authorization"
	);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,PATCH");
	next();
});

//NOTE - Dynamically Model Load
const schemaPath = "./src/model";
fs.readdirSync(schemaPath).forEach((file) => {
	if (~file.indexOf(".js")) require(schemaPath + "/" + file);
});
//NOTE - Dynamically Route Load
const routes = "./src/routes";
fs.readdirSync(routes).forEach((file) => {
	if (~file.indexOf(".js")) {
		const routePath = require(routes + "/" + file);
		routePath.setRouter(app);
	}
});


app.use(globalErrorMiddleware);
app.use(globalRouteMiddleware);


database.startDB(app);
