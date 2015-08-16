angular.module('philosophySearchApp', [])
  .factory('wiki', function ($http) {
    var wikiService = {
      getPhilosophyPage: function (lang) {
        return $http({
          url: "/wiki/philosophy",
          method: "GET",
          params: {"lang": lang}
        });
      },

      getNextPage: function (url) {
        return $http({
          url: "/wiki",
          method: "GET",
          params: {"url": url}
        });
      }
    };
    return wikiService;
  }
);