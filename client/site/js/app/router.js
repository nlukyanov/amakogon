(function() {
  
	var router = angular.module('router', ['ngRoute']);

	router.config(function($routeProvider, $locationProvider) {
		$routeProvider
				.when('/', {
					templateUrl: config.prefix + 'html/templates/homepage.html'
				})
				.when('/photos', {
					templateUrl: config.prefix + 'html/templates/photos.html'
				})
				.when('/tags', {
					templateUrl: config.prefix + 'html/templates/tags.html'
				})
				.when('/photos/:id', {
					templateUrl: config.prefix + 'html/templates/album.html',
					reloadOnSearch: false
				})
				.when('/blog', {
					templateUrl: config.prefix + 'html/templates/blog.html',
					reloadOnSearch: false
				})
				.when('/blog/:id', {
					templateUrl: config.prefix + 'html/templates/post.html',
					reloadOnSearch: false
				})
				.when('/about', {
					templateUrl: config.prefix + 'html/templates/about.html',
					reloadOnSearch: false
				})
				.when('/contacts', {
					templateUrl: config.prefix + 'html/templates/contact.html',
					reloadOnSearch: false
				})
				.when('/404', {
					templateUrl: config.prefix + 'html/templates/404.html'
				})
				.otherwise({redirectTo: '/404'});

		$locationProvider.html5Mode({
			enabled: true,
		});
	});
})();
