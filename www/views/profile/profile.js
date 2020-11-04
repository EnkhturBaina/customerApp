angular.module("profile.Ctrl", []).controller("profileCtrl", function ($scope, $state, $stateParams, $rootScope, serverDeferred) {
  $scope.replaceCyr = function (lastName) {
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputLastName = document.getElementById("customerLastName");
    if (rex.test(lastName) == false) {
      document.getElementById("lastNameError").style.display = "block";
      inputLastName.value = inputLastName.value.replace(inputLastName.value, "");
    } else {
      document.getElementById("lastNameError").style.display = "none";
    }
  };
  $scope.replaceCyr2 = function (firstName) {
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputFirstName = document.getElementById("customerFirstName");
    if (rex.test(firstName) == false) {
      document.getElementById("firstNameError").style.display = "block";
      inputFirstName.value = inputFirstName.value.replace(inputFirstName.value, "");
    } else {
      document.getElementById("firstNameError").style.display = "none";
    }
  };
  // $scope.replaceCyr3 = function (userId) {
  //   var rex = /.*[А-ЯӨҮа-яөү]{2}\d{8}/;
  //   var inputUserId = document.getElementById("userID");
  //   if (rex.test(userId) == false) {
  //     document.getElementById("userIDError").style.display = "block";
  //     inputUserId.value = inputUserId.value.replace(inputUserId.value, "");
  //   } else {
  //     document.getElementById("userIDError").style.display = "none";
  //   }
  // };

  $scope.getProData = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1601286700017285", crmuserid: $rootScope.loginUserInfo.id }).then(function (response) {
      $rootScope.loginUserInfo = mergeJsonObjs(response, $rootScope.loginUserInfo);
    });
  };

  $scope.getFamiltyStat = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
      $rootScope.familtStatData = response;
    });
  };
  $scope.getIncomeType = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554274244505" }).then(function (response) {
      $rootScope.incomeType = response;
    });
  };
  $scope.getAllBankList = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1603958798356" }).then(function (response) {
      $rootScope.allBankList = response;
      console.log("$rootScope.allBankList", $rootScope.allBankList);
    });
  };
  //   $scope.getCustomerDealBankList = function () {
  //     console.log($rootScope.loginUserInfo);
  //   };

  //   $scope.getCustomerDealBankList();
  $scope.getAllBankList();
  $scope.getFamiltyStat();
  $scope.getIncomeType();
  $scope.nextPath = $stateParams.path;
  // console.log("stateParams", $stateParams);
  // console.log("nextPath", $scope.nextPath);
  $rootScope.customerProfileData = {};
  $rootScope.customerProfilePicture = {};
  $rootScope.customerIncomeProfileData = {};
  $scope.customerProfileData.mobilenumber = "";
  $scope.customerProfileData.customerTypeId = 1;
  $scope.customerProfileData.stayedtimebyyear = "";

  if (!isEmpty($rootScope.loginUserInfo)) {
    $rootScope.customerProfileData.crmCustomerId = $rootScope.loginUserInfo.id;
    $rootScope.customerProfileData.mobilenumber = $rootScope.loginUserInfo.customercode;
  }

  $scope.getProfileData = function () {
    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: $rootScope.loginUserInfo.id }).then(function (response) {
        // console.log("getProfileData", response);
        $rootScope.hideFooter = true;
        if (response != "") {
          console.log($rootScope.loginUserInfo);
          // console.log(mergeJsonObjs(response[0], $rootScope.loginUserInfo));
          // console.log(response[0])
          $rootScope.customerProfileData = response[0];
          $scope.customerProfilePicture.profilepicture = response[0].profilepicture;
          $rootScope.customerIncomeProfileData.customerid = response[0].id;
          $rootScope.customerProfileData.ismarried = parseInt(response[0].ismarried);

          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: response[0].id }).then(function (response) {
            if (response != "") {
              $rootScope.customerIncomeProfileData = response[0];
              // $rootScope.customerIncomeProfileData.incometypeid = parseInt(response[0].incometypeid);
              $scope.asdasd = response[0].incometypeid;
            } else {
              // console.log("shine user income");
            }
          });
        } else {
          // console.log("shine user");
        }
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1604389075984789", dim1: $rootScope.loginUserInfo.customerid }).then(function (response) {
          $rootScope.customerDealBanks = response;
          console.log("customerDealBanks", $rootScope.customerDealBanks);
        });
      });
    }
  };
  $scope.getProfileData();

  $scope.saveProfileData = function () {
    if (isEmpty($scope.customerProfileData.lastname)) {
      $rootScope.alert("Та овогоо оруулна уу");
    } else if (isEmpty($scope.customerProfileData.firstname)) {
      $rootScope.alert("Та өөрийн нэрээ оруулна уу");
    } else if (isEmpty($scope.customerProfileData.uniqueidentifier)) {
      $rootScope.alert("Регситрын дугаараа оруулна уу");
    } else if (isEmpty($scope.customerProfileData.address)) {
      $rootScope.alert("Хаягаа оруулна уу");
    } else if (isEmpty($scope.customerProfileData.mobilenumber)) {
      $rootScope.alert("Утасны дугаараа оруулна уу");
    } else if (isEmpty($scope.customerProfileData.ismarried)) {
      $rootScope.alert("Гэрлэсэн эсэхээ сонгоно уу");
    } else if (isEmpty($scope.customerProfileData.stayedtimebyyear)) {
      $rootScope.alert("Ажилласан жилээ оруулна уу");
    } else {
      console.log($scope.customerProfileData);
      serverDeferred.requestFull("dcApp_profile_dv_002", $scope.customerProfileData).then(function (response) {
        // console.log("customerProfileData", response);
        $rootScope.loginUserInfo = mergeJsonObjs($scope.customerProfileData, $rootScope.loginUserInfo);
        $rootScope.alert("Амжилттай");
        if (!isEmpty($scope.nextPath)) {
          $state.go($scope.nextPath);
        }
      });
    }
  };
  $scope.takePhoto = function (type) {
    navigator.camera.getPicture(
      function (imageData) {
        if (type == 1) {
          $scope.customerProfileData.identfrontpic = "jpg♠" + imageData;
        } else if (type == 2) {
          $scope.customerProfileData.identbackpic = "jpg♠" + imageData;
        } else if (type == 3) {
          $scope.customerProfilePicture.profilepicture = "jpg♠" + imageData;

          $scope.customerProfilePicture.id = $scope.loginUserInfo.customerid;

          console.log("$scope.customerProfilePicture", $scope.customerProfilePicture);

          serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $scope.customerProfilePicture).then(function (response) {
            console.log("save profilepicture response", response);
            console.log("imageData", imageData);
          });
        }
        $scope.$apply();
      },
      function onFail(message) {
        alert("Failed because: " + message);
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
      }
    );
  };
  //income data

  $scope.saveIncomeProfileData = function () {
    if (isEmpty($scope.customerIncomeProfileData.incometypeid)) {
      $rootScope.alert("Та орлогын эх үүсвэр сонгоно уу");
    } else if (isEmpty($scope.customerIncomeProfileData.monthlyincome)) {
      $rootScope.alert("Та сарын орлогоо оруулна уу");
    } else if (isEmpty($scope.customerIncomeProfileData.totalincomehousehold)) {
      $rootScope.alert("Та өрхийн нийт орлогоо оруулна уу");
    } else if (isEmpty($scope.customerIncomeProfileData.monthlypayment)) {
      $rootScope.alert("Та төлж буй зээлийн дүнгээ оруулна уу");
    } else {
      $scope.getProfileData();
      if ($rootScope.customerIncomeProfileData != "") {
        serverDeferred.requestFull("dcApp_profile_income_dv_002", $scope.customerIncomeProfileData).then(function (response) {
          // console.log("save income response", response);
          $rootScope.alert("Амжилттай");
        });
      } else {
        serverDeferred.requestFull("dcApp_profile_income_dv_002", $scope.customerIncomeProfileData).then(function (response) {
          // console.log("save income response", response);
        });
      }
    }
  };
  $scope.overlayOn = function () {
    document.getElementById("overlay").style.display = "block";
  };
  $scope.overlayOff = function () {
    document.getElementById("overlay").style.display = "none";
  };
  if (!isEmpty($scope.nextPath)) {
    $scope.overlayOn();
  }
  $("#userID").mask("AA00000000", {
    translation: {
      A: { pattern: /^[А-ЯӨҮа-яөү]+$/ },
    },
  });

  $scope.addDealBank = function () {
    $scope.customerDealBank.dim1 = $scope.loginUserInfo.customerid;
    serverDeferred.requestFull("dcApp_deal_bank_customer_001", $scope.customerDealBank).then(function (response) {
      console.log("customerDealBank", response);
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1604389075984789", id: response[1].id }).then(function (response) {
        console.log("response", response);
        var appendEl = '<div class="col added-deal-bank">' + '<div class="deal-bank-remove">-</div>' + "<img src=" + $rootScope.imagePath + response[0].banklogo + " />" + "<p>" + response[0].departmentname + "</p>" + "</div>";
        $(appendEl).insertBefore(".profile-bank-list select:last");
      });
    });
    $scope.customerDealBank.dim2 = null;
  };

  $scope.generateQR = function () {
    $rootScope.customeridforQR = {};
    $scope.showCreateQr = true;
    $rootScope.customeridforQR.text = $scope.loginUserInfo.customerid;

    if (!isEmpty($rootScope.loginUserInfo)) {
      console.log($scope.showCreateQr);
      serverDeferred.requestFull("dcApp_qr_generator", $rootScope.customeridforQR).then(function (response) {
        console.log("generateQR response", response);

        $rootScope.customerQrData = {};
        $rootScope.customerQrData.id = $scope.loginUserInfo.customerid;
        $rootScope.customerQrData.customerqr = "jpg♠" + response[1].value;

        serverDeferred.requestFull("dcApp_customer_qr_dv_002", $rootScope.customerQrData).then(function (response) {
          console.log("customerQrData response", response);
          $scope.getProfileData();
        });
      });
    }
  };
});
