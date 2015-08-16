angular.module('philosophySearchApp', [])
  .factory('wiki', function ($http) {
    var wikiService = {
      //getFirstLink: getFirstLink,
      //getPhilosophyLink: getPhilosophyLink;
      getFirstLink: function (url) {
        return $http({
          url: "/wiki",
          method: "GET",
          params: {"url": url}
        });
      },

      getPhilosophyLink: function (lang) {
        return $http({
          url: "/wiki/philosophy",
          method: "GET",
          params: {"lang": lang}
        });
      }
    };
    return wikiService;
  }
);