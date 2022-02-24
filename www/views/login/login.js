angular.module("login.Ctrl", []).controller("loginCtrl", function ($scope, $http, $ionicModal, $stateParams, $rootScope, $cordovaNetwork, $ionicLoading, $state, serverDeferred, $timeout) {
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
      console.log("res", response);
      if (!isEmpty(response.data) && response.data.response.status === "success") {
        $rootScope.loginUserInfo = response.data.response.result;
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", userName: `${username}` }).then(function (response) {
          console.log("res 2", response);
          if (!isEmpty(response) && !isEmpty(response[0])) {
            $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

            localStorage.removeItem("loginUserInfo");
            localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

            $rootScope.profilePictureSideMenu = response[0].profilepicture;
            localStorage.removeItem("profilePictureSideMenu");
            localStorage.setItem("profilePictureSideMenu", response[0].profilepicture);

            serverDeferred.requestFull("dcApp_allUserID_004", { mobileNumber: `${username}` }).then(function (response) {
              console.log("res", response);
              if (response[0] == "success" && !isEmpty(response[1])) {
                localStorage.setItem("ALL_ID", JSON.stringify(response[1]));
                if (isEmpty($stateParams.path)) {
                  //Банк цэснээс Login хийх
                  if ($rootScope.isLoginFromRequestList) {
                    $rootScope.HideLoader();
                    $state.go("requestList");
                    $scope.getRequetData();
                  } else {
                    //Хүсэлт явуулах үед Login хийх
                    if ($rootScope.loginFromAutoLeasing) {
                      $rootScope.HideLoader();
                      $state.go("autoleasing-4");
                      // $rootScope.alert("Та гараар мэдээллээ бөглөсөн тохиолдолд зээл олгох байгууллагаас нэмэлт материал авах хүсэлт ирэхийг анхаарна уу", "");
                      var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
                      //Нэвтэрсэн үед мэдээлэл татах
                      if (!isEmpty($rootScope.loginUserInfo)) {
                        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: all_ID.crmuserid }).then(function (responseCustomerData) {
                          // console.log("responseCustomerData", responseCustomerData);
                          if (responseCustomerData[0] != "") {
                            $rootScope.danCustomerData = responseCustomerData[0];
                            $rootScope.danCustomerData.id = all_ID.dccustomerid;
                            // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
                              // console.log("get income data response", response);
                              if (response[0] != "") {
                                $rootScope.danIncomeData = response[0];
                              }
                            });
                          }
                        });
                      }
                    } else if ($rootScope.loginFromAutoColl) {
                      $rootScope.HideLoader();
                      $state.go("car_coll");
                    } else if ($rootScope.loginFromProperty) {
                      $rootScope.HideLoader();
                      $state.go("property_collateral");
                    } else {
                      //Login цонхноос явуулах үед Login хийх
                      $rootScope.HideLoader();
                      $state.go("home");
                      location.reload();
                    }
                  }
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
            $rootScope.alert("Нэр, Нууц үг буруу байна", "warning");
          }
        });
      } else {
        $rootScope.HideLoader();
        $rootScope.alert("Нэр, Нууц үг буруу байна", "warning");
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
