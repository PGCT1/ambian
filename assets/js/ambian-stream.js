
//var SOURCE_STREAM = 'ws://echo.websocket.org';
var SOURCE_STREAM = 'wss://ambianmonitordev-projectgemini.rhcloud.com:8443/json';
var SOURCE_STREAM_PASSWORD = 'qkfojweokfjasokdfjoakwefl';

//  var SOURCE_STREAM = 'ws://192.168.1.5:3000/json';
//  var SOURCE_STREAM_PASSWORD = 'your_password';

(function(){

	var connectionStatus = 1;	// 0 = disconnected, 1 = connecting, 2 = active, -1 = waiting for device ready
	var maxStreamItemCount = 10;

	var socket;
	var connectionStatus;

	var capture;

	var notifications = [];

	var ambianStream = angular.module('ambian-stream',['ionic','ambian-notification']);

	ambianStream.directive('ambianStream',function($http){

		var directive = ambianDirectiveWithTemplate('ambian-stream');

		directive.controller = ['$scope',function($scope){

			capture = this;

			this.paused = false;

			this.notificationLimit = maxStreamItemCount;

			this.notifications = notifications;

			this.connectionStatus = connectionStatus;

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

			// capture.i = 0;

			// setInterval(function(){
			// 	if(capture.i > 5)return
			// 	capture.handleStreamTick(notification())
			// 	capture.i = capture.i + 1;
			// },1000);

			capture.lastPost = (new Date()).getTime();

			this.connect = function(){

				capture.connectionStatus = connectionStatus;

				if(connectionStatus == 2){
					return;
				}else{
					connectionStatus = 1;
					capture.connectionStatus = connectionStatus;
				}

				socket = new WebSocket(SOURCE_STREAM);

				socket.onopen = function(){

					connectionStatus = 2;
					capture.connectionStatus = connectionStatus;

					$scope.$apply();

					socket.send(JSON.stringify({
						Password:SOURCE_STREAM_PASSWORD,
						DesiredStreams:{
							AmbianStreamIds:[1],
							Sources:{
								Corporate:true,
								SocialMedia:true
							}
						}
					}));

				};

				socket.onmessage = function(raw){

					if(capture.paused == true){
						return false;
					}

					var now = (new Date()).getTime();

					if(now - capture.lastPost < 500){
						return;
					}else{
						capture.lastPost = now;
					}

					var notification = JSON.parse(raw.data);

					notification.Content = JSON.parse(notification.Content);

					capture.handleStreamTick(notification);
				};

				socket.onerror = function(e){
					alert(JSON.stringify(e));
				};

				socket.onclose = function(){
					connectionStatus = 0;
					capture.connectionStatus = connectionStatus;
					$scope.$apply();
				};

			};

			this.handleStreamTick = function(notification){

				capture.notifications.unshift(notification);

				if(capture.notifications.length == maxStreamItemCount){
					capture.notifications.pop();
				}

				$scope.$apply();

			}

			ionic.Platform.ready(function() {
				connectionStatus = 1;
				capture.connectionStatus = connectionStatus;
				capture.connect();
			});

		}];

		directive.controllerAs = 'AmbianStreamCtrl';

		return directive;

	});

})();
