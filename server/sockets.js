var io = require('socket.io');

var Socket = function(server) {
	var connection = io.listen(server),
		self = this;

	connection.sockets.on('connection', function(socket) {
		/*socket.on('get rooms', function() {
		});*/
	});
};

module.exports = Socket;
