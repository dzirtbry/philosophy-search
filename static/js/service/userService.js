/**
 * Created by dzirtbry on 10/17/15.
 */
var TOKEN_URL = "http://192.168.0.2:8888/training-planner/api/oauth/token";
var USERS_URL = "http://192.168.0.2:8888/training-planner/api/users";
var ME_URL = "http://192.168.0.2:8888/training-planner/api/users/me";

angular.module('philosophySearchApp')
  .factory('userService', ['$http', '$q', 'tokenStore', function ($http, $q, tokenStore) {

    var userService = {
      model: {
        isLoggedIn: tokenStore.isValid(),
        userName: ''
      },

      login: function (username, password) {
        return $q(function (resolve, reject) {
          $http({
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
          }).then(function (response) {
            console.log("Successful login, " + response.data.access_token);
            console.log(response);
            tokenStore.save(response.data);
            userService.model.isLoggedIn = true;
            userService.model.userName = username;
            resolve(response);
          }, function (response) {
            console.log("Non-Successful login, " + response.data);
            userService.model.isLoggedIn = false;
            userService.model.userName = '';
            reject(response);
          })
        });
      },

      me: function () {
        return $q(function (resolve, reject) {
          if (!tokenStore.isValid()) {
            reject({data: "Invalid token"});
            return;
          }
          $http({
            url: ME_URL,
            method: "GET",
            withCredential: true
          }).then(function (response) {
            userService.model.isLoggedIn = true;
            userService.model.userName = response.data.email;
            resolve(response);
          }, function (response) {
            userService.model.isLoggedIn = false;
            userService.model.userName = '';
            reject(response);
          })
        });
      },

      logout: function () {
        // Cleanup cookies and invalidate token
        return $q(function (resolve, reject) {
          userService.model.isLoggedIn = false;
          userService.model.userName = '';
          tokenStore.remove();
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
      },

      userName: function () {
        return userService.model.userName;
      }
    };

    userService.me();
    return userService;
  }]
)
;