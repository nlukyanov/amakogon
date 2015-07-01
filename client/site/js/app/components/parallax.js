(function() {

	var parallax = angular.module('parallax', []);

	parallax.directive('parallax', function($http, $location, $timeout) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			$timeout(function() {
				element.addClass('visible');
			}, 0);

			element.on('click', '.icon-down', function(e) {
				e.preventDefault();

				scope.$emit('nextSlide');
			});

			scope.resetSlide = function (item) {
				item.find('.visible').removeClass('visible');
				item.find('.line-vertical01').css({top: 0, height: 0});
				item.find('.line-vertical02').css({height: 0});
			}

			scope.animateSlide = function() {
				var slide = element.find('.px-slide.active'),
					textBox = slide.find('.px-slide-text'),
					icon1 = slide.find('.icon').first(),
					icon2 = slide.find('.icon').last(),
					lv1 = slide.find('.line-vertical01'),
					lv2 = slide.find('.line-vertical02'),
					lh1 = slide.find('.line-horisontal01'),
					lh2 = slide.find('.line-horisontal02');

				// === Line Vertical 1
				var lv1Height = textBox.position().top - (icon1.position().top + icon1.height()) + parseInt(lv1.css('margin-top'));

				lv1.addClass('visible').css({top: -lv1Height});
				$timeout(function() {
					lv1.height(lv1Height);
				}, 250);

				// === Line Horisontal 1
				$timeout(function() {
					lh1.addClass('visible');
				}, 500);

				// === Text
				$timeout(function() {
					textBox.find('p, a').addClass('visible');
				}, 750);

				// === Line Horisontal 2
				$timeout(function() {
					lh2.addClass('visible');
				}, 1000);

				// === Line Vertical 2
				var lv2Height = icon2.position().top - (textBox.position().top + textBox.outerHeight()) - parseInt(lv2.css('margin-top'));

				lv2.addClass('visible');

				$timeout(function() {
					lv2.height(lv2Height);
				}, 1250);

				// === Icon 2
				$timeout(function() {
					icon2.addClass('visible');
				}, 1500);
			}

			scope.$on('pxScroll', function(i, index) {
				element.find('#px-slide' + index).addClass('active').siblings().removeClass('active');
				scope.resetSlide(element.closest('.page-wrapper').find('#px-slide' + scope.index).siblings());

				// === Animating slides
				if ( element.find('.px-slide.active .line-vertical01').length && !element.find('.px-slide.active .line-vertical01.visible').length  ) {
					scope.animateSlide();
				}
			});
		};
	});

})();