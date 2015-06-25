(function() {

	var sitePhotos = angular.module('sitePhotos', []);

	sitePhotos.directive('sitePhotos', function($http, $location, $rootScope, $timeout, pageTitle) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			pageTitle.setTitle('Фотографии');
			socket.emit('load photos');
			socket.off('photos loaded').on('photos loaded', function(data) {
				var published = false;
				for ( var i in data ) {
					if ( data[i].published ) {
						published = true;
					}
				}
				if ( !published ) {
					$location.path('/404');
				}
				scope.photos = data;

				scope.$apply();
				function textHeight() {
					var item = element.find('li'),
						photo = item.find('.photo-holder'),
						text = item.find('.photo-info-holder');

					$timeout(function() {
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
					}, 100);
				};

				function showPhoto() {
					var viewport = $(window).scrollTop() + $(window).height(),
						item = element.find('li');

					item.each(function() {
						if ( viewport >= $(this).offset().top + $(this).height() / 2 ) {
							$(this).addClass('visible');
						}
						else {
							$(this).removeClass('visible');
						}
					});
				};

				if ( $(window).width() > 1024 ) {
					textHeight();
					showPhoto();
				}
				$(window).on('resize', function() {
					if ( $(window).width() > 1024 ) {
						textHeight();
						showPhoto();
					}
				});
				$(window).on('scroll', function() {
					if ( $(window).width() > 1024 ) {
						showPhoto();
					}
				});
				socket.on('album published', function(data) {
					if ( !data.published ) {
						for ( var i in scope.photos ) {
							if ( scope.photos[i].title == data.title ) {
								scope.photos.splice(scope.photos.indexOf(scope.photos[i]), 1);
								scope.$apply();
							}
						}
					}
					else {
						scope.photos.push(data);
						scope.$apply();
						textHeight();
						showPhoto();
					}
				});
			});
		};
	});

})();