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

	var ambian = angular.module('ambian',['ionic','ngSanitize','onTap','settings','notification-stream','app-store','app-settings','news-summary']);

	ambian.directive('ambianApp',function(){

		return ambianDirectiveWithTemplate('ambian-app');

	});

	ambian.controller('MainNavigationController',function($scope,$sce,settings){

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

		$scope.$on('external-link-click',function(event,url,callback){
			capture.onLinkClick(url,callback);
		})

		capture.onLinkClick = function(url,callback){

			if(ionic.Platform.isWebView()){

				var newWindow = window.open(url,'_blank');

				newWindow.addEventListener("exit", callback);
			}else
				window.open(url)	// running in a browser, so just open a new tab
		}

		this.activeIndex = 0;

		this.showNewsSummary = false;

		this.closeNewsSummary = function(){
			capture.showNewsSummary = false;
		}

		this.iOS = ionic.Platform.isIOS();

		ionic.Platform.ready(function(){

			if(settings.getSettings().AmbianStreamIds.length > 0)
				setTimeout(function(){capture.showNewsSummary = true;},500);

		});

	});

	ambian.run(function($ionicPlatform){

	});

})();
