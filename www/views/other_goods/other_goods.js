angular.module("addOtherGoods.Ctrl", []).controller("addOtherGoodsCtrl", function ($rootScope, serverDeferred, $window, $scope, $state) {
  $rootScope.otherGoods = [];
  $rootScope.newCarReq = {};
  $rootScope.otherGoodsData = [];

  $rootScope.suppliers = [];
  $rootScope.getLocalGoodsData = function () {
    $rootScope.otherGoodsData = JSON.parse(localStorage.getItem("otherGoods"));
    // console.log("otherGoodsData", otherGoodsData);
    console.log("$rootScope.otherGoodsData", $rootScope.otherGoodsData);
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" }).then(function (response) {
      $rootScope.suppliers = response;
      // console.log("allSupplierList respionse", response);
    });
  };
  $rootScope.getLocalGoodsData();
  //Нийт үнэ
  $rootScope.sumPrice = 0;
  $rootScope.calcTotalPrice = function () {
    var local = localStorage.getItem("otherGoods");
    if (!isEmpty(local) && local != "undefined") {
      $rootScope.otherGoods = JSON.parse(localStorage.getItem("otherGoods"));
      for (var i = 0; i < $rootScope.otherGoods.length; i++) {
        $rootScope.sumPrice += parseInt($rootScope.otherGoods[i].unitPrice);
      }
    }
  };
  $rootScope.calcTotalPrice();

  $scope.nexClivk = function () {
    if ($rootScope.otherGoodsData.length >= 1) {
      $state.go("autoleasing-2");
    } else {
      $rootScope.alert("Та зээлээр авах бараагаа бүртгэнэ үү", "warning");
    }
    localStorage.setItem("requestType", "consumer");
    console.log("local", localStorage);
  };

  $scope.otherGoodsDelete = function (id) {
    for (var i = 0; i < $rootScope.otherGoodsData.length; i++) {
      if ($rootScope.otherGoodsData[i].itemid === id) {
        $rootScope.otherGoodsData.splice(i, 1);

        localStorage.removeItem("otherGoods");
        localStorage.setItem("otherGoods", JSON.stringify($rootScope.otherGoodsData));

        $rootScope.calcTotalPrice();
        $rootScope.getLocalGoodsData();
      }
    }
  };

  $scope.selectCarBasket = function (item, aa) {
    console.log(item);
    console.log("aa", aa);
  };
});
