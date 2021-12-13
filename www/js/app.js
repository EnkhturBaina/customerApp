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
    "request_list.Ctrl",
    "request_detail.Ctrl",
    "register.Ctrl",
    "sign.Ctrl",
    "login.Ctrl",
    "autoleasing.Ctrl",
    "car_collateral.Ctrl",
    "property_collateral.Ctrl",
    "carinfo.Ctrl",
    "otherGoods.Ctrl",
    "addOtherGoods.Ctrl",
    "reset_password.Ctrl",
    "preLoan.Ctrl",
    // "settings.Ctrl",
    // "loan_calculator.Ctrl",
    // "carlist.Ctrl",
    // "search.Ctrl",
    // "business_loan.Ctrl",
    // "basket.Ctrl",
    // "trend.Ctrl",
    // "qr.Ctrl",
    // "car.Ctrl",
    "notif.Ctrl",
    "notif_detail.Ctrl",
    "term.Ctrl",
    "danselect.Ctrl",
    "suppliers.Ctrl",
    "suppliers-search.Ctrl",
    "supplier-detail.Ctrl",
    "purchase-inst.Ctrl",
    "eco.Ctrl",
    "building.Ctrl",
    "card.Ctrl",
    "money.Ctrl",
    "divide.Ctrl",
    "salary.Ctrl",
    "dan_page.Ctrl",
  ])
  .run(function ($ionicPlatform, $cordovaNetwork, $rootScope) {
    $ionicPlatform.ready(function () {
      if (window.StatusBar) {
        StatusBar.styleDefault();
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#f8f8fe");
      }
    });
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
    // $stateProvider.state("search", {
    //   url: "/views/search",
    //   templateUrl: "views/search/search.html",
    //   controller: "searchCtrl",
    // });
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
    $stateProvider.state("pre_loan", {
      url: "/views/pre_loan",
      templateUrl: "views/loan/pre_loan/pre_loan.html",
      controller: "pre_loanCtrl",
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
    $stateProvider.state("ident-pic", {
      url: "/views/ident-pic",
      templateUrl: "views/loan/autoleasing/ident_pic.html",
      controller: "autoleasingCtrl",
    });
    // $stateProvider.state("autoleasing-bank-info", {
    //   url: "/views/autoleasing-bank-info",
    //   templateUrl: "views/loan/autoleasing/step3-bank-info.html",
    //   controller: "autoleasingCtrl",
    // });
    // $stateProvider.state("business_loan", {
    //   url: "/views/business_loan",
    //   templateUrl: "views/loan/business_loan/business_loan.html",
    //   controller: "business_loanCtrl",
    // });
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
    // $stateProvider.state("basket", {
    //   url: "/views/basket",
    //   templateUrl: "views/basket/basket.html",
    //   controller: "basketCtrl",
    // });
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
    // $stateProvider.state("car", {
    //   url: "/views/loan/car",
    //   templateUrl: "views/car/car.html",
    //   controller: "carCtrl",
    // });
    // $stateProvider.state("car-brandlist", {
    //   url: "/views/loan/car/brandlist",
    //   templateUrl: "views/car/brandlist.html",
    //   controller: "carCtrl",
    // });
    $stateProvider.state("car-info", {
      url: "/views/loan/car/info",
      templateUrl: "views/car/car-info.html",
      controller: "carinfoCtrl",
    });
    // $stateProvider.state("carlist", {
    //   url: "/views/carlist",
    //   templateUrl: "views/carlist/carlist.html",
    //   controller: "carlistCtrl",
    // });
    // $stateProvider.state("qr", {
    //   url: "/views/qr",
    //   templateUrl: "views/qr/qr.html",
    //   controller: "qrCtrl",
    // });
    // $stateProvider.state("trend", {
    //   url: "/views/trend",
    //   templateUrl: "views/trend/trend.html",
    //   controller: "trendCtrl",
    // });
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
    // $stateProvider.state("settings", {
    //   url: "/views/settings",
    //   templateUrl: "views/settings/settings.html",
    //   controller: "settingsCtrl",
    // });
    $stateProvider.state("reset_password", {
      url: "/views/reset_password",
      templateUrl: "views/reset_password/reset_password.html",
      controller: "reset_passwordCtrl",
    });
    // $stateProvider.state("loan_calculator", {
    //   url: "/views/loan_calculator",
    //   templateUrl: "views/loan_calculator/loan_calculator.html",
    //   controller: "loan_calculatorCtrl",
    // });
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
    $stateProvider.state("suppliers", {
      url: "/views/suppliers",
      templateUrl: "views/suppliers/suppliers.html",
      controller: "suppliersCtrl",
    });
    $stateProvider.state("suppliers-search", {
      url: "/views/suppliers-search",
      templateUrl: "views/suppliers-search/suppliers-search.html",
      controller: "suppliers-searchCtrl",
    });
    $stateProvider.state("supplier-detail", {
      url: "/views/supplier-detail",
      templateUrl: "views/supplier-detail/supplier-detail.html",
      controller: "supplier-detailCtrl",
    });
    $stateProvider.state("supplier-detail2", {
      url: "/views/supplier-detail2",
      templateUrl: "views/supplier-detail/supplier-detail2.html",
      controller: "supplier-detailCtrl",
    });
    $stateProvider.state("purchase-inst", {
      url: "/views/purchase-inst",
      templateUrl: "views/purchase-inst/purchase-inst.html",
      controller: "purchase-instCtrl",
    });
    $stateProvider.state("eco", {
      url: "/views/loan/eco",
      templateUrl: "views/loan/eco/eco.html",
      controller: "ecoCtrl",
    });
    $stateProvider.state("building", {
      url: "/views/loan/building",
      templateUrl: "views/loan/building/building.html",
      controller: "buildingCtrl",
    });
    $stateProvider.state("card", {
      url: "/views/loan/card",
      templateUrl: "views/loan/card/card.html",
      controller: "cardCtrl",
    });
    $stateProvider.state("money", {
      url: "/views/loan/money",
      templateUrl: "views/loan/money/money.html",
      controller: "moneyCtrl",
    });
    $stateProvider.state("divide", {
      url: "/views/loan/divide",
      templateUrl: "views/loan/divide/divide.html",
      controller: "divideCtrl",
    });
    $stateProvider.state("salary", {
      url: "/views/loan/salary",
      templateUrl: "views/loan/salary/salary.html",
      controller: "salaryCtrl",
    });
    $stateProvider.state("dan_page", {
      url: "/views/loan/dan_page",
      templateUrl: "views/loan/dan_page/dan_page.html",
      controller: "dan_pageCtrl",
    });
    $urlRouterProvider.otherwise("/views/home");
  })
  .controller("index", function ($scope, $ionicPlatform, $state) {})
  .controller("indexCtrl", function ($scope, $rootScope, $state, $ionicPopup) {
    $rootScope.zeelmeAppVersion = "1.1.5";
    $scope.toggleSideMenu = function () {
      $("#mobile").toggleClass("non-navigation");
      $("#mobile").toggleClass("navigation");
    };
    //Дан-р нэвтэрсэн байх үед өөр customer дангаар нэвтрэх
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
      $ionicPopup.show({
        template: "<b>Та аппликейшнээс гарах уу?</b>",
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
              $rootScope.loginUserInfo = undefined;
              localStorage.removeItem("loginUserInfo");
              localStorage.removeItem("profilePictureSideMenu");
              localStorage.removeItem("all_ID");
              $rootScope.danCustomerData = {};
              $rootScope.danIncomeData = {};
              //Хэрэглээний лизинг
              localStorage.removeItem("otherGoods");
              localStorage.removeItem("consumerRequestData");
              localStorage.removeItem("otherGoodsMaxId");

              $rootScope.profilePictureSideMenu = "";
              $state.go("home");
            },
          },
        ],
      });
    };
    $(function () {
      $("#ionNavViewMobile,#ionNavViewMobileFooter").click(function () {
        if ($("#mobile").hasClass("navigation")) {
          $scope.toggleSideMenu();
        } else if ($("#mobile").hasClass("non-navigation")) {
        }
      });
    });

    $rootScope.hideShowFooter = function () {
      $rootScope.hideFooter = !$rootScope.hideFooter;
    };
    $rootScope.hideKeyboard = function (event) {
      if (event.keyCode === 13) {
        document.activeElement.blur();
      }
    };
    $rootScope.stateGoFromProfile = function () {
      if (!isEmpty($rootScope.loginUserInfo)) {
        $state.go("profile");
      } else {
        $state.go("login");
      }
      $rootScope.hideFooter = true;
    };
    $rootScope.isNumber = function (evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
      return true;
    };
    $rootScope.onlyNumbers = /^\d+$/;
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
  })
  .directive("tooltip", function () {
    return {
      restrict: "C",
      link: function (scope, element, attrs) {
        if (attrs.title) {
          var $element = $(element);
          $element.attr("title", attrs.title);
          $element.tooltipster({
            animation: attrs.animation,
            trigger: "click",
            position: "top",
            positionTracker: true,
            maxWidth: 500,
            contentAsHTML: true,
          });
        }
      },
    };
  })
  .directive("limitChar", function () {
    "use strict";
    return {
      restrict: "A",
      scope: {
        limit: "=limit",
        ngModel: "=ngModel",
      },
      link: function (scope) {
        scope.$watch("ngModel", function (newValue, oldValue) {
          if (newValue) {
            var length = newValue.toString().length;
            if (length > scope.limit) {
              scope.ngModel = oldValue;
            }
          }
        });
      },
    };
  })
  .directive("preventTypingGreater", function () {
    return {
      link: function (scope, element, attributes) {
        var oldVal = null;
        element.on("keydown keyup", function (e) {
          if (
            Number(element.val()) > Number(attributes.max) &&
            e.keyCode != 46 && // delete
            e.keyCode != 8 // backspace
          ) {
            e.preventDefault();
            element.val(oldVal);
          } else {
            oldVal = Number(element.val());
          }
        });
      },
    };
  })
  .directive("repeatDone", function () {
    return function (scope, element, attrs) {
      if (scope.$last) {
        // all are rendered
        scope.$eval(attrs.repeatDone);
      }
    };
  })
  .directive("groupedRadio", function () {
    return {
      restrict: "A",
      require: "ngModel",
      scope: {
        model: "=ngModel",
        value: "=groupedRadio",
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        element.addClass("button");
        element.on("click", function (e) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(scope.value);
          });
        });

        scope.$watch("model", function (newVal) {
          element.removeClass("button-positive");
          if (newVal === scope.value) {
            element.addClass("button-positive");
          }
        });
      },
    };
  })
  .filter("htmlToPlaintext", function () {
    return function (text) {
      return String(text).replace(/<[^>]+>/gm, "");
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
