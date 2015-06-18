var path = require('path');

var Admin = function(req, resp) {
	this.req = req;
	this.resp = resp;
};

Admin.prototype.renderAdmin = function() {
	this.resp.sendFile(path.resolve(__dirname, '../../client/admin/admin.html'));
}

module.exports = Admin;
