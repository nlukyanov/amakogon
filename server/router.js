var exec = require('child_process').exec;
function router(app) {
	app.get('/admin', function(req, resp){
		var Admin = require('./admin/admin');

		admin = new Admin(req, resp);

		admin.renderAdmin();
	});
	app.get('/admin/*', function(req, resp){
		var Admin = require('./admin/admin');

		admin = new Admin(req, resp);

		admin.renderAdmin();
	});
	app.get('*', function(req, resp){
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
}
module.exports = router;
