// app.controller("danselectCtrl", function ($scope, $state, $stateParams, $rootScope, serverDeferred, $ionicPlatform, $ionicModal, $timeout) {});
angular.module("danselect.Ctrl", []).controller("danselectCtrl", function ($scope, $ionicModal, $timeout, $state, $stateParams, $rootScope, serverDeferred, $ionicPlatform) {
  $ionicModal
    .fromTemplateUrl("templates/autoColl.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (autoCollModal) {
      $scope.autoCollModal = autoCollModal;
    });
  // modals.show();
  $timeout(function () {
    $scope.autoCollModal.show();
  }, 300);

  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
  });
  $rootScope.isDanLoginAutoColl = false;
  $scope.autoCollHand = function () {
    $rootScope.isDanLoginAutoColl = false;
  };
  $rootScope.autoCollDanCarData = {};

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  $scope.gotoDanLoginDanSelect = function () {
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
    serverDeferred.carCalculation({ type: "auth_car_collateral", redirect_uri: "customerapp" }, "https://services.digitalcredit.mn/api/v1/c").then(function (response) {
      $rootScope.stringHtmlsLink = response.result.data;
      var authWindow = cordova.InAppBrowser.open($rootScope.stringHtmlsLink.url, "_blank", "location=no,toolbar=no");
      $(authWindow).on("loadstart", function (e) {
        var url = e.originalEvent.url;
        var code = url.indexOf("https://services.digitalcred");
        var error = /\?error=(.+)$/.exec(url);
        if (code == 0 || error) {
          authWindow.close();
        }

        if (code == 0) {
          serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://services.digitalcredit.mn/api/sso/check").then(function (response) {
            console.log("response autoColl DAN", response);
            if (!isEmpty(response.result.data)) {
              var userInfo = JSON.parse(response.result.data.info);
              console.log("userInfo", userInfo);
              if (!isEmpty(response.result.data.vehicle)) {
                $rootScope.userVehicleData = JSON.parse(response.result.data.vehicle);
                console.log("$rootScope.userVehicleData", $rootScope.userVehicleData);

                // $rootScope.newCarReq = $rootScope.userVehicleData.list[0];
                $rootScope.autoCollDanCarData = $rootScope.userVehicleData.list[0];
                $rootScope.autoCollDanCarData.importDate = formatDate($rootScope.userVehicleData.list[0].importDate);
                console.log("$rootScope.autoCollDanCarData", $rootScope.autoCollDanCarData);
                if (!isEmpty(userInfo)) {
                  $scope.registerFunction(userInfo);
                }

                var userSalaryInfo = JSON.parse(response.result.data.salary);
                serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.regnum.toUpperCase() }).then(function (checkedValue) {
                  console.log("checkedValue", checkedValue);
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
                    console.log("responseCustomerData", responseCustomerData);
                    if (responseCustomerData[0] != "") {
                      //Бүртгэлтэй USER -н дата татаж харуулах
                      $rootScope.danCustomerData = responseCustomerData[0];
                      $rootScope.danCustomerData.id = checkedValue[1].customerid;
                    }
                  });

                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
                    console.log("get income data response", response);
                    if (response[0] != "") {
                      $rootScope.danIncomeData = response[0];
                    }
                  });
                  console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);

                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
                    $rootScope.mortgageData = response;
                  });
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
                    $rootScope.familtStatData = response;
                  });
                });
                $timeout(function () {
                  $rootScope.danCustomerData.lastname = userInfo.lastname;
                  $rootScope.danCustomerData.firstname = userInfo.firstname;
                  $rootScope.danCustomerData.uniqueidentifier = userInfo.regnum.toUpperCase();

                  console.log("userSalaryInfo", userSalaryInfo);
                  if (userSalaryInfo) {
                    serverDeferred.carCalculation(userSalaryInfo.list, "https://services.digitalcredit.mn/api/salary").then(function (response) {
                      console.log("res salary", response);
                      $rootScope.monthlyAverage = response.result;
                      console.log("$rootScope.monthlyAverage", $rootScope.monthlyAverage);
                      $rootScope.danIncomeData.monthlyincome = response.result;
                      console.log("$rootScope.danIncomeData", $rootScope.danIncomeData);
                    });
                  }
                }, 1000);
              }
            }
          });
        } else if (error) {
          console.log(error);
        }
      });
    });
    $rootScope.isDanLoginAutoColl = true;
  };
  $scope.registerFunction = function (value) {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    var json = {
      customerCode: value.regnum.toUpperCase(),
      siRegNumber: value.regnum.toUpperCase(),
      isActive: "1",
    };
    json.dcApp_crmUser_dan = {
      userName: value.regnum.toUpperCase(),
      userId: "1",
      isActive: "1",
    };
    json.dcApp_crmUser_dan.dcApp_dcCustomer_dan = {
      familyName: value.surname,
      firstName: value.firstname,
      lastName: value.lastname,
      birthDate: value.birthDateAsText.substring(0, 10),
      uniqueIdentifier: value.regnum.toUpperCase(),
      profilePictureClob: value.image,
      isActive: "1",
      customerTypeId: "1",
    };

    serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: value.regnum.toUpperCase() }).then(function (checkedValue) {
      console.log("checkedValue", checkedValue);
      if (!isEmpty(checkedValue[1]) && !isEmpty(checkedValue[1].customerid)) {
        json.id = checkedValue[1].customerid;
        json.dcApp_crmUser_dan.id = checkedValue[1].custuserid;
        json.dcApp_crmUser_dan.dcApp_dcCustomer_dan.id = checkedValue[1].dccustomerid;
      }

      serverDeferred.requestFull("dcApp_crmCustomer_dan_001", json).then(function (response) {
        console.log("res", response);
        if (!isEmpty(response) && !isEmpty(response[0])) {
          $rootScope.loginUserInfo = {};
          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
            if (response[0] != "") {
              $rootScope.customerIncomeProfileData = response[0];
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

              localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
              console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
            } else {
            }
          });
          $state.go("car_coll");
        }
      });
    });
  };
});
