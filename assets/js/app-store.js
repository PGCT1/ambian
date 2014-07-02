
(function(){

	var appSettings = angular.module('app-store',[]);

	appSettings.directive('appStore',function(){

		var directive = ambianDirectiveWithTemplate('app-store');

		directive.controller = function(){

			this.subscriptions = [
				{
					id:3,
					name:'Football (U.S. Soccer)'
				},
				{
					id:4,
					name:'Technology'
				}
			];

		};

		directive.controllerAs = 'AppStoreCtrl';

		return directive;

	});

})();
