
//var SOURCE_STREAM = 'ws://golang-projectgemini.rhcloud.com:8000/json';//'ws://localhost:3000/json'
var SOURCE_STREAM = 'ws://192.168.1.5:3000/json';

(function(){

	var connectionStatus = 1;	// 0 = disconnected, 1 = connecting, 2 = active
	var maxStreamItemCount = 50;

	var socket;
	var notifications = [];

	var ambianStream = angular.module('ambian-stream',['ambian-notification']);

	ambianStream.directive('ambianStream',function(){

		var directive = ambianDirectiveWithTemplate('ambian-stream');

		directive.controller = ['$scope',function($scope){

			this.notificationLimit = maxStreamItemCount;

			this.notifications = notifications;

			var notification = function(){return {
				Type:1,
				Content:{
					Id:'4123424232',
					UserId:'1434231422',
					Username:'BBCOne',
					Screenname:'BBCOne',
					UserImageUrl:'https://pbs.twimg.com/profile_images/485011385223356416/JQdqhnoC_400x400.png',
					Followers:234123,
					Text:'Great news story!',
					Hashtags:['worldcup','brazil']
				},
				MetaData:{
					AmbianStreamIds:[1],
					Sources:{
						Corporate:true,
						SocialMedia:true,
						Aggregate:false
					}
				}
			}};

			var capture = this;
			capture.i = 0;

			// setInterval(function(){
			// 	if(capture.i > 50)return
			// 	capture.handleStreamTick(notification())
			// 	capture.i = capture.i + 1;
			// },1000);

			this.connectionStatus = connectionStatus;

			this.lastPost = (new Date()).getTime();

			this.connect = function(){

				if(connectionStatus == 2){
					return;
				}

				capture.socket = new WebSocket(SOURCE_STREAM);

				socket = capture.socket;

				socket.onopen = function(){

					connectionStatus = 2;
					capture.connectionStatus = connectionStatus;

					$scope.$apply();

					socket.send(JSON.stringify({
						Password:'your_password',
						DesiredStreams:{
							AmbianStreamIds:[1,2],
							Sources:{
								Corporate:true,
								SocialMedia:true
							}
						}
					}));

				};

				socket.onmessage = function(raw){

					var now = (new Date()).getTime();

					if(now - capture.lastPost < 500){
						return;
					}else{
						capture.lastPost = now;
					}

					notification = JSON.parse(raw.data);
					notification.Content = JSON.parse(notification.Content);
					capture.handleStreamTick(notification);
				};

				socket.onerror = function(e){};

				socket.onclose = function(){
					connectionStatus = 0;
					capture.connectionStatus = connectionStatus;
					$scope.$apply();
				};

			};

			this.handleStreamTick = function(notification){

				this.notifications.unshift(notification);

				if(this.notifications.length == maxStreamItemCount){
					this.notifications.pop();
				}
				
				$scope.$apply();

			}

		}];

		directive.controllerAs = 'AmbianStreamCtrl';

		return directive;

	});

})();
