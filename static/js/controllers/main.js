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
    $scope.tracing = false;


    $scope.trace = function () {
      $scope.path = [];
      $scope.tracing = true;
      var word = $scope.input.url.slice($scope.input.url.lastIndexOf('/') + 1);

      var lang = $scope.input.url.match("https?://([a-z]+)\.wikipedia.org")[1];
      $http({
        url: "/wiki/philosophy",
        method: "GET",
        params: {"lang": lang}
      }).success(function (data) {
        console.log(data);
        $scope.finishUrl = data.url;
        $scope.tracePath(word, $scope.input.url, $scope.path)
      });
    };

    $scope.tracePath = function (name, url, path) {
      var page = {name: decodeURIComponent(name), url: decodeURIComponent(url), type: ''};
      path.push(page);

      if (url.toLowerCase() === $scope.finishUrl.toLowerCase()) {
        $scope.tracing = false;
        page.type = 'philosophy';
      } else if (this.hasDuplicates(path)) {
        $scope.tracing = false;
        path.map(function (element) {
          if (page.url.toLowerCase() === element.url.toLowerCase()) {
            element.type = 'circle';
          }
        });
        page.type = 'circle';
      } else if (url.length == 0) {
        page.type = 'last';
        $scope.tracing = false;
      } else {
        $http({
          url: "/wiki",
          method: "GET",
          params: {"url": url}
        }).success(function (data) {
          console.log(data);
          $scope.tracePath(data.name, data.url, path);
        });
      }

    };

    $scope.hasDuplicates = function (array) {
      var urlSet = new Set(array.map(function (t) {
        return t.url
      }));
      return urlSet.size != array.length;
    };

  });
