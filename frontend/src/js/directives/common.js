(function () {
  'use strict';

  angular.module('philosophySearchApp')
    .directive('keyEnter', function () {
      return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.keyEnter, {'event': event});
            });
            event.preventDefault();
          }
        });
      };
    });

})();