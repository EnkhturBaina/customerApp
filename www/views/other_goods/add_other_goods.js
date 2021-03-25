otherGoods = angular.module("otherGoods.Ctrl", []);
otherGoods.controller(
  "otherGoodsCtrl",
  function ($rootScope, serverDeferred, $scope, $ionicPopup, $ionicHistory) {
    $scope.asdasdasd = function () {
      localStorage.removeItem("otherGoods");
      localStorage.removeItem("otherGoodsMaxId");
    };
    // $scope.asdasdasd();
    $scope.savebtn = function () {
      if (isEmpty($rootScope.newCarReq.unitPrice)) {
        $rootScope.alert("Та барааны үнийг оруулна уу", "warning");
      } else if (isEmpty($rootScope.newCarReq.shopId)) {
        $rootScope.alert("Та барааны нийлүүлэгчийг сонгоно уу", "warning");
      } else if (isEmpty($rootScope.newCarReq.categoryId)) {
        $rootScope.alert("Та барааны төрөл өө сонгоно уу", "warning");
      }
      //  else if (isEmpty($rootScope.newCarReq.picture1)) {
      //   $rootScope.alert("Та барааны зургийг оруулна уу", "warning");
      // }
      else {
        try {
          var otherGoodFirstId = 1;
          if (localStorage.otherGoodsMaxId === undefined) {
            localStorage.setItem(
              "otherGoodsMaxId",
              JSON.stringify(otherGoodFirstId)
            );
            $rootScope.newCarReq.itemid = otherGoodFirstId;
          } else {
            var lastMaxId = localStorage.getItem("otherGoodsMaxId");
            $rootScope.newCarReq.itemid = parseInt(lastMaxId) + 1;
            localStorage.setItem(
              "otherGoodsMaxId",
              JSON.stringify($rootScope.newCarReq.itemid)
            );
          }

          $rootScope.otherGoods.push($rootScope.newCarReq);

          localStorage.setItem(
            "otherGoods",
            JSON.stringify($rootScope.otherGoods)
          );
          $rootScope.newCarReq = {};

          // document.getElementsByClassName("img-input-area")[0].style.backgroundImage = "url(../../img/note-20.png)";
          // document.getElementsByClassName("img-input-area")[0].style.opacity = "0.5";
          $scope.showPopup();
        } catch (ex) {}
        // var image = "jpg♠" + $rootScope.newCarReq.image.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");

        // var image = $rootScope.newCarReq.image.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");

        console.log("local", localStorage);
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
    //Барааны төрөл
    $rootScope.supplierCategory = [];
    //Нийлүүлэгчийн борлуулдаг барааны төрлийн хамаарал
    $rootScope.supplierHaveCategory = [];
    //Нийлүүлэгч сонгоход тухайн нийлүүлэгчийн зардаг барааны төрлийг хадгалах
    $rootScope.selectedSupplierCategory = [];
    //Бүтээгдэхүүний төрөл (Нийлүүлэгчийн борлуулдаг барааны төрөл олоход ашиглана)
    $rootScope.suppcategoryStore = [];

    $scope.getLookUpData = function () {
      serverDeferred
        .request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" })
        .then(function (response) {
          $rootScope.allSupplierList = response;
          // console.log("allSupplierList respionse", response);
        });
      serverDeferred
        .request("PL_MDVIEW_004", { systemmetagroupid: "1614229736963117" })
        .then(function (response) {
          $rootScope.supplierCategory = response;
          $rootScope.suppcategoryStore = response;
          // console.log(" supplierCategoryrespionse", response);
        });
      serverDeferred
        .request("PL_MDVIEW_004", { systemmetagroupid: "1614229588590652" })
        .then(function (response) {
          $rootScope.supplierHaveCategory = response;
          // console.log("supplierHaveCategoryrespionse", response);
        });
    };

    $scope.getLookUpData();
    $scope.goodsSourceSelectOn = function (path) {
      $scope.selectedImagePath = path;
      console.log("$scope.selectedImagePath", $scope.selectedImagePath);
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
          $rootScope.newCarReq[$scope.selectedImagePath] =
            "data:image/jpeg;base64," + imageData;
          document.getElementsByClassName(
            "img-input-area-" + $scope.selectedImagePath + ""
          )[0].style.backgroundImage =
            "url(" + $rootScope.newCarReq[$scope.selectedImagePath] + ")";
          document.getElementsByClassName(
            "img-input-area-" + $scope.selectedImagePath + ""
          )[0].style.opacity = "1";
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
        if (item.supplierid === supppp) {
          $scope.selectedSupplierCategory.push(item.categoryid);
          return true;
        }
      });

      var selectedCategory = [];

      $rootScope.supplierCategory = $rootScope.suppcategoryStore.some(
        (item) => {
          $scope.selectedSupplierCategory.map((item2) => {
            if (item2 == item.id) {
              selectedCategory.push(item);
              return true;
            }
          });
        }
      );
      $rootScope.supplierCategory = selectedCategory;
    };
    $scope.hideKeyboard = function (event) {
      if (event.keyCode === 13) {
        document.activeElement.blur();
      }
    };
  }
);
