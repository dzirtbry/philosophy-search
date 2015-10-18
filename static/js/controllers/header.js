/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('HeaderCtrl', ['$scope', 'userService', function ($scope, userService) {
    console.log("HeaderCtrl inited");

    $scope.model = {
      isLoggedIn: userService.isLoggedIn(),
      userName: userService.userName()
    };

    $scope.logout = function () {
      userService.logout()
        .then(function () {
          $location.path("/login");
        });
    }

  }]
);
