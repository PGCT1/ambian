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

		this.minimized = true;

		this.Navigate = function(index){

			if(capture.activeIndex != index){

				$scope.$broadcast('exiting-' + capture.controls[capture.activeIndex]);
				capture.activeIndex = index;
				$scope.$broadcast('entering-' + capture.controls[capture.activeIndex]);

			}

		}

		$scope.$on('stream-pause',function(){
			capture.minimized = false;
		});

		$scope.$on('stream-play',function(){
			capture.minimized = true;
		});

		$scope.$on('navigate-external-url',function(){
			alert('asdf');
		});

		$scope.$on('external-link-click',function(event,url){

			if(ionic.Platform.isWebView())
				alert("TODO")
			else
				window.open(url)	// running in a browser, so just open a new tab

		})

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
