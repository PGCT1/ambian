(function(){

  var sourceUrl = 'http://ambianmonitordev-projectgemini.rhcloud.com/currentTopHeadlines/';

  var newsSummary = angular.module('news-summary',['settings','navigation-bar']);

  function extractUrl(article){

    if(article.Guid && article.Guid.indexOf(".") != -1)
      return article.Guid
    else if(article.Links && article.Links[0] && article.Links[0].Href)
      return article.Links[0].Href
    else
      return false

  }

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

              var url = extractUrl (article);

              if(url){
                article.Url = extractUrl(article);
                capture.articles.push(article);
              }

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
