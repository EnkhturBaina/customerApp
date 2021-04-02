angular.module("login.Ctrl", []).controller("loginCtrl", function ($scope, $http, $ionicModal, $stateParams, $rootScope, $cordovaNetwork, $ionicLoading, $state, serverDeferred) {
  $scope.inputType = "password";
  $scope.user = {};

  $rootScope.hideFooter = true;

  $(".login-mobile").mask("00000000");
  $scope.hideShowPassword = function () {
    if ($scope.inputType == "password") {
      $("#eye-icon").removeClass("ion-eye");
      $("#eye-icon").addClass("ion-eye-disabled");
      $scope.inputType = "text";
    } else {
      $scope.inputType = "password";
      $("#eye-icon").removeClass("ion-eye-disabled");
      $("#eye-icon").addClass("ion-eye");
    }
  };

  $scope.cC = function (connectClient, callBack) {
    var json = reqiuestJsonFormat($rootScope.serverUrl, {
      request: { zip: "1", command: "connectClient", sessionId: "" + connectClient.sessionid + "", parameters: { userKeyId: "" + connectClient.userkeys[0].id + "" } },
    });
    $http({
      method: "POST",
      url: $rootScope.serverUrl,
      data: json,
      headers: { "content-type": "application/json;charset=UTF-8" },
      transformResponse: [
        function (data) {
          var response = decomZ(data).replace(/\t/g, "");
          return JSON.parse(response);
        },
      ],
    }).then(
      function (response) {
        $ionicLoading.hide();
        if ($scope.loginChecks.fingerprint != "1") {
          $state.go("appHome", { beforePath: "login" });
          $rootScope.runFunctionDataView = true;
        } else {
          $scope.FingerPrintRegister();
        }
      },
      function (response) {
        if (typeof callBack === "function") {
          $ionicLoading.hide();
          callBack("Серверт холбогдоход алдаа гарлаа");
        }
      }
    );
  };
  $scope.ls = function (username, password, callBack) {
    var json = {
      request: {
        command: "login",
        zip: "1",
        isCustomer: "1",
        parameters: { username: username.toString(), password: password, isCustomer: "1" },
      },
    };
    $http({
      method: "POST",
      url: $rootScope.serverUrl,
      data: json,
      headers: { "content-type": "application/json;charset=UTF-8" },
      transformResponse: [
        function (data) {
          var response = decomZ(data).replace(/\t/g, "");
          return JSON.parse(response);
        },
      ],
    }).then(function (response) {
      if (!isEmpty(response.data) && response.data.response.status === "success") {
        $rootScope.loginUserInfo = response.data.response.result;
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", crmCustomerId: $rootScope.loginUserInfo.id }).then(function (response) {
          if (!isEmpty(response) && !isEmpty(response[0])) {
            $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
            // console.log($rootScope.loginUserInfo);

            localStorage.removeItem("loginUserInfo");
            localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

            if ($rootScope.loginUserInfo) {
            }
            $rootScope.hideFooter = false;
          }
        });
        if (isEmpty($stateParams.path)) {
          if ($rootScope.isLoginFromRequestList) {
            $state.go("requestList");
            $scope.getRequetData();
          } else {
            $state.go("profile");
          }
        } else {
          $state.go($stateParams.path);
        }
      } else {
        $ionicLoading.hide();
        $rootScope.alert("Нэр, Нууц үг буруу байна", "warning");
      }
      $rootScope.hideFooter = true;
    });
  };

  $scope.loginKey = function (value, username, password) {
    if (value.keyCode === 13) {
      $scope.Login(username, password);
      document.getElementById("userpassLogin").blur();
    }
  };
  $scope.user.username = "";
  $rootScope.isDanLogin = false;
  $scope.Login = function (a, b) {
    // $rootScope.ShowLoader();
    if (isEmpty(a)) {
      $ionicLoading.hide();
      $rootScope.alert("Нэвтрэх нэрээ оруулна уу", "warning");
    } else if (isEmpty(b)) {
      $ionicLoading.hide();
      $rootScope.alert("Нууц үгээ оруулна уу", "warning");
    } else {
      var network = $cordovaNetwork.isOnline();
      if (network) {
        $scope.ls(a, b);
      }
    }
    $rootScope.hideFooter = true;
  };
  $scope.gotoDanLogin = function () {
    serverDeferred.carCalculation({ type: "auth_auto", redirect_uri: "customerapp" }, "https://services.digitalcredit.mn/api/v1/c").then(function (response) {
      console.log("response v1 c", response);
      $rootScope.stringHtmlsLink = response.result.data;

      // window.open(, "_system", "location=yes");
      //"state": "16149527413694721614952741900321"
      var authWindow = cordova.InAppBrowser.open($rootScope.stringHtmlsLink.url, "_blank", "location=no,toolbar=no");

      $(authWindow).on("loadstart", function (e) {
        var url = e.originalEvent.url;
        console.log(url);
        var code = url.indexOf("https://services.digitalcred");
        console.log(code);
        console.log($rootScope.stringHtmlsLink.state);
        var error = /\?error=(.+)$/.exec(url);
        if (code == 0 || error) {
          authWindow.close();
        }

        if (code == 0) {
          serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://services.digitalcredit.mn/api/sso/check").then(function (response) {
            console.log("res", response);
            var userInfo = response.result.data.info;
            if (!isEmpty(userInfo)) {
              $scope.registerFunction(JSON.parse(userInfo));
            }
          });
        } else if (error) {
          console.log(error);
        }
      });
      // $ionicModal.fromTemplateUrl('views/login/bind.html', {
      //         scope: $scope,
      //         animation: 'fade-in-scale'
      //     })
      //     .then(function(modalend) {
      //         $rootScope.htmlBindModel = modalend;
      //         $rootScope.htmlBindModel.show();
      //         $ionicLoading.hide();
      //     });
    });
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
        console.log("IS REGISTERED !!!");
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
          if (isEmpty($stateParams.path)) {
            if ($rootScope.isLoginFromRequestList) {
              $state.go("requestList");
              $rootScope.isDanLogin = true;
              $scope.getRequetData();
            } else {
              $rootScope.isDanLogin = true;
              $state.go("profile");
            }
          } else {
            $state.go($stateParams.path);
          }
        }
      });
    });
  };
  $scope.closeHtmlBindBluetooth = function () {
    $scope.htmlBindModel.remove();
  };
});
