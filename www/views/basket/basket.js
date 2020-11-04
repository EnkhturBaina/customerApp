var basket = angular.module("basket.Ctrl", []);
basket.controller("basketCtrl", function ($scope, $rootScope, $ionicPlatform, $state) {
  var basketData = $scope.basketData;
  // console.log("basketData", basketData);

  $scope.basketGoLeasing = function () {
    if (!isEmpty($rootScope.selectedCarData)) {
      var next = $rootScope.checkLoginUserDatas("basket", "autoleasing-2");
      $state.go(next.now, { path: next.nextpath });
    }
  };
  $scope.isChecked = false;
  // $scope.selected = [];
  $scope.selectCarBasket = function (item, isChecked, index) {
    if (isChecked) {
      // $scope.selected.push(item);

      $rootScope.selectedCarData = item;
    } else {
      // var _index = $scope.selected.indexOf(item);
      // $scope.selected.splice(_index, 1);

      $rootScope.selectedCarData = null;
    }
    // $rootScope.selectedCarData = $scope.selected;
    // console.log("$rootScope.selectedCarData", $rootScope.selectedCarData);
    // console.log("basketData", basketData);
  };

  $scope.sumPrice = 0;
  $scope.calcTotalPrice = function () {
    $scope.sumPrice = 0;
    for (var i = 0; i < basketData.length; i++) {
      $scope.sumPrice += basketData[i].itemquantity * parseInt(basketData[i].price);
    }
  };
  $scope.calcTotalPrice();

  $scope.basketDelete = function (id) {
    for (var i = 0; i < basketData.length; i++) {
      if (basketData[i].id === id) {
        basketData.splice(i, 1);
        $scope.calcTotalPrice();
      }
    }

    localStorage.removeItem("basketData");
    localStorage.setItem("basketData", JSON.stringify(basketData));
  };
  $scope.increaseQuantity = function (id) {
    for (var i = 0; i < basketData.length; i++) {
      if (basketData[i].id === id) {
        basketData[i].itemquantity = parseInt(basketData[i].itemquantity) + 1;
        $scope.calcTotalPrice();
      }
    }
    localStorage.removeItem("basketData");
    localStorage.setItem("basketData", JSON.stringify(basketData));
  };
  $scope.decreaseQuantity = function (id) {
    for (var i = 0; i < basketData.length; i++) {
      if (basketData[i].id === id) {
        if (basketData[i].itemquantity > 1) {
          basketData[i].itemquantity = parseInt(basketData[i].itemquantity) - 1;
          $scope.calcTotalPrice();
        }
      }
    }
    localStorage.removeItem("basketData");
    localStorage.setItem("basketData", JSON.stringify(basketData));
  };
});
