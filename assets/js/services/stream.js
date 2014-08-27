'use strict';

var eConnectionStatus = {
	disconnected:0,
	connecting:1,
	connected:2,
	connectionError:3
};

(function(){

	var stream = angular.module('stream',['ActiveProcess']);

	stream.factory('stream',['ActiveProcess',function(ActiveProcess){

		var SOURCE_STREAM = 'wss://ambianmonitordev-projectgemini.rhcloud.com:8443/json';
		var SOURCE_STREAM_PASSWORD = 'qkfojweokfjasokdfjoakwefl';

		// var SOURCE_STREAM = 'ws://localhost:3000/json';
		// var SOURCE_STREAM_PASSWORD = 'qkfojweokfjasokdfjoakwefl';

		var capture = {};
		var socket;

		var connect = function(settings,statusCallback,notificationCallback){

			if(socket){
				socket.close();
			}

			// if we have parameters, store them; if not, use the stored values

			if(settings){
				capture.settings = settings;
			}

			if(statusCallback){
				capture.statusCallback = statusCallback;
			}

			if(notificationCallback){
				capture.notificationCallback = notificationCallback;
			}
			
			capture.statusCallback(eConnectionStatus.connecting);

			socket = new WebSocket(SOURCE_STREAM);

			socket.onopen = function(){

				capture.statusCallback(eConnectionStatus.connected);

				socket.send(JSON.stringify({
					Password:SOURCE_STREAM_PASSWORD,
					DesiredStreams:capture.settings
				}));

			};

			socket.onmessage = function(raw){

				var notification = JSON.parse(raw.data);

				notification.Content = JSON.parse(notification.Content);

				capture.notificationCallback(notification);
			};

			socket.onerror = function(e){
				capture.statusCallback(eConnectionStatus.connectionError);
				socket.close();
				console.error("STREAM ERROR: " + JSON.stringify(e));
			};

			socket.onclose = function(){
				capture.statusCallback(eConnectionStatus.disconnected);
			};

		};

		var disconnect = function(){
			socket.close();
		}

		ActiveProcess(function(active){
			if(active){
				connect();
			}else{
				socket.close();
			}
		});

		return {
			connect:connect,
			disconnect:disconnect
		};

	}]);

})();
