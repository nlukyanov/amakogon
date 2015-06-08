var exec = require('child_process').exec;
function router(app) {
	app.get('*', function(req, resp){
		var Site = require('./site/site');

		site = new Site(req, resp);

		site.renderSite();
	});
}
module.exports = router;
