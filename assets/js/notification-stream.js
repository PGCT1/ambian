'use strict';

(function(){

	var maxStreamItemCount = 10;

	var ambianStream = angular.module('notification-stream',['ionic','stream','ambian-notification']);

	ambianStream.directive('notificationStream',function(){

		var directive = ambianDirectiveWithTemplate('notification-stream');

		directive.controller = ['$scope','stream',function($scope,stream){

			var capture = this;

			this.paused = false;

			this.notificationLimit = maxStreamItemCount;

			this.notifications = [];

			this.connectionStatus = eConnectionStatus.connecting;

			capture.lastPost = (new Date()).getTime();

			this.connect = function(){

				stream({
					AmbianStreamIds:[1],
					Sources:{
						Corporate:true,
						SocialMedia:true
					}
				},function(connectionStatus){
					capture.connectionStatus = connectionStatus;
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
