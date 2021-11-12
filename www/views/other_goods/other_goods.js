angular.module("addOtherGoods.Ctrl", []).controller("addOtherGoodsCtrl", function ($rootScope, serverDeferred, $scope, $state, $ionicPopup, $ionicModal, $timeout, $ionicSlideBoxDelegate) {
  $rootScope.otherGoods = [];
  $rootScope.newCarReq = {};
  $rootScope.otherGoodsData = [];
  $rootScope.newReqiust = {};
  $rootScope.suppliers = [];

  $rootScope.showSec = false;

  $rootScope.getLocalGoodsData = function () {
    $rootScope.otherGoodsData = JSON.parse(localStorage.getItem("otherGoods"));
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" }).then(function (response) {
      $rootScope.suppliers = response;
    });
  };
  //Нийт үнэ
  $rootScope.sumPrice = 0;
  $rootScope.calcTotalPrice = function () {
    $rootScope.sumPrice = 0;
    var local = localStorage.getItem("otherGoods");
    if (!isEmpty(local) && local != "undefined") {
      $rootScope.otherGoods = JSON.parse(localStorage.getItem("otherGoods"));
      !isEmpty($rootScope.otherGoods) ? ($rootScope.showSec = false) : ($rootScope.showSec = true);
      for (var i = 0; i < $rootScope.otherGoods.length; i++) {
        $rootScope.sumPrice += parseInt($rootScope.otherGoods[i].unitPrice);
      }
    } else if ($rootScope.otherGoods.length == 0) {
      $rootScope.sumPrice = 0;
    }
  };

  $scope.nexClivk = function () {
    if (!isEmpty($rootScope.otherGoodsData)) {
      $rootScope.newReqiust.advancePayment = "";
      $state.go("autoleasing-2");
    } else {
      $rootScope.alert("Та зээлээр авах бараагаа бүртгэнэ үү", "warning");
    }
  };

  $scope.otherGoodsDelete = function (id) {
    $ionicPopup.show({
      template: "<b>Бараа устгах уу ?</b>",
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Үгүй",
          type: "button-decline",
        },
        {
          text: "Устгах",
          type: "button-confirm",
          onTap: function () {
            for (var i = 0; i < $rootScope.otherGoodsData.length; i++) {
              if ($rootScope.otherGoodsData[i].itemid === id) {
                $rootScope.otherGoodsData.splice(i, 1);

                localStorage.removeItem("otherGoods");
                localStorage.setItem("otherGoods", JSON.stringify($rootScope.otherGoodsData));

                $rootScope.calcTotalPrice();
                $rootScope.getLocalGoodsData();
              }
            }
          },
        },
      ],
    });
    !isEmpty($rootScope.otherGoods) ? ($rootScope.showSec = false) : ($rootScope.showSec = true);
  };

  $scope.backFromOtherGoods = function () {
    $state.go("home");
  };

  // $ionicModal
  //   .fromTemplateUrl("templates/consumer.html", {
  //     scope: $scope,
  //     animation: "slide-in-up",
  //   })
  //   .then(function (consumerModal) {
  //     $scope.consumerModal = consumerModal;
  //   });
  // $timeout(function () {
  //   $scope.consumerModal.show();
  // }, 300);
  $rootScope.hideFooter = true;

  $scope.clickSlidePager = function (index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  $scope.$on("$ionicView.enter", function () {
    $rootScope.is0001Price = false;
    $rootScope.getLocalGoodsData();
    $rootScope.calcTotalPrice();
    !isEmpty($rootScope.otherGoods) ? ($rootScope.showSec = false) : ($rootScope.showSec = true);
  });
});
