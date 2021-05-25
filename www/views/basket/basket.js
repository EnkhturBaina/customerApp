var basket = angular.module("basket.Ctrl", []);
basket.controller("basketCtrl", function ($scope, $rootScope, $state) {
  var basketData = $scope.basketData;

  $scope.basketGoLeasing = function () {
    if (!isEmpty($rootScope.selectedCarData)) {
    }
  };
  $scope.isChecked = false;
  $scope.selectCarBasket = function (item, isChecked, index) {
    if (isChecked) {
      $rootScope.selectedCarData = item;
    } else {
      $rootScope.selectedCarData = null;
    }
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
