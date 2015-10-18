/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('LoginCtrl', ['$scope', 'userService', function ($scope, userService) {
    console.log("LoginCtrl inited");

    $scope.model = {
      isLoggedIn: false,
      userName: ''
    };

    $scope.login = function () {
      userService.login("user@gmail.com", "qwerty123")
        .then(function () {
          console.log("User logged in!");
        }, function () {
          console.log("Login call failed");
        });
      $scope.model.isLoggedIn = true;
      $scope.model.userName = "dzirtbry";
    };

    $scope.logout = function () {
      $scope.model.isLoggedIn = false;
      $scope.model.userName = '';
    };

  }]
);