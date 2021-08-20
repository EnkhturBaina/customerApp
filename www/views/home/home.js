angular.module("home.Ctrl", []).controller("homeCtrl", function ($scope, $ionicPopup, $ionicLoading, serverDeferred, $ionicSlideBoxDelegate, $cordovaNetwork, $rootScope, $ionicTabsDelegate, $ionicHistory, $ionicPlatform, $timeout, $state, $http) {
  // $rootScope.serverUrl = "http://dev.veritech.mn:8082/erp-services/RestWS/runJson";
  // $rootScope.imagePath = "https://dev.veritech.mn/";
  $rootScope.serverUrl = "http://leasing.digitalcredit.mn:8080/erp-services/RestWS/runJsonz";
  $rootScope.imagePath = "http://leasing.digitalcredit.mn/";

  $rootScope.carMarketURL = "http://0001.mn/";
  $rootScope.carMarketStorageURL = "http://0001.mn/storage/";
  $rootScope.serverHeader = { "content-type": "application/json;charset=UTF-8" };
  $rootScope.sessionid = "65178215-7896-4513-8e26-896df9cb36ad";

  $cordovaNetwork.isOnline = function () {
    return true;
  };
  $rootScope.newCarReq = {};
  // ========= Slide =============
  $scope.activeSlideIndex = 0;
  $rootScope.showBanner = true;

  $scope.getBanner = function () {
    document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "hidden";
    serverDeferred.requestFull("PL_MDVIEW_004", { systemmetagroupid: "1597631698242718" }).then(function (data) {
      // console.log(data);
      delete data[1].aggregatecolumns;
      delete data[1].paging;
      if (!isEmpty(data[1])) {
        $rootScope.bannerData = data[1];
        $ionicSlideBoxDelegate.update();
      }
    });
  };
  $scope.slideChanged = function (index) {
    $scope.activeSlideIndex = index;
  };
  $scope.nextSlideChanged = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.endSlideChanged = function (index) {
    $ionicSlideBoxDelegate.slide(Object.keys($rootScope.bannerData).length - 1, 0);
  };
  $scope.hideIntro = function () {
    document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "visible";
    $rootScope.showBanner = false;
  };

  $scope.isBanneNotShowChecked = { checked: false };
  $scope.isNotShow = function () {
    if ($scope.isBanneNotShowChecked.checked == true) {
      localStorage.setItem("bannerNotShow", JSON.stringify($scope.isBanneNotShowChecked.checked));
    } else {
      localStorage.removeItem("bannerNotShow");
    }
  };
  // ============= glob ========================
  $rootScope.alert = function (messege, checkmark, then) {
    if (!isEmpty($scope.alertPopup)) {
      $scope.alertPopup.close();
    }
    if (checkmark == "success") {
      template = '<div class="svg-box"><svg class="circular green-stroke"><circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg>' + '<svg class="checkmark green-stroke"><g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-489.57,-205.679)"><path class="checkmark__check" fill="none" d="M616.306,283.025L634.087,300.805L673.361,261.53"/></g></svg></div>' + "<style>.popup { text-align:center;}</style>" + messege + "";
    } else if (checkmark == "danger") {
      template = '<div class="svg-box"><svg class="circular red-stroke"><circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg>' + '<svg class="cross red-stroke"><g transform="matrix(0.79961,8.65821e-32,8.39584e-32,0.79961,-502.652,-204.518)"><path class="first-line" d="M634.087,300.805L673.361,261.53" fill="none"/></g>' + '<g transform="matrix(-1.28587e-16,-0.79961,0.79961,-1.28587e-16,-204.752,543.031)"><path class="second-line" d="M634.087,300.805L673.361,261.53"/></g></svg></div>' + "<style>.popup { text-align:center;}</style>" + messege + "";
    } else if (checkmark == "warning") {
      template = '<div class="svg-box"><svg class="circular yellow-stroke">' + '<circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg>' + '<svg class="alert-sign yellow-stroke">' + '<g transform="matrix(1,0,0,1,-615.516,-257.346)">' + '<g transform="matrix(0.56541,-0.56541,0.56541,0.56541,93.7153,495.69)">' + '<path class="line" d="M634.087,300.805L673.361,261.53" fill="none"/>' + "</g>" + '<g transform="matrix(2.27612,-2.46519e-32,0,2.27612,-792.339,-404.147)">' + '<circle class="dot" cx="621.52" cy="316.126" r="1.318" />' + "</g>" + "</g>" + "</svg></div>" + "<style>.popup { text-align:center;}</style>" + messege + "";
    } else {
      template = "<style>.popup { text-align:center;}</style>" + messege + "";
    }
    $scope.alertPopup = $ionicPopup.alert({
      title: "",
      template: template,
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "OK",
          type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst button-dc-default",
          onTap: function (e) {
            if (then == "profile") {
              $ionicTabsDelegate.$getByHandle("profileTabs").select(1);
            }
            return true;
          },
        },
      ],
    });
  };
  $rootScope.ShowLoader = function () {
    $ionicLoading.show({
      showBackdrop: true,
      showDelay: 0,
      template: '<div class="three-quarter-spinner"></div>',
    });
    $("#mobile").addClass("blur-full-screen");
  };

  $rootScope.HideLoader = function () {
    $ionicLoading.hide();

    $("#mobile").removeClass("blur-full-screen");
  };

  $rootScope.ShowLoader();

  //========= first run ==========================
  var basket = localStorage.getItem("basketData");
  // console.log("basket", basket);
  console.log("localStorage", localStorage);
  if (!isEmpty(basket)) $rootScope.basketData = JSON.parse(basket);
  else $rootScope.basketData = [];

  $scope.getAllBankList = function () {
    serverDeferred.carCalculation({ type: "allBanks" }).then(function (response) {
      $rootScope.allBankList = response.result.data;
      // console.log("allBanks", response.result.data);
    });
  };

  $scope.getProfileLookupData = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
      $rootScope.mortgageData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
      $rootScope.familtStatData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554274244505" }).then(function (response) {
      $rootScope.incomeType = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1620623825290326" }).then(function (response) {
      $rootScope.experiencePeriodData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1621830937132722" }).then(function (response) {
      $rootScope.consumerSuppliers = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
      $rootScope.locationData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
      $rootScope.isColl = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363794516634" }).then(function (response) {
      $rootScope.carCategoryPreLoan = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1628487627246231" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.suppliersWithCategory = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1628559883022530" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.dcSuppliers = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16269370387471" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.supplierConditions = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1629173002695086" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.educationData = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
  };
  $scope.getProfileLookupData();
  $scope.callComingSoon = function () {
    $rootScope.alert("Тун удахгүй", "warning");
  };

  //Утасны back button
  $ionicPlatform.onHardwareBackButton(function () {
    $rootScope.hideFooter = false;
  });

  $ionicPlatform.registerBackButtonAction(function (e) {
    e.preventDefault();

    if ($state.current.name == "home") {
      $ionicPopup.show({
        template: "<b>Аппликейшнийг  -г хаах уу ?</b>",
        cssClass: "confirmPopup",
        buttons: [
          {
            text: "Үгүй",
            type: "button-decline",
          },
          {
            text: "Тийм",
            type: "button-confirm",
            onTap: function () {
              ionic.Platform.exitApp();
            },
          },
        ],
      });
    } else if ($state.current.name == "loan_success") {
      $state.go("home");
    } else {
      $ionicHistory.viewHistory().backView.go();
    }

    return false;
  }, 101);
  $rootScope.profilePictureSideMenu = localStorage.getItem("profilePictureSideMenu");
  $scope.$on("$ionicView.loaded", function (ev, info) {
    $rootScope.hideFooter = false;

    localStorage.removeItem("requestType");

    $rootScope.loginUserInfo = {};
    $rootScope.loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));

    if (!isEmpty($rootScope.loginUserInfo) && $rootScope.loginUserInfo.lastname && $rootScope.loginUserInfo.firstname) {
      $rootScope.sidebarUserName = $rootScope.loginUserInfo.lastname.substr(0, 1) + ". " + $rootScope.loginUserInfo.firstname;
    }
    $rootScope.displayMinPayment = 0;
    $rootScope.maxMonth = 0;
    //dc_bank_product table -с зээлийн бүтээгдэхүүн бүрийн max зээлийн хугацаа авах
    if (isEmpty($rootScope.bankproductDtl)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1621843239702927" }).then(function (response) {
        $rootScope.bankproductDtl = response;
      });
    }
    //dc_bank_product table -с зээлийн бүтээгдэхүүн бүрийн min урьдчилгаа авах
    if (isEmpty($rootScope.bankProductMinPayment)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1621921912497648" }).then(function (response) {
        $rootScope.bankProductMinPayment = response;
      });
    }
    if (isEmpty($rootScope.allBankList)) $scope.getAllBankList();
    $ionicSlideBoxDelegate.update();
  });

  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = false;

    //Render хийгдсэн байхад бүх Slide давхардаад байгааг дахин render хийх
    $timeout(function () {
      if (!$scope.slideIndex) {
        $scope.slideIndex = 0;
      }
      $ionicSlideBoxDelegate.$getByHandle("suppliersDelegate").update();
      $ionicSlideBoxDelegate.$getByHandle("suppliersDelegate").slide($scope.slideIndex);
    }, 100);

    $ionicSlideBoxDelegate.update();
    //Хувааж төлөх зээл эсэх
    $rootScope.isSupLoan = false;
    $timeout(function () {
      $rootScope.HideLoader();
    }, 2000);
  });

  var bannerNotShow = JSON.parse(localStorage.getItem("bannerNotShow"));
  if (isEmpty(bannerNotShow)) {
    $scope.getBanner();
  } else {
    $scope.hideIntro();
  }

  $scope.supplierDetailFromHome = function (id) {
    $rootScope.selectSupplierID = id;
    $state.go("supplier-detail");
  };
});
