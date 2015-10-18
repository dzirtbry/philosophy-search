/**
 * Created by dzirtbry on 10/18/15.
 */
angular.module('philosophySearchApp')
  .factory('tokenStore', ['$cookies', function ($cookies) {
    var tokenStore = {
      save: function(token) {
        
      },
      load: function() {

      }
    };
    return tokenStore;
  }]
);