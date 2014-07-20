'use strict';

(function(){

	var maxStreamItemCount = 10;

	var ambianStream = angular.module('notification-stream',['ionic','stream','settings','ambian-notification']);

	ambianStream.directive('notificationStream',function(){

		var directive = ambianDirectiveWithTemplate('notification-stream');

		directive.controller = ['$scope','stream','settings',function($scope,stream,settings){

			var capture = this;

			this.paused = false;

			this.notificationLimit = maxStreamItemCount;

			this.notifications = [];

			this.connectionStatus = eConnectionStatus.connecting;

			capture.lastPost = (new Date()).getTime();

			this.activeSettings = '';

			$scope.$on('entering-notification-stream',function(){
				capture.connect();
			});

			this.pause = function(){
				capture.paused = true;
				$scope.$broadcast('stream-pause');
			};

			this.play = function(){
				capture.paused = false;
				$scope.$broadcast('stream-play');
			};

			this.connect = function(){

				var settingsString = JSON.stringify(settings());

				if(capture.activeSettings == settingsString && capture.connectionStatus == eConnectionStatus.connected){
						return;
				}

				capture.activeSettings = settingsString;
				capture.notifications = [];

				stream(settings(),function(connectionStatus){

					capture.connectionStatus = connectionStatus;

					// annoying that this part has to be here: basically, we need to
					// call $scope.$apply because otherwise, after connecting, the
					// connecting animation will play until the first notification makes
					// it all the way through (which can be a long time with strong
					// filters). however, we can't just call $scope.$apply synchronously
					// because with saturated streams, it will cause an error by firing
					// during the digest while posting the first notification. so we
					// resolve this by sticking it in a timeout block with 0 offset.

					setTimeout(function(){
						$scope.$apply();
					});

				},this.handleStreamTick);

			};

			this.handleStreamTick = function(notification){

				if(capture.paused == true){
					return false;
				}

				var now = (new Date()).getTime();

				if(now - capture.lastPost < 500){
					return;
				}else{
					capture.lastPost = now;
				}

				capture.notifications.unshift(notification);

				if(capture.notifications.length == maxStreamItemCount){
					capture.notifications.pop();
				}

				$scope.$apply();

			}

			ionic.Platform.ready(function(){
				capture.connect();
			});

		}];

		directive.controllerAs = 'StreamCtrl';

		return directive;

	});

})();
