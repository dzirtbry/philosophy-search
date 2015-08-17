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
    $scope.path = [];
    $scope.tracing = false;
    $scope.input = {
      url: "https://en.wikipedia.org/wiki/Anarchy"
    };
    $scope.target = {
      name: 'Philosophy',
      url: "https://en.wikipedia.org/wiki/Philosophy"
    };
    $scope.error = {
      on: false,
      message: ''
    };

    function reset() {
      $scope.path = [];
      $scope.tracing = false;
      $scope.error = {
        on: false,
        message: ''
      };
    }

    function extractLanguage(url) {
      return url.match("https?://([a-z]+)\.wikipedia.org")[1];
    }

    function extractWord(url) {
      return url.slice($scope.input.url.lastIndexOf('/') + 1);
    }

    function handleError(data, status, xhr) {
      $scope.tracing = false;
      $scope.error.on = true;
      $scope.error.message = data.message;
    }

    function analyzeResponse(data, path) {
      var page = {name: decodeURIComponent(data.name), url: decodeURIComponent(data.url), type: ''};

      if (page.url.length == 0) {
        path[path.length - 1].type = 'last';
        handleError({message: page.name});
        ga('send', 'event', 'trace', 'finish', 'last');
        ga('send', 'event', 'trace', 'hops', path[0].name + '' + path.length);
        return null;
      }

      path.map(function (element) {
        if (element.url == page.url) {
          element.type = 'circle';
          page.type = 'circle';
          ga('send', 'event', 'trace', 'finish', 'circle');
        }
      });

      if (page.url.toLowerCase() === $scope.target.url.toLowerCase()) {
        page.type = 'target';
        ga('send', 'event', 'trace', 'finish', 'target');
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
        var nextPage = analyzeResponse(data, path);
        if (nextPage != undefined && nextPage != null) {
          path.push(nextPage);
        }
        tracePath(path);
      }).error(handleError);
    }

    $scope.trace = function () {
      ga('send', 'event', 'trace', 'start', $scope.input.url, 1);
      reset();
      $scope.tracing = true;

      var url = $scope.input.url;
      var word = extractWord(url);
      var lang = extractLanguage(url);
      var page = {name: decodeURI(word), url: decodeURI(url), type: ''};
      $scope.input.url = decodeURI(url);
      $scope.path.push(page);
      wiki.getPhilosophyPage(lang).success(function (data) {
        $scope.target.name = decodeURI(data.name);
        $scope.target.url = decodeURI(data.url);
        tracePath($scope.path)
      }).error(handleError);
    };

  }]
);
