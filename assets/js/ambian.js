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

	var ambian = angular.module('ambian',['ionic','ngSanitize','onTap','notification-stream','app-store','app-settings']);

	ambian.directive('ambianApp',function(){

		return ambianDirectiveWithTemplate('ambian-app');

	});

	ambian.controller('MainNavigationController',function($scope,$sce){

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

		$scope.$on('external-link-click',function(event,url){

			if(ionic.Platform.isWebView())
				window.open(url,'_blank');
			else
				window.open(url)	// running in a browser, so just open a new tab

		})

		this.activeIndex = 0;

		this.iOS = ionic.Platform.isIOS();
	});

	ambian.run(function($ionicPlatform){

	});

})();
