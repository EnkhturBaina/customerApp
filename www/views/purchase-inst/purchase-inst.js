angular.module("purchase-inst.Ctrl", []).controller("purchase-instCtrl", function ($scope, $rootScope, $ionicHistory) {
  $rootScope.hideFooter = true;
  $scope.purchaseInstBack = function () {
    $ionicHistory.goBack();
  };
});
