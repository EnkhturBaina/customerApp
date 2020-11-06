angular.module("sign.Ctrl", []).controller("signCtrl", function ($stateParams, $state, $scope) {
  $scope.loginbtn = function () {
    $state.go("login", { path: $stateParams.path });
  };
});
