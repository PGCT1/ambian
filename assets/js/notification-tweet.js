
(function(){

	var cLinkRegex = /\bhttps?:\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/g
	var cUserReferenceRegex = /@([a-z0-9]|_)+/ig

	var tweetNotification = angular.module('notification-tweet',[]);

	tweetNotification.directive('notificationTweet',function(){

		var directive = ambianDirectiveWithTemplate('notification-tweet');

		directive.controller = ['$scope',function($scope){

			if($scope.tweet.textAlreadyParsed){
				// necessary because this constructor will be called on the same tweet object if
				// the user switches tabs and comes back, so we don't want to re-parse the text
				return;
			}else{
				$scope.tweet.textAlreadyParsed = true;
			}

			// first, remove truncated text at the end, since it's almost always
			// partial links or usernames

			if($scope.tweet.Text.substring($scope.tweet.Text.length-1) == '…'){
				if($scope.tweet.Text.indexOf(' ') != -1){
					$scope.tweet.Text = $scope.tweet.Text.substring(0,$scope.tweet.Text.lastIndexOf(' ')) + '…';
				}
			}

			// add links in the tweet body

			var urls = $scope.tweet.Text.match(cLinkRegex);

			if(urls)
				for(var i=0;i<urls.length;++i)
					$scope.tweet.Text = $scope.tweet.Text.replace(urls[i],'<a href="' + urls[i] + '" target="_blank">link</a>');

			// add user references

			var userReferences = $scope.tweet.Text.match(cUserReferenceRegex);

			if(userReferences)
				for(var i=0;i<userReferences.length;++i)
					$scope.tweet.Text = $scope.tweet.Text.replace(userReferences[i],'<a href="https://twitter.com/' + userReferences[i].substring(1) + '" target="_blank">' + userReferences[i] + '</a>');

			// remove duplicate hashtags so we don't get ng-repeat complaining

			if($scope.tweet.Hashtags){

				var hashtags = [];

				for(var i=0;i<$scope.tweet.Hashtags.length;++i){
					if(hashtags.indexOf($scope.tweet.Hashtags[i]) == -1){
						hashtags.push($scope.tweet.Hashtags[i]);
					}
				}

				$scope.tweet.Hashtags = hashtags;

			}



		}];

		directive.controllerAs = 'TweetCtrl';
		directive.scope = {
      tweet: '=tweet'
    };

		return directive;

	});

})();
