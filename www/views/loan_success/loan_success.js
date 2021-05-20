app.controller("loan_successCtrl", function ($scope, $rootScope) {
  $scope.goBankMenu = function () {
    console.log("ASD");
    $rootScope.hideFooter = false;
  };
});
