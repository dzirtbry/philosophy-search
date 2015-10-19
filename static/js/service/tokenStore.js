/**
 * Created by dzirtbry on 10/18/15.
 */
angular.module('philosophySearchApp')
  .factory('tokenStore', ['$cookies', function ($cookies) {
    var tokenStore = {
      isValid: function () {
        return $cookies.get('access_token') ? true : false;
      },
      save: function (token) {
        $cookies.put('access_token', token.access_token);
      },
      get: function () {
        return $cookies.get('access_token');
      },
      remove: function () {
        $cookies.remove('access_token');
      }

    };
    return tokenStore;
  }]
);