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

  $("#Next").on("click", function () {
    progressBar.Next();
    // console.log("1");
  });
  $("#Back").on("click", function () {
    progressBar.Back();
  });
  $("#Reset").on("click", function () {
    progressBar.Reset();
  });
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

  $scope.registerCustomer = function () {
    $scope.disabledBtn = true;
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
          serverDeferred.requestFull("getPasswordHash1", $scope.customerPassword).then(function (response) {
            console.log("pass response", response);
            //Password Hash
            $rootScope.passwordHashResult = response;
            var json = {
              userName: $scope.crmUserData.userName,
              siRegNumber: $scope.crmUserData.userName,
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
            };
            console.log("json", json);
            serverDeferred.requestFull("dcApp_all_crm_customer_001", json).then(function (crmResponse) {
              console.log("register response", crmResponse);
              var basePersonData = {
                firstName: $scope.crmUserData.userName,
                lastName: $scope.crmUserData.userName,
                stateRegNumber: $scope.crmUserData.userName,
                parentId: crmResponse[1].dcapp_all_crm_user.dcapp_all_dc_customer.id,
              };
              basePersonData.dcApp_all_um_system_user = {
                username: $scope.crmUserData.userName,
                email: "",
                typeCode: "internal",
              };
              basePersonData.dcApp_all_um_system_user.dcApp_all_um_user = {
                isActive: "1",
              };
              console.log("basePersonData", basePersonData);
              serverDeferred.requestFull("dcApp_all_base_person_001", basePersonData).then(function (response) {
                console.log("base response", response);
                if (response[0] == "success") {
                  $timeout(function () {
                    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: crmResponse[1].dcapp_all_crm_user.dcapp_all_dc_customer.id }).then(function (response) {
                      console.log("res", response);
                      localStorage.setItem("ALL_ID", JSON.stringify(response[0]));
                      console.log("basePersonData", basePersonData);
                      console.log("localStorage", localStorage);
                    });
                    $state.go("login");
                    $rootScope.alert("Нэвтэрнэ үү", "success");
                  }, 500);
                } else {
                  $rootScope.alert("Бүртгэхэд алдаа гарлаа", "warning");
                }
              });
            });
          });
        }
      });
    }
  };
});
