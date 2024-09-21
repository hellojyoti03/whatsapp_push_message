// @ts-nocheck
/**
 * @file_purpose  Make Connection To The DataBase
 * @author JyotiPrakash
 * @Date_Created
 * @Date_Modified
 */

const { connect, connection } = require("mongoose");
const appConfig = require("../../config/appConfig");
const startServer = require("../rest/server");

const startDB = (app) => {
	console.log("DATABASE ", appConfig.db.uri);
	connect(`${appConfig.db.uri}`);
	connection.on("connected", () => {
		console.log("MongoDb Database Connect Successfully ");
		startServer(app);
	});
	connection.on("error", (e) => {
		console.log("MongoDb Database Connection Error", e);
	});
	connection.on("disconnect", () => {
		console.log("MongoDb Database Disconnected ");
	});
};

module.exports = {
	startDB,
};
