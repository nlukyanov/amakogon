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
				if ( $location.$$path == '/photos' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Фотографии',
							url: '/photos'
						}
					];
				}
				else if ( $location.$$path == '/tags' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: '#Тег',
							url: '/tags/#tag'
						}
					];
				}
				else if ( $location.$$path == '/blog' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Блог',
							url: '/blog'
						}
					];
				}
				else if ( $location.$$path == '/cv' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Обо мне',
							url: '/cv'
						}
					];
				}
				else if ( $location.$$path == '/contact' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Контакты',
							url: '/contat'
						}
					];
				}
			}
			else if ( $location.$$path.match(/\//ig).length == 2 ) {
				if ( $location.$$hash == '' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Фотографии',
							url: '/photos'
						},
						{
							title: 'Название альбома',
							url: '/photos/22'
						}
					];
				}
				else {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Фотографии',
							url: '/photos'
						},
						{
							title: '#Тег',
							url: '/photos/tags#tag'
						}
					];
				}
			}
			else if ( $location.$$path.match(/\//ig).length == 3 ) {
				if ( $location.$$hash != 'fullsize' ) {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Фотографии',
							url: '/photos'
						},
						{
							title: 'Название альбома',
							url: '/photos/22'
						},
						{
							title: 'Название фотографии',
							url: '/photos/22/1'
						}
					];
				}
				else {
					scope.breadcrumbs = [
						{
							title: 'Главная',
							url: '/'
						},
						{
							title: 'Фотографии',
							url: '/photos'
						},
						{
							title: 'Название альбома',
							url: '/photos/22'
						},
						{
							title: 'Название фотографии#fullsize',
							url: '/photos/22/1#fullsize'
						}
					];
				}
			}
		};
	});

})();