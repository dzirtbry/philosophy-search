/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('HeaderCtrl', ['$scope', 'userService', function ($scope, userService) {
    console.log("HeaderCtrl inited");

    $scope.model = {
      loggedIn: userService.loggedIn(),
      userName: userService.userName()
    };

  }]
);
