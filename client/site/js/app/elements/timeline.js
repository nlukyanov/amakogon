(function() {

	var timeline = angular.module('timeline', []);

	timeline.directive('timeline', function($http, $location, $filter) {
		return {
			restrict: 'A',
			link: link,
			templateUrl: '../client/site/html/elements/timeline.html',
			scope: {
				currentTime: "=timeline"
			}
		};
		function link(scope, element, attrs) {
			scope.timeline = [
				{
					"position": "Фриланс",
					"start": {
						"month": "9",
						"year": "2015"
					},
					"end": false,
					"desc": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				},
				{
					"position": "Фриланс 2",
					"start": {
						"month": "9",
						"year": "2014"
					},
					"end": {
						"month": "10",
						"year": "2015"
					},
					"desc": "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				},
				{
					"position": "Фриланс 3",
					"start": {
						"month": "5",
						"year": "2013"
					},
					"end": {
						"month": "11",
						"year": "2015"
					},
					"desc": "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				},
				{
					"position": "Фриланс 4",
					"start": {
						"month": "5",
						"year": "2012"
					},
					"end": {
						"month": "9",
						"year": "2013"
					},
					"desc": "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				},
				{
					"position": "Фриланс 5",
					"start": {
						"month": "4",
						"year": "2011"
					},
					"end": {
						"month": "10",
						"year": "2012"
					},
					"desc": "5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				},
				{
					"position": "Фриланс 6",
					"start": {
						"month": false,
						"year": "2009"
					},
					"end": {
						"month": false,
						"year": "2011"
					},
					"desc": "6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque metus est, finibus vitae risus ut, mattis facilisis justo. Pellentesque gravida ex dignissim nunc suscipit, ac vehicula ipsum ultricies."
				}
			];
			var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

			scope.currentDate = {
				'month': $filter('date')(new Date(), 'M'),
				'year': $filter('date')(new Date(), 'yyyy')
			}
			scope.minYear = parseInt(scope.timeline[scope.timeline.length - 1].start.year);
			scope.maxYear = parseInt(scope.timeline[0].end.year) + 1 || parseInt(scope.currentDate.year) + 1;
			scope.yearRange = scope.maxYear - scope.minYear;

			var yLine = element.find('.timeline-years'),
				mLine = element.find('.timeline-months'),
				lLine = element.find('.timeline-labels'),
				dLine = element.find('.timeline-desc'),
				rLine = element.find('.timeline-range'),
				yLineHTML = '',
				mLineHTML = '',
				lLineHTML = '',
				prev = element.find('.timeline-prev'),
				next = element.find('.timeline-next');

			for ( var y = scope.maxYear; y >= scope.minYear; y -- ) {
				if ( y == scope.maxYear ) {
					yLineHTML += '<div class="year" year-id="' + y + '">Сейчас</div>';
				}
				else {
					yLineHTML += '<div class="year" year-id="' + y + '">' + y + '</div>';
				}

				if ( y <= scope.currentDate.year ) {
					mLineHTML += '<div class="months-holder" year-id="' + y + '">';
					for ( var m = 11; m >= 0; m -- ) {
						mLineHTML += '<div class="month" month-id="' + (m + 1) + '">' + months[m] + '</div>';
					}
					mLineHTML += '</div>';
				}
			}

			for ( var l = 0; l < scope.timeline.length; l ++ ) {
				lLineHTML += '<div class="label" label-id="' + l + '">' + scope.timeline[l].position + '</div>';
			}

			yLine.html(yLineHTML);
			mLine.html(mLineHTML);
			lLine.html(lLineHTML);

			var year = yLine.find('.year'),
				month = mLine.find('.month'),
				label = lLine.find('.label');

			var isAnimated = false;

			$(window).on('resize', function() {
				scope.newTime();
			});
			scope.newTime = function() {
				month.removeClass('visible');
				element.find('.start-point').removeClass('start-point');
				element.find('.end-point').removeClass('end-point');
				element.find('.range-year').removeClass('range-year');
				label.removeClass('active');
				$(label[scope.currentTime]).addClass('active');
				dLine.html(scope.timeline[scope.currentTime].desc);

				if ( $(window).width() > 750 ) {
					var viewportMin = parseInt(scope.timeline[scope.currentTime].start.year),
						viewportMax = parseInt(scope.timeline[scope.currentTime].end.year) + 1 || parseInt(scope.currentDate.year) + 1;

					if ( viewportMax - viewportMin == 0 ) {
						viewportMax ++;
					}
					
					var viewport = viewportMax - viewportMin,
						viewportMMin = scope.timeline[scope.currentTime].start.month,
						viewportMMax = scope.timeline[scope.currentTime].end.month;

					year.each(function() {
						var $this = $(this),
							indent = - yLine.width() / viewport * (scope.maxYear - viewportMax) + (yLine.width() / viewport * $this.index() - $this.outerWidth() / 2);

						if ( indent + $this.outerWidth() / 2 == 0 ) {
							$this.addClass('end-point');
						}
						if ( indent + $this.outerWidth() / 2 == yLine.width() ) {
							$this.addClass('start-point');
						}

						$this.css({left: indent});
					});

					if ( viewportMMax ) {
						mLine.find('.months-holder').each(function() {
							if ( $(this).attr('year-id') == viewportMax - 1 ) {
								$(this).find('.month').each(function() {
									if ( $(this).attr('month-id') == viewportMMax ) {
										var currentMaxMonth = $(this);

										element.find('.year.end-point').removeClass('end-point');
										
										currentMaxMonth.css({left: yLine.width() / (viewport + 1) / 12 * (12 - viewportMMax) - currentMaxMonth.outerWidth() / 2 + 21}).addClass('end-point');
										setTimeout(function() {
											currentMaxMonth.addClass('visible');
										}, 750);
									}
								});
							}
						});
					}
					if ( viewportMMin ) {
						mLine.find('.months-holder').each(function() {
							if ( $(this).attr('year-id') == viewportMin ) {
								$(this).find('.month').each(function() {
									if ( $(this).attr('month-id') == viewportMMin ) {
										var currentMinMonth = $(this);

										element.find('.year.start-point').removeClass('start-point');
										
										currentMinMonth.css({right: yLine.width() / viewport / 12 * viewportMMin - currentMinMonth.outerWidth() / 2 - 21}).addClass('start-point');
										setTimeout(function() {
											currentMinMonth.addClass('visible');
										}, 500);
									}
								});
							}
						});
					}
					rLine.width(0);
					setTimeout(function() {
						var rangeLeft = element.find('.end-point').position().left + element.find('.end-point').outerWidth() / 2,
							rangeRight = yLine.width() - (element.find('.start-point').position().left + element.find('.start-point').outerWidth() / 2);

						rLine
							.css({right: rangeRight})
							.animate({width: element.find('.start-point').position().left + element.find('.start-point').outerWidth() / 2 - rangeLeft}, 250, function() {
								isAnimated = false;
							});
						year.each(function() {
							var $this = $(this);

							if ( $this.position().left > rangeLeft && $this.position().left + $this.outerWidth() < element.find('.start-point').position().left ) {
								$this.addClass('range-year');
							}
						});
					}, 500);
				}
				else {
					isAnimated = false;
				}
			}

			scope.newTime();

			scope.prevClick = function(e) {
				e.preventDefault();

				if ( !isAnimated ) {
					isAnimated = true;
					if ( scope.currentTime > 0 ) {
						scope.currentTime --;
					}
					else {
						scope.currentTime = label.length - 1;
					}
					scope.newTime();
				}
			}
			scope.nextClick = function(e) {
				e.preventDefault();

				if ( !isAnimated ) {
					isAnimated = true;
					if ( scope.currentTime < label.length - 1 ) {
						scope.currentTime ++;
					}
					else {
						scope.currentTime = 0;
					}
					scope.newTime();
				}
			}
		};
	});

})();