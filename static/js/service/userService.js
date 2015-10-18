/**
 * Created by dzirtbry on 10/17/15.
 */
LOGIN_URL = "/user/login";

angular.module('philosophySearchApp')
  .factory('userService', ['$http', function ($http) {


    var userService = {
      model: {
        loggedIn: false,
        userName: ''
      },

      login: function (username, password) {
        return $http({
          url: LOGIN_URL,
          method: "POST",
          data: {
            username: username,
            password: password
          }
        });
      },

      loggedIn: function () {
        return userService.model.loggedIn;
      },

      userName: function () {
        return userService.model.userName;
      }
    };

    return userService;
  }]
)
;