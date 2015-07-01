(function() {

	var contactMap = angular.module('contactMap', []);

	contactMap.directive('contactMap', function($http, $location, $rootScope, pageTitle, $timeout) {
		return {
			restrict: 'C',
			link: link
		};
		function link(scope, element, attrs) {
			pageTitle.setTitle('Контакты');

			socket.emit('load map');
			socket.on('map loaded', function(data) {
				scope.marker = data[0];
				socket.emit('load contact');
				socket.on('contact loaded', function(data) {
					scope.contact = data[0];

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
									draggable: false,
									disableDoubleClickZoom: true
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
							var latlng = new google.maps.LatLng($marker.lat, $marker.lng),
								markerCont = scope.contact,
								self = this,
								marker = new google.maps.Marker({
									position: latlng,
									map: map,
									icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiID8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIzM3B0IiBoZWlnaHQ9IjUwcHQiIHZpZXdCb3g9IjAgMCAzMyA1MCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGlkPSIjMDAwMDAwZmYiPjwvZz48ZyBpZD0iI2U4ZThlOGZmIj48cGF0aCBmaWxsPSIjZThlOGU4IiBvcGFjaXR5PSIxLjAwIiBkPSIgTSAxNC43MSAwLjAwIEwgMTcuNzMgMC4wMCBDIDI1LjQ0IDAuNDAgMzIuMTEgNi45MiAzMy4wMCAxNC41MyBMIDMzLjAwIDE5LjA1IEMgMzEuMDYgMjYuMTYgMjcuMDYgMzIuNDkgMjQuMjMgMzkuMjYgQyAyMi4yMiA0Mi44NiAyMS40MyA0Ny40MyAxNy45NyA1MC4wMCBMIDE1LjQzIDUwLjAwIEMgMTQuMDIgNDkuMzcgMTIuOTYgNDguMjMgMTIuMzcgNDYuODIgQyA5LjExIDQwLjAwIDYuMDQgMzMuMDggMi43NCAyNi4yOCBDIDEuNDUgMjMuNjIgMC4xNyAyMC44NiAwLjAwIDE3Ljg2IEwgMC4wMCAxNC45NiBDIDAuNjkgNy4zNiA3LjEyIDAuODEgMTQuNzEgMC4wMCBNIDYuMzUgNi4zMiBDIDEuNzEgMTAuODAgMC43MiAxOC40MSAzLjk3IDIzLjk2IEMgNy45OCAzMS43NSAxMS4wNiA0MC4wMSAxNS4zNiA0Ny42NSBDIDE1LjkzIDQ3Ljc0IDE3LjA5IDQ3LjkyIDE3LjY2IDQ4LjAxIEMgMjEuODkgMzkuOTQgMjUuMjUgMzEuNDUgMjkuMzggMjMuMzIgQyAzMi43OCAxNy4wMiAzMC41OCA4LjI2IDI0LjQ0IDQuNDggQyAxOC45OCAwLjY2IDEwLjk0IDEuNTIgNi4zNSA2LjMyIFoiIC8+PHBhdGggZmlsbD0iI2U4ZThlOCIgb3BhY2l0eT0iMS4wMCIgZD0iIE0gMTQuNDAgNi41NCBDIDIxLjM4IDQuNzcgMjguNTcgMTEuODcgMjYuNTggMTguOTAgQyAyNS4zNSAyNi4zNyAxNC45NiAzMC4wNCA5LjYzIDI0LjM2IEMgMy4zNCAxOS4yOSA2LjM5IDcuODAgMTQuNDAgNi41NCBNIDE0LjQ1IDguNjQgQyA4Ljg2IDkuOTUgNi4zMyAxNy40NiAxMC4wNyAyMS44NSBDIDEzLjY5IDI2LjkwIDIyLjUzIDI1LjQ2IDI0LjI4IDE5LjQ3IEMgMjYuNzIgMTMuNTggMjAuNTMgNi43NiAxNC40NSA4LjY0IFoiIC8+PC9nPjxnIGlkPSIjZmY1ZTAwZmYiPjxwYXRoIGZpbGw9IiNmZjVlMDAiIG9wYWNpdHk9IjEuMDAiIGQ9IiBNIDYuMzUgNi4zMiBDIDEwLjk0IDEuNTIgMTguOTggMC42NiAyNC40NCA0LjQ4IEMgMzAuNTggOC4yNiAzMi43OCAxNy4wMiAyOS4zOCAyMy4zMiBDIDI1LjI1IDMxLjQ1IDIxLjg5IDM5Ljk0IDE3LjY2IDQ4LjAxIEMgMTcuMDkgNDcuOTIgMTUuOTMgNDcuNzQgMTUuMzYgNDcuNjUgQyAxMS4wNiA0MC4wMSA3Ljk4IDMxLjc1IDMuOTcgMjMuOTYgQyAwLjcyIDE4LjQxIDEuNzEgMTAuODAgNi4zNSA2LjMyIE0gMTQuNDAgNi41NCBDIDYuMzkgNy44MCAzLjM0IDE5LjI5IDkuNjMgMjQuMzYgQyAxNC45NiAzMC4wNCAyNS4zNSAyNi4zNyAyNi41OCAxOC45MCBDIDI4LjU3IDExLjg3IDIxLjM4IDQuNzcgMTQuNDAgNi41NCBaIiAvPjwvZz48L3N2Zz4='
								});

							var infoContent = 	'<h2 class="contact-info-title">' + scope.marker.address + '</h2>';

							if ( markerCont.phones.length ) {
								for ( var i = 0; i < markerCont.phones.length; i ++ ) {
									infoContent += 	'<dl class="contact-info">' +
														'<dt>тел.:</dt>' +
														'<dd>' + markerCont.phones[i].value + '</dd>' +
													'</dl>';
								}
							}
							if ( markerCont.emails.length ) {
								for ( var i = 0; i < markerCont.emails.length; i ++ ) {
									infoContent += 	'<dl class="contact-info">' +
														'<dt>email:</dt>' +
														'<dd><a href="mailto:' + markerCont.emails[i].value + '">' + markerCont.emails[i].value + '</a></dd>' +
													'</dl>';
								}
							}
							if ( markerCont.skype.length ) {
								for ( var i = 0; i < markerCont.skype.length; i ++ ) {
									infoContent += 	'<dl class="contact-info">' +
														'<dt>skype:</dt>' +
														'<dd>' + markerCont.skype[i].value + '</dd>' +
													'</dl>';
								}
							}

							infowindow.setContent(infoContent);
							this.center_map(map, $marker);
							infowindow.open(map, marker);
						},

						center_map: function(map, $marker) {
							var bounds = new google.maps.LatLngBounds();
								latlng = new google.maps.LatLng($marker.lat, $marker.lng);

							bounds.extend(latlng);
						    map.setZoom(this.args.zoom);
							map.setCenter(bounds.getCenter());
							map.panBy(200, -100);
						}
					}

					MAPS.render_map(element, scope.marker);
				});
			});
		};
	});

})();