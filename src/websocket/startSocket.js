const socket = require("../../www/socket/socket");

let setSocket = (io) => {
	/**
	 * Connection Handler.
	 **/
	let users = [];

	//add user...
	const addUser = (userId, socketId) => {
		let findIdx = users.findIndex((user) => user.userId == userId);
		if (findIdx == -1) {
			users.push({ userId, socketId });
		}
	};

	//removed user
	const removeUser = (socketId) => {
		let user = users.filter((el) => socketId != el.socketId);
		users = user;
	};

	//get a single user
	const getUser = (userId) => {
		const user = users.find((user) => {
			return user.userId == userId;
		});
		return user;
	};

	//send message
	const sendMessage = ({ senderId, receiverId, text }) => {
		const user = getUser(receiverId);
		console.log(user);
		io.to(user?.socketId).emit("getMessage", {
			senderId,
			text,
		});
	};

	//connection
	io.on("connection", (socket) => {
		console.log(`A user Connected In ${socket.id}`);

		// add user
		socket.on("add_user", (user) => {
			addUser(user._id, socket.id);

			//get all user
			io.emit("get_user", users);
		});

		// send message
		socket.on("send_message", sendMessage);

		//disconnect
		//! bug : use always inside a socket connection event
		socket.on("disconnect", function () {
			let findIdx = users.findIndex((user) => user.socketId == socket.id);

			// remove disconnect user from socket arr
			if (findIdx != -1) {
				removeUser(users[findIdx].socketId);
				io.emit("get_user", users);
				console.log("Socket User Disconnected From Server");
			} else {
				console.log("socket disconnected before username set");
			}
		});
	});

	/**
	 * Socket Events For Application Logic.
	 **/

	/**
	 * Disconnection Handler.
	 **/
};

module.exports = {
	setSocket: setSocket,
};
