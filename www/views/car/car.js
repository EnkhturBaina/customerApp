angular.module("car.Ctrl", []).controller("carCtrl", function ($scope, $state, $rootScope, serverDeferred, $ionicLoading) {
  $scope.search = {};
  $scope.searchBy = "$";
  $scope.searchBrand = {};
  $scope.searchByBrand = "$";
  $scope.selectedSubCat = [];
  var brandAr = [];
  // ====== cars ========
  $rootScope.getCarDatas = function (brandAr) {
    $rootScope.ShowLoader();
    $rootScope.carDatas = [];
    if (!isEmpty(brandAr)) {
      for (i = 0; i < brandAr.length; i++) {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727", factoryid: brandAr[i].factoryid }).then(function (response) {
          angular.forEach(response, function (item) {
            if (!isEmpty(item)) {
              $rootScope.carDatas.push(item);
              // console.log("$rootScope.carDatas", $rootScope.carDatas);
              $rootScope.HideLoader();
            }
          });
        });
      }
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727" }).then(function (response) {
        angular.forEach(response, function (item) {
          if (!isEmpty(item)) {
            $rootScope.carDatas.push(item);
            // console.log("$rootScope.carDatas", $rootScope.carDatas);
            $rootScope.HideLoader();
          }
        });
      });
    }
  };
  $scope.selectCar = function (item) {
    $rootScope.selectedCarData = item;
    $state.go("car-info", {}, { reload: true });
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
    var index = brandAr.findIndex((x) => x.factoryname == item.factoryname);
    if (index === -1) {
      brandAr.push(item);
    }

    $scope.selectedSubCat = brandAr;
    $scope.getCarDatas(brandAr);
  };

  $scope.selectCategoryBig = function (item) {
    $rootScope.selectedCategoryId = item.factoryid;
    $state.go("carlist");
  };

  $scope.clearSelectedSubCat = function (id) {
    for (var i = 0; i < $scope.selectedSubCat.length; i++) {
      if ($scope.selectedSubCat[i].factoryid === id) {
        $scope.selectedSubCat.splice(i, 1);
      }
    }
    $scope.getCarDatas($scope.selectedSubCat);
  };
  // ====== First Runs ========
  $scope.getCategory();
  $scope.getCarDatas();
});
