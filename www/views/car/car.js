angular.module("car.Ctrl", []).controller("carCtrl", function ($scope, $state, $rootScope, serverDeferred) {
  $scope.search = {};
  $scope.searchBy = "$";
  $scope.searchBrand = {};
  $scope.searchByBrand = "$";
  // ====== cars ========
  $scope.getCarDatas = function (id) {
    $rootScope.carDatas = [];

    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727", factoryid: id }).then(function (response) {
      angular.forEach(response, function (item) {
        if (!isEmpty(item)) {
          $rootScope.carDatas.push(item);
        }
      });
      // $rootScope.carDatas = response;
    });
  };
  $scope.selectCar = function (item) {
    $rootScope.selectedCarData = item;
    $state.go("car-info");
  };
  // ====== Category ========
  $scope.categoryShowLimit = 7;
  $scope.getCategory = function () {
    $scope.catData = [];
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597644413889185" }).then(function (response) {
      $rootScope.categoryData = response;
      // console.log("categoryData", $rootScope.categoryData);
    });
  };
  $scope.showFullCategory = function () {
    // $scope.categoryShowLimit = 100;
  };
  $scope.selectCategory = function (item) {
    $scope.selectedSubCat = item;
    $scope.getCarDatas(item.factoryid);
  };
  $scope.selectCategoryBig = function (item) {
    $rootScope.selectedCategoryId = item.factoryid;
    $state.go("carlist");
  };
  $scope.clearSelectedSubCat = function () {
    $scope.selectedSubCat = "";
    $scope.getCarDatas();
  };
  // ====== First Runs ========
  $scope.getCategory();
  $scope.getCarDatas();
});
