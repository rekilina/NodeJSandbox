let io;

module.exports = {
	init: (httpServer, options) => {
		io = require('socket.io')(httpServer, options);
		return io;
	},
	getIO: () => {
		if (!io) {
			throw new Error('socket-io is not initialized');
		}
		return io;
	}
}