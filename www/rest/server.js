// @ts-nocheck
/**
 * @file_purpose  Make Connection To The Server and Socket
 * @author JyotiPrakash
 * @Date_Created
 * @Date_Modified
 */

const http = require("http");

const ws = require("../socket/socket");
const startServer = (app) => {
	const httpServer = http.createServer(app);

	httpServer.listen(process.env.PORT);

	httpServer.on("listening", () => {
		console.log(`Server Listening On Port ${process.env.PORT}`);

		ws.startSocket(httpServer);
	});

	httpServer.on("error", (error) => {
		console.log(`Some Error Occurred ${error}`);
	});
	httpServer.on("close", () => {
		console.log(`Server Close..........`);
	});
};

module.exports = startServer;
