(function() {

	var siteSocial = angular.module('siteSocial', []);

	siteSocial.directive('siteSocial', function($http, $location) {
		return {
			restrict: 'E',
			link: link,
			templateUrl: '../client/site/html/elements/site-social.html',
			scope: {
				url: '=socialUrl',
				img: '=socialImg',
				title: '=socialTitle',
				desc: '=socialDesc'
			}
		};
		function link(scope, element, attrs) {
			if ( $location.$$path == '/' ) {
				element.find('.social-media').addClass('home-social');
			}

			scope.url_s = $location.absUrl().substr(0, $location.absUrl().indexOf('#')) + scope.url;

			if ( $location.hash() ) {
				scope.img_s = $location.absUrl().substr(0, $location.absUrl().indexOf('#')) + '/../../' + scope.img;
			}
			else {
				scope.img_s = $location.absUrl() + '/../../' + scope.img;
			}

			scope.desc_s = scope.title + '. ' + scope.desc || scope.desc || 'Anastasia Makogon';

			// === Vkontakte
			if ( scope.title && scope.desc ) {
				scope.vk = 'http://vk.com/share.php?url=' + scope.url_s + '&title=' + scope.title + '&description=' + scope.desc + '&image=' + scope.img_s;
			}
			else if ( scope.title && !scope.desc ) {
				scope.vk = 'http://vk.com/share.php?url=' + scope.url_s + '&title=' + scope.title + '&image=' + scope.img_s;
			}
			else if ( !scope.title && scope.desc ) {
				scope.vk = 'http://vk.com/share.php?url=' + scope.url_s + '&description=' + scope.desc + '&image=' + scope.img_s;
			}
			else {
				scope.vk = 'http://vk.com/share.php?url=' + scope.url_s + '&image=' + scope.img_s;
			}

			// === Facebook
			if ( scope.title && scope.desc ) {
				scope.facebook = 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=page&name=' + scope.title + '&caption=' + scope.desc + '&link=' + scope.url_s + '&redirect_uri=http://www.facebook.com&picture=' + scope.img_s;
			}
			else if ( scope.title && !scope.desc ) {
				scope.facebook = 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=page&name=' + scope.title + '&link=' + scope.url_s + '&redirect_uri=http://www.facebook.com&picture=' + scope.img_s;
			}
			else if ( !scope.title && scope.desc ) {
				scope.facebook = 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=page&caption=' + scope.desc + '&link=' + scope.url_s + '&redirect_uri=http://www.facebook.com&picture=' + scope.img_s;
			}
			else {
				scope.facebook = 'https://www.facebook.com/dialog/feed?app_id=145634995501895&display=page&link=' + scope.url_s + '&redirect_uri=http://www.facebook.com&picture=' + scope.img_s;
			}

			// === Pinterest
			scope.pinterest = 'http://pinterest.com/pin/create/button/?url=' + scope.url_s + '&media=' + scope.img_s + '&description=' + scope.desc_s;
		};
	});

})();