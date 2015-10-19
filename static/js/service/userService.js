/**
 * Created by dzirtbry on 10/17/15.
 */


angular.module('philosophySearchApp')
  .factory('userService', ['userApiClient', 'tokenStore', function (userApiClient, tokenStore) {

    var userService = {
      model: {
        isLoggedIn: tokenStore.isValid(),
        userName: ''
      },

      login: function (username, password) {
        return userApiClient.login(username, password)
          .then(function (response) {
            tokenStore.save(response.data);
            userService.model.isLoggedIn = true;
            userService.model.userName = username;
          }, function (reason) {
            userService.model.isLoggedIn = false;
            userService.model.userName = '';
          }
        );
      },

      me: function () {
        return userApiClient.me().then(function (response) {
          userService.model.isLoggedIn = true;
          userService.model.userName = response.data.email;
        }, function (reason) {
          userService.model.isLoggedIn = false;
          userService.model.userName = '';
        });
      },

      logout: function () {
        // Cleanup cookies and invalidate token
        return userApiClient.logout().finally(function () {
          userService.model.isLoggedIn = false;
          userService.model.userName = '';
          tokenStore.remove();
        });
      },

      register: function (username, password) {
        return userApiClient.register(username, password);
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