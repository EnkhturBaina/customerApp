angular.module("reset_password.Ctrl", []).controller("reset_passwordCtrl", function ($window, $ionicSlideBoxDelegate, $scope, $rootScope, $state, serverDeferred) {
  // document.getElementById("saveNewPassword").setAttribute("style", "display:none !important");
  $(".register-mobile").mask("00000000");
  var progressBar = {
    Bar: $("#pr-progress-bar"),
    step1: $("pr-register-step-1"),
    step2: $("pr-register-step-2"),

    Next: function () {
      $("#pr-register-step-1").addClass("pr-remove-step");
      $("#pr-register-step-1").removeClass("pr-add-step");

      $("#pr-register-step-2").removeClass("pr-remove-step");
      $("#pr-register-step-2").addClass("pr-add-step");
    },
  };

  var registeredUserData = {};
  $rootScope.customerNewPassword = {};
  $scope.getPhoneNumber = function () {
    $rootScope.customerNewPassword.userName = $rootScope.loginUserInfo.customercode;
  };
  if (!isEmpty($rootScope.loginUserInfo)) {
    $scope.getPhoneNumber();
  }
  $scope.checkMobileNumber = function () {
    if ($scope.customerNewPassword === undefined) {
      $rootScope.alert("Утасны дугаараа оруулна уу");
    } else {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1600337520341415", username: $scope.customerNewPassword.userName }).then(function (response) {
        if (response.length == 1 || response.length[0] == "") {
          $rootScope.alert("Утасны дугаар бүртгэлгүй байна");
        } else {
          registeredUserData = response[0];
          // console.log("registeredUserData", registeredUserData);
          progressBar.Next();
          document.getElementById("saveNewPassword").setAttribute("style", "display:block !important");
          document.getElementById("continueNewPassword").setAttribute("style", "display:none !important");
        }
      });
    }
  };
  $rootScope.newPasswordHashResult = {};
  $scope.saveNewPassword = function () {
    if ($scope.customerNewPassword.passwordHash !== $scope.customerNewPassword.confirmPasswordHash) {
      $rootScope.alert("Нууц үг тохирохгүй байна");
    } else if ($scope.customerNewPassword.oldPassword !== registeredUserData.password) {
      $rootScope.alert("Хуучин нууц үг буруу байна");
    } else {
      serverDeferred.requestFull("getPasswordHash1", $scope.customerNewPassword).then(function (response) {
        $rootScope.newPasswordHashResult.passwordHash = response[1].result;
        $rootScope.newPasswordHashResult.password = $scope.customerNewPassword.passwordHash;
        $rootScope.newPasswordHashResult.customerId = registeredUserData.customerid;
        $rootScope.newPasswordHashResult.id = registeredUserData.id;
        $rootScope.newPasswordHashResult.userId = registeredUserData.userid;
        $rootScope.newPasswordHashResult.userName = $scope.customerNewPassword.userName;
        serverDeferred.requestFull("dcApp_login_register_dv_002", $scope.newPasswordHashResult).then(function (response) {
          $state.go("login");
        });
      });
    }
  };
  $rootScope.goBack = function () {
    $window.history.back();
  };

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
});
