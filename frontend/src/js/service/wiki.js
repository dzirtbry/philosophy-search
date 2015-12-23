(function () {
  'use strict';

  angular.module('philosophySearchApp')
    .factory('wiki', ['$http', function ($http) {
      var wikiService = {
        getPhilosophyPage: function (lang) {
          ga('send', 'event', 'service', 'philosophy', lang);
          return $http({
            url: "/wiki/philosophy",
            method: "GET",
            params: {"lang": lang}
          });
        },

        getNextPage: function (url) {
          ga('send', 'event', 'service', 'nextPage', url);
          return $http({
            url: "/wiki",
            method: "GET",
            params: {"url": encodeURI(url)}
          });
        }
      };
      return wikiService;
    }]
  );

})();