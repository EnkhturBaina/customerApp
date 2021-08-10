angular.module("suppliers.Ctrl", []).controller("suppliersCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.supplierDetailFromSuppliers = function (id) {
    $rootScope.selectSupplierID = id;
    $state.go("supplier-detail");
  };
  $scope.goSearchPage = function () {
    $state.go("suppliers-search");
  };
});
