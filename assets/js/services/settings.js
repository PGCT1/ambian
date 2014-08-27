'use strict';

var eAvailableStreams = {
	WorldNews:1,
	SocialEntertainment:2
};

(function(){

	var settings = angular.module('settings',[]);

	var defaultSettings = {
		AmbianStreamIds:[eAvailableStreams.WorldNews],
		Sources:{
			Corporate:true,
			SocialMedia:true
		},
		speed:2500,
		lastSeenTimes:{
			1:0	// last seen on WorldNews -- unix timestamp 0
		}
	};

	var capture = {
		onChange:function(){}
	};

	settings.factory('settings',function(){

		if(!localStorage.getItem("ambian-settings")){
			localStorage.setItem("ambian-settings",JSON.stringify(defaultSettings));
		}

		return new function(){

			this.setOnChange = function(f){
				capture.onChange = f;
			}

			this.getSettings = function(){
				return JSON.parse(localStorage.getItem("ambian-settings"));
			}

			this.setSettings = function(settings){

				localStorage.setItem("ambian-settings",JSON.stringify(settings));

				capture.onChange();
			}

		}

	});

})();
