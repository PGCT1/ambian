
(function(){

	var appSettings = angular.module('app-settings',[]);

	appSettings.directive('appSettings',function(){

		var directive = ambianDirectiveWithTemplate('app-settings');

		directive.controller = function(){

			this.feeds = [
				{
					name:'World News',
					subscribed:true,
					active:true
				},
				{
					name:'Celebrity Gossip',
					subscribed:false,
					active:false
				}
			];

		};

		directive.controllerAs = 'AppSettingsCtrl';

		return directive;

	});

})();
