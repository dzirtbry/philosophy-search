/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('HeaderCtrl', ['$scope', 'userService', function ($scope, userService) {
    console.log("HeaderCtrl inited");

    $scope.model = {
      loggedIn: false,
      userName: ''
    };

    $scope.login = function () {
      userService.login("user@gmail.com", "qwerty123")
        .then(function () {
          console.log("User logged in!");
        }, function () {
          console.log("Login call failed");
        });
      $scope.model.loggedIn = true;
      $scope.model.userName = "dzirtbry";
    };

    $scope.logout = function () {
      $scope.model.loggedIn = false;
      $scope.model.userName = '';
    };

  }]
);
