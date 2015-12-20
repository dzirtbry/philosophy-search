/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp').config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $httpProvider.interceptors.push('authInterceptor');
}]);