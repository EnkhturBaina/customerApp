app.controller("loan_successCtrl", function ($scope, $rootScope, $state) {
  $scope.goBankMenu = function () {
    $state.go("requestList");
    $rootScope.hideFooter = false;
  };
});
