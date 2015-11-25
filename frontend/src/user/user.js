angular.module('philosophySearchApp')
  .controller('UserCtrl', ['$scope', 'userService', '$location', '$routeParams', 'userApiClient',
    function ($scope, userService, $location, $routeParams, userApiClient) {

      $scope.model = {
        userId: $routeParams.id,
        user: null
      };

      $scope.init = function () {
        if (!$scope.model.userId || $scope.model.userId === 'me') {
          if (!userService.isLoggedIn()) {
            $location.path('/login');
          }
          $location.path('/user/' + userService.id());
        }

        console.log($routeParams);
        userApiClient.user($routeParams.id).then(
          function(data) {
            $scope.model.user = data.data;
          },
          function(data) {
            console.error(data);
          }
        );

      };

      $scope.init();

    }]
);
