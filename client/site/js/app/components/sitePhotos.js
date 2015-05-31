(function() {

	var sitePhotos = angular.module('sitePhotos', []);

	sitePhotos.directive('sitePhotos', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var item = element.find('li'),
				photo = item.find('.photo-holder'),
				text = item.find('.photo-info-holder');

			function textHeight() {
				if ( photo.height() > text.height() ) {
					photo.css({marginTop: 0});
					text.css({marginTop: (photo.height() - text.height()) / 2});
				}
				else if ( photo.height() < text.height() ) {
					text.css({marginTop: 0});
					photo.css({marginTop: (text.height() - photo.height()) / 2});
				}
				else {
					text.css({marginTop: 0});
					photo.css({marginTop: 0});
				}
			};

			function showPhoto() {
				var viewport = $(window).scrollTop() + $(window).height();

				item.each(function() {
					if ( viewport >= $(this).offset().top + $(this).height() / 2 ) {
						$(this).addClass('visible');
					}
					else {
						$(this).removeClass('visible');
					}
				});
			};

			if ( $(window).width() > 1366 ) {
				textHeight();
				showPhoto();
			}
			$(window).on('load resize', function() {
				if ( $(window).width() > 1366 ) {
					textHeight();
					showPhoto();
				}
			});
			$(window).on('scroll', function() {
				if ( $(window).width() > 1366 ) {
					showPhoto();
				}
			});
		};
	});

})();