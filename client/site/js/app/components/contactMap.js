(function() {

	var contactMap = angular.module('contactMap', []);

	contactMap.directive('contactMap', function($http, $location, $rootScope) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			scope.marker = {
				position: {
					lat: '49.83968',
					lng: '24.02972'
				},
				info: {
					city: 'Львов',
					phones: ['+38 (099) 111-11-11', '+38 (063) 111-11-11'],
					email: 'email@gmail.com',
					skype: 'skype.name',
					vk: 'vk.address.com'
				}
			}

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
									invert_lightness: true
								},
								{
									lightness: '5'
								},
							]
						},
						{
							featureType: "all",
							elementType: 'labels',
							stylers: [
								{
									visibility: 'off'
								}
							]
						}
					];
					self.args = {
						zoom: 12,
						center: new google.maps.LatLng(0, 0),
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						options: {
							mapTypeControl: false,
							streetViewControl: false,
							panControl: false,
							rotateControl: false,
							zoomControl: false,
							scrollwheel: false,
							draggable: false
						},
						styles: myStyles
					};

					var directionDisplay = new google.maps.DirectionsRenderer();
					directionDisplay.set('directions', null);

					var map = new google.maps.Map($el[0], self.args);

					var infowindow = new google.maps.InfoWindow();

			    	this.add_marker($marker, map, infowindow);

				},

				add_marker: function($marker, map, infowindow) {
					var latlng = new google.maps.LatLng($marker.position.lat, $marker.position.lng),
						markerCont = $marker.info,
						self = this,
						marker = new google.maps.Marker({
							position: latlng,
							map: map,
							icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIzM3B0IiBoZWlnaHQ9IjUwcHQiIHZpZXdCb3g9IjAgMCAzMyA1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGlkPSIjMDAwMDAwZmYiPjwvZz48ZyBpZD0iI2U4ZThlOGZmIj48cGF0aCBmaWxsPSIjZThlOGU4IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxNS4yOSAwLjAwIEwgMTcuNzEgMC4wMCBDIDI1LjQzIDAuNDAgMzIuMDkgNi45MCAzMy4wMCAxNC41MSBMIDMzLjAwIDE5LjA2IEMgMzEuMDQgMjYuMTcgMjcuMDYgMzIuNTIgMjQuMjIgMzkuMjkgQyAyMi4yNSA0Mi45MCAyMS4zOSA0Ny4zOCAxOC4wMCA1MC4wMCBMIDE1LjQwIDUwLjAwIEMgMTQuMDIgNDkuMzEgMTIuOTMgNDguMjEgMTIuMzUgNDYuNzggQyA5LjMxIDQwLjQyIDYuNDUgMzMuOTggMy4zOSAyNy42NCBDIDEuOTEgMjQuNTIgMC4yMSAyMS4zNiAwLjAwIDE3Ljg0IEwgMC4wMCAxNC45NSBDIDAuNzIgNy4xOCA3LjQ0IDAuNDQgMTUuMjkgMC4wMCBNIDMuMDggMjEuOTMgQyA3LjIzIDMwLjU3IDExLjExIDM5LjMzIDE1LjMyIDQ3Ljk0IEMgMTYuNTAgNDcuNzggMTcuOTkgNDguMDAgMTguNDEgNDYuNTYgQyAyMi40MiAzOC40MiAyNS45OCAzMC4wNSAyOS45OCAyMS45MCBDIDMzLjgxIDEzLjEwIDI2LjY0IDIuMTEgMTcuMDQgMi4xMCBDIDcuMDcgMS4zNCAtMS4wMSAxMi44MCAzLjA4IDIxLjkzIFoiIC8+PC9nPjxnIGlkPSIjZTE3MDRhZmYiPjxwYXRoIGZpbGw9IiNlMTcwNGEiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDMuMDggMjEuOTMgQyAtMS4wMSAxMi44MCA3LjA3IDEuMzQgMTcuMDQgMi4xMCBDIDI2LjY0IDIuMTEgMzMuODEgMTMuMTAgMjkuOTggMjEuOTAgQyAyNS45OCAzMC4wNSAyMi40MiAzOC40MiAxOC40MSA0Ni41NiBDIDE3Ljk5IDQ4LjAwIDE2LjUwIDQ3Ljc4IDE1LjMyIDQ3Ljk0IEMgMTEuMTEgMzkuMzMgNy4yMyAzMC41NyAzLjA4IDIxLjkzIE0gMTQuNDcgNi40OCBDIDYuMzggNy43MCAzLjI0IDE5LjI2IDkuNjAgMjQuMzggQyAxNC45MyAzMC4wMyAyNS4zMSAyNi40NCAyNi42MSAxOC45OCBDIDI4LjY0IDExLjk2IDIxLjQ5IDQuNzUgMTQuNDcgNi40OCBaIiAvPjwvZz48ZyBpZD0iI2YwZTZlMmZmIj48cGF0aCBmaWxsPSIjZjBlNmUyIiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxNC40NyA2LjQ4IEMgMjEuNDkgNC43NSAyOC42NCAxMS45NiAyNi42MSAxOC45OCBDIDI1LjMxIDI2LjQ0IDE0LjkzIDMwLjAzIDkuNjAgMjQuMzggQyAzLjI0IDE5LjI2IDYuMzggNy43MCAxNC40NyA2LjQ4IE0gMTQuNDQgOC42NCBDIDguNTggMTAuMDAgNi4yMiAxOC4xMSAxMC41MSAyMi4zNiBDIDE0LjQwIDI2LjkyIDIyLjc0IDI1LjEzIDI0LjM0IDE5LjMyIEMgMjYuNjIgMTMuNDUgMjAuNDcgNi43OCAxNC40NCA4LjY0IFoiIC8+PC9nPjwvc3ZnPg=='
						});

					if ( markerCont ) {
						var infoContent = 	'<h2 class="contact-info-title">' + $marker.info.city + '</h2>' +
											'<dl class="contact-info">' +
												'<dt>тел.</dt>' +
												'<dd>' + $marker.info.phones[0] + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>тел.</dt>' +
												'<dd>' + $marker.info.phones[1] + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>email</dt>' +
												'<dd>' + $marker.info.email + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>skype</dt>' +
												'<dd>' + $marker.info.skype + '</dd>' +
											'</dl>' +
											'<dl class="contact-info">' +
												'<dt>vk</dt>' +
												'<dd>' + $marker.info.vk + '</dd>' +
											'</dl>';

						infowindow.setContent(infoContent);
						infowindow.open(map, marker);
						this.center_map(map, $marker);
						$(window).on('resize', function() {
							self.center_map(map, $marker);
						});
					}
				},

				center_map: function(map, $marker) {
					var bounds = new google.maps.LatLngBounds();
						latlng = new google.maps.LatLng($marker.position.lat, $marker.position.lng);

					bounds.extend(latlng);
				    map.setZoom(this.args.zoom);
					map.setCenter(bounds.getCenter());
				}
			}

			MAPS.render_map(element, scope.marker);
		};
	});

})();