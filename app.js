var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	router = require('./server/router'),
	DB = require('./server/mongoosedb'),
	IO = require('./server/sockets');

global.ioInst = new IO(server);

server.listen(3030);

app.use(express.static( __dirname));

router(app);

global.db = new DB();
db.connect(function(resp) {
	//console.log(resp);
});
