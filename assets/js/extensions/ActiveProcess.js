'use strict';

/*
  this module adds a listener which fires when the process state changes (i.e.,
  when the user switches to another tab or switches back to this tab, or
  minimizes the app, etc.)
*/

(function(){

  var ActiveProcess = angular.module('ActiveProcess',[]);

  ActiveProcess.factory('ActiveProcess',function(){

    var vis = (function(){

      var stateKey, eventKey, keys = {
          hidden: "visibilitychange",
          webkitHidden: "webkitvisibilitychange",
          mozHidden: "mozvisibilitychange",
          msHidden: "msvisibilitychange"
      };

      for (stateKey in keys) {
          if (stateKey in document) {
              eventKey = keys[stateKey];
              break;
          }
      }

      return function(pointer) {

          if (pointer) document.addEventListener(eventKey, function(){
            pointer.handler(vis());
          });

          return !document[stateKey];
      }
    })();

    var capture = {
      handler:function(visible){
      }
    };

    vis(capture);

    return function(newHandler){

      capture.handler = newHandler;

    };



  });

})();
