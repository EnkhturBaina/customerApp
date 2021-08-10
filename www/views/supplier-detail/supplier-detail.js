angular.module("supplier-detail.Ctrl", []).controller("supplier-detailCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.supplierName = [{ title: "supplierName" }];

  console.log("dcSuppliers", $rootScope.dcSuppliers);
  console.log("$rootScope.selectSupplierID", $rootScope.selectSupplierID);

  $scope.$on("$ionicView.loaded", function (ev, info) {
    $rootScope.ShowLoader();
    $rootScope.dcSuppliers.map((el) => {
      if (el.id == $rootScope.selectSupplierID) {
        $scope.selectedSupplierData = el;
      }
    });
    console.log("$scope.selectedSupplierData", $scope.selectedSupplierData);
    $scope.supplierName[0].title = $scope.selectedSupplierData.suppliername;
  });

  $scope.$on("$ionicView.enter", function (ev, info) {
    if (!isEmpty($scope.selectedSupplierData)) {
      $rootScope.HideLoader();
    }
  });
});
