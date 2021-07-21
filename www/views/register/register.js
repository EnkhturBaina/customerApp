angular.module("register.Ctrl", []).controller("registerCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $(".register-mobile").mask("00000000");
  $(".registerRegSelector").mask("99999999");
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
  $scope.hideShowPasswordReg = function () {
    if ($scope.inputType == "password") {
      $("#eye-icon-register").removeClass("ion-eye");
      $("#eye-icon-register").addClass("ion-eye-disabled");
      $scope.inputType = "text";
    } else {
      $("#eye-icon-register").removeClass("ion-eye-disabled");
      $("#eye-icon-register").addClass("ion-eye");
      $scope.inputType = "password";
    }
  };
  $rootScope.customerPassword = {};
  $rootScope.crmUserData = {};
  $rootScope.passwordHashResult = {};
  $scope.crmUserData.userName = "";
  $scope.smsConfirmCode = "";
  $scope.disabledBtn = false;
  $rootScope.registeredData = {};

  $scope.sendSmsCode = function () {
    if (isEmpty($scope.crmUserData.userName)) {
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
    } else if ($scope.crmUserData.userName.length < 8) {
      $rootScope.alert("Утасны дугаараа бүрэн оруулна уу", "warning");
    } else if (isEmpty($scope.customerPassword.passwordHash)) {
      $rootScope.alert("Нууц үгээ оруулна уу", "warning");
    } else if ($("#regNums").val() == "" || $("#regNums").val() == null) {
      $rootScope.alert("Регистрээ оруулна уу", "warning");
    } else {
      //User бүртгэлтэй эсэхийг шалгах
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $scope.crmUserData.userName }).then(function (response) {
        if (!isEmpty(response[0])) {
          $rootScope.alert("<p class=" + "customer_registerd_number" + ">" + $scope.crmUserData.userName + "</p>" + " Утасны дугаараар бүртгэл үүссэн байна", "warning");
        } else {
          serverDeferred.requestFull("getPasswordHash1", $scope.customerPassword).then(function (response) {
            //Password Hash
            $rootScope.passwordHashResult = response;
          });

          serverDeferred.requestFull("dcApp_all_crm_customer_004", { siRegNumber: $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val() }).then(function (checkedValue) {
            $rootScope.registeredData = checkedValue;
          });

          var generatedCode = Math.floor(100000 + Math.random() * 900000);

          $timeout(function () {
            if (!isEmpty($rootScope.registeredData[1])) {
              json = $rootScope.registeredData[1];

              var json = {
                ...json,
                mobileNumber: $scope.crmUserData.userName,
              };
              json.dcapp_all_crm_user.username = $scope.crmUserData.userName;
              json.dcapp_all_crm_user.password = $scope.customerPassword.passwordHash;
              json.dcapp_all_crm_user.passwordhash = $scope.passwordHashResult[1].result;

              json.dcapp_all_crm_user.dcapp_all_dc_customer.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();
              json.dcapp_all_crm_user.dcapp_all_dc_customer.mobilenumber = $scope.crmUserData.userName;
              json.dcapp_all_crm_user.dcapp_all_dc_customer.smscode = generatedCode;
            } else {
              var json = {
                mobileNumber: $scope.crmUserData.userName,
                siRegNumber: $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val(),
                customerCode: $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val(),
              };
              json.dcApp_all_crm_user = {
                userName: $scope.crmUserData.userName,
                userId: "1",
                password: $scope.customerPassword.passwordHash,
                passwordHash: $scope.passwordHashResult[1].result,
              };
              json.dcApp_all_crm_user.dcApp_all_dc_customer = {
                uniqueidentifier: $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val(),
                mobileNumber: $scope.crmUserData.userName,
                smsCode: generatedCode,
                customertypeid: "1",
              };
            }

            // $scope.smsConfirmCode = generatedCode;
            serverDeferred.requestFull("dcApp_all_crm_customer_001", json).then(function (crmResponse) {
              if (crmResponse[0] == "success") {
                $scope.isStep1 = false;
                $scope.isStep2 = true;
                progressBar.Next();
                $timeout(function () {
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: crmResponse[1].dcapp_all_crm_user.dcapp_all_dc_customer.id }).then(function (response) {
                    localStorage.setItem("ALL_ID", JSON.stringify(response[0]));
                  });
                  $scope.number = $scope.crmUserData.userName;
                  $scope.msg = `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`;
                  serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, "https://services.digitalcredit.mn/api/sms/send").then(function (response) {});
                }, 800);
              } else {
                $rootScope.alert("Бүртгэхэд алдаа гарлаа", "danger");
              }
            });
          }, 500);
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

    serverDeferred.requestFull("dcApp_resendCode_002", updateCode).then(function (sendSmsResponse) {
      if (sendSmsResponse[0] == "success") {
        $scope.number = $scope.crmUserData.userName;
        $scope.msg = `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`;

        serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, "https://services.digitalcredit.mn/api/sms/send").then(function (response) {});
      } else {
        $rootScope.alert("Баталгаажуулах код илгээхэд алдаа гарлаа", "warning");
      }
    });
    $scope.onTimer();
  };
  $scope.registerCustomer = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619583335021155", mobileNumber: $scope.crmUserData.userName }).then(function (response) {
      if (response[0] != "") {
        if (document.getElementById("confirmationCode").value == response[0].smscode) {
          $state.go("login");
          $rootScope.alert("Та амжилттай бүртгэгдлээ", "success");
        } else {
          $rootScope.alert("Баталгаажуулах код буруу байна", "warning");
        }
      }
    });
  };
  $scope.onTimer = function () {
    var timeleft = 30;
    var downloadTimer = setInterval(function () {
      if ($state.current.name == "register") {
        if (timeleft <= 0) {
          clearInterval(downloadTimer);
          document.getElementById("resendBtn").innerHTML = "Дахин код илгээх";
          document.getElementById("resendBtn").disabled = false;
        } else {
          document.getElementById("resendBtn").innerHTML = "Дахин код илгээх " + timeleft;
          document.getElementById("resendBtn").disabled = true;
        }
      }
      timeleft -= 1;
    }, 1000);
  };
  $ionicPlatform.ready(function () {
    setTimeout(function () {
      var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Э", "Ю", "Я"];
      new MobileSelect({
        trigger: ".registerRegSelector",
        wheels: [{ data: regChars }, { data: regChars }],
        position: [0, 0],
        ensureBtnText: "Хадгалах",
        cancelBtnText: "Хаах",
        transitionEnd: function (indexArr, data) {
          //scroll xiij bhd ajillah func
        },
        callback: function (indexArr, data) {
          $("#regCharA").text(data[0]);
          $("#regCharB").text(data[1]);
          $scope.overlayKeyOn();

          keyInput = document.getElementById("regNums");
          if (keyInput) {
            $scope.clearD = function () {
              keyInput.value = keyInput.value.slice(0, keyInput.value.length - 1);
            };

            $scope.addCode = function (key) {
              keyInput.value = keyInput.value + key;
            };

            $scope.emptyCode = function () {
              keyInput.value = "";
            };

            $scope.emptyCode();
          }
        },
      });
      $("#regNums").mask("00000000");
    }, 1000);
  });
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
      backdropClickToClose: false,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.overlayKeyOn = function () {
    $scope.modal.show();
  };
  $scope.saveRegNums = function () {
    if (keyInput.value.length < 8) {
      $rootScope.alert("Регистер ээ бүрэн оруулна уу.", "warning");
    } else {
      $scope.modal.hide();
    }
  };
  $scope.cancelRegNums = function () {
    // $("#regCharA").text($scope.regNum.substr(0, 1));
    // $("#regCharB").text($scope.regNum.substr(1, 1));
    // $("#regNums").val($scope.regNum.substr(2, 8));
    $scope.modal.hide();
  };
});
