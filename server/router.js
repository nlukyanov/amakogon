var exec = require('child_process').exec;
function router(app) {
	app.get('/site', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
	app.get('/push', function(req, resp) {
		var child = exec('git pull', function(err, stdout, stderr) {
			resp.end();
		});
	});
}
module.exports = router;
