/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('LoginCtrl', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    console.log("LoginCtrl inited");

    $scope.model = {
      email: '',
      password: ''
    };

    $scope.login = function () {
      userService.login($scope.model.email, $scope.model.password)
        .then(function (user) {
          console.log("User logged in!");
          $location.path("/");
        }, function (error) {
          console.log("Login call failed");
        });
    };

  }]
);