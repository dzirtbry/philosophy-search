'use strict';

/**
 * @ngdoc function
 * @name philosopySearchApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the philosopySearchApp
 */
angular.module('philosophySearchApp')
  .controller('MainCtrl', ['$scope', 'wiki', function ($scope, wiki) {
    $scope.input = {
      url: "https://en.wikipedia.org/wiki/Anarchy"
    };
    $scope.path = [];
    $scope.finishUrl = "https://en.wikipedia.org/wiki/Philosophy";
    $scope.tracing = false;

    function reset() {
      $scope.path = [];
      $scope.tracing = false;
    }

    function extractLanguage(url) {
      return url.match("https?://([a-z]+)\.wikipedia.org")[1];
    }

    function extractWord(url) {
      return url.slice($scope.input.url.lastIndexOf('/') + 1);
    }

    function hasDuplicates(array) {
      var urlSet = new Set(array.map(function (t) {
        return t.url
      }));
      return urlSet.size != array.length;
    }

    function tracePath(name, url, path) {
      var page = {name: decodeURIComponent(name), url: decodeURIComponent(url), type: ''};
      path.push(page);

      if (url.toLowerCase() === $scope.finishUrl.toLowerCase()) {
        $scope.tracing = false;
        page.type = 'philosophy';
      } else if (hasDuplicates(path)) {
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
        wiki.getNextPage(url).success(function (data) {
          console.log(data);
          tracePath(data.name, data.url, path);
        });
      }
    }

    $scope.trace = function () {
      reset();
      $scope.tracing = true;
      var word = extractWord($scope.input.url);
      var lang = extractLanguage($scope.input.url);
      wiki.getPhilosophyPage(lang).success(function (data) {
        console.log(data);
        $scope.finishUrl = data.url;
        tracePath(word, $scope.input.url, $scope.path)
      });
    };

  }]
);
