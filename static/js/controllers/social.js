angular.module('philosophySearchApp')
  .controller('SocialCtrl', ['$scope', function ($scope) {
    $scope.logEvent = function(socialProvoder) {
      ga('send', 'event', 'social', 'shared', socialProvoder);
    }
  }]
);