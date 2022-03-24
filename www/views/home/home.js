angular.module("home.Ctrl", []).controller("homeCtrl", function ($scope, $ionicPopup, $ionicLoading, serverDeferred, $ionicSlideBoxDelegate, $cordovaNetwork, $rootScope, $ionicTabsDelegate, $ionicHistory, $ionicPlatform, $timeout, $state) {
  // $rootScope.serverUrl = "http://dev.veritech.mn:8082/erp-services/RestWS/runJson";
  // $rootScope.imagePath = "https://dev.veritech.mn/";
  // $rootScope.serverUrl = "http://leasing.digitalcredit.mn:8080/erp-services/RestWS/runJsonz";
  // $rootScope.imagePath = "http://leasing.digitalcredit.mn/";
  $rootScope.serverUrl = "http://market.digitalcredit.mn:8086/erp-services/RestWS/runJsonz";
  $rootScope.imagePath = "http://market.digitalcredit.mn/";

  $rootScope.carMarketURL = "http://0001.mn/";
  $rootScope.carMarketStorageURL = "http://0001.mn/storage/";
  $rootScope.serverHeader = { "content-type": "application/json;charset=UTF-8" };
  $rootScope.sessionid = "65178215-7896-4513-8e26-896df9cb36ad";

  $cordovaNetwork.isOnline = function () {
    return true;
  };
  $rootScope.newCarReq = {};
  $rootScope.filterSalaries = {};
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
      template = "<div class='emoji-container'>😉</div>" + "<div class='pop-up-text-container'>" + messege + "</div>";
    } else if (checkmark == "danger") {
      template = "<div class='emoji-container'>🙁</div>" + "<div class='pop-up-text-container'>" + messege + "</div>";
    } else if (checkmark == "warning") {
      template = "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + messege + "</div>";
    } else {
      template = "<style>.popup { text-align:center;}</style>" + messege + "";
    }
    $scope.alertPopup = $ionicPopup.alert({
      title: "",
      template: template,
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Oкей",
          type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst button-dc-default",
          onTap: function (e) {
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
  console.log("localStorage", localStorage);
  localStorage.setItem("isSupplierLoan", "no");

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
    // serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363794516634" }).then(function (response) {
    //   $rootScope.carCategoryPreLoan = response;
    // });
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
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16269369396661" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.supplierConditionsNotMap = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1629173002695086" }).then(function (response) {
      if (!isEmpty(response)) {
        $rootScope.educationData = response.filter((value) => Object.keys(value).length !== 0);
      }
    });
    // serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1634710517519245" }).then(function (response) {
    //   if (!isEmpty(response)) {
    //     $rootScope.ecoProductType = response.filter((value) => Object.keys(value).length !== 0);
    //   }
    // });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614229736963117" }).then(function (response) {
      $rootScope.supplierCategory = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614229588590652" }).then(function (response) {
      $rootScope.supplierHaveCategory = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" }).then(function (response) {
      $rootScope.allSupplierList = response;
      $rootScope.suppcategoryStore = response;
    });
    // serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16347033464591" }).then(function (response) {
    //   $rootScope.supplierHaveSubCategory = response;
    // });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1634724795622863" }).then(function (response) {
      $rootScope.termContent = response[0].templatebody;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1636343385639929" }).then(function (response) {
      $rootScope.ERPappVersion = response[0].name;
      $rootScope.isAppActive = response[0].isactive;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1643091771811030" }).then(function (response) {
      $rootScope.customerSector = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16429945436111" }).then(function (response) {
      $rootScope.customerAreasOfActivity = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16429945437301" }).then(function (response) {
      $rootScope.customerJobPosition = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16431697956661" }).then(function (response) {
      $rootScope.buildingLoanTypeData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1618473508871492" }).then(function (response) {
      $rootScope.propertyCategory = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363794516634" }).then(function (datas) {
      delete datas.aggregatecolumns;
      $rootScope.carCategory = datas;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1645754816241863" }).then(function (datas) {
      delete datas.aggregatecolumns;
      $rootScope.carNumberTaken = datas;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364305380357" }).then(function (datas) {
      delete datas.aggregatecolumns;
      $rootScope.carFactoryData = datas;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364325545258" }).then(function (datas) {
      delete datas.aggregatecolumns;
      $rootScope.carModelData = datas;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "164490994564810" }).then(function (response) {
      $rootScope.coBorrowerData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "164490995509910" }).then(function (response) {
      $rootScope.ecoLoanCategoryData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "164491108544910" }).then(function (response) {
      $rootScope.ecoLoanStoreData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1645435285663193" }).then(function (response) {
      $rootScope.incomeTypeWithCondition = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430027914932" }).then(function (response) {
      $rootScope.isCarSelection = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "164612642423810" }).then(function (response) {
      $rootScope.proveIncomeData = response;
    });
    $rootScope.monthsArr = {
      auto: [6, 12, 15, 18, 24, 30, 36, 48],
      consumer: [3, 6, 12, 15, 18, 24, 30, 36],
      salary: [6, 9, 12, 18, 24, 30, 36],
      eco: [3, 6, 12, 15, 18, 24, 30, 36],
      building: [24, 48, 60, 96, 120, 240, 300, 360],
      card: [12, 24],
      autoColl: [6, 12, 18, 24, 30, 36],
      estate: [6, 12, 18, 24, 30, 36],
    };
  };
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
    document.addEventListener("offline", onOffline, false);

    function onOffline() {
      // Handle the offline event
      $ionicPopup.show({
        template: "<b>Оффлайн горимд ажиллах боломжгүй. Та интернэт холболтоо шалгана уу</b>",
        cssClass: "confirmPopup",
        buttons: [
          {
            text: "Oкей",
            type: "button-confirm",
            onTap: function () {
              ionic.Platform.exitApp();
            },
          },
        ],
      });
    }
    $rootScope.hideFooter = false;

    localStorage.removeItem("requestType");

    if (isEmpty($rootScope.loginUserInfo)) {
      $rootScope.loginUserInfo = {};
      $rootScope.loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
    }

    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    $rootScope.all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    if (!isEmpty($rootScope.loginUserInfo) && !isEmpty(all_ID)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: all_ID.crmuserid }).then(function (response) {
        $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
        localStorage.removeItem("loginUserInfo");
        localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
      });
      console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
      if (!isEmpty($rootScope.loginUserInfo) && $rootScope.loginUserInfo.lastname && $rootScope.loginUserInfo.firstname) {
        $rootScope.sidebarUserName = $rootScope.loginUserInfo.lastname.substr(0, 1) + ". " + $rootScope.loginUserInfo.firstname;
      }

      $rootScope.displayMinPayment = 0;
      $rootScope.maxMonth = 0;

      if (isEmpty($rootScope.allBankList)) $scope.getAllBankList();
      $ionicSlideBoxDelegate.update();

      $scope.getProfileLookupData();
      //App version check
      $timeout(function () {
        if (!isEmpty($rootScope.ERPappVersion) && $rootScope.zeelmeAppVersion === $rootScope.ERPappVersion) {
        } else {
          // console.log($rootScope.ERPappVersion, $rootScope.zeelmeAppVersion);
          $rootScope.checkisUpdate();
        }
        if ($rootScope.isAppActive === "0") {
          $rootScope.checkisAppActive();
        }
      }, 2000);
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
    } else {
      $state.go("login");
      $rootScope.HideLoader();
    }
  });
  $rootScope.checkisUpdate = function () {
    if (!isEmpty($scope.alertPopup)) {
      $scope.alertPopup.close();
    }
    template = "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + "Шинэ хувилбар гарсан байна шинэчлэн үү" + "</div>";
    $scope.alertPopup = $ionicPopup.alert({
      title: "",
      template: template,
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Шинэчлэх",
          type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst button-dc-default",
          onTap: function (e) {
            //play store -s zeelme duudah
            startApp
              .set({
                action: "ACTION_VIEW",
                uri: "market://details?id=com.digital.customerN",
              })
              .start();
            //Шинэчлэх darahad app haaj play store duudah
            ionic.Platform.exitApp();
            return true;
          },
        },
      ],
    });
  };
  $rootScope.checkisAppActive = function () {
    if (!isEmpty($scope.alertPopup)) {
      $scope.alertPopup.close();
    }
    template = "<div class='emoji-container'>😉</div>" + "<div class='pop-up-text-container'>" + "Уучлаарай апп засвартай байна" + "</div>";
    $scope.alertPopup = $ionicPopup.alert({
      title: "",
      template: template,
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Oкей",
          type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst button-dc-default",
          onTap: function (e) {
            ionic.Platform.exitApp();
          },
        },
      ],
    });
  };
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = false;
    $rootScope.is0001Price = false;
    $rootScope.isIncomeConfirm = true;
    $timeout(function () {
      $ionicHistory.clearCache();
    }, 300);
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

  $scope.goLoanPage = function (type, state, isactive, cat) {
    $rootScope.hideFooter = true;
    if (isactive == "active") {
      localStorage.setItem("requestType", type);
      localStorage.setItem("requestCategory", cat);
      localStorage.setItem("firstReq", "yes");
      //Дан дуудсан эсэх
      $rootScope.isDanCalled = false;
      $rootScope.requestTypeId = cat;
      $state.go(state);
    } else {
      $rootScope.alert("Тун удахгүй", "warning");
    }
  };
  $rootScope.incomeConfirm = function (id) {
    if (id === "1554263832151") {
      $rootScope.isIncomeConfirm = false;
    } else if (id === "1554263832132") {
      $rootScope.isIncomeConfirm = true;
    } else {
      $rootScope.isIncomeConfirm = "not";
    }
  };
  $rootScope.checkUserService = function (income, incomeType) {
    serverDeferred
      .requestFull("dcApp_checkUser_service", {
        register: $rootScope.danCustomerData.uniqueidentifier,
        type: parseInt($rootScope.requestTypeId),
        channel: 1626864048648,
        income: income,
        income_type: incomeType,
      })
      .then(function (response) {
        // console.log("response dan service", response);
        $rootScope.userDataFromCheckService = response[1].data;
        // console.log("$rootScope.userDataFromCheckService", $rootScope.userDataFromCheckService);
        if (response[0] == "success" && response[1].data.count !== "0") {
          $ionicPopup.show({
            template: response[1].data.message,
            cssClass: "confirmPopup",
            buttons: [
              {
                text: "Oкей",
                type: "button-confirm",
                onTap: function () {
                  $timeout(function () {
                    $ionicHistory.clearCache();
                  }, 100);
                  $state.go("home");
                },
              },
            ],
          });
        }
      });
  };
});
