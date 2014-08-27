(function(){

  var sourceUrl = 'http://ambianmonitordev-projectgemini.rhcloud.com/currentTopHeadlines/';

  var newsSummary = angular.module('news-summary',['settings']);

  newsSummary.directive('newsSummary',function(){

    var directive = ambianDirectiveWithTemplate('news-summary');

    directive.controller = function($scope,$http,settings){

      var capture = this;

      this.articles = [];

      this.getStreamData = function(){

        async.each(settings.getSettings().AmbianStreamIds, function(streamId, callback) {

          $http.get(sourceUrl + streamId).success(function(sourceArticleMap){

            _.map(sourceArticleMap,function(article,source){

              article.SourceName = source;

              article.SourceLogo = 'images/source-icons/' + article.SourceName.replace(/\s/gm, '') + '.png';

              capture.articles.push(article);

            });

            callback();

          }).error(callback)

        }, function(err) {
          if(err)
            capture.error = err;
        });

      }

      this.getStreamData();

      this.close = function(){
        $scope.closeWindow();
      }

      this.linkClick = function(url){
        $scope.linkClick(url,function(){});
      }

    }

    directive.controllerAs = 'NewsSummaryCtrl';

    directive.scope = {
      closeWindow: '=closeButtonHandler',
      linkClick: '=onLinkClick'
    }

    return directive;

  });

})();
