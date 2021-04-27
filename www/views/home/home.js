angular.module("home.Ctrl", []).controller("homeCtrl", function ($scope, $ionicPopup, $ionicLoading, serverDeferred, $ionicSlideBoxDelegate, $cordovaNetwork, $rootScope, $ionicTabsDelegate, $ionicHistory, $ionicPlatform, $state) {
  // $rootScope.serverUrl = "http://dev.veritech.mn:8082/erp-services/RestWS/runJson";
  // $rootScope.imagePath = "https://dev.veritech.mn/";
  $rootScope.serverUrl = "http://leasing.digitalcredit.mn:8080/erp-services/RestWS/runJsonz";
  $rootScope.imagePath = "http://leasing.digitalcredit.mn/";

  $rootScope.carMarketURL = "http://0001.mn/";
  $rootScope.serverHeader = { "content-type": "application/json;charset=UTF-8" };
  $rootScope.sessionid = "65178215-7896-4513-8e26-896df9cb36ad";

  $cordovaNetwork.isOnline = function () {
    return true;
  };
  $rootScope.newCarReq = {};
  $rootScope.hideFooter = false;
  // ========= Slide =============
  $scope.activeSlideIndex = 0;
  $rootScope.showBanner = true;
  $scope.getBanner = function () {
    document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "hidden";
    $scope.bannerData = JSON.parse(localStorage.getItem("banner"));
    serverDeferred.requestFull("PL_MDVIEW_004", { systemmetagroupid: "1597631698242718" }).then(function (data) {
      // console.log(data);
      delete data[1].aggregatecolumns;
      delete data[1].paging;
      if (!isEmpty(data[1])) {
        $scope.bannerData = data[1];
        localStorage.setItem("banner", JSON.stringify(data[1]));
        $ionicSlideBoxDelegate.update();
      }
    });
  };
  $scope.slideChanged = function (index) {
    $scope.activeSlideIndex = index;
  };
  $scope.nextSlideChanged = function () {
    $ionicSlideBoxDelegate.next();
    // $rootScope.showBanner = false;
  };
  $scope.endSlideChanged = function (index) {
    $ionicSlideBoxDelegate.slide(Object.keys($scope.bannerData).length - 1, 0);
    //$scope.activeSlideIndex = $scope.bannerData.length - 1;
  };
  $scope.showlogin = function () {
    document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "visible";
    $rootScope.showBanner = false;
    $rootScope.hideFooter = false;
  };

  $scope.isBanneNotShowChecked = { checked: false };
  $scope.isNotShow = function () {
    if ($scope.isBanneNotShowChecked.checked == true) {
      localStorage.setItem("bannerNotShow", JSON.stringify($scope.isBanneNotShowChecked.checked));
    } else {
      localStorage.removeItem("bannerNotShow");
    }
  };
  $scope.getBanner();

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
  $rootScope.checkLoginUserReq = function () {
    if (isEmpty($rootScope.loginUserInfo.incometypeid)) {
      return false;
    } else if (isEmpty($rootScope.loginUserInfo.monthlyincome)) {
      return false;
    } else if (isEmpty($rootScope.loginUserInfo.totalincomehousehold)) {
      return false;
    } else if (isEmpty($rootScope.loginUserInfo.monthlypayment)) {
      return false;
    } else {
      return true;
    }
  };
  $rootScope.checkLoginUserDatas = function (correntPath, next) {
    if (!isEmpty($rootScope.loginUserInfo)) {
      if ($rootScope.checkLoginUserReq()) {
        return { now: next, nextpath: next };
      } else {
        return { now: "profile", nextpath: next };
      }
    } else {
      $rootScope.hideFooter = true;
      return { now: "login", nextpath: next };
    }
  };
  $rootScope.ShowLoader = function () {
    $ionicLoading.show({
      showBackdrop: true,
      showDelay: 0,
      template: '<div class="custom-spinner"><div></div><div class="custom-dot"></div><div></div><div class="custom-dot"></div></div>',
    });
  };
  //========= first run ==========================
  var basket = localStorage.getItem("basketData");
  // console.log("basket", basket);
  // console.log("localStorage", localStorage);
  if (!isEmpty(basket)) $rootScope.basketData = JSON.parse(basket);
  else $rootScope.basketData = [];

  $scope.getAllBankList = function () {
    serverDeferred.carCalculation({ type: "allBanks" }).then(function (response) {
      $rootScope.allBankList = response.result.data;
      // console.log("allBanks", response.result.data);
    });
  };

  $scope.getAllBankList();

  var bannerNotShow = localStorage.getItem("bannerNotShow");
  if (bannerNotShow == "true") {
    $scope.showlogin();
  }

  $scope.callComingSoon = function () {
    $rootScope.alert("Тун удахгүй", "warning");
  };

  localStorage.removeItem("requestType");
  $rootScope.loginUserInfo = {};
  $rootScope.loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
  console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
  if (!isEmpty($rootScope.loginUserInfo) && $rootScope.loginUserInfo.lastname && $rootScope.loginUserInfo.firstname) {
    $rootScope.sidebarUserName = $rootScope.loginUserInfo.lastname.substr(0, 1) + ". " + $rootScope.loginUserInfo.firstname;
  }
  //Утасны back button
  $ionicPlatform.onHardwareBackButton(function () {
    $rootScope.hideFooter = false;
  });

  $ionicPlatform.registerBackButtonAction(function (e) {
    e.preventDefault();
    // if ($ionicHistory.viewHistory().currentView.stateName == "requestList") {
    //   $state.go("home");
    // } else
    if ($ionicHistory.viewHistory().backView) {
      $ionicHistory.viewHistory().backView.go();
    } else {
      $ionicPopup.show({
        template: "<b>Апп -г хаах уу ?</b>",
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
    }

    return false;
  }, 101);
  $rootScope.profilePictureSideMenu = localStorage.getItem("profilePictureSideMenu");

  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = false;
  });
});
