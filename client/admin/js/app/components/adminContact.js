(function() {

	var adminContact = angular.module('adminContact', []);

	adminContact.directive('adminContact', function($http, $location, $timeout, pageTitle, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			pageTitle.setTitle('Контакты');

			socket.emit('load contact');
			socket.on('contact loaded', function(data) {
				scope.contact = data;
				$timeout(function() {
					scope.contactUpdated = false;
					$('.contact-form').find('.item-overlay').removeClass('saving');
				}, 500);
			});

			socket.emit('load map');
			socket.on('map loaded', function(data) {
				scope.marker = data[0];
				scope.mapUpdated = false;

				var MAPS = {
					render_map: function( $el, $marker ) {
						var self = this;
						var myStyles = [
							{
								featureType: "poi",
								elementType: "labels",
								stylers: [
									{
										visibility: "off"
									}
								]
							},
							{
								featureType: "road",
								elementType: "labels",
								stylers: [
									{
										visibility: "off"
									}
								]
							},
							{
								featureType: "water",
								elementType: "labels",
								stylers: [
									{
										visibility: "off"
									}
								]
							},
							{
								featureType: "transit",
								elementType: "labels",
								stylers: [
									{
										visibility: "off"
									}
								]
							},
							{
								featureType: "all",
								elementType: 'all',
								stylers: [
									{
										saturation: '-100'
									},
									{
										lightness: '5'
									},
								]
							},
						];
						self.args = {
							zoom: 10,
							center: new google.maps.LatLng(0, 0),
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							options: {
								mapTypeControl: false,
								streetViewControl: false,
								panControl: false,
								rotateControl: false,
								zoomControl: false,
								scrollwheel: false,
								draggable: false,
								disableDoubleClickZoom: true
							},
							styles: myStyles
						};

						var directionDisplay = new google.maps.DirectionsRenderer();
						directionDisplay.set('directions', null);

						var map = new google.maps.Map($el[0], self.args);

						if ( $marker ) {
					    	this.add_marker($marker, map);
						}
	
						// === Search box
						var input = (
							document.getElementById('mapInput')
						);
						map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

						var searchBox = new google.maps.places.SearchBox(
							(input)
						);

						google.maps.event.addListener(searchBox, 'places_changed', function() {
							var marker = new google.maps.Marker({
									map: map,
									position: new google.maps.LatLng($marker.lat, $marker.lng)
								}),
								places = searchBox.getPlaces();

							if ( places.length == 0 ) {
								return;
							}
							marker.setMap(null);

							marker = [];
							var bounds = new google.maps.LatLngBounds();
							for (var i = 0, place; place = places[i]; i++) {
								var image = {
									url: place.icon,
									size: new google.maps.Size(71, 71),
									origin: new google.maps.Point(0, 0),
									anchor: new google.maps.Point(17, 34),
									scaledSize: new google.maps.Size(25, 25)
								};

								// Create a marker for each place.
								var newMarker = new google.maps.Marker({
									map: map,
									icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIzM3B0IiBoZWlnaHQ9IjUwcHQiIHZpZXdCb3g9IjAgMCAzMyA1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGlkPSIjMDAwMDAwZmYiPjwvZz48ZyBpZD0iI2U4ZThlOGZmIj48cGF0aCBmaWxsPSIjZThlOGU4IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxNC43MSAwLjAwIEwgMTcuNzMgMC4wMCBDIDI1LjQ0IDAuNDAgMzIuMTEgNi45MiAzMy4wMCAxNC41MyBMIDMzLjAwIDE5LjA1IEMgMzEuMDYgMjYuMTYgMjcuMDYgMzIuNDkgMjQuMjMgMzkuMjYgQyAyMi4yMiA0Mi44NiAyMS40MyA0Ny40MyAxNy45NyA1MC4wMCBMIDE1LjQzIDUwLjAwIEMgMTQuMDIgNDkuMzcgMTIuOTYgNDguMjMgMTIuMzcgNDYuODIgQyA5LjExIDQwLjAwIDYuMDQgMzMuMDggMi43NCAyNi4yOCBDIDEuNDUgMjMuNjIgMC4xNyAyMC44NiAwLjAwIDE3Ljg2IEwgMC4wMCAxNC45NiBDIDAuNjkgNy4zNiA3LjEyIDAuODEgMTQuNzEgMC4wMCBNIDYuMzUgNi4zMiBDIDEuNzEgMTAuODAgMC43MiAxOC40MSAzLjk3IDIzLjk2IEMgNy45OCAzMS43NSAxMS4wNiA0MC4wMSAxNS4zNiA0Ny42NSBDIDE1LjkzIDQ3Ljc0IDE3LjA5IDQ3LjkyIDE3LjY2IDQ4LjAxIEMgMjEuODkgMzkuOTQgMjUuMjUgMzEuNDUgMjkuMzggMjMuMzIgQyAzMi43OCAxNy4wMiAzMC41OCA4LjI2IDI0LjQ0IDQuNDggQyAxOC45OCAwLjY2IDEwLjk0IDEuNTIgNi4zNSA2LjMyIFoiIC8+PHBhdGggZmlsbD0iI2U4ZThlOCIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTQuNDAgNi41NCBDIDIxLjM4IDQuNzcgMjguNTcgMTEuODcgMjYuNTggMTguOTAgQyAyNS4zNSAyNi4zNyAxNC45NiAzMC4wNCA5LjYzIDI0LjM2IEMgMy4zNCAxOS4yOSA2LjM5IDcuODAgMTQuNDAgNi41NCBNIDE0LjQ1IDguNjQgQyA4Ljg2IDkuOTUgNi4zMyAxNy40NiAxMC4wNyAyMS44NSBDIDEzLjY5IDI2LjkwIDIyLjUzIDI1LjQ2IDI0LjI4IDE5LjQ3IEMgMjYuNzIgMTMuNTggMjAuNTMgNi43NiAxNC40NSA4LjY0IFoiIC8+PC9nPjxnIGlkPSIjZmY1ZTAwZmYiPjxwYXRoIGZpbGw9IiNmZjVlMDAiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDYuMzUgNi4zMiBDIDEwLjk0IDEuNTIgMTguOTggMC42NiAyNC40NCA0LjQ4IEMgMzAuNTggOC4yNiAzMi43OCAxNy4wMiAyOS4zOCAyMy4zMiBDIDI1LjI1IDMxLjQ1IDIxLjg5IDM5Ljk0IDE3LjY2IDQ4LjAxIEMgMTcuMDkgNDcuOTIgMTUuOTMgNDcuNzQgMTUuMzYgNDcuNjUgQyAxMS4wNiA0MC4wMSA3Ljk4IDMxLjc1IDMuOTcgMjMuOTYgQyAwLjcyIDE4LjQxIDEuNzEgMTAuODAgNi4zNSA2LjMyIE0gMTQuNDAgNi41NCBDIDYuMzkgNy44MCAzLjM0IDE5LjI5IDkuNjMgMjQuMzYgQyAxNC45NiAzMC4wNCAyNS4zNSAyNi4zNyAyNi41OCAxOC45MCBDIDI4LjU3IDExLjg3IDIxLjM4IDQuNzcgMTQuNDAgNi41NCBaIiAvPjwvZz48L3N2Zz4=',
									title: place.name,
									position: place.geometry.location
								});
								scope.marker.address = place.name;
								scope.marker.lat = place.geometry.location.A;
								scope.marker.lng = place.geometry.location.F;

								scope.mapUpdated = true;
								scope.$apply();

								marker.push(newMarker);

								bounds.extend(place.geometry.location);
							}

						    map.setZoom(self.args.zoom);
							map.setCenter(bounds.getCenter());
							map.panBy(0, -100);
						});
					},

					add_marker: function($marker, map) {
						var latlng = new google.maps.LatLng($marker.lat, $marker.lng),
							markerCont = $marker.info,
							self = this,
							marker = new google.maps.Marker({
								position: latlng,
								map: map,
								icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIzM3B0IiBoZWlnaHQ9IjUwcHQiIHZpZXdCb3g9IjAgMCAzMyA1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGlkPSIjMDAwMDAwZmYiPjwvZz48ZyBpZD0iI2U4ZThlOGZmIj48cGF0aCBmaWxsPSIjZThlOGU4IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxNC43MSAwLjAwIEwgMTcuNzMgMC4wMCBDIDI1LjQ0IDAuNDAgMzIuMTEgNi45MiAzMy4wMCAxNC41MyBMIDMzLjAwIDE5LjA1IEMgMzEuMDYgMjYuMTYgMjcuMDYgMzIuNDkgMjQuMjMgMzkuMjYgQyAyMi4yMiA0Mi44NiAyMS40MyA0Ny40MyAxNy45NyA1MC4wMCBMIDE1LjQzIDUwLjAwIEMgMTQuMDIgNDkuMzcgMTIuOTYgNDguMjMgMTIuMzcgNDYuODIgQyA5LjExIDQwLjAwIDYuMDQgMzMuMDggMi43NCAyNi4yOCBDIDEuNDUgMjMuNjIgMC4xNyAyMC44NiAwLjAwIDE3Ljg2IEwgMC4wMCAxNC45NiBDIDAuNjkgNy4zNiA3LjEyIDAuODEgMTQuNzEgMC4wMCBNIDYuMzUgNi4zMiBDIDEuNzEgMTAuODAgMC43MiAxOC40MSAzLjk3IDIzLjk2IEMgNy45OCAzMS43NSAxMS4wNiA0MC4wMSAxNS4zNiA0Ny42NSBDIDE1LjkzIDQ3Ljc0IDE3LjA5IDQ3LjkyIDE3LjY2IDQ4LjAxIEMgMjEuODkgMzkuOTQgMjUuMjUgMzEuNDUgMjkuMzggMjMuMzIgQyAzMi43OCAxNy4wMiAzMC41OCA4LjI2IDI0LjQ0IDQuNDggQyAxOC45OCAwLjY2IDEwLjk0IDEuNTIgNi4zNSA2LjMyIFoiIC8+PHBhdGggZmlsbD0iI2U4ZThlOCIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTQuNDAgNi41NCBDIDIxLjM4IDQuNzcgMjguNTcgMTEuODcgMjYuNTggMTguOTAgQyAyNS4zNSAyNi4zNyAxNC45NiAzMC4wNCA5LjYzIDI0LjM2IEMgMy4zNCAxOS4yOSA2LjM5IDcuODAgMTQuNDAgNi41NCBNIDE0LjQ1IDguNjQgQyA4Ljg2IDkuOTUgNi4zMyAxNy40NiAxMC4wNyAyMS44NSBDIDEzLjY5IDI2LjkwIDIyLjUzIDI1LjQ2IDI0LjI4IDE5LjQ3IEMgMjYuNzIgMTMuNTggMjAuNTMgNi43NiAxNC40NSA4LjY0IFoiIC8+PC9nPjxnIGlkPSIjZmY1ZTAwZmYiPjxwYXRoIGZpbGw9IiNmZjVlMDAiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDYuMzUgNi4zMiBDIDEwLjk0IDEuNTIgMTguOTggMC42NiAyNC40NCA0LjQ4IEMgMzAuNTggOC4yNiAzMi43OCAxNy4wMiAyOS4zOCAyMy4zMiBDIDI1LjI1IDMxLjQ1IDIxLjg5IDM5Ljk0IDE3LjY2IDQ4LjAxIEMgMTcuMDkgNDcuOTIgMTUuOTMgNDcuNzQgMTUuMzYgNDcuNjUgQyAxMS4wNiA0MC4wMSA3Ljk4IDMxLjc1IDMuOTcgMjMuOTYgQyAwLjcyIDE4LjQxIDEuNzEgMTAuODAgNi4zNSA2LjMyIE0gMTQuNDAgNi41NCBDIDYuMzkgNy44MCAzLjM0IDE5LjI5IDkuNjMgMjQuMzYgQyAxNC45NiAzMC4wNCAyNS4zNSAyNi4zNyAyNi41OCAxOC45MCBDIDI4LjU3IDExLjg3IDIxLjM4IDQuNzcgMTQuNDAgNi41NCBaIiAvPjwvZz48L3N2Zz4='
							});

						this.center_map(map, $marker);
					},

					center_map: function(map, $marker) {
						var bounds = new google.maps.LatLngBounds();
							latlng = new google.maps.LatLng($marker.lat, $marker.lng);

						bounds.extend(latlng);
					    map.setZoom(this.args.zoom);
						map.setCenter(bounds.getCenter());
						map.panBy(0, -100);
						$timeout(function() {
							$('#mapInput').trigger('focus');
						}, 500);
					}
				}
				
				MAPS.render_map(element.find('.map'), scope.marker);
			});

			scope.saveMap = function(e) {
				e.preventDefault();

				if ( scope.mapUpdated ) {
					socket.emit('update map', scope.marker);
					$('.map-holder').find('.item-overlay').addClass('saving');
				}
			};

			socket.on('map updated', function() {
				$timeout(function() {
					$('.map-holder').find('.item-overlay').removeClass('saving');
					scope.mapUpdated = false;
					$('#mapInput').val('').trigger('focus');
				}, 500);
			});

			scope.updateContact = function(e) {
				e.preventDefault();
				if ( scope.contactUpdated ) {
					socket.emit('update partially contact', scope.contact);
					$('.contact-form').find('.item-overlay').addClass('saving');
				}
			};

			scope.canAdd = false;

			scope.addContact = function(e) {
				e.preventDefault();
			};

			scope.$on('$locationChangeStart', function(e) {
				if ( scope.mapUpdated ) {
					if ( !confirm('Некоторые изменения не были сохранены. Действительно обновить эту страницу?') ) {
						e.preventDefault();
					}
				}
			});
			window.onbeforeunload = function (e) {
				if ( scope.mapUpdated ) {
					return 'Некоторые изменения не были сохранены.';
				}
			}
		}
	});

})();