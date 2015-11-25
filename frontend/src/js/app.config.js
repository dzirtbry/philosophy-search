/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    }).
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    }).
    when('/user/:id?', {
      templateUrl: 'user/user.html',
      controller: 'UserCtrl'
    }).
    when('/game/:id', {
      templateUrl: 'game/game.html',
      controller: 'GameCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $httpProvider.interceptors.push('authInterceptor');
}]);