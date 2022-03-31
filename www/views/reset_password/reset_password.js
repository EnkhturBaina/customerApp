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
  $rootScope.isEmail = false;
  $rootScope.userEmail = "";
  $rootScope.newPasswordHashResult = {};
  $rootScope.goBack = function () {
    $window.history.back();
  };
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
  $scope.sendSmsCodeReset = function () {
    if (isEmpty($rootScope.customerData.userName)) {
      $rootScope.alert("Утасны дугаараа оруулна уу");
    } else if ($rootScope.customerData.userName.length < 8) {
      $rootScope.alert("Утасны дугаараа бүрэн оруулна уу");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $rootScope.customerData.userName }).then(function (response) {
        if (isEmpty(response[0])) {
          $rootScope.alert("Утасны дугаар бүртгэлгүй байна");
        } else {
          // console.log("ELSE");
          registeredUserData = response[0];
          $timeout(function () {
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", crmUserId: response[0].id }).then(function (response) {
              // console.log("RES", response);
              $rootScope.dc_customer_id = response[0].dccustomerid;
              localStorage.setItem("ALL_ID", JSON.stringify(response[0]));

              var generatedCode = Math.floor(100000 + Math.random() * 900000);
              // console.log("generatedCode", generatedCode);
              var updateCode = {
                id: $rootScope.dc_customer_id,
                smsCode: generatedCode,
              };
              // console.log("updateCode", updateCode);

              $scope.number = $scope.customerData.userName;
              $scope.msg = `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`;

              serverDeferred.requestFull("dcApp_resendCode_002", updateCode).then(function (sendSmsResponse) {
                // console.log("sendSmsResponse", sendSmsResponse);
                if (sendSmsResponse[0] == "success") {
                  serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, `https://${$rootScope.api_url}digitalcredit.mn/api/sms/send`).then(function (response) {
                    // console.log("res", response);
                    if (response.result.status == "success") {
                      $scope.isStep1 = false;
                      $scope.isStep2 = true;
                      progressBar.Next();
                    } else if (response.result.status == "error") {
                      //Төлбөр дууссан үед mail ээр нэг удаагийн код явуулах
                      serverDeferred.requestFull("dcApp_get_email_mobile_number_004", { mobileNumber: $scope.number }).then(function (res) {
                        if (!isEmpty(res[1])) {
                          $rootScope.userEmail = res[1].email;
                          $rootScope.isEmail = true;
                          var mailJson = {
                            subjecttxt: "Zeelme.mn",
                            messagetxt: `Сайн байна уу, нэг удаагийн код: ${generatedCode}`,
                            maillist: {
                              0: {
                                value: $rootScope.userEmail,
                              },
                            },
                          };

                          serverDeferred.requestFull("SEND_MAIL3", mailJson).then(function (sendSmsResponse) {
                            $scope.isStep1 = false;
                            $scope.isStep2 = true;
                            progressBar.Next();
                          });
                        }
                      });
                    } else {
                      $rootScope.alert("Баталгаажуулах код илгээхэд алдаа гарлаа 100", "warning");
                    }
                  });
                } else {
                  $rootScope.alert("Баталгаажуулах код илгээхэд алдаа гарлаа 200", "warning");
                }
              });
            });
          }, 500);
        }
      });
    }
    $scope.onTimer();
  };
  $scope.resetPassword = function () {
    if (isEmpty($scope.smsCode)) {
      $rootScope.alert("Баталгаажуулах кодоо оруулна уу");
    } else if (isEmpty($rootScope.customerNewPassword.passwordHash)) {
      $rootScope.alert("Та шинэ нууц үгээ оруулна уу");
    } else {
      if ($scope.isPasswordValid) {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619583335021155", mobileNumber: $rootScope.customerData.userName }).then(function (response) {
          if (response[0] != "") {
            if ($scope.smsCode == response[0].smscode) {
              serverDeferred.requestFull("getPasswordHash1", $rootScope.customerNewPassword).then(function (response) {
                $rootScope.newPasswordHashResult.passwordHash = response[1].result;
                $rootScope.newPasswordHashResult.password = $rootScope.customerNewPassword.passwordHash;
                $rootScope.newPasswordHashResult.customerId = registeredUserData.customerid;
                $rootScope.newPasswordHashResult.id = registeredUserData.id;
                $rootScope.newPasswordHashResult.userId = registeredUserData.userid;
                $rootScope.newPasswordHashResult.userName = $rootScope.customerData.userName;
                serverDeferred.requestFull("dcApp_login_register_dv_002", $rootScope.newPasswordHashResult).then(function (response) {
                  $state.go("login");
                  $rootScope.alert("Таны нууц үг амжилттай шинэчлэгдлээ", "success");
                });
              });
            } else {
              $rootScope.alert("Баталгаажуулах код буруу байна", "warning");
            }
          }
        });
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

    $scope.number = $scope.customerData.userName;
    $scope.msg = `http://zeelme.mn tanii batalgaajuulah code: ${generatedCode}`;

    serverDeferred.requestFull("dcApp_resendCode_002", updateCode).then(function (sendSmsResponse) {
      if (sendSmsResponse[0] == "success") {
        serverDeferred.carCalculation({ sendto: $scope.number, message: $scope.msg }, `https://${$rootScope.api_url}digitalcredit.mn/api/sms/send`).then(function (response) {});
      } else {
        $rootScope.alert("Баталгаажуулах код илгээхэд алдаа гарлаа 200", "warning");
      }
    });
    $scope.onTimer();
  };
  $scope.onTimer = function () {
    var timeleft = 30;
    var downloadTimer = setInterval(function () {
      if ($state.current.name == "reset_password") {
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
