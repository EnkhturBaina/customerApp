angular.module("reset_password.Ctrl", []).controller("reset_passwordCtrl", function ($window, $state, $scope, $rootScope, $timeout, serverDeferred) {
  $(".register-mobile").mask("00000000");
  var progressBar = {
    Bar: $("#pr-progress-bar"),
    step1: $("reset-step-1"),
    step2: $("reset-step-2"),

    Next: function () {
      $("#reset-step-1").addClass("remove-step");
      $("#reset-step-1").removeClass("add-step");

      $("#reset-step-2").removeClass("remove-step");
      $("#reset-step-2").addClass("add-step");
    },
  };

  var registeredUserData = {};
  $rootScope.customerNewPassword = {};
  $rootScope.customerData = {};
  $rootScope.newPasswordHashResult = {};
  $rootScope.goBack = function () {
    $window.history.back();
  };
  $scope.smsCode = "";
  $scope.isStep1 = true;
  $scope.isStep2 = false;
  $scope.hideShowPassword = function (inputName) {
    if (document.getElementById(inputName).type == "password") {
      $("#" + inputName + "-eye-icon").removeClass("ion-eye");
      $("#" + inputName + "-eye-icon").addClass("ion-eye-disabled");
      document.getElementById(inputName).type = "text";
    } else {
      $("#" + inputName + "-eye-icon").removeClass("ion-eye-disabled");
      $("#" + inputName + "-eye-icon").addClass("ion-eye");
      document.getElementById(inputName).type = "password";
    }
  };
  $scope.sendSmsCode = function () {
    if (isEmpty($rootScope.customerData.userName)) {
      $rootScope.alert("Утасны дугаараа оруулна уу");
    } else if ($rootScope.customerData.userName.length < 8) {
      $rootScope.alert("Утасны дугаараа бүрэн оруулна уу");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $rootScope.customerData.userName }).then(function (response) {
        console.log("res", response);
        if (isEmpty(response[0])) {
          $rootScope.alert("Утасны дугаар бүртгэлгүй байна");
        } else {
          var generatedCode = Math.floor(100000 + Math.random() * 900000);
          registeredUserData = response[0];
          progressBar.Next();
          $scope.isStep1 = false;
          $scope.isStep2 = true;
          $timeout(function () {
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", crmUserId: response[0].id }).then(function (response) {
              console.log("res", response);
              localStorage.setItem("ALL_ID", JSON.stringify(response[0]));
              console.log("localStorage", localStorage);
            });

            var sendSms = {
              msg: `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`,
              phoneNumber: $rootScope.customerData.userName,
            };
            serverDeferred.requestFull("SEND_SMS", sendSms).then(function (sendSmsResponse) {
              console.log("sendSmsResponse", sendSmsResponse);
            });
          }, 500);
        }
      });
    }
  };
  $scope.resetPassword = function () {
    if (isEmpty($scope.smsCode)) {
      $rootScope.alert("Баталгаажуулах кодоо оруулна уу");
    } else if (isEmpty($rootScope.customerNewPassword.passwordHash)) {
      $rootScope.alert("Та шинэ нууц үгээ оруулна уу");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619583335021155", mobileNumber: $rootScope.customerData.userName }).then(function (response) {
        console.log("res", response);
        if (response[0] != "") {
          if (document.getElementById("smsCode").value == response[0].smscode) {
            console.log("$rootScope.customerNewPassword", $rootScope.customerNewPassword);
            serverDeferred.requestFull("getPasswordHash1", $rootScope.customerNewPassword).then(function (response) {
              console.log("res", response);
              $rootScope.newPasswordHashResult.passwordHash = response[1].result;
              $rootScope.newPasswordHashResult.password = $rootScope.customerNewPassword.passwordHash;
              $rootScope.newPasswordHashResult.customerId = registeredUserData.customerid;
              $rootScope.newPasswordHashResult.id = registeredUserData.id;
              $rootScope.newPasswordHashResult.userId = registeredUserData.userid;
              $rootScope.newPasswordHashResult.userName = $rootScope.customerData.userName;
              serverDeferred.requestFull("dcApp_login_register_dv_002", $rootScope.newPasswordHashResult).then(function (response) {
                $state.go("login");
                $rootScope.alert("Нэвтэрнэ үү", "success");
              });
            });
          } else {
            $rootScope.alert("Баталгаажуулах код буруу байна", "warning");
          }
        }
      });
    }
  };
  $scope.resendCode = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    var generatedCode = Math.floor(100000 + Math.random() * 900000);

    var updateCode = {
      id: all_ID.dccustomerid,
      smsCode: generatedCode,
    };
    var sendSms = {
      msg: `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`,
      phoneNumber: $scope.customerData.userName,
    };
    serverDeferred.requestFull("dcApp_resendCode_002", updateCode).then(function (sendSmsResponse) {
      console.log("sendSmsResponse", sendSmsResponse);
      serverDeferred.requestFull("SEND_SMS", sendSms).then(function (sendSmsResponse) {
        console.log("sendSmsResponse", sendSmsResponse);
      });
    });
    $scope.onTimer();
  };
  $scope.onTimer = function () {
    var timeleft = 30;
    var downloadTimer = setInterval(function () {
      if (timeleft <= 0) {
        clearInterval(downloadTimer);
        document.getElementById("resendBtn").innerHTML = "Дахин код илгээх";
        document.getElementById("resendBtn").disabled = false;
      } else {
        if ($state.current.name == "register") {
          document.getElementById("resendBtn").innerHTML = "Дахин код илгээх " + timeleft;
          document.getElementById("resendBtn").disabled = true;
        }
      }
      timeleft -= 1;
    }, 1000);
  };
  $scope.inputType = "password";
  $scope.hideShowPasswordReset = function () {
    if ($scope.inputType == "password") {
      $("#eye-icon-reset").removeClass("ion-eye");
      $("#eye-icon-reset").addClass("ion-eye-disabled");
      $scope.inputType = "text";
    } else {
      $("#eye-icon-reset").removeClass("ion-eye-disabled");
      $("#eye-icon-reset").addClass("ion-eye");
      $scope.inputType = "password";
    }
  };
});
