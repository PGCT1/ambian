'use strict';

(function(){

  var PriorityService = angular.module('PriorityService',['settings']);

  var cStaleTime = 30000;  // time before we discard a notification

  var priorityQueue = [
    function(notification){
      return (notification.MetaData.Sources.Corporate &&
          !notification.MetaData.Sources.SocialMedia);
    },function(notification){
      return notification.MetaData.Sources.Corporate;
    }
  ];

  PriorityService.factory('PriorityService',['settings',function(settings){

    var stampedNotifications = [];

    function findNotification(criteriaFunction){

      var index = -1;

      for(var i=0;i<stampedNotifications.length;++i){

        if(criteriaFunction(stampedNotifications[i].notification)){
          index = i;
          break;
        }

      }

      return index;

    }

    function chooseBestNotification(){

      // returns the index of the best notification

      var bestNotificationIndex = -1;

      for(var i=0;i<priorityQueue.length;++i){

        bestNotificationIndex = findNotification(priorityQueue[i]);

        if(-1 == bestNotificationIndex){
          break;
        }

      }

      // if we found something interesting, return it; otherwise, just
      // return the last element

      if(bestNotificationIndex != -1){

        return bestNotificationIndex;

      }else{

        return stampedNotifications.length - 1;

      }

    }

    function discardOldNotifications(){

      var i=0;

      var now = (new Date()).getTime();

      while(now - stampedNotifications[i].timestamp > cStaleTime){
        stampedNotifications.shift();
        ++i;
      }

    }

    function addNotification(notification){

      var stampedNotification = {
        notification:notification,
        timestamp:(new Date()).getTime()
      };

      stampedNotifications.push(stampedNotification);

      discardOldNotifications();
    }

    function popNotification(){

      var bestNotificationIndex = chooseBestNotification();

      var chosenNotification = stampedNotifications[bestNotificationIndex].notification;

      for(var i=bestNotificationIndex;i<stampedNotifications.length-1;++i){
        stampedNotifications[i] = stampedNotifications[i+1];
      }

      stampedNotifications.pop();

      return chosenNotification;
    }

    function clearNotifications(){
      while(stampedNotifications.length > 0) {
        stampedNotifications.pop();
      }
    }


    return new function(){

      this.addNotification = addNotification;
      this.popNotification = popNotification;
      this.clearNotifications = clearNotifications;

    };


  }]);

})();
