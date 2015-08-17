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

    function handleError(data, status, xhr) {
      $scope.tracing = false;
      console.log(data, status, xhr);
    }

    function analyzeData(data, path) {
      var page = {name: decodeURIComponent(data.name), url: decodeURIComponent(data.url), type: ''};

      if (page.url.length == 0) {
        page.type = 'last';
      }

      path.map(function (element) {
        if (element.url == page.url) {
          element.type = 'circle';
          page.type = 'circle';
        }
      });

      if (page.url.toLowerCase() === $scope.finishUrl.toLowerCase()) {
        page.type = 'target';
      }
      return page;
    }

    function tracePath(path) {
      var currentPage = path[path.length - 1];

      if (currentPage.type != '') {
        $scope.tracing = false;
        return;
      }

      wiki.getNextPage(currentPage.url).success(function (data) {
        console.log(data);
        var nextPage = analyzeData(data, path);
        path.push(nextPage);
        tracePath(path);
      }).error(handleError);
    }

    $scope.trace = function () {
      reset();
      $scope.tracing = true;

      var url = $scope.input.url;
      var word = extractWord(url);
      var lang = extractLanguage(url);
      var page = {name: decodeURI(word), url: decodeURI(url), type: ''};
      $scope.path.push(page);
      wiki.getPhilosophyPage(lang).success(function (data) {
        console.log(data);
        $scope.finishUrl = decodeURI(data.url);
        tracePath($scope.path)
      }).error(handleError);
    };

  }]
);
