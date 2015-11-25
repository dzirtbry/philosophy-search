/**
 * Created by dzirtbry on 10/17/15.
 */
angular.module('philosophySearchApp')
  .controller('RegisterCtrl', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
    console.log("RegisterCtrl inited");

    $scope.model = {
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: []
    };

    function validate(model) {
      if (model.password != model.passwordConfirmation) {
        return false;
      }
      // Validate email and password
      return true;
    }

    $scope.register = function () {
      if (!validate($scope.model)) {
        console.log("Invalid input data");
        return;
      }
      console.log("Registering user");

      userService.register($scope.model.email, $scope.model.password)
        .then(function (data, status, headers, config) {
          console.log(data);
          console.log("Registered successfully");
          userService.login($scope.model.email, $scope.model.password)
            .then(function() {
              $location.path("/")
            }, function() {
              console.log("Failed to login");
            });
          // Change location to '#/'
        }, function () {
          console.log("Registration failed");
          // Emit error message
        })
    };

  }]
);