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
              var userInfo = response.result.data.info;
              if (!isEmpty(response.result.data.vehicle)) {
                $rootScope.userVehicleData = JSON.parse(response.result.data.vehicle);
                console.log("$rootScope.userVehicleData", $rootScope.userVehicleData);

                // $rootScope.newCarReq = $rootScope.userVehicleData.list[0];
                $rootScope.autoCollDanCarData = $rootScope.userVehicleData.list[0];
                $rootScope.autoCollDanCarData.importDate = formatDate($rootScope.userVehicleData.list[0].importDate);
                console.log("$rootScope.autoCollDanCarData", $rootScope.autoCollDanCarData);
                if (!isEmpty(userInfo)) {
                  $scope.registerFunction(JSON.parse(userInfo));
                }
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
          $rootScope.loginUserInfo = response[1];
          $rootScope.loginUserInfo.id = response[1].dcapp_crmuser_dan.id;
          localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
          $state.go("car_coll");
        }
      });
    });
  };
});
