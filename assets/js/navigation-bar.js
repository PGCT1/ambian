(function(){

  var navigationBar = angular.module('navigation-bar',[]);

  navigationBar.directive('navigationBar',function(){

    var directive = ambianDirectiveWithTemplate('navigation-bar');

    directive.controller = function($scope){

      this.leftButtonHook = $scope.leftButtonHook;
      this.leftButtonText = $scope.leftButtonText;

      this.rightButtonHook = $scope.rightButtonHook;
      this.rightButtonText = $scope.rightButtonText;

      this.headerText = $scope.headerText;

    };

    directive.controllerAs = 'NavBarCtrl';

    directive.scope = {
      leftButtonText: '=leftButtonText',
      leftButtonHook: '=leftButtonHook',
      rightButtonText: '=rightButtonText',
      rightButtonHook: '=rightButtonHook',
      headerText:'=headerText'
    }

    return directive;

  });

})();
