'use strict';

(function(){

	var eStreamStatus = {
		disconnected:0,
		connectingToNewStream:1,
		streaming:2
	};

	var maxStreamItemCount = 10;

	var ambianStream = angular.module('notification-stream',['ionic','duScroll','stream','settings','ambian-notification','PriorityService']);

	ambianStream.directive('notificationStream',function(){

		var directive = ambianDirectiveWithTemplate('notification-stream');

		directive.controller = ['$scope','stream','settings','PriorityService',function($scope,stream,settings,PriorityService){

			var capture = this;

			this.paused = false;

			this.notificationLimit = maxStreamItemCount;

			this.speedLimit = 500;	// min delay in ms between posting notifications; overridden by settings

			this.notifications = [];

			this.connectionStatus = eConnectionStatus.connecting;

			this.streamStatus = eStreamStatus.connectingToNewStream;

			this.lastPost = 0;	// timestamp of most recent notification added

			this.activeSettings = '';

			this.ignoreNextDisconnect = false;	// set to true when we close the connection manually

			this.animating = false;

			$scope.$on('entering-notification-stream',function(){
				capture.connect();
			});

			this.pause = function(){
				capture.paused = true;
				$scope.$broadcast('stream-pause');
			};

			this.play = function(){

				capture.scrollTop(300,function(){

					capture.animating = true;

					setTimeout(function(){

						capture.animating = false;
						capture.showNotification();

					},350);

					capture.paused = false;
					$scope.$broadcast('stream-play');
				});

			};

			this.scrollTop = function(scrollTime,f){
				angular.element(document.getElementById('notificationList')).scrollTop(0, scrollTime).then(f);
			}

			this.linkClick = function(url){

				capture.ignoreNextDisconnect = true;

				stream.disconnect();

				$scope.$broadcast('external-link-click',url,function(){
					capture.connect();
				});

				setTimeout(function(){
					capture.scrollTop(0,function(){});
				},800);

			};

			settings.setOnChange(function(){

				capture.paused = false;

				capture.notifications = [];
				PriorityService.clearNotifications();

				capture.ignoreNextDisconnect = true;
				capture.streamStatus = eStreamStatus.connectingToNewStream;

			});

			this.connect = function(force){

				var settingsObj = settings.getSettings();

				var speed = settingsObj.speed;

				delete settingsObj.speed;

				var settingsString = JSON.stringify(settingsObj);

				if(capture.activeSettings == settingsString
					&& capture.connectionStatus == eConnectionStatus.connected
					&& speed == capture.speedLimit
					&& !force){
						return;
				}

				capture.speedLimit = speed;

				capture.activeSettings = settingsString;

				if(capture.connectionStatus == eConnectionStatus.connected){

					capture.ignoreNextDisconnect = true;

				}

				stream.connect(settings.getSettings(),function(connectionStatus){

					capture.connectionStatus = connectionStatus;

					if(connectionStatus != eConnectionStatus.connected && capture.ignoreNextDisconnect){
						if(connectionStatus == eConnectionStatus.disconnected)
							capture.ignoreNextDisconnect = false;
						return;
					}else{
						capture.streamStatus = eStreamStatus.streaming;
					}

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

				PriorityService.addNotification(notification);

				capture.showNotification();
			}

			this.showNotification = function(){

				if(capture.paused || capture.animating || PriorityService.availableNotificationCount() == 0){
					return false;
				}

				var now = (new Date()).getTime();

				var notificationToAdd;

				if(now - capture.lastPost < capture.speedLimit){
					return;
				}else{
					notificationToAdd = PriorityService.popNotification();
					capture.lastPost = now;
				}

				capture.notifications.unshift(notificationToAdd);

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
