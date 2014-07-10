
(function(){

	var tweetNotification = angular.module('notification-tweet',[]);

	tweetNotification.directive('notificationTweet',function(){

		var directive = ambianDirectiveWithTemplate('notification-tweet');

		directive.controller = ['$scope',function($scope){
			
		}];

		directive.controllerAs = 'TweetCtrl';
		directive.scope = {
      tweet: '=tweet'
    };

		return directive;

	});

})();
