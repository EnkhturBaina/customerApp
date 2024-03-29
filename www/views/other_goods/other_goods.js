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
    if (isEmpty($rootScope.consumerData)) {
      $rootScope.consumerData = JSON.parse(localStorage.getItem("otherGoods"));
      if (!isEmpty($rootScope.consumerData)) {
        $rootScope.selectedSupplierID = $rootScope.consumerData[0].shopId;
      }
    }
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
      $rootScope.isIncomeConfirm = true;
      $state.go("autoleasing-2");
    } else {
      $rootScope.alert("Та зээлээр авах бараагаа бүртгэнэ үү", "warning");
    }
  };

  $scope.otherGoodsDelete = function (id) {
    $ionicPopup.show({
      template: "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + "Та бүртгэсэн бараагаа буцаахдаа итгэлтэй байна уу?" + "</div>",
      cssClass: "confirmPopup goods-popup",
      buttons: [
        {
          text: "ҮГҮЙ",
          type: "button-decline",
        },
        {
          text: "Тийм",
          type: "button-confirm",
          onTap: function () {
            for (var i = 0; i < $rootScope.otherGoodsData.length; i++) {
              if ($rootScope.otherGoodsData[i].itemid === id) {
                $rootScope.otherGoodsData.splice(i, 1);

                localStorage.removeItem("otherGoods");
                localStorage.setItem("otherGoods", JSON.stringify($rootScope.otherGoodsData));
                $rootScope.consumerData = $rootScope.otherGoodsData;

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

  $rootScope.hideFooter = true;

  $scope.clickSlidePager = function (index) {
    $ionicSlideBoxDelegate.slide(index);
  };

  $scope.$on("$ionicView.enter", function () {
    $rootScope.is0001Price = false;
    $rootScope.getLocalGoodsData();
    $rootScope.calcTotalPrice();
    $rootScope.newReqiust = {};
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
    var firstReq = localStorage.getItem("firstReq");

    if (firstReq === "yes" && $state.current.name == "otherGoods") {
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
    }
    $rootScope.filteredMonths = [];
    localStorage.setItem("firstReq", "no");
    !isEmpty($rootScope.otherGoods) ? ($rootScope.showSec = false) : ($rootScope.showSec = true);
  });
  $scope.clearAllProduct = function () {
    localStorage.removeItem("otherGoods");
    $rootScope.otherGoods = [];
    $rootScope.showSec = true;
    $rootScope.sumPrice = 0;
  };
});
