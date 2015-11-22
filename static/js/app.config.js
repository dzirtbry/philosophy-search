/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'static/views/main.html',
      controller: 'MainCtrl'
    }).
    when('/login', {
      templateUrl: 'static/views/login.html',
      controller: 'LoginCtrl'
    }).
    when('/register', {
      templateUrl: 'static/views/register.html',
      controller: 'RegisterCtrl'
    }).
    when('/user', {
      templateUrl: 'static/user/user.html',
      controller: 'UserCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });

  $httpProvider.interceptors.push('authInterceptor');
}]);