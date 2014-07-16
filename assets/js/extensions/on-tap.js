
// angular extension similar to ng-click, but which fires upon
// the mousedown or touchstart event instead

(function(){

  var onTap = angular.module('onTap',['ionic']);

  onTap.directive('onTap',function($parse){

    return function(scope,element,attr){

      var fn = $parse(attr['onTap']);

      if('ontouchstart' in document.documentElement){

        element.on('touchstart',function(event){
          scope.$apply(function(){
            console.log(scope);
            fn(scope,{$event:event})
          });
        });

      }else{

        element.on('mousedown',function(event){
          scope.$apply(function(){
            fn(scope,{$event:event})
          });
        });

      }

    };

  });

})();
