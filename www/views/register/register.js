angular.module("register.Ctrl", []).controller("registerCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred) {
  $(".register-mobile").mask("00000000");
  var progressBar = {
    Bar: $("#progress-bar"),
    step1: $("register-step-1"),
    step2: $("register-step-2"),

    Next: function () {
      $("#progress-bar li:not(.active):first").addClass("active");
      $("#register-step-1").addClass("remove-step");
      $("#register-step-1").removeClass("add-step");

      $("#register-step-2").removeClass("remove-step");
      $("#register-step-2").addClass("add-step");
    },
    Back: function () {
      $("#progress-bar li.active:last").removeClass("active");

      $("#register-step-2").removeClass("add-step");
      $("#register-step-2").addClass("remove-step");

      $("#register-step-1").removeClass("remove-step");
      $("#register-step-1").addClass("add-step");
    },
  };

  $scope.isStep1 = true;
  $scope.isStep2 = false;

  $scope.inputType = "password";
  $scope.user = {};
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
  $rootScope.customerPassword = {};
  $rootScope.crmUserData = {};
  $rootScope.passwordHashResult = {};
  $scope.crmUserData.userName = "";

  $scope.disabledBtn = false;
  $scope.sendSmsCode = function () {
    if (isEmpty($scope.crmUserData.userName)) {
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
    } else if (isEmpty($scope.customerPassword.passwordHash)) {
      $rootScope.alert("Нууц үгээ оруулна уу", "warning");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $scope.crmUserData.userName }).then(function (response) {
        console.log("isRegistered", response);
        if (!isEmpty(response[0])) {
          $rootScope.alert("<p class=" + "customer_registerd_number" + ">" + $scope.crmUserData.userName + "</p>" + " Утасны дугаараар бүртгэл үүссэн байна", "warning");
        } else {
          $scope.isStep1 = false;
          $scope.isStep2 = true;
          progressBar.Next();
          var generatedCode = Math.floor(100000 + Math.random() * 900000);
          serverDeferred.requestFull("getPasswordHash1", $scope.customerPassword).then(function (response) {
            console.log("pass response", response);
            //Password Hash
            $rootScope.passwordHashResult = response;
            var json = {
              mobileNumber: $scope.crmUserData.userName,
            };
            json.dcApp_all_crm_user = {
              userName: $scope.crmUserData.userName,
              userId: "1",
              password: $scope.customerPassword.passwordHash,
              passwordHash: $scope.passwordHashResult[1].result,
              userId: "1",
            };
            json.dcApp_all_crm_user.dcApp_all_dc_customer = {
              mobileNumber: $scope.crmUserData.userName,
              smsCode: generatedCode,
            };
            console.log("json", json);
            serverDeferred.requestFull("dcApp_all_crm_customer_001", json).then(function (crmResponse) {
              console.log("register response", crmResponse);
              if (crmResponse[0] == "success") {
                $timeout(function () {
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: crmResponse[1].dcapp_all_crm_user.dcapp_all_dc_customer.id }).then(function (response) {
                    console.log("res", response);
                    localStorage.setItem("ALL_ID", JSON.stringify(response[0]));
                    console.log("localStorage", localStorage);
                  });

                  var sendSms = {
                    msg: `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`,
                    phoneNumber: $scope.crmUserData.userName,
                  };
                  serverDeferred.requestFull("SEND_SMS", sendSms).then(function (sendSmsResponse) {
                    console.log("sendSmsResponse", sendSmsResponse);
                  });
                }, 500);
              } else {
                $rootScope.alert("Бүртгэхэд алдаа гарлаа", "warning");
              }
            });
          });
        }
      });
    }
    $scope.onTimer();
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
      phoneNumber: $scope.crmUserData.userName,
    };
    serverDeferred.requestFull("dcApp_resendCode_002", updateCode).then(function (sendSmsResponse) {
      console.log("sendSmsResponse", sendSmsResponse);
      serverDeferred.requestFull("SEND_SMS", sendSms).then(function (sendSmsResponse) {
        console.log("sendSmsResponse", sendSmsResponse);
      });
    });
    $scope.onTimer();
  };
  $scope.registerCustomer = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619583335021155", mobileNumber: $scope.crmUserData.userName }).then(function (response) {
      console.log("res", response);
      if (response[0] != "") {
        console.log(document.getElementById("confirmationCode").value);
        if (document.getElementById("confirmationCode").value == response[0].smscode) {
          $state.go("login");
          $rootScope.alert("Нэвтэрнэ үү", "success");
        } else {
          $rootScope.alert("Баталгаажуулах код буруу байна", "warning");
        }
      }
    });
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
});
