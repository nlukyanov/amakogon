(function() {
  
	var adminItems = {};

	adminItems.main = angular.module('adminItems.main', ['ngRoute', 'router']);

	//admin.factories = angular.module('admin.factories', ['stSettingsFactory', 'stIconsFactory', 'stAdminNavFactory', 'stPagesListFactory', 'stContentTypeFactory']);

	//admin.widgets = angular.module('admin.widgets', ['widgetItem', 'widgetBtnAlign', 'widgetBtnFontWeight', 'widgetBtnFontSize', 'widgetBtnColor', 'widgetBtnViewHeading', 'widgetBtnWidth', 'widgetBtnHeight', 'widgetBtnViewImage', 'widgetBtnVisibility', 'widgetBtnUpload', 'widgetBtnListSettings', 'widgetBtnAddListItem', 'widgetBtnOverflow', 'widgetBtnBannerSettings', 'widgetBtnPosition', 'widgetBtnBannerHeading', 'widgetBtnBannerText', 'widgetBtnBannerLink', 'widgetBtnLinkType', 'widgetBtnUrl', 'widgetBtnPositionVertical', 'widgetBtnPositionHorisontal', 'widgetBtnFeatureSettings', 'addGridItem']);

	adminItems.elements = angular.module('adminItems.elements', ['adminLogo', 'adminNav', 'maxlength', 'modal', 'tagsList']);

	adminItems.components = angular.module('adminItems.components', ['dashboardListItem', 'adminPhotos', 'adminAlbum', 'tagsListPage']);

	var admin = angular.module('admin', ['adminItems.main', 'adminItems.components', 'adminItems.elements'/*, 'admin.factories', 'admin.widgets'*/]);

	$(window).on('load', function() {
		$('body').addClass('admin');
	});
})();