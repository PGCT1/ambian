
(function(){

	var cLinkRegex = /\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/g
	var cUserReferenceRegex = /@([a-z0-9]|_)+/ig

	var tweetNotification = angular.module('notification-official',[]);

	tweetNotification.directive('notificationOfficial',function(){

		var directive = ambianDirectiveWithTemplate('notification-official');

		directive.controller = ['$scope',function($scope){

			if($scope.article.parsed){
				return;
			}

			$scope.article.parsed = true;

			if($scope.article.Content.Description.length > 200){

				$scope.article.Content.Description = $scope.article.Content.Description.substring(0,200) + '...'

			}

		}];

		directive.controllerAs = 'ArticleCtrl';
		directive.scope = {
			article: '=article'
		};

		return directive;

	});

})();
