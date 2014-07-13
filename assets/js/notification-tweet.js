
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

			// add links in the tweet body

			var urls = $scope.tweet.Text.match(cLinkRegex);

			if(urls)
				for(var i=0;i<urls.length;++i)
					if($scope.tweet.Text.substring($scope.tweet.Text.length-1) != '…' || $scope.tweet.Text.substring($scope.tweet.Text.length - urls[i].length - 4).indexOf(urls[i]) == -1)
						$scope.tweet.Text = $scope.tweet.Text.replace(urls[i],'<a href="' + urls[i] + '" target="_blank">link</a>');

			// add user references

			var userReferences = $scope.tweet.Text.match(cUserReferenceRegex);

			if(userReferences)
				for(var i=0;i<userReferences.length;++i)
					if($scope.tweet.Text.substring($scope.tweet.Text.length-1) != '…' || $scope.tweet.Text.substring($scope.tweet.Text.length - userReferences[i].length - 4).indexOf(userReferences[i]) == -1)
						$scope.tweet.Text = $scope.tweet.Text.replace(userReferences[i],'<a href="https://twitter.com/' + userReferences[i].substring(1) + '" target="_blank">' + userReferences[i] + '</a>');
			
		}];

		directive.controllerAs = 'TweetCtrl';
		directive.scope = {
      tweet: '=tweet'
    };

		return directive;

	});

})();
