/**
 * Created by dzirtbry on 10/18/15.
 */
var TOKEN_URL = "http://192.168.0.2:8888/training-planner/api/oauth/token";
var USERS_URL = "http://192.168.0.2:8888/training-planner/api/users";
var ME_URL = "http://192.168.0.2:8888/training-planner/api/users/me";
var USER_URL = "http://192.168.0.2:8888/training-planner/api/users/";

angular.module('philosophySearchApp')
  .factory('userApiClient', ['$http', '$q', function ($http, $q) {
    var userApiClient = {
      /**
       * Login by username and password.
       * @param username username
       * @param password password
       * @returns {*}
       */
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
      logout: function () {
        return $q(function (resolve, reject) {
          resolve({});
        });
      },
      me: function () {
        return $http({
          url: ME_URL,
          method: "GET",
          withCredential: true
        });
      },
      user: function (id) {
        return $http({
          url: USER_URL+id,
          method: "GET",
          withCredential: true
        });
      }
    };
    return userApiClient;
  }]
);
