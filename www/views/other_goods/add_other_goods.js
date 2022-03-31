otherGoods = angular.module("otherGoods.Ctrl", []);
otherGoods.controller("otherGoodsCtrl", function ($rootScope, serverDeferred, $scope, $ionicPopup, $ionicHistory) {
  $("#itemPriceOtherGoods").mask("00000000000");
  $scope.addOther = function () {
    if (isEmpty($rootScope.newCarReq.categoryId)) {
      $rootScope.alert("Та барааны төрөл өө сонгоно уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.shopId)) {
      $rootScope.alert("Бараа авах дэлгүүр сонгоно уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.subVendorId)) {
      $rootScope.alert("Дэлгүүрийн салбар сонгоно уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.unitPrice)) {
      $rootScope.alert("Авах барааны үнэ оруулна уу", "warning");
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
        $rootScope.consumerData = $rootScope.otherGoods;
        $rootScope.newCarReq = {};

        $scope.showPopup();
      } catch (ex) {}
    }
    $rootScope.calcTotalPrice();
    $rootScope.getLocalGoodsData();
  };

  $scope.showPopup = function () {
    $ionicPopup.show({
      template: "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + "Бараа нэмэгдлээ</b></br>Та өөр бараа бүртгэх үү ?" + "</div>",
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Үгүй",
          type: "button-decline",
          onTap: function () {
            $ionicHistory.goBack();
          },
        },
        {
          text: "Бүртгэх",
          type: "button-confirm",
        },
      ],
    });
  };
  //Барааны ДЭД нийлүүлэгч
  $rootScope.subVendor = [];

  $scope.goodsSourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayItemPicGoods").style.display = "block";
  };
  $scope.goodsSourceSelectOff = function () {
    document.getElementById("overlayItemPicGoods").style.display = "none";
  };
  $scope.takePhoto = function (type) {
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if (isEmpty($rootScope.newCarReq)) {
          $rootScope.newCarReq = {};
        }
        $rootScope.newCarReq[$scope.selectedImagePath] = imageData;
        $scope.$apply();
      },
      function onFail(message) {},
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
      }
    );
  };

  //Бараны нийлүүлэгч хамаарч Барааны төрөл -г lookup -д дахин сэт хийх
  $scope.changeSupCategory = function (supppp) {
    $rootScope.selectedSupplierCategory = [];

    $rootScope.supplierHaveCategory.map((item) => {
      if (item.categoryid === supppp) {
        $rootScope.selectedSupplierCategory.push(item.supplierid);
        return true;
      }
    });

    var selectedCategory = [];

    $rootScope.allSupplierList = $rootScope.suppcategoryStore.some((item) => {
      $rootScope.selectedSupplierCategory.map((item2) => {
        if (item2 == item.id && item.isactive == "1") {
          selectedCategory.push(item);
          return true;
        }
      });
    });
    $rootScope.allSupplierList = selectedCategory;
    supppp != "" ? (document.getElementById("shopId").disabled = false) : (document.getElementById("shopId").disabled = true);
  };
  $scope.changeSubVendor = function (parentId) {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619503143703351", parentId: parentId }).then(function (response) {
      if (!isEmpty(response[0])) {
        $rootScope.subVendor = response;
      } else {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619503143703351", id: parentId }).then(function (response) {
          $rootScope.subVendor = response;
        });
      }
    });
    parentId != "" ? (document.getElementById("subVendorId").disabled = false) : (document.getElementById("subVendorId").disabled = true);
  };
  $scope.hideKeyboard = function (event) {
    if (event.keyCode === 13) {
      document.activeElement.blur();
    }
  };
});
