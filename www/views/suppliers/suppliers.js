angular.module("suppliers.Ctrl", []).controller("suppliersCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.supplierDetailFromSuppliers = function (id) {
    $rootScope.selectSupplierID = id;
    $state.go("supplier-detail");
  };
  $scope.goSearchPage = function () {
    $rootScope.isNewOrSpecial = "";
    $state.go("suppliers-search");
  };
  $scope.seeAllNewOrSpecial = function (val) {
    $rootScope.isNewOrSpecial = val;
    $state.go("suppliers-search");
  };
});
