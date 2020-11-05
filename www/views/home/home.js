angular.module("home.Ctrl", []).controller("homeCtrl", function($scope, $ionicPopup, $ionicLoading, serverDeferred, $ionicSlideBoxDelegate, $cordovaNetwork, $rootScope, $ionicTabsDelegate, $timeout) {
    // console.log("request list");

    // $rootScope.serverUrl = "http://dev.veritech.mn:8082/erp-services/RestWS/runJson";
    // $rootScope.imagePath = "https://dev.veritech.mn/";
    $rootScope.serverUrl = "http://leasing.digitalcredit.mn:8080/erp-services/RestWS/runJsonz";
    $rootScope.imagePath = "http://leasing.digitalcredit.mn/";
    $rootScope.serverHeader = { "content-type": "application/json;charset=UTF-8" };
    $rootScope.sessionid = "65178215-7896-4513-8e26-896df9cb36ad";
    $cordovaNetwork.isOnline = function() {
        return true;
    };

    // $ionicTabsDelegate.select(1);
    // console.log("XAXAX", $ionicTabsDelegate.$getByHandle("myHeaderTabHandle").selectedIndex(1));
    // $ionicTabsDelegate.$getByHandle("myHeaderTabHandle").select(1);

    $rootScope.newCarReq = {};
    $rootScope.hideFooter = true;
    // ========= Slide =============
    $scope.activeSlideIndex = 0;
    $rootScope.showBanner = true;
    $scope.getBanner = function() {
        document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "hidden";
        $scope.bannerData = JSON.parse(localStorage.getItem("banner"));
        serverDeferred.requestFull("PL_MDVIEW_004", { systemmetagroupid: "1597631698242718" }).then(function(data) {
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
    $scope.slideChanged = function(index) {
        $scope.activeSlideIndex = index;
    };
    $scope.nextSlideChanged = function() {
        $ionicSlideBoxDelegate.next();
        // $rootScope.showBanner = false;
    };
    $scope.endSlideChanged = function(index) {
        $ionicSlideBoxDelegate.slide(Object.keys($scope.bannerData).length - 1, 0);
        //$scope.activeSlideIndex = $scope.bannerData.length - 1;
    };
    $scope.showlogin = function() {
        document.getElementsByTagName("ion-nav-bar")[0].style.visibility = "visible";
        $rootScope.showBanner = false;
        $rootScope.hideFooter = false;
    };

    $scope.isChecked = { checked: false };
    $scope.isNotShow = function() {
        if ($scope.isChecked.checked == true) {
            localStorage.setItem("bannerNotShow", JSON.stringify($scope.isChecked.checked));
        } else {
            localStorage.removeItem("bannerNotShow");
        }
    };
    $scope.getBanner();

    // ============= glob ========================
    $rootScope.alert = function(messege) {
        if (!isEmpty($scope.alertPopup)) {
            $scope.alertPopup.close();
        }
        $scope.alertPopup = $ionicPopup.alert({
            title: "",
            template: "<style>.popup { text-align:center;}</style>" + messege + "",
            cssClass: "confirmPopup",
            buttons: [{
                text: "OK",
                type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst",
                onTap: function(e) {
                    return true;
                },
            }, ],
        });
    };
    $rootScope.checkLoginUserReq = function() {
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
    $rootScope.checkLoginUserDatas = function(correntPath, next) {
        if (!isEmpty($rootScope.loginUserInfo)) {
            if ($rootScope.checkLoginUserReq()) {
                return { now: next, nextpath: next };
            } else {
                return { now: "profile", nextpath: next };
            }
        } else {
            $rootScope.hideFooter = true;
            return { now: "sign", nextpath: next };
        }
    };
    $rootScope.ShowLoader = function() {
        $ionicLoading.show({
            showBackdrop: true,
            showDelay: 0,
            template: '<div class="loadingio-spinner-spinner-v5m2iut1fj" > <div class="ldio-agte97219x" ><div > </div > <div > </div > <div > </div > <div > </div > <div > </div > <div > </div > <div > </div > <div > </div > <div > </div > <div > </div ></div > </div >'
        });
    };
    //========= first run ==========================
    var basket = localStorage.getItem("basketData");
    // console.log("basket", basket);
    // console.log("localStorage", localStorage);
    if (!isEmpty(basket)) $rootScope.basketData = JSON.parse(basket);
    else $rootScope.basketData = [];

    $scope.getAllBankList = function() {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1603958798356" }).then(function(response) {
            $rootScope.allBankList = response;
            // console.log("$rootScope.allBankList", $rootScope.allBankList);
        });
    };

    $scope.getAllBankList();

    var bannerNotShow = localStorage.getItem("bannerNotShow");
    if (bannerNotShow == "true") {
        $scope.showlogin();
    }

    $scope.callComingSoon = function() {
        $rootScope.alert("Тун удахгүй");
    };
});