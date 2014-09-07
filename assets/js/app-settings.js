
(function(){

	var appSettings = angular.module('app-settings',['settings']);

	appSettings.directive('appSettings',function(){

		var directive = ambianDirectiveWithTemplate('app-settings');

		directive.controller = ['$scope','settings',function($scope,settings){

			var capture = this;

			$scope.initFunctionSetter(function(){
				capture.loadSettings();
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

			this.saveAndClose = function(){

				var settingsObj = {
					AmbianStreamIds:[],
					Sources:{}
				};

				for(var i=0;i<capture.subscriptions.length;++i){

					if(capture.subscriptions[i].active){
						settingsObj.AmbianStreamIds.push(capture.subscriptions[i].id);
					}

				}

				settingsObj.speed = capture.speed * -1;

				settingsObj.Sources.Corporate = capture.sources[0].enabled;
				settingsObj.Sources.SocialMedia = capture.sources[1].enabled;
				settingsObj.Sources.Aggregate = capture.sources[2].enabled;

				settings.setSettings(settingsObj);

				capture.close(true);
			};

			this.close = function(didMakeChanges){
				$scope.closeButtonHandler(didMakeChanges);
			}

			this.loadSettings = function(){

				var settingsObj = settings.getSettings();

				for(var i=0;i<capture.subscriptions.length;++i){

					if(settingsObj.AmbianStreamIds.indexOf(capture.subscriptions[i].id) == -1){
						capture.subscriptions[i].active = false;
					}else{
						capture.subscriptions[i].active = true;
					}

				}

				capture.speed = settingsObj.speed * -1;

				capture.sources[0].enabled = settingsObj.Sources.Corporate;
				capture.sources[1].enabled = settingsObj.Sources.SocialMedia;
				capture.sources[2].enabled = settingsObj.Sources.Aggregate;

			};

		}];

		directive.controllerAs = 'AppSettingsCtrl';

		directive.scope = {
			closeButtonHandler: '=closeButtonHandler',
			initFunctionSetter: '=initFunctionSetter'
		};

		return directive;

	});

})();
