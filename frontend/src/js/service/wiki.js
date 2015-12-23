(function () {
  'use strict';


  angular.module('philosophySearchApp')
    .factory('wiki', ['$http', 'API', function ($http, API) {
      var wikiService = {
        getPhilosophyPage: function (lang) {
          ga('send', 'event', 'service', 'philosophy', lang);
          return $http({
            url: API.ENDPOINT + "/wiki/philosophy",
            method: "GET",
            params: {"lang": lang}
          });
        },

        getNextPage: function (url) {
          ga('send', 'event', 'service', 'nextPage', url);
          return $http({
            url: API.ENDPOINT + "/wiki",
            method: "GET",
            params: {"url": encodeURI(url)}
          });
        }
      };
      return wikiService;
    }]
  );

})();