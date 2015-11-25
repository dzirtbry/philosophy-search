/**
 * Created by dzirtbry on 10/18/15.
 */
angular.module('philosophySearchApp')
  .factory('authInterceptor', ['tokenStore', function (tokenStore) {
    var authInterceptor = {
      request: function (config) {
        if (!config.headers.Authorization) {
          if (tokenStore.isValid()) {
            config.headers.Authorization = "Bearer " + tokenStore.get();
          }
        }
        return config;
      }
    };
    return authInterceptor;
  }]
);