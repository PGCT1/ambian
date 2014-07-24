
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

			var clip = $scope.article.Content.Description.replace(/<[^>]+>/gm, '');

			if(clip.length > 200){

				clip = clip.substring(0,200) + '...'

			}

			$scope.article.Content.Description = clip;

		}];

		directive.controllerAs = 'ArticleCtrl';
		directive.scope = {
			article: '=article'
		};

		return directive;

	});

})();
