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
		}
	};

	settings.factory('settings',function(){

		if(!localStorage.getItem("ambian-settings")){
			localStorage.setItem("ambian-settings",JSON.stringify(defaultSettings));
		}

		return function(settings){

			if(settings){
				localStorage.setItem("ambian-settings",JSON.stringify(settings));
			}else{
				return JSON.parse(localStorage.getItem("ambian-settings"));
			}

		}

	});

})();
