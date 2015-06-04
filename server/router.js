var exec = require('child_process').exec;
function router(app) {
	app.get('/', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/photos', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/photos/:id', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/tags', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/blog', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/blog/:id', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/404', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.post('/push', function(req, resp) {
		var child = exec('git pull', function(err, stdout, stderr) {
			resp.end();
		});
	});
	app.get('*', function(req, resp){
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
}
module.exports = router;
