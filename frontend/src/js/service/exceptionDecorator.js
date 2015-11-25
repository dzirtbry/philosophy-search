angular.module('philosophySearchApp')
  .config(['$provide', function ($provide) {
    $provide.decorator('$exceptionHandler', ['$delegate', function ($delegate) {
        return function (exception, cause) {
          $delegate(exception, cause);
          console.log("My logger " + exception);
        }
      }]
    );
  }]
);