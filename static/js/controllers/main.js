'use strict';

/**
 * @ngdoc function
 * @name philosopySearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the philosopySearchApp
 */
angular.module('philosophySearchApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.input = {
      url: "https://en.wikipedia.org/wiki/Anarchy"
    };
    $scope.path = [];
    $scope.finishUrl = "https://en.wikipedia.org/wiki/Philosophy";
    $scope.finished = false;


    $scope.trace = function () {
      $scope.path = [];
      $scope.finished = false;
      var word = $scope.input.url.slice($scope.input.url.lastIndexOf('/') + 1);
      $scope.tracePath(word, $scope.input.url, $scope.path);
    };

    $scope.tracePath = function (name, url, path) {
      this.hasDuplicates = function (array) {
        var urlSet = new Set(array.map(function (t) {
          return t.url
        }));
        return urlSet.size != array.length;
      };

      var page = {name: name, url: url, type: ''};
      path.push(page);
      if (url.toLowerCase() === $scope.finishUrl.toLowerCase()) {
        $scope.finised = true;
        page.type = 'philosophy';
        return;
      }
      if (this.hasDuplicates(path)) {
        $scope.finised = true;
        for (var i = 0; i < path.length; i++) {
          if (url.toLowerCase() === path[i].url.toLowerCase()) {
            path[i].type = 'circle';
          }
        }

        page.type = 'circle';
        return;
      }
      $http({
        url: "/wiki",
        method: "GET",
        params: {"url": url}
      }).success(function (data) {
        console.log(data);
        $scope.tracePath(data.name, data.url, path);
      });

    };

  });
