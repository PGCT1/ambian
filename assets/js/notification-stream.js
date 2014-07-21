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

			this.speedLimit = 500;	// min delay in ms between posting notifications

			this.notifications = [];

			this.connectionStatus = eConnectionStatus.connecting;

			capture.lastPost = (new Date()).getTime();

			this.activeSettings = '';

			this.ignoreNextDisconnect = false;	// set to true when we close manually

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

				var settingsObj = settings();

				var speed = settingsObj.speed;

				delete settingsObj.speed;

				var settingsString = JSON.stringify(settingsObj);

				if(capture.activeSettings == settingsString
					&& capture.connectionStatus == eConnectionStatus.connected
					&& speed == capture.speedLimit){
						return;
				}

				if(!(capture.activeSettings == settingsString
					&& capture.connectionStatus == eConnectionStatus.connected)){
					capture.notifications = [];
				}

				capture.speedLimit = speed;

				capture.activeSettings = settingsString;

				capture.ignoreNextDisconnect = true;

				stream(settings(),function(connectionStatus){

					if(connectionStatus == eConnectionStatus.disconnected && capture.ignoreNextDisconnect == true){
						capture.ignoreNextDisconnect = false;
						return;
					}

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

						// autoplay on reconnect

						setTimeout(function(){

							if(connectionStatus == eConnectionStatus.connected){
								capture.paused = false;
								$scope.$broadcast('stream-play');
							}

							$scope.$apply();

						},500);

						$scope.$apply();
					});

				},capture.handleStreamTick);

			};

			this.handleStreamTick = function(notification){

				if(capture.paused == true){
					return false;
				}

				var now = (new Date()).getTime();

				if(now - capture.lastPost < capture.speedLimit){
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
