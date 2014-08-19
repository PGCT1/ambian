
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

			// make the logo url to our stored logo

			$scope.article.sourceLogo = 'images/source-icons/' + $scope.article.Source.replace(/\s/gm, '') + '.png';

			// remove html and trim article

			var clip = $scope.article.Content.Description.replace(/<[^>]+>/gm, '');

			if(clip.length > 200){

				clip = clip.substring(0,200) + '...'

			}

			$scope.article.Content.Description = clip;

			// parse special characters in the title

			$scope.article.Content.Title = $scope.article.Content.Title.replace(/\&\#39;/g,'\'');

			// construct the link to the article

			if($scope.article.Content.Guid && $scope.article.Content.Guid.substring(0,4) == 'http'){
				$scope.article.Link = $scope.article.Content.Guid
			}else if($scope.article.Content.Links.length > 0){
				$scope.article.Link = $scope.article.Content.Links[0].Href;
			}else{

				// this shouldn't happen -- the article link should always be in
				// one of the above two places

				console.log('Unable to parse link for article: ');
				console.log($scope.article);

				$scope.article.Link = '#';
			}

		}];

		directive.controllerAs = 'ArticleCtrl';
		directive.scope = {
			article: '=article',
			linkClick: '=onLinkClick'
		};

		return directive;

	});

})();
