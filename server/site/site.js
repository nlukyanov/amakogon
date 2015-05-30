var path = require('path');

var Site = function(req, resp) {
	this.req = req;
	this.resp = resp;
};

Site.prototype.renderSite = function() {
	this.resp.sendFile(path.resolve(__dirname, '../../client/site/site.html'));
}

module.exports = Site;
