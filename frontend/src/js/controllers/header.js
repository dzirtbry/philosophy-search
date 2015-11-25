/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('HeaderCtrl', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    console.log("HeaderCtrl inited");

    $scope.model = {
      isLoggedIn: userService.isLoggedIn,
      userName: userService.userName
    };


    //$scope.userService = userService;
    //$scope.$watch('userService.model.isLoggedIn', function (newVal, oldVal, scope) {
    //  if (newVal) {
    //    $scope.model.isLoggedIn = userService.model.isLoggedIn;
    //    $scope.model.userName = userService.model.userName;
    //  }
    //});

    $scope.logout = function () {
      userService.logout()
        .then(function () {
          //$scope.model.isLoggedIn = userService.model.isLoggedIn;
          //$scope.model.userName = userService.model.userName;
          $location.path("/login");
        });
    }

  }]
);
