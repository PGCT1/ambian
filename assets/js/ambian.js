(function(){

	var ambian = angular.module('ambian',['ionic']);

	function ambianDirectiveWithTemplate(templateName){

		var template = {
			restrict:'E'
		};

		if(jade.templates && jade.templates[templateName]){

			template.template = jade.templates[templateName];

		}else{

			template.templateUrl = '/templates/' + templateName;

		}

		return template;

	}

	ambian.directive('ambianApp',function(){

		return ambianDirectiveWithTemplate('ambian-app');

	});

	ambian.run(function($ionicPlatform){

	  $ionicPlatform.ready(function(){

	    // Hide the accessory bar

	    if(window.cordova && window.cordova.plugins.Keyboard) {
	      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	    }

	  });

	});

})();