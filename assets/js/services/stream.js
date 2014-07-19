'use strict';

var eConnectionStatus = {
	disconnected:0,
	connecting:1,
	connected:2
};

(function(){

	var stream = angular.module('stream',[]);

	stream.factory('stream',function(){

		var SOURCE_STREAM = 'wss://ambianmonitordev-projectgemini.rhcloud.com:8443/json';
		var SOURCE_STREAM_PASSWORD = 'qkfojweokfjasokdfjoakwefl';

		//  var SOURCE_STREAM = 'ws://192.168.1.5:3000/json';
		//  var SOURCE_STREAM_PASSWORD = 'your_password';

		var socket;

		var capture = {};

		return function(settings,statusCallback,notificationCallback){

			if(socket){
				socket.close();
			}

			// if we have callbacks, store them; we should always have settings

			if(statusCallback){
				capture.statusCallback = statusCallback;
			}

			if(notificationCallback){
				capture.notificationCallback = notificationCallback;
			}

			//

			capture.statusCallback(eConnectionStatus.connecting);

			socket = new WebSocket(SOURCE_STREAM);

			socket.onopen = function(){

				capture.statusCallback(eConnectionStatus.connected);

				socket.send(JSON.stringify({
					Password:SOURCE_STREAM_PASSWORD,
					DesiredStreams:settings
				}));

			};

			socket.onmessage = function(raw){

				var notification = JSON.parse(raw.data);

				notification.Content = JSON.parse(notification.Content);

				capture.notificationCallback(notification);
			};

			socket.onerror = function(e){
				alert(JSON.stringify(e));
			};

			socket.onclose = function(){
				capture.statusCallback(eConnectionStatus.disconnected);
			};

		}

	});

})();
