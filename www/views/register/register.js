angular.module("register.Ctrl", []).controller("registerCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal, $ionicPopup, $ionicHistory) {
  $(".register-mobile").mask("00000000");

  $(".registerRegSelector").mask("00000000");

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
    if ($("#regNums").val() == "" || $("#regNums").val() == null) {
      $rootScope.alert("Регистрээ оруулна уу", "warning");
    } else if (isEmpty($scope.crmUserData.userName)) {
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
    } else if ($scope.crmUserData.userName.length < 8) {
      $rootScope.alert("Утасны дугаараа бүрэн оруулна уу", "warning");
    } else if (isEmpty($scope.customerPassword.passwordHash)) {
      $rootScope.alert("Нууц үгээ оруулна уу", "warning");
    } else {
      if ($scope.isPasswordValid) {
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
                  channel: "1626864048648",
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
                    serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, `https://${$rootScope.api_url}digitalcredit.mn/api/sms/send`).then(function (response) {
                      // console.log("res", response);
                      if (response.result.status == "error") {
                        $scope.smsConfirmCode = generatedCode;
                      }
                    });
                  }, 800);
                } else {
                  $rootScope.alert("Бүртгэхэд алдаа гарлаа", "danger");
                }
              });
            }, 500);
          }
        });
        $scope.onTimer();
      } else {
        $rootScope.alert("Нууц үг шаардлага хангахгүй байна.", "warning");
      }
    }
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

        serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, `https://${$rootScope.api_url}digitalcredit.mn/api/sms/send`).then(function (response) {});
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
      var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Ы", "Э", "Ю", "Я"];
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
      serverDeferred.requestFull("dcApp_allUserID_004_copy", { uniqueIdentifier: $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val() }).then(function (checkUser) {
        if (checkUser[0] == "success" && !isEmpty(checkUser[1])) {
          // console.log("checkUser", checkUser[1].mobilenumber);
          var temp = "Та манай системд ****" + checkUser[1].mobilenumber.substr(4, 4) + " дугаараар бүртгэлтэй байна.";
          $ionicPopup.show({
            // template: "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + temp + "<br><div ui-sref='reset_password'><b>Нууц үг сэргээх</b></div></div>",
            template: "<div class='emoji-container'>😃</div>" + "<div class='pop-up-text-container'>" + temp + "</div>",
            cssClass: "confirmPopup",
            buttons: [
              {
                text: "Окей",
                type: "button-confirm",
                onTap: function () {
                  $ionicHistory.goBack();
                  return true;
                },
              },
            ],
          });
        }
        $scope.modal.hide();
      });
    }
  };
  $scope.cancelRegNums = function () {
    // $("#regCharA").text($scope.regNum.substr(0, 1));
    // $("#regCharB").text($scope.regNum.substr(1, 1));
    // $("#regNums").val($scope.regNum.substr(2, 8));
    $scope.modal.hide();
  };
  $scope.$on("$ionicView.enter", function () {
    $scope.isPasswordValid = false;
  });
  $scope.$on("$ionicView.afterEnter", function () {
    $timeout(function () {
      (function () {
        var password = document.querySelector(".password");

        var helperText = {
          charLength: document.querySelector(".helper-text .length"),
          uppercase: document.querySelector(".helper-text .uppercase"),
          special: document.querySelector(".helper-text .special"),
        };

        var pattern = {
          charLength: function () {
            if (password.value.length >= 8) {
              return true;
            }
          },
          uppercase: function () {
            var regex = /^(?=.*[A-Z]).+$/; // Uppercase character pattern

            if (regex.test(password.value)) {
              return true;
            }
          },
          special: function () {
            var regex = /^(?=.*[0-9_\W]).+$/; // Special character or number pattern

            if (regex.test(password.value)) {
              return true;
            }
          },
        };

        // Listen for keyup action on password field
        password.addEventListener("keyup", function () {
          // Check that password is a minimum of 8 characters
          patternTest(pattern.charLength(), helperText.charLength);

          // Check that password contains an uppercase letter
          patternTest(pattern.uppercase(), helperText.uppercase);

          // Check that password contains a number or special character
          patternTest(pattern.special(), helperText.special);

          // Check that all requirements are fulfilled
          if (hasClass(helperText.charLength, "valid") && hasClass(helperText.uppercase, "valid") && hasClass(helperText.special, "valid")) {
            addClass(password.parentElement, "valid");
            $scope.isPasswordValid = true;
          } else {
            removeClass(password.parentElement, "valid");
            $scope.isPasswordValid = false;
          }
        });

        function patternTest(pattern, response) {
          if (pattern) {
            addClass(response, "valid");
          } else {
            removeClass(response, "valid");
          }
        }

        function addClass(el, className) {
          if (el.classList) {
            el.classList.add(className);
          } else {
            el.className += " " + className;
          }
        }

        function removeClass(el, className) {
          if (el.classList) el.classList.remove(className);
          else el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }

        function hasClass(el, className) {
          if (el.classList) {
            return el.classList.contains(className);
          } else {
            new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
          }
        }
      })();
    }, 1000);
  });
});
