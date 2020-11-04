angular.module("addOtherGoods.Ctrl", []).controller("addOtherGoodsCtrl", function ($rootScope, serverDeferred, $window, $scope, $state) {
  $rootScope.otherGoods = [];
  $rootScope.newCarReq = {};
  var otherGoodsData = [];
  $rootScope.getLocalGoodsData = function () {
    otherGoodsData = JSON.parse(localStorage.getItem("otherGoods"));
    console.log("otherGoodsData", otherGoodsData);
  };
  $rootScope.getLocalGoodsData();
  $rootScope.calcTotalPrice = function () {
    var local = localStorage.getItem("otherGoods");
    $scope.sumPrice = 0;
    if (!isEmpty(local) && local != "undefined") {
      $rootScope.otherGoods = JSON.parse(localStorage.getItem("otherGoods"));
      for (var i = 0; i < $rootScope.otherGoods.length; i++) {
        $scope.sumPrice += parseInt($rootScope.otherGoods[i].amount);
      }
    }
  };
  $rootScope.calcTotalPrice();
  $scope.selectCarBasket = function (item) {
    console.log(item);
  };
  $scope.nexClivk = function () {
    $state.go("autoleasing-2");
  };
  $scope.otherGoodsDelete = function (id) {
    for (var i = 0; i < otherGoodsData.length; i++) {
      if (otherGoodsData[i].itemid === id) {
        otherGoodsData.splice(i, 1);

        localStorage.removeItem("otherGoods");
        localStorage.setItem("otherGoods", JSON.stringify(otherGoodsData));

        $rootScope.calcTotalPrice();
        $rootScope.getLocalGoodsData();
      }
    }
  };
});
