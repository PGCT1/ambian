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

(function(){

	var ambian = angular.module('ambian',['ionic','onTap','notification-stream','app-store','app-settings']);

	ambian.directive('ambianApp',function(){

		return ambianDirectiveWithTemplate('ambian-app');

	});

	ambian.controller('MainNavigationController',function($scope){

		var capture = this;

		this.controls = ['notification-stream','app-store','app-settings'];

		this.Navigate = function(index){

			if(capture.activeIndex != index){

				$scope.$broadcast('exiting-' + capture.controls[capture.activeIndex]);
				capture.activeIndex = index;
				$scope.$broadcast('entering-' + capture.controls[capture.activeIndex]);

			}

		}

		this.activeIndex = 0;

		this.iOS = ionic.Platform.isIOS();
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
