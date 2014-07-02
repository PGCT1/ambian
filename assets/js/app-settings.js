
(function(){

	var appSettings = angular.module('app-settings',[]);

	appSettings.directive('appSettings',function(){

		var directive = ambianDirectiveWithTemplate('app-settings');

		directive.controller = function(){

			this.feeds = [
				{
					name:'World News',
					free:true
				},
				{
					name:'Celebrity Gossip',
					free:false
				}
			];

		};

		directive.controllerAs = 'AppSettingsCtrl';

		return directive;

	});

})();
