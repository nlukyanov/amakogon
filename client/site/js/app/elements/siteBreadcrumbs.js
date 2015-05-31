(function() {

	var siteBreadcrumbs = angular.module('siteBreadcrumbs', []);

	siteBreadcrumbs.directive('siteBreadcrumbs', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-breadcrumbs.html'
		};
		function link(scope, element, attrs) {
			if ( $location.$$path.match(/\//ig).length == 1 ) {
				scope.breadcrumbs = [
					{
						title: 'Главная',
						url: '/#/'
					},
					{
						title: 'Фотографии',
						url: '/#/photos'
					}
				];
			}
			else if ( $location.$$path.match(/\//ig).length == 2 ) {
				scope.breadcrumbs = [
					{
						title: 'Главная',
						url: '/#/'
					},
					{
						title: 'Фотографии',
						url: '/#/photos'
					},
					{
						title: 'Название альбома',
						url: '/#/photos/22'
					}
				];
			}
			else if ( $location.$$path.match(/\//ig).length == 3 ) {
				if ( $location.$$hash != 'fullsize' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/#/'
						},
						{
							title: 'Фотографии',
							url: '/#/photos'
						},
						{
							title: 'Название альбома',
							url: '/#/photos/22'
						},
						{
							title: 'Название фотографии',
							url: '/#/photos/22/1'
						}
					];
				}
				else {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/#/'
						},
						{
							title: 'Фотографии',
							url: '/#/photos'
						},
						{
							title: 'Название альбома',
							url: '/#/photos/22'
						},
						{
							title: 'Название фотографии#fullsize',
							url: '/#/photos/22/1#fullsize'
						}
					];
				}
			}
		};
	});

})();