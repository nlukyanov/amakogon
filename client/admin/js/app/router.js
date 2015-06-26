(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/admin', {
					templateUrl: config.prefix + 'html/templates/dashboard.html'
				})
				.when('/admin/photos', {
					templateUrl: config.prefix + 'html/templates/photos.html',
					reloadOnSearch: false
				})
				.when('/admin/photos/:id', {
					templateUrl: config.prefix + 'html/templates/album.html',
					reloadOnSearch: false
				})
				.when('/admin/tags', {
					templateUrl: config.prefix + 'html/templates/tags.html'
				})
				.when('/admin/blog', {
					templateUrl: config.prefix + 'html/templates/blog.html'
				})
				.when('/admin/blog/:id', {
					templateUrl: config.prefix + 'html/templates/post.html'
				})
				.when('/admin/about', {
					templateUrl: config.prefix + 'html/templates/about.html'
				})
				.when('/admin/contact', {
					templateUrl: config.prefix + 'html/templates/contact.html'
				})
				.otherwise({redirectTo: '/404'});

		$locationProvider.html5Mode({
			enabled: true,
		});
	});
})();
