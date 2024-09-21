const { Server } = require("socket.io");
const Socket = require("../../src/websocket/startSocket");
let startSocket = (server) => {
	const io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	Socket.setSocket(io);
};

module.exports = {
	startSocket: startSocket,
};
