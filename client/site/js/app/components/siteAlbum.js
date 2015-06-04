(function() {

	var siteAlbum = angular.module('siteAlbum', []);

	siteAlbum.directive('siteAlbum', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			var slider = element.find('.album-slider');

			setTimeout(function() {
				slider.find('.album-slider-item').addClass('visible');
			}, 0);

			slider.flexslider({
				animation: 'slide',
				slideshow: false,
				controlNav: false,
				maxItems: 1
			});

			$('.flex-prev').html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 561" version="1.1"><g id="#ffffffff"></g><g id="#242424ff"><path opacity="1.00" d=" M 448.22 0.00 L 454.55 0.00 C 465.99 0.65 477.25 5.45 485.12 13.87 C 494.97 24.14 499.38 38.49 500.00 52.46 L 500.00 508.65 C 499.43 522.55 494.65 536.67 484.75 546.72 C 476.60 555.30 465.07 560.19 453.33 561.00 L 447.54 561.00 C 437.77 560.21 428.27 557.08 419.82 552.13 C 295.19 480.11 170.58 408.06 45.95 336.03 C 35.06 329.46 23.11 324.08 14.32 314.59 C 6.28 306.31 0.95 295.37 0.00 283.82 L 0.00 278.37 C 0.75 266.20 6.50 254.72 15.04 246.15 C 20.88 240.03 28.10 235.50 35.44 231.42 C 163.65 157.34 291.85 83.25 420.06 9.18 C 428.64 4.11 438.28 0.89 448.22 0.00 M 440.65 50.64 C 311.40 125.39 182.14 200.11 52.88 274.85 C 50.20 276.38 47.69 278.33 46.02 280.97 C 47.94 283.07 50.08 284.98 52.59 286.37 C 181.20 360.73 309.79 435.11 438.39 509.49 C 442.68 511.94 446.97 514.86 452.05 515.32 C 453.46 512.44 453.93 509.24 453.88 506.07 C 453.89 356.06 453.87 206.04 453.89 56.03 C 453.95 52.60 453.57 49.12 452.14 45.96 C 447.95 46.50 444.20 48.49 440.65 50.64 Z"/></g></svg>')
			$('.flex-next').html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 561" version="1.1"><g id="#ffffffff"></g><g id="#242424ff"><path opacity="1.00" d=" M 45.54 0.00 L 53.46 0.00 C 63.21 0.81 72.60 4.21 80.99 9.17 C 205.79 81.31 330.61 153.43 455.42 225.56 C 463.12 230.20 471.27 234.17 478.45 239.65 C 490.05 248.47 498.89 261.72 500.00 276.52 L 500.00 283.63 C 498.55 303.05 484.21 318.89 467.65 327.73 C 343.65 399.35 219.67 470.99 95.68 542.61 C 84.42 548.81 73.69 556.65 60.90 559.39 C 46.41 562.89 29.97 560.27 18.52 550.32 C 6.13 540.05 0.60 523.67 0.00 507.99 L 0.00 51.77 C 0.75 39.26 4.57 26.57 12.82 16.92 C 20.81 7.09 32.96 1.00 45.54 0.00 M 47.97 45.59 C 46.37 48.81 46.09 52.44 46.12 55.97 C 46.11 205.30 46.12 354.63 46.12 503.96 C 46.14 507.67 46.21 511.58 48.05 514.92 C 51.33 514.29 54.50 513.13 57.35 511.37 C 186.01 437.01 314.67 362.63 443.34 288.26 C 447.26 286.00 451.55 283.88 454.11 279.97 C 450.73 275.77 445.73 273.55 441.22 270.85 C 313.22 196.84 185.21 122.83 57.21 48.82 C 54.36 47.20 51.27 45.88 47.97 45.59 Z"/></g></svg>')

			scope.imgFullsize = function() {
				if ( !element.hasClass('fullsize') ) {
					element.addClass('fullsize').css({visibility: 'hidden'});
					setTimeout(function() {
						$(window).trigger('resize');
						element.css({visibility: 'visible'});
					}, 100);
					$('.logo, .toggleNav, .breadcrumbs').addClass('fixedAlbum');
				}
				$location.hash('02');
			}

			scope.closeFullsize = function(e) {
				e.preventDefault();

				element.removeClass('fullsize').css({visibility: 'hidden'});
				setTimeout(function() {
					$(window).trigger('resize');
					element.css({visibility: 'visible'});
				}, 100);
				$('.logo, .toggleNav, .breadcrumbs').removeClass('fixedAlbum');
			}
		};
	});

})();