var io = require('socket.io'),
	dashboard = require('./admin/pages/dashboard');

var Socket = function(server) {
	var connection = io.listen(server),
		self = this;

	connection.sockets.on('connection', function(socket) {
		socket.on('load dashboard', function(item) {
			dashboard.getHome(item, function(error, data) {
				if ( error != null ) {
					// === Error Handling
				}
				else {
					socket.emit('dashboard loaded', data);
				}
			});
		});
		socket.on('update dashboard', function(item, img, title, desc) {
			dashboard.updateHome(item, img, title, desc, function(error, data) {
				socket.emit('dashboard updated', data);
			});
		});
	});
};

module.exports = Socket;
