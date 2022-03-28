angular.module("term.Ctrl", []).controller("termCtrl", function ($rootScope, $state, $scope) {
  $rootScope.hideFooter = true;
  $scope.goHome = function () {
    $state.go("home");
    $ionicHistory.goBack();
  };
});
