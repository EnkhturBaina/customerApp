var app = angular
  .module("index", [
    "ionic",
    "ngCordova",
    "Filters",
    "ServerServices",
    "angular.filter",
    // modules
    "home.Ctrl",
    "intro.Ctrl",
    "profile.Ctrl",
    "basket.Ctrl",
    "request_list.Ctrl",
    "request_detail.Ctrl",
    "search.Ctrl",
    "register.Ctrl",
    "sign.Ctrl",
    "login.Ctrl",
    "autoleasing.Ctrl",
    "business_loan.Ctrl",
    "car_collateral.Ctrl",
    "property_collateral.Ctrl",
    "car.Ctrl",
    "carinfo.Ctrl",
    "carlist.Ctrl",
    "qr.Ctrl",
    "trend.Ctrl",
    "otherGoods.Ctrl",
    "addOtherGoods.Ctrl",
    "reset_password.Ctrl",
    "settings.Ctrl",
    "loan_calculator.Ctrl",
    "notif.Ctrl",
    "notif_detail.Ctrl",
    "term.Ctrl",
    "danselect.Ctrl",
  ])
  .run(function ($ionicPlatform, $state, $cordovaSplashscreen) {
    $ionicPlatform.ready(function () {
      if (window.StatusBar) {
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#f8f8fe");
      }
    });

    // BACK button idevxgv bolgox
    // $ionicPlatform.registerBackButtonAction(function (e) {
    //   //do your stuff
    //   e.preventDefault();
    //   return false;
    // }, 101);
  })
  .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $cordovaInAppBrowserProvider, $sceDelegateProvider) {
    if (!window.cordova) {
      var appID = 1234567890;
      var version = "v2.0";
    }
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|chrome-extension|ionic):|data:image/);
    // $sceDelegateProvider.resourceUrlWhitelist(["self", "https://dev.veritech.mn/**"]);
    $sceDelegateProvider.resourceUrlWhitelist(["self", "https://leasing.digitalcredit.mn/**"]);

    var browserOptions = {
      location: "yes",
      toolbar: "yes",
    };

    document.addEventListener(
      "deviceready",
      function () {
        var preferences = {
          iosURL: "some URL",
          appName: "APP NAME",
          language: "EN",
        };
      },
      false
    );

    $cordovaInAppBrowserProvider.setDefaultOptions(browserOptions);
    $stateProvider.state("home", {
      url: "/views/home",
      templateUrl: "views/home/home.html",
      controller: "homeCtrl",
    });
    $stateProvider.state("requestList", {
      url: "/views/request_list",
      templateUrl: "views/request-list/request_list.html",
      controller: "requestListCtrl",
    });
    $stateProvider.state("intro", {
      url: "/views/intro",
      templateUrl: "views/intro/intro.html",
      controller: "introCtrl",
    });
    $stateProvider.state("search", {
      url: "/views/search",
      templateUrl: "views/search/search.html",
      controller: "searchCtrl",
    });
    $stateProvider.state("profile", {
      url: "/views/profile",
      templateUrl: "views/profile/profile.html",
      controller: "profileCtrl",
      params: {
        path: null,
      },
    });
    $stateProvider.state("register", {
      url: "/views/register",
      templateUrl: "views/register/register.html",
      controller: "registerCtrl",
    });
    $stateProvider.state("sign", {
      url: "/views/sign",
      templateUrl: "views/sign/sign.html",
      controller: "signCtrl",
      params: {
        path: null,
      },
    });
    $stateProvider.state("login", {
      url: "/views/login",
      templateUrl: "views/login/login.html",
      controller: "loginCtrl",
      params: {
        path: null,
      },
    });
    $stateProvider.state("autoleasing-1", {
      url: "/views/autoleasing-1",
      templateUrl: "views/loan/autoleasing/step1.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("autoleasing-2", {
      url: "/views/autoleasing-2",
      templateUrl: "views/loan/autoleasing/step2.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("autoleasing-3", {
      url: "/views/autoleasing-3",
      templateUrl: "views/loan/autoleasing/step3.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("autoleasing-4", {
      url: "/views/autoleasing-4",
      templateUrl: "views/loan/autoleasing/step4.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("autoleasing-5", {
      url: "/views/autoleasing-5",
      templateUrl: "views/loan/autoleasing/step5.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("autoleasing-bank-info", {
      url: "/views/autoleasing-bank-info",
      templateUrl: "views/loan/autoleasing/step3-bank-info.html",
      controller: "autoleasingCtrl",
    });
    $stateProvider.state("business_loan", {
      url: "/views/business_loan",
      templateUrl: "views/loan/business_loan/business_loan.html",
      controller: "business_loanCtrl",
    });
    $stateProvider.state("car_coll", {
      url: "/views/car_collateral",
      templateUrl: "views/loan/car_collateral/car_collateral.html",
      controller: "car_collateralCtrl",
    });
    $stateProvider.state("car_coll2", {
      url: "/views/car_collateral2",
      templateUrl: "views/loan/car_collateral/car_collateral2.html",
      controller: "car_collateralCtrl",
    });
    $stateProvider.state("property_collateral", {
      url: "/views/property_collateral",
      templateUrl: "views/loan/property_collateral/property_collateral.html",
      controller: "property_collateralCtrl",
    });
    $stateProvider.state("property_collateral2", {
      url: "/views/property_collateral2",
      templateUrl: "views/loan/property_collateral/property_collateral2.html",
      controller: "property_collateralCtrl",
    });
    $stateProvider.state("property_collateral_danselect", {
      url: "/views/danselect_property",
      templateUrl: "views/loan/property_collateral/danselect_property.html",
      controller: "property_collateralCtrl",
    });
    $stateProvider.state("basket", {
      url: "/views/basket",
      templateUrl: "views/basket/basket.html",
      controller: "basketCtrl",
    });
    $stateProvider.state("loan_success", {
      url: "/views/loan_success",
      templateUrl: "views/loan_success/loan_success.html",
      controller: "loan_successCtrl",
    });
    $stateProvider.state("request_detail", {
      url: "/views/request-detail/request_detail",
      templateUrl: "views/request-list/request-detail/request_detail.html",
      controller: "request_detailCtrl",
    });
    $stateProvider.state("car", {
      url: "/views/loan/car",
      templateUrl: "views/car/car.html",
      controller: "carCtrl",
    });
    $stateProvider.state("car-brandlist", {
      url: "/views/loan/car/brandlist",
      templateUrl: "views/car/brandlist.html",
      controller: "carCtrl",
    });
    $stateProvider.state("car-info", {
      url: "/views/loan/car/info",
      templateUrl: "views/car/car-info.html",
      controller: "carinfoCtrl",
    });
    $stateProvider.state("carlist", {
      url: "/views/carlist",
      templateUrl: "views/carlist/carlist.html",
      controller: "carlistCtrl",
    });
    $stateProvider.state("qr", {
      url: "/views/qr",
      templateUrl: "views/qr/qr.html",
      controller: "qrCtrl",
    });
    $stateProvider.state("trend", {
      url: "/views/trend",
      templateUrl: "views/trend/trend.html",
      controller: "trendCtrl",
    });
    $stateProvider.state("otherGoods", {
      url: "/views/otherGoods",
      templateUrl: "views/other_goods/other_goods.html",
      controller: "addOtherGoodsCtrl",
    });
    $stateProvider.state("addOtherGoods", {
      url: "/views/addOtherGoods",
      templateUrl: "views/other_goods/add_other_goods.html",
      controller: "otherGoodsCtrl",
    });
    $stateProvider.state("settings", {
      url: "/views/settings",
      templateUrl: "views/settings/settings.html",
      controller: "settingsCtrl",
    });
    $stateProvider.state("reset_password", {
      url: "/views/reset_password",
      templateUrl: "views/reset_password/reset_password.html",
      controller: "reset_passwordCtrl",
    });
    $stateProvider.state("loan_calculator", {
      url: "/views/loan_calculator",
      templateUrl: "views/loan_calculator/loan_calculator.html",
      controller: "loan_calculatorCtrl",
    });
    $stateProvider.state("contact", {
      url: "/views/contact",
      templateUrl: "views/contact/contact.html",
      controller: "contactCtrl",
    });
    $stateProvider.state("notif", {
      url: "/views/notif",
      templateUrl: "views/notif/notif.html",
      controller: "notifCtrl",
    });
    $stateProvider.state("notif_detail", {
      url: "/views/notif/notif_detail",
      templateUrl: "views/notif/notif_detail/notif_detail.html",
      controller: "notif_detailCtrl",
    });
    $stateProvider.state("danselect", {
      url: "/views/loan/danselect/danselect",
      templateUrl: "views/loan/danselect/danselect.html",
      controller: "danselectCtrl",
    });
    $stateProvider.state("term", {
      url: "/views/term",
      templateUrl: "views/term/term.html",
      controller: "termCtrl",
    });
    $stateProvider.state("income", {
      url: "/views/templates/income",
      templateUrl: "views/templates/income.html",
      controller: "autoleasingCtrl",
    });
    $urlRouterProvider.otherwise("/views/home");
  })
  .controller("index", function ($scope, $ionicPlatform, $state) {
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
  })
  .controller("indexCtrl", function ($scope, $rootScope, $ionicTabsDelegate, $state, $ionicModal) {
    $scope.toggleSideMenu = function () {
      $("#mobile").toggleClass("non-navigation");
      $("#mobile").toggleClass("navigation");
    };
    $rootScope.changeUserDan = function () {
      $rootScope.loginUserInfo = undefined;
      localStorage.removeItem("loginUserInfo");
      localStorage.removeItem("profilePictureSideMenu");
      localStorage.removeItem("all_ID");
      //Хэрэглээний лизинг
      localStorage.removeItem("otherGoods");
      localStorage.removeItem("consumerRequestData");
      localStorage.removeItem("otherGoodsMaxId");
    };
    $scope.logOut = function () {
      $rootScope.loginUserInfo = undefined;
      localStorage.removeItem("loginUserInfo");
      localStorage.removeItem("profilePictureSideMenu");
      localStorage.removeItem("all_ID");
      //Хэрэглээний лизинг
      localStorage.removeItem("otherGoods");
      localStorage.removeItem("consumerRequestData");
      localStorage.removeItem("otherGoodsMaxId");

      $rootScope.profilePictureSideMenu = "";
      $state.go("home");
    };
    $(function () {
      $("#ionNavViewMobile,#ionNavViewMobileFooter").click(function () {
        if ($("#mobile").hasClass("navigation")) {
          $scope.toggleSideMenu();
        } else if ($("#mobile").hasClass("non-navigation")) {
        }
      });
    });
    $scope.icon = "ion-arrow-down-b";
    $scope.expandMenu = function () {
      var grow = document.getElementById("side-menu-wraps");
      if (grow.clientHeight) {
        grow.style.height = 0;
        $scope.icon = "ion-arrow-down-b";
      } else {
        var wrapper = document.querySelector(".side-menu-collapsible");
        grow.style.height = wrapper.clientHeight + "px";
        $scope.icon = "ion-arrow-up-b";
      }
    };

    $scope.rangeData = { volume: "14" };
    $scope.$watch("data.volume", function () {
      // console.log("Has changed");
    });
    $scope.$watch("data.volume", function () {});
    $rootScope.hideShowFooter = function () {
      $rootScope.hideFooter = !$rootScope.hideFooter;
    };
    $rootScope.hideKeyboard = function (event) {
      if (event.keyCode === 13) {
        document.activeElement.blur();
      }
    };
  })
  .directive("format", [
    "$filter",
    function toAmount($filter) {
      return {
        require: "?ngModel",
        link: function (scope, elem, attrs, ctrl) {
          if (!ctrl) return;

          ctrl.$formatters.unshift(function (a) {
            return $filter(attrs.format)(ctrl.$modelValue, attrs.format == "currency" ? "€" : "");
          });

          elem.bind("keyup", function (event) {
            var plainNumber = elem.val().replace(/[^\d|\-+|\.+]/g, "");
            elem.val($filter(attrs.format)(plainNumber));
          });
        },
      };
    },
  ])
  .directive("selectOnClick", [
    "$window",
    function ($window) {
      return {
        restrict: "A",
        link: function (scope, element, attrs) {
          element.on("click", function () {
            if (!$window.getSelection().toString()) {
              // Required for mobile Safari
              if (!isEmpty(this.value)) this.setSelectionRange(0, this.value.length);
            }
          });
        },
      };
    },
  ])
  .directive("numOnly", numOnly)
  .directive("thousandSeparator", [
    "$timeout",
    function ($timeout) {
      return {
        require: "ngModel",
        link: function (scope, element, attrs, controller) {
          var sep = attrs.thousandSeparator || ",";
          var model = attrs.ngModel;

          console.info(model);

          var doReplace = function () {
            var curValue = element.val();
            var replace = new RegExp(sep, "g");
            var cleanValue = curValue.replace(replace, "");

            // Create dotted value from clean
            var x1 = cleanValue + "";
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
              x1 = x1.replace(rgx, "$1" + "," + "$2");
            }

            element.val(x1);

            scope.$apply(function () {
              controller.$setViewValue(cleanValue);
            });
          };

          element.on("keyup", function () {
            doReplace();
          });

          element.on("blur", function () {
            doReplace();
          });

          // trigger for existing model values
          $timeout(doReplace, 1);
        },
      };
    },
  ])
  .directive("focusMe", function ($timeout) {
    return {
      link: function (scope, element, attrs) {
        $timeout(function () {
          element[0].focus();
        }, 150);
      },
    };
  });

function numOnly() {
  var directive = {
    restrict: "A",
    scope: {
      ngModel: "=ngModel",
    },
    link: link,
  };

  return directive;

  function link(scope, element, attrs) {
    scope.$watch("ngModel", function (newVal, oldVal) {
      var arr = String(newVal).split("");
      if (arr.length === 0) return;
      if (arr.length === 1 && (arr[0] === "-" || arr[0] === ".")) return;
      if (isNaN(newVal)) {
        scope.ngModel = oldVal;
      }
    });
  }
}
