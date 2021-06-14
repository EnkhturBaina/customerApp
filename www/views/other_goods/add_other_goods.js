otherGoods = angular.module("otherGoods.Ctrl", []);
otherGoods.controller("otherGoodsCtrl", function ($rootScope, serverDeferred, $scope, $ionicPopup, $ionicHistory) {
  $scope.addOther = function () {
    if (isEmpty($rootScope.newCarReq.unitPrice)) {
      $rootScope.alert("Та барааны үнийг оруулна уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.shopId)) {
      $rootScope.alert("Та барааны нийлүүлэгчийг сонгоно уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.categoryId)) {
      $rootScope.alert("Та барааны төрөл өө сонгоно уу", "warning");
    } else if (isEmpty($rootScope.newCarReq.picture1)) {
      $rootScope.alert("Та барааны зургийг оруулна уу", "warning");
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
        $rootScope.newCarReq = {};

        $scope.showPopup();
      } catch (ex) {}
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

  $scope.showPopup = function () {
    $ionicPopup.show({
      template: "<b>Бараа нэмэгдлээ</b></br></br>Та өөр бараа бүртгэх үү ?",
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
  //Бараа нийлүүлэгч
  $rootScope.allSupplierList = [];
  //Барааны ДЭД нийлүүлэгч
  $rootScope.subVendor = [];
  //Барааны төрөл
  $rootScope.supplierCategory = [];
  //Нийлүүлэгчийн борлуулдаг барааны төрлийн хамаарал
  $rootScope.supplierHaveCategory = [];
  //Нийлүүлэгч сонгоход тухайн нийлүүлэгчийн зардаг барааны төрлийг хадгалах
  $rootScope.selectedSupplierCategory = [];
  //Бүтээгдэхүүний төрөл (Нийлүүлэгчийн борлуулдаг барааны төрөл олоход ашиглана)
  $rootScope.suppcategoryStore = [];

  $scope.getLookUpData = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614229736963117" }).then(function (response) {
      $rootScope.supplierCategory = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" }).then(function (response) {
      $rootScope.allSupplierList = response;
      $rootScope.suppcategoryStore = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614229588590652" }).then(function (response) {
      $rootScope.supplierHaveCategory = response;
    });
  };

  $scope.getLookUpData();
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
    $scope.selectedSupplierCategory = [];

    $scope.supplierHaveCategory.map((item) => {
      if (item.categoryid === supppp) {
        $scope.selectedSupplierCategory.push(item.supplierid);
        return true;
      }
    });

    var selectedCategory = [];

    $rootScope.allSupplierList = $rootScope.suppcategoryStore.some((item) => {
      $scope.selectedSupplierCategory.map((item2) => {
        if (item2 == item.id) {
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
