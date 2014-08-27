'use strict';

(function(){

  var PriorityService = angular.module('PriorityService',['settings']);

  var cStaleTime = 90000;  // time before we discard a notification

  PriorityService.factory('PriorityService',['settings',function(settings){

    var stampedNotifications = [];
    var recentHistory = [];

    function rate(notification){

      var rating;

      if(notification.MetaData.Sources.Corporate &&
        !notification.MetaData.Sources.SocialMedia){
          rating = 100;
      }else if(notification.MetaData.Sources.Corporate){
        rating = 50;
      }else{
        rating = 30;
      }

      if(notification.Type == 2){

        for(var i=0;i<recentHistory.length;++i){

          if(recentHistory[i].Type == notification.Type){

            if(notification.Content.Source == recentHistory[i].Content.Source){
              rating = rating / 2;
            }

          }

        }

      }else if(notification.Type == 1){

        // tweet

        if(!notification.Content.Verified)
          rating = rating * 0.75

      }

      return rating * Math.random();

    }

    function chooseBestNotification(){

      var currentHighestIndex = 0;
      var currentHighestRating = 0;

      for(var i=0;i<stampedNotifications.length;++i){

        var score = rate(stampedNotifications[i].notification);

        if(score > currentHighestRating){
          currentHighestRating = score;
          currentHighestIndex = i;
        }

      }

      return currentHighestIndex;

    }

    function discardOldNotifications(){

      var i=0;

      var now = (new Date()).getTime();

      while(i < stampedNotifications.length && now - stampedNotifications[i].timestamp > cStaleTime){
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

      if(recentHistory.length == 30){
        recentHistory.shift();
      }

      discardOldNotifications();
    }

    function popNotification(){

      var bestNotificationIndex = chooseBestNotification();

      var chosenNotification = stampedNotifications[bestNotificationIndex].notification;

      recentHistory.push(chosenNotification);

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

    function availableNotificationCount(){
      return stampedNotifications.length;
    }


    return new function(){

      this.addNotification = addNotification;
      this.popNotification = popNotification;
      this.clearNotifications = clearNotifications;
      this.availableNotificationCount = availableNotificationCount;

    };


  }]);

})();
