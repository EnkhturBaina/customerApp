angular.module("supplier-detail.Ctrl", []).controller("supplier-detailCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.supplierName = [{ title: "supplierName" }];

  $scope.$on("$ionicView.loaded", function (ev, info) {
    $rootScope.ShowLoader();
    $rootScope.dcSuppliers.map((el) => {
      if (el.id == $rootScope.selectSupplierID) {
        $scope.selectedSupplierData = el;
      }
    });
    $scope.supplierName[0].title = $scope.selectedSupplierData.suppliername;
  });

  $scope.$on("$ionicView.enter", function (ev, info) {
    if (!isEmpty($scope.selectedSupplierData)) {
      console.log("$scope.selectedSupplierData", $scope.selectedSupplierData);
      $rootScope.HideLoader();
    }
  });
});
