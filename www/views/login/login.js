angular.module("login.Ctrl", []).controller("loginCtrl", function ($scope, $http, $ionicModal, $stateParams, $rootScope, $cordovaNetwork, $ionicLoading, $state, serverDeferred, $timeout) {
  $scope.inputType = "password";
  $scope.user = {};

  $(".login-mobile").mask("00000000");

  $rootScope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
  });
  $scope.hideShowPassword = function () {
    if ($scope.inputType == "password") {
      $("#eye-icon").removeClass("ion-eye");
      $("#eye-icon").addClass("ion-eye-disabled");
      $scope.inputType = "text";
    } else {
      $("#eye-icon").removeClass("ion-eye-disabled");
      $("#eye-icon").addClass("ion-eye");
      $scope.inputType = "password";
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
        $rootScope.HideLoader();
        if ($scope.loginChecks.fingerprint != "1") {
          $state.go("appHome", { beforePath: "login" });
          $rootScope.runFunctionDataView = true;
        } else {
          $scope.FingerPrintRegister();
        }
      },
      function (response) {
        if (typeof callBack === "function") {
          $rootScope.HideLoader();
          callBack("Серверт холбогдоход алдаа гарлаа");
        }
      }
    );
  };
  $scope.ls = function (username, password, callBack) {
    $rootScope.ShowLoader();
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
      // console.log("res", response);
      if (!isEmpty(response.data) && response.data.response.status === "success") {
        $rootScope.loginUserInfo = response.data.response.result;
        // serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", userName: `${username}` }).then(function (response) {
        serverDeferred.requestFull("dcApp_getDV_customer_income_copy_004", { mobileNumber: `${username}` }).then(function (response) {
          // console.log("res 2", response);
          if (response[0] == "success" && !isEmpty(response[1])) {
            $rootScope.loginUserInfo = mergeJsonObjs(response[1], $rootScope.loginUserInfo);

            localStorage.removeItem("loginUserInfo");
            localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

            $rootScope.profilePictureSideMenu = response[1].profilepicture;
            localStorage.removeItem("profilePictureSideMenu");
            localStorage.setItem("profilePictureSideMenu", response[1].profilepicture);

            serverDeferred.requestFull("dcApp_allUserID_004", { mobileNumber: `${username}` }).then(function (response) {
              // console.log("res", response);
              if (response[0] == "success" && !isEmpty(response[1])) {
                localStorage.setItem("ALL_ID", JSON.stringify(response[1]));
                if (isEmpty($stateParams.path)) {
                  //Login цонхноос явуулах үед Login хийх
                  $rootScope.HideLoader();
                  $state.go("home");
                  location.reload();
                  if ($rootScope.isRemmberUsername && !isEmpty($scope.user.username)) {
                    localStorage.setItem("rememberUsername", $scope.user.username);
                  }
                } else {
                  $state.go($stateParams.path);
                }
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Нэр, Нууц үг буруу байна", "warning");
              }
            });
            $rootScope.hideFooter = false;
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Бүртгэл олдсонгүй 100", "warning");
          }
        });
      } else if (response.data.response.code == "User_name_or_password_wrong") {
        $rootScope.HideLoader();
        $rootScope.alert("Нэвтрэх нэр эсэвл нууц үг буруу байна", "warning");
      } else {
        $rootScope.HideLoader();
        $rootScope.alert("Бүртгэл олдсонгүй 200", "warning");
      }
      $rootScope.hideFooter = true;
    });
  };

  $scope.loginKey = function (value, username, password) {
    if (value.keyCode === 13) {
      $scope.Login(username, password);
    }
  };

  $scope.user.username = "";
  $rootScope.isDanLogin = false;
  $rootScope.isRemmberUsername = true;

  var rememberedUsername = JSON.parse(localStorage.getItem("rememberUsername"));

  if (!isEmpty(rememberedUsername)) {
    $scope.user.username = rememberedUsername;
  }

  $scope.Login = function (a, b) {
    var value = document.getElementById("loginMobileNumber").value;
    if (isEmpty(a)) {
      $rootScope.HideLoader();
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
    } else if (value.length < 8) {
      $rootScope.HideLoader();
      $rootScope.alert("Утасны дугаараа бүрэн уу", "warning");
    } else if (isEmpty(b)) {
      $rootScope.HideLoader();
      $rootScope.alert("Нууц үгээ оруулна уу", "warning");
    } else {
      var network = $cordovaNetwork.isOnline();
      if (network) {
        $scope.ls(a, b);
      }
    }
    $rootScope.hideFooter = true;
  };
  $scope.closeHtmlBindBluetooth = function () {
    $scope.htmlBindModel.remove();
  };
});
