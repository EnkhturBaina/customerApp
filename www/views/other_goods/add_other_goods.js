otherGoods = angular.module("otherGoods.Ctrl", []);
otherGoods.controller("otherGoodsCtrl", function ($rootScope, serverDeferred, $window, $scope) {
  $scope.asdasdasd = function () {
    localStorage.removeItem("otherGoods");
    localStorage.removeItem("otherGoodsMaxId");
  };
  //   $scope.asdasdasd();
  $scope.takePhoto = function (path) {
    navigator.camera.getPicture(
      function (imageData) {
        if (isEmpty($rootScope.newCarReq)) {
          $rootScope.newCarReq = {};
        }
        $rootScope.newCarReq.image = "data:image/jpeg;base64," + imageData;
        document.getElementsByClassName("img-input-area")[0].style.backgroundImage = "url(" + $rootScope.newCarReq.image + ")";
        document.getElementsByClassName("img-input-area")[0].style.opacity = "1";
        $scope.$apply();
      },
      function onFail(message) {
        alert("Failed because: " + message);
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
      }
    );
  };
  $scope.savebtn = function () {
    if (isEmpty($rootScope.newCarReq.amount)) {
      $rootScope.alert("Та барааны үнийг оруулна уу");
    } else if (isEmpty($rootScope.newCarReq.shopId)) {
      $rootScope.alert("Та барааны нийлүүлэгчийг сонгоно уу");
    } else if (isEmpty($rootScope.newCarReq.image)) {
      $rootScope.alert("Та барааны зургийг оруулна уу");
    } else {
      try {
        var otherGoodFirstId = 1;
        if (localStorage.otherGoodsMaxId === undefined) {
          localStorage.setItem("otherGoodsMaxId", JSON.stringify(otherGoodFirstId));
          $rootScope.newCarReq.itemid = otherGoodFirstId;
        } else {
          var lastMaxId = localStorage.getItem("otherGoodsMaxId");
          $rootScope.newCarReq.itemid = parseInt(lastMaxId) + 1;
          localStorage.setItem("otherGoodsMaxId", JSON.stringify($rootScope.newCarReq.itemid));
        }

        $rootScope.otherGoods.push($rootScope.newCarReq);
        localStorage.setItem("otherGoods", JSON.stringify($rootScope.otherGoods));
      } catch (ex) {}
      var image = "jpg♠" + $rootScope.newCarReq.image.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
      serverDeferred.request("dcApp_consumer_loan_001", { amount: $rootScope.newCarReq.amount, shopId: $rootScope.newCarReq.shopId, picture1: image }).then(function (response) {
        $rootScope.newCarReq = {};
        $rootScope.alert("Бараа нэмэгдлээ");
        document.getElementsByClassName("img-input-area")[0].style.backgroundImage = "url(../../img/note-20.png)";
        document.getElementsByClassName("img-input-area")[0].style.opacity = "0.5";

        // console.log("response", response);
      });
    }
    $rootScope.calcTotalPrice();
    $rootScope.getLocalGoodsData();
  };
  $scope.changeShop = function (item) {
    if (!isEmpty(item)) {
      var itjs = JSON.parse(item);
      $rootScope.newCarReq.shopId = itjs.id;
      $rootScope.newCarReq.shopname = itjs.suppliername;
    }
  };
  $scope.getAllSupplier = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1569899290735152" }).then(function (response) {
      $rootScope.allSupplierList = response;
      //   console.log("respionse", response);
    });
  };

  $scope.getAllSupplier();
});
