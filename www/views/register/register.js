angular.module("register.Ctrl", []).controller("registerCtrl", function ($ionicSlideBoxDelegate, $scope, $rootScope, $state, serverDeferred) {
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
      $rootScope.alert("Утасны дугаараа оруулна уу");
    } else if (isEmpty($scope.customerPassword.passwordHash)) {
      $rootScope.alert("Нууц үгээ оруулна уу");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $scope.crmUserData.userName }).then(function (response) {
        // console.log("isRegistered", response);
        if (response.length > 1) {
          $rootScope.alert("<p class=" + "customer_registerd_number" + ">" + $scope.crmUserData.userName + "</p>" + " Утасны дугаараар бүртгэл үүссэн байна");
        } else {
          serverDeferred.requestFull("getPasswordHash1", $scope.customerPassword).then(function (response) {
            //Password Hash
            $rootScope.passwordHashResult = response;
            serverDeferred.requestFull("dcApp_crmCustomer_001", $scope.crmUserData).then(function (response) {
              //crm_customer
              $rootScope.crmUserData.customerId = response[1].id;
              $rootScope.crmUserData.password = $scope.customerPassword.passwordHash;
              $rootScope.crmUserData.passwordHash = $scope.passwordHashResult[1].result;
              $rootScope.crmUserData.userId = 1;
              serverDeferred.requestFull("dcApp_login_register_dv_001", $scope.crmUserData).then(function (response) {
                //crm_user
                // console.log("respone", response);
                $state.go("login");
              });
            });
          });
        }
      });
    }
  };
});
