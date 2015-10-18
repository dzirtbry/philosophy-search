/**
 * Created by dzirtbry on 10/17/15.
 */
var TOKEN_URL = "http://localhost:8888/training-planner/api/oauth/token";
var USERS_URL = "http://localhost:8888/training-planner/api/users";
var ME_URL = "http://localhost:8888/training-planner/api/users/me";

angular.module('philosophySearchApp')
  .factory('userService', ['$http', 'tokenStore', function ($http, tokenStore) {

    var userService = {
      model: {
        isLoggedIn: false,
        userName: ''
      },

      login: function (username, password) {
        return $http({
          url: TOKEN_URL,
          method: "POST",
          withCredential: true,
          headers: {
            'Content-Type': "application/x-www-form-urlencoded",
            'Authorization': "Basic MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM="
          },
          data: $.param({
            username: username,
            password: password,
            grant_type: "password"
          })
        });
      },

      me: function () {

      },

      logout: function () {
        // Cleanup cookies and invalidate token
        //return $http({
        //  url: TOKEN_URL,
        //  method: "DELETE",
        //  withCredential: true,
        //  headers: {
        //    'Content-Type': "application/x-www-form-urlencoded",
        //    'Authorization': "Basic MzUzYjMwMmM0NDU3NGY1NjUwNDU2ODdlNTM0ZTdkNmE6Mjg2OTI0Njk3ZTYxNWE2NzJhNjQ2YTQ5MzU0NTY0NmM="
        //  },
        //  data: token
        //  });
        return $q(function (resolve, reject) {
          resolve({});
        });
      },

      register: function (username, password) {
        return $http({
          url: USERS_URL,
          method: "POST",
          headers: {'Content-Type': "application/json; charset=utf-8"},
          data: {
            user: {
              email: username
            },
            password: password
          }
        });
      },

      isLoggedIn: function () {
        return userService.model.isLoggedIn;
      }
      ,

      userName: function () {
        return userService.model.userName;
      }
    };

    return userService;
  }]
);