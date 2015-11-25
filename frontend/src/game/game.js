angular.module('philosophySearchApp')
  .controller('GameCtrl', ['$scope', 'userService', '$location', '$routeParams',
    function ($scope, userService, $location, $routeParams) {

      $scope.model = {
        gameId: $routeParams.id,
        game: {
          name: "Dummy game"
        },
        bots : [
          {
            title: "Bot 1"
          }
        ]
      };

      $scope.init = function () {
        //if (!$scope.model.userId || $scope.model.userId === 'me') {
        //  if (!userService.isLoggedIn()) {
        //    $location.path('/login');
        //  }
        //  $location.path('/user/' + userService.id());
        //}
        //
        //console.log($routeParams);
        //userApiClient.user($routeParams.id).then(
        //  function(data) {
        //    $scope.model.user = data.data;
        //  },
        //  function(data) {
        //    console.error(data);
        //  }
        //);

      };

      $scope.init();

    }]
);
