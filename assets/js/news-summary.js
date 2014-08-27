(function(){

  var sourceUrl = 'http://ambianmonitordev-projectgemini.rhcloud.com/currentTopHeadlines/';

  var newsSummary = angular.module('news-summary',['settings']);

  newsSummary.directive('newsSummary',function(){

    var directive = ambianDirectiveWithTemplate('news-summary');

    directive.controller = function($scope,$http,settings){

      var capture = this;

      this.articles = [];

      streams = settings.getSettings().AmbianStreamIds;

      for(var i=0;i<streams.length;++i)
        $http.get(sourceUrl + streams[i]).success(function(articles){

          var sources = Object.keys(articles);

          for(var i=0;i<sources.length;++i){

            var article = articles[sources[i]];

            article.SourceName = sources[i];

            article.SourceLogo = 'images/source-icons/' + article.SourceName.replace(/\s/gm, '') + '.png';

            capture.articles.push(article);

          }

        }).error(function(e){
          capture.error = e;
        })

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
