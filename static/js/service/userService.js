/**
 * Created by dzirtbry on 10/17/15.
 */
LOGIN_URL = "/user/login";

angular.module('philosophySearchApp')
  .factory('userService', ['$http', function ($http) {
    var userService = {
      login: function(username, password) {
        return $http({
          url: LOGIN_URL,
          method: "POST",
          data: {
            username: username,
            password: password
          }
        });
      }
    };

    return userService;
  }]
);