
(function(){

	var appSettings = angular.module('app-settings',['settings']);

	appSettings.directive('appSettings',function(){

		var directive = ambianDirectiveWithTemplate('app-settings');

		directive.controller = ['$scope','settings',function($scope,settings){

			var capture = this;

			$scope.$on('entering-app-settings',function(){
				capture.loadSettings();
			});

			$scope.$on('exiting-app-settings',function(){
				capture.saveSettings();
			});

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
					name:'Social Media',
					enabled:true
				},
				{
					name:'Aggregate',
					enabled:true
				}
			];

			this.saveSettings = function(){
				
				var settingsObj = {
					AmbianStreamIds:[],
					Sources:{}
				};

				for(var i=0;i<capture.subscriptions.length;++i){

					if(capture.subscriptions[i].active){
						settingsObj.AmbianStreamIds.push(capture.subscriptions[i].id);
					}

				}

				settingsObj.speed = capture.speed;

				settingsObj.Sources.Corporate = capture.sources[0].enabled;
				settingsObj.Sources.SocialMedia = capture.sources[1].enabled;
				settingsObj.Sources.Aggregate = capture.sources[2].enabled;

				settings(settingsObj);

			};

			this.loadSettings = function(){

				var settingsObj = settings();

				for(var i=0;i<capture.subscriptions.length;++i){

					if(settingsObj.AmbianStreamIds.indexOf(capture.subscriptions[i].id) == -1){
						capture.subscriptions[i].active = false;
					}else{
						capture.subscriptions[i].active = true;
					}

				}

				capture.speed = settingsObj.speed;

				capture.sources[0].enabled = settingsObj.Sources.Corporate;
				capture.sources[1].enabled = settingsObj.Sources.SocialMedia;
				capture.sources[2].enabled = settingsObj.Sources.Aggregate;

			};

		}];

		directive.controllerAs = 'AppSettingsCtrl';

		return directive;

	});

})();
