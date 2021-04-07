angular.module("carinfo.Ctrl", []).controller("carinfoCtrl", function ($rootScope, $state, serverDeferred, $window, $scope, $ionicSlideBoxDelegate, $ionicHistory, $ionicLoading, $ionicModal, $ionicScrollDelegate, $timeout) {
  $scope.Math = $window.Math;
  $rootScope.newReqiust = {};
  $scope.selectCarName = "";
  $scope.selectedCarId = "";
  $rootScope.ShowLoader();
  // auto Leasing
  $scope.goAutoleasing = function () {
    localStorage.setItem("requestType", "auto");
    // var next = $rootScope.checkLoginUserDatas("car-info", "autoleasing-2");
    // $rootScope.hideFooter = true;
    // $state.go(next.now, { path: next.nextpath });
    $state.go("autoleasing-2");
    $rootScope.getLoanAmountFunc();
    $rootScope.calcLoanAmount();
  };
  // get car Data
  $rootScope.getCarinfo = function () {
    $rootScope.carData = [];
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", id: $rootScope.selectedCarData.id }).then(function (response) {
      console.log("res", response);
      if (!isEmpty(response[0]) && isObject(response[0])) {
        var images = [];
        if (response[0].itempic) images.push(response[0].itempic);
        if (response[0].itempic2) images.push(response[0].itempic2);
        if (response[0].itempic3) images.push(response[0].itempic3);
        if (response[0].itempic4) images.push(response[0].itempic4);
        if (response[0].itempic5) images.push(response[0].itempic5);
        if (response[0].itempic6) images.push(response[0].itempic6);
        if (response[0].itempic7) images.push(response[0].itempic7);
        if (response[0].itempic8) images.push(response[0].itempic8);
        response[0].images = images;
        $scope.carData = response[0];
        $scope.selectCarName = response[0].modelname.split(" ")[0];
        $scope.selectedCarId = response[0].id;
        $rootScope.selectedCarData = response[0];
        $scope.getbankData();
        if (!$scope.$$phase) {
          $scope.$apply();
        }
        $ionicSlideBoxDelegate.update();
      }
    });
  };
  $scope.getbankData = function () {
    $rootScope.bankList = [];
    if (!isEmpty($rootScope.selectedCarData) && !isEmpty($rootScope.selectedCarData.itemcode)) {
      // { type: "car", operation: "calculation", productCode: $rootScope.selectedCarData.itemcode }
      serverDeferred.carCalculation({ type: "allBanks" }).then(function (response) {
        $rootScope.bankList = response.result.data;
        console.log(response.result.data);
        // console.log(response);
      });
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $scope.getCarinfo();
    $timeout(function () {
      var img = document.getElementById("carImg0");
      if (img) {
        document.getElementById("carImg0").style.height = img.clientHeight + "px";
        document.getElementById("carInfoSlideBox").style.height = img.clientHeight + 30 + "px";
        $ionicLoading.hide();
      }
    }, 500);
  });
  // basket
  $scope.addtoBasket = function () {
    var value = searchJsonValue($rootScope.basketData, "id", $rootScope.selectedCarData.id);
    $rootScope.selectedCarData.itemquantity = "1";
    if (isEmpty(value)) {
      $rootScope.basketData.push($rootScope.selectedCarData);
      localStorage.setItem("basketData", JSON.stringify($rootScope.basketData));
      $rootScope.alert("Сагсанд нэмэгдлээ");
    } else {
      $rootScope.alert("Сагслагдсан байна");
    }
  };

  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };
  $scope.slideChanged = function (index) {
    var img = document.getElementById("carImg" + index);
    document.getElementById("carImg" + index).style.height = img.clientHeight + "px";
    document.getElementById("carInfoSlideBox").style.height = img.clientHeight + 30 + "px";
    $scope.slideIndex = index;
  };
  $scope.slideChangedZoom = function (index) {
    $scope.slideIndex = index;
  };
  $rootScope.newReqiust = {};

  $scope.payOn = function () {
    document.getElementById("paypopup").style.display = "block";
  };
  $scope.payOff = function () {
    document.getElementById("paypopup").style.display = "none";
  };
  $scope.tabhide = function () {
    document.getElementById("home-tab").style.display = "none";
  };
  $scope.collapse = function () {
    document.getElementById("addition-info").style.display = "block";
    document.getElementById("collapse-btn").style.display = "none";
    document.getElementById("uncollapse-btn").style.display = "block";
  };
  $scope.uncollapse = function () {
    document.getElementById("addition-info").style.display = "none";
    document.getElementById("collapse-btn").style.display = "block";
    document.getElementById("uncollapse-btn").style.display = "none";
  };
  $scope.shouldHide = function () {
    switch ($state.current.name) {
      case "statename1":
        return true;
      case "statename2":
        return true;
      default:
        return false;
    }
  };
  $scope.backFromcarInfo = function () {
    $rootScope.hideFooter = false;
    // if ($ionicHistory.viewHistory().backView.stateName == "autoleasing-2") {
    //     $state.go("car");
    // } else {
    $ionicHistory.goBack();
    // }
  };

  $scope.zoomMin = 1;
  $scope.showImages = function (index) {
    $scope.activeSlide = index;
    $scope.showModal("templates/image-zoom.html");
  };
  $scope.showModal = function (templateUrl) {
    $ionicModal
      .fromTemplateUrl(templateUrl, {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
  };
  //Close the modal
  $scope.closeModal = function () {
    $scope.modal.hide();
    $scope.modal.remove();
  };
  $scope.updateSlideStatus = function (slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle("scrollHandle" + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };
});
