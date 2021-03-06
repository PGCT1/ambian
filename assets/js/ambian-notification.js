
var eNotificationTypes = {
	cNotificationTypeDefault:0,
	cNotificationTypeTweet:1,
	cNotificationTypeOfficialNews:2
};	// directly parallel to the iota declaration chain in notification.go

(function(){

	var NotificatonTypes = Object.keys(eNotificationTypes);

	var ambianNotification = angular.module('ambian-notification',['notification-tweet','notification-official']);

	ambianNotification.directive('ambianNotification',function(){

		var directive = ambianDirectiveWithTemplate('ambian-notification');

		directive.controller = ['$scope',function($scope){

			// set the notification type... kind of a dance to maintain a reference to our eNotificationTypes enum,
			// but necessary since ng-switch-when won't evaluate expressions

			for(var notificationType in NotificatonTypes){
				if($scope.notification.Type == notificationType){
					this.NotificationType = NotificatonTypes[notificationType];
					break;
				}
			}

		}];

		directive.controllerAs = 'AmbianNotificationCtrl';

		directive.scope = {
			notification: '=notification',
			linkClick: '=onLinkClick'
		};

		return directive;

	});

})();
