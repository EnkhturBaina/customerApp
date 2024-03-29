angular.module("profile.Ctrl", []).controller("profileCtrl", function ($scope, $state, $rootScope, serverDeferred, $ionicPlatform, $ionicModal, $timeout, $ionicTabsDelegate) {
  $rootScope.customerProfileData = {};
  $rootScope.customerProfilePicture = {};
  $scope.customerProfileData.mobilenumber = "";
  $scope.customerProfileData.customerTypeId = 1;

  $scope.getProfileIncomeData = function () {
    $rootScope.customerIncomeProfileData = {};
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (responseIncomeProfile) {
      // console.log("responseIncomeProfile", responseIncomeProfile);
      if (!isEmpty(responseIncomeProfile[0])) {
        $rootScope.customerIncomeProfileData = responseIncomeProfile[0];
        $rootScope.loginUserInfo = mergeJsonObjs(responseIncomeProfile[0], $rootScope.loginUserInfo);

        localStorage.removeItem("loginUserInfo");
        localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
      } else {
      }
    });
  };
  $rootScope.getProfileData = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    // $rootScope.ShowLoader();
    if (!isEmpty($rootScope.loginUserInfo)) {
      $rootScope.loginUserInfo = {};
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: all_ID.crmuserid }).then(function (response) {
        // console.log("res", response);
        $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
        if (response[0] != "") {
          $rootScope.customerProfileData = response[0];
          localStorage.removeItem("profilePictureSideMenu");
          localStorage.setItem("profilePictureSideMenu", response[0].profilepicture);
          $rootScope.profilePictureSideMenu = response[0].profilepicture;
          $rootScope.customerProfilePicture.profilePictureClob = response[0].profilepicture;
        }
        $rootScope.HideLoader();
      });
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $ionicTabsDelegate.$getByHandle("profileTabs").select(0);
    $rootScope.hideFooter = true;
    $rootScope.ShowLoader();
    $timeout(function () {
      $rootScope.getProfileData();
      $scope.getProfileIncomeData();
    }, 200);
    $timeout(function () {
      $rootScope.HideLoader();
    }, 2000);
  });

  $scope.saveProfileData = function () {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    $rootScope.ShowLoader();

    // if (isEmpty($scope.customerProfileData.lastname)) {
    //   $rootScope.HideLoader();
    //   $rootScope.alert("Та овогоо оруулна уу", "warning");
    // } else if (isEmpty($scope.customerProfileData.firstname)) {
    //   $rootScope.HideLoader();
    //   $rootScope.alert("Та өөрийн нэрээ оруулна уу", "warning");
    // } else
    if (isEmpty($scope.customerProfileData.uniqueidentifier)) {
      $rootScope.HideLoader();
      $rootScope.alert("Регистрийн дугаараа оруулна уу", "warning");
    }
    // else if (isEmpty($scope.customerProfileData.email)) {
    //   $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
    // }
    // else if (!re.test($scope.customerProfileData.email)) {
    //   $rootScope.HideLoader();
    //   $rootScope.alert("И-мэйл хаягаа зөв оруулна уу", "warning");
    // }
    else if (isEmpty($scope.customerProfileData.mobilenumber)) {
      $rootScope.HideLoader();
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
    } else if ($scope.customerProfileData.mobilenumber.length < 8) {
      $rootScope.HideLoader();
      $rootScope.alert("Утасны дугаараа бүрэн оруулна уу", "warning");
    } else if (isEmpty($scope.customerProfileData.ismarried)) {
      $rootScope.HideLoader();
      $rootScope.alert("Гэрлэсэн эсэхээ сонгоно уу", "warning");
    } else if (isEmpty($scope.customerProfileData.mikmortgagecondition)) {
      $rootScope.HideLoader();
      $rootScope.alert("Ипотекийн зээлтэй эсэхээ сонгоно уу", "warning");
    } else if (isEmpty($scope.customerProfileData.experienceperiodid)) {
      $rootScope.HideLoader();
      $rootScope.alert("Ажилласан жилээ оруулна уу", "warning");
    }
    // else if (isEmpty($scope.customerProfileData.identfrontpic)) {
    //   $rootScope.HideLoader();
    //   $rootScope.alert("Иргэний үнэмлэхний урд талын зургийг оруулна уу", "warning");
    // } else if (isEmpty($scope.customerProfileData.identbackpic)) {
    //   $rootScope.HideLoader();
    //   $rootScope.alert("Иргэний үнэмлэхний ард талын зургийг оруулна уу", "warning");
    // }
    else {
      var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
      $rootScope.customerProfileData.profilepicture = localStorage.getItem("profilePictureSideMenu");
      $scope.customerProfileData.id = all_ID.dccustomerid;
      $rootScope.customerProfileData.crmCustomerId = all_ID.crmuserid;

      serverDeferred.requestFull("dcApp_profile_dv_002", $scope.customerProfileData).then(function (responseSaveCustomer) {
        if (responseSaveCustomer[0] == "success" && !isEmpty(responseSaveCustomer[1])) {
          $rootScope.sidebarUserName = responseSaveCustomer[1].lastname.substr(0, 1) + ". " + responseSaveCustomer[1].firstname;

          // serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", uniqueIdentifier: $scope.customerProfileData.uniqueidentifier }).then(function (response) {
          serverDeferred.requestFull("dcApp_getDV_customer_income_copy_004", { uniqueIdentifier: $scope.customerProfileData.uniqueidentifier }).then(function (response) {
            // console.log("asd", response);
            if (response[0] == "success" && !isEmpty(response[1])) {
              var json = {
                id: all_ID.crmcustomerid,
                mobileNumber: $scope.customerProfileData.mobilenumber,
                siRegNumber: $scope.customerProfileData.uniqueidentifier,
              };
              json.dcApp_crmUser_update = {
                id: all_ID.crmuserid,
                customerId: all_ID.crmcustomerid,
                userName: $scope.customerProfileData.mobilenumber,
              };
              serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {});
              $rootScope.loginUserInfo = {};
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

              localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

              $rootScope.customerProfilePicture.id = all_ID.dccustomerid;

              serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $rootScope.customerProfilePicture).then(function (response) {});

              $rootScope.alert("Амжилттай", "success", "profile");
              $rootScope.HideLoader();
            } else {
              $rootScope.alert("Мэдээлэл хадгалахад алдаа гарлаа 100", "danger", "profile");
            }
          });
        } else {
          $rootScope.alert("Мэдээлэл хадгалахад алдаа гарлаа 200", "danger", "profile");
        }
      });
    }
    $timeout(function () {
      $rootScope.HideLoader();
    }, 5000);
  };

  $scope.takePhoto = function (type) {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if ($scope.selectedImagePath == 1) {
          $scope.customerProfileData.identfrontpic = imageData;
        } else if ($scope.selectedImagePath == 2) {
          $scope.customerProfileData.identbackpic = imageData;
        } else if ($scope.selectedImagePath == 3) {
          $rootScope.customerProfilePicture.profilePictureClob = imageData;

          $rootScope.customerProfilePicture.id = all_ID.dccustomerid;

          serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $rootScope.customerProfilePicture).then(function (response) {});
        }
        $scope.$apply();
      },
      function onFail(message) {},
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
      }
    );
    localStorage.removeItem("profilePictureSideMenu");
    localStorage.setItem("profilePictureSideMenu", $rootScope.customerProfilePicture.profilePictureClob);
  };

  //income data
  $scope.saveIncomeProfileData = function () {
    if (isEmpty($scope.customerIncomeProfileData.incometypeid)) {
      $rootScope.alert("Та орлогын эх үүсвэр сонгоно уу", "warning");
    }
    // else if (isEmpty($scope.customerIncomeProfileData.monthlyincome)) {
    //   $rootScope.alert("Та сарын орлогоо оруулна уу", "warning");
    // }
    else {
      $timeout(function () {
        if ($scope.customerIncomeProfileData != "") {
          var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
          $rootScope.customerIncomeProfileData.customerid = all_ID.dccustomerid;
          // console.log("$rootScope.customerIncomeProfileData", $rootScope.customerIncomeProfileData);
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {
            $rootScope.alert("Амжилттай", "success");
          });
        } else {
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {});
        }
      }, 500);
    }
  };

  $scope.ppSourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayProfilePicute").style.display = "block";
  };
  $scope.ppSourceSelectOff = function () {
    document.getElementById("overlayProfilePicute").style.display = "none";
  };

  $rootScope.backFromProfile = function () {
    $state.go("home");
  };
  $ionicPlatform.onHardwareBackButton(function () {
    if ($state.current.name == "profile") {
      $state.go("home");
    }
    if ($state.current.name == "autoleasing-2") {
      $state.go("home");
    }
  });
  $rootScope.proofOfIncomeData = $rootScope.incomeTypeWithCondition;
  $scope.selectIncomeTypeProfile = function (id) {
    $rootScope.proofOfIncomeData = [];
    $rootScope.incomeTypeWithCondition.forEach((el) => {
      if (el.id === id) {
        $rootScope.proofOfIncomeData.push(el);
      }
    });
  };
  $scope.checkEmail = function (email) {
    serverDeferred.requestFull("dcApp_checkEmail_004", { email: $scope.customerProfileData.email }).then(function (checkUserEmail) {
      if (checkUserEmail[0] == "success" && !isEmpty(checkUserEmail[1])) {
        $rootScope.alert("И-мэйл хаяг бүртгэлтэй байна", "danger", "profile");
        $scope.customerProfileData.email = "";
      }
    });
  };
});
