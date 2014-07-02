
(function(){

	var appSettings = angular.module('app-settings',[]);

	appSettings.directive('appSettings',function(){

		var directive = ambianDirectiveWithTemplate('app-settings');

		directive.controller = function(){

			this.subscriptions = [
				{
					id:1,
					name:'World News',
					active:true
				},
				{
					id:2,
					name:'Social & Entertainment',
					active:false
				}
			];

			this.speed = 60;

			this.sources = [
				{
					name:'Corporate Media',
					enabled:true
				},
				{
					name:'Government Media',
					enabled:true
				},
				{
					name:'Social Media',
					enabled:true
				}
			];

		};

		directive.controllerAs = 'AppSettingsCtrl';

		return directive;

	});

})();
