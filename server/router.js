function router(app) {
	app.get('/site', function(req, resp) {
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
}
module.exports = router;
