'use strict';

/**
 * @ngdoc function
 * @name philosopySearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the philosopySearchApp
 */
angular.module('philosopySearchApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.input = {
      url: "https://en.wikipedia.org/wiki/Anarchy"
    };
    $scope.path = [];
    $scope.finishName = "https://en.wikipedia.org/wiki/Philosophy";
    $scope.finished = false;


    $scope.trace = function () {
      $scope.finished = false;
      var word = $scope.input.url.slice($scope.input.url.lastIndexOf('/') + 1);
      $scope.getPath(word, $scope.input.url, $scope.path);
    };

    $scope.getPath = function (name, url, path) {
      path.push({name: name, url: url});
      if (url.toLowerCase() === $scope.finishName.toLowerCase()) {
        $scope.finised = true;
        return;
      }
      $http({
        url: "/wiki",
        method: "GET",
        params: {"url": url}
      }).success(function (data) {
        console.log(data);
        $scope.getPath(data.name, data.url, path);
      });

    };

  });
