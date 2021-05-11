angular.module("profile.Ctrl", []).controller("profileCtrl", function ($scope, $ionicHistory, $state, $stateParams, $rootScope, serverDeferred, $ionicPlatform, $ionicModal, $timeout, $ionicTabsDelegate, $ionicLoading) {
  $scope.backbutton = function () {
    $rootScope.hideFooter = false;
    $ionicHistory.goBack();
  };
  $rootScope.hideFooter = true;
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

  $scope.getProfileLookupData = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
      $rootScope.mortgageData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
      $rootScope.familtStatData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554274244505" }).then(function (response) {
      $rootScope.incomeType = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1620623825290326" }).then(function (response) {
      $rootScope.experiencePeriodData = response;
    });
  };

  $scope.nextPath = $stateParams.path;

  $rootScope.customerProfileData = {};
  $rootScope.customerProfilePicture = {};
  $scope.customerProfileData.mobilenumber = "";
  $scope.customerProfileData.customerTypeId = 1;

  $rootScope.customerIncomeProfileData = {};

  $scope.regNum = "";

  $rootScope.getProfileData = function () {
    $rootScope.ShowLoader();
    console.log("localStorage", localStorage);
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: all_ID.crmuserid }).then(function (response) {
        console.log("get Profile Data response", response);

        $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
        $rootScope.hideFooter = true;
        if (response[0] != "") {
          $rootScope.customerProfileData = response[0];
          localStorage.removeItem("profilePictureSideMenu");
          localStorage.setItem("profilePictureSideMenu", response[0].profilepicture);
          $rootScope.profilePictureSideMenu = response[0].profilepicture;
          $rootScope.customerProfilePicture.profilePictureClob = response[0].profilepicture;

          if (response[0].uniqueidentifier) {
            $scope.regNum = response[0].uniqueidentifier;
            $("#regCharA").text(response[0].uniqueidentifier.substr(0, 1));
            $("#regCharB").text(response[0].uniqueidentifier.substr(1, 1));
            $("#regNums").val(response[0].uniqueidentifier.substr(2, 8));
          }
          console.log("all_ID", all_ID);
          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
            console.log("ASDFSDFSDFSDF", response);
            if (!isEmpty(response[0])) {
              $rootScope.customerIncomeProfileData = response[0];
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

              localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
              console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
            } else {
            }
          });
        }
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1604389075984789", dim1: $rootScope.loginUserInfo.customerid }).then(function (response) {
          $rootScope.customerDealBanks = response;
        });
        $ionicLoading.hide();
      });
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $scope.getProfileLookupData();
    $timeout(function () {
      $rootScope.getProfileData();
    }, 500);
    $rootScope.hideFooter = true;
  });

  $scope.saveProfileData = function () {
    $rootScope.ShowLoader();
    document.getElementById("lastNameLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("firstNameLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("regLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("mailLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("phoneLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("marriageLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("mikLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("workLabel").style.borderBottom = "1px solid #ddd";
    $scope.customerProfileData.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();

    if (isEmpty($scope.customerProfileData.lastname)) {
      $rootScope.alert("Та овогоо оруулна уу", "warning");
      document.getElementById("lastNameLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.firstname)) {
      $rootScope.alert("Та өөрийн нэрээ оруулна уу", "warning");
      document.getElementById("firstNameLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.uniqueidentifier)) {
      $rootScope.alert("Регситрын дугаараа оруулна уу", "warning");
      document.getElementById("regLabel").style.borderBottom = "2px solid red";
    }
    // else if (isEmpty($scope.customerProfileData.email)) {
    //   $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
    //   document.getElementById("mailLabel").style.borderBottom = "2px solid red";
    // }
    else if (isEmpty($scope.customerProfileData.mobilenumber)) {
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
      document.getElementById("phoneLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.ismarried)) {
      $rootScope.alert("Гэрлэсэн эсэхээ сонгоно уу", "warning");
      document.getElementById("marriageLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.mikmortgagecondition)) {
      $rootScope.alert("МИК-ийн зээлтэй эсэхээ сонгоно уу", "warning");
      document.getElementById("mikLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.experienceperiodid)) {
      $rootScope.alert("Ажилласан жилээ оруулна уу", "warning");
      document.getElementById("workLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.identfrontpic)) {
      $rootScope.alert("Иргэний үнэмлэхний урд талын зургийг оруулна уу", "warning");
    } else if (isEmpty($scope.customerProfileData.identbackpic)) {
      $rootScope.alert("Иргэний үнэмлэхний ард талын зургийг оруулна уу", "warning");
    } else {
      var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
      console.log("ALL_ID", all_ID);
      $rootScope.customerProfileData.profilepicture = localStorage.getItem("profilePictureSideMenu");
      $scope.customerProfileData.id = all_ID.dccustomerid;
      $rootScope.customerProfileData.crmCustomerId = all_ID.crmuserid;

      console.log("$scope.customerProfileData", $scope.customerProfileData);

      serverDeferred.requestFull("dcApp_profile_dv_002", $scope.customerProfileData).then(function (responseSaveCustomer) {
        console.log("responseSaveCustomer", responseSaveCustomer);
        if (responseSaveCustomer[0] == "success" && !isEmpty(responseSaveCustomer[1])) {
          $rootScope.sidebarUserName = responseSaveCustomer[1].lastname.substr(0, 1) + ". " + responseSaveCustomer[1].firstname;

          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", uniqueIdentifier: $scope.customerProfileData.uniqueidentifier }).then(function (response) {
            console.log("res", response);
            if (!isEmpty(response) && !isEmpty(response[0])) {
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
              serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                console.log("crmRes", crmResponse);
              });
              $rootScope.loginUserInfo = {};
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
              console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);

              localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

              $rootScope.customerProfilePicture.id = all_ID.dccustomerid;

              serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $rootScope.customerProfilePicture).then(function (response) {
                console.log("res change profile picture", response);
              });

              $rootScope.alert("Амжилттай", "success", "profile");
              $ionicLoading.hide();
            } else {
              $rootScope.alert("Мэдээлэл хадгалахад алдаа гарлаа", "success", "profile");
            }
          });
          if (!isEmpty($scope.nextPath)) {
            $state.go($scope.nextPath);
          }
        } else {
          $rootScope.alert("Мэдээлэл хадгалахад алдаа гарлаа", "success", "profile");
        }
      });
    }
    $timeout(function () {
      $ionicLoading.hide();
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

          serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $rootScope.customerProfilePicture).then(function (response) {
            console.log("res change profile picture", response);
          });
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
    } else if (isEmpty($scope.customerIncomeProfileData.monthlyincome)) {
      $rootScope.alert("Та сарын орлогоо оруулна уу", "warning");
    } else if (isEmpty($scope.customerIncomeProfileData.totalincomehousehold)) {
      $rootScope.alert("Та өрхийн нийт орлогоо оруулна уу", "warning");
    } else if (isEmpty($scope.customerIncomeProfileData.monthlypayment)) {
      $rootScope.alert("Та төлж буй зээлийн дүнгээ оруулна уу", "warning");
    } else {
      $timeout(function () {
        if ($scope.customerIncomeProfileData != "") {
          var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
          $rootScope.customerIncomeProfileData.customerid = all_ID.dccustomerid;
          console.log("$rootScope.customerIncomeProfileData", $rootScope.customerIncomeProfileData);
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {
            $rootScope.alert("Амжилттай", "success");
          });
        } else {
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {});
        }
      }, 500);
    }
  };
  // $scope.overlayOn = function () {
  //   document.getElementById("overlay").style.display = "block";
  // };
  // $scope.overlayOff = function () {
  //   document.getElementById("overlay").style.display = "none";
  // };

  $scope.generateQR = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    $rootScope.customeridforQR = {};
    $scope.showCreateQr = true;
    $rootScope.customeridforQR.text = all_ID.dccustomerid;

    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.requestFull("dcApp_qr_generator", $rootScope.customeridforQR).then(function (response) {
        $rootScope.customerQrData = {};
        $rootScope.customerQrData.id = all_ID.dccustomerid;
        $rootScope.customerQrData.customerqr = "jpg♠" + response[1].value;

        serverDeferred.requestFull("dcApp_customer_qr_dv_002", $rootScope.customerQrData).then(function (response) {});
      });
    }
  };
  $scope.ppSourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayProfilePicute").style.display = "block";
  };
  $scope.ppSourceSelectOff = function () {
    document.getElementById("overlayProfilePicute").style.display = "none";
  };
  $scope.growDivTab3 = function (id) {
    var grow = document.getElementById("grow" + id);
    $("#grow" + id).toggleClass("expand");
    $("#grow" + id).toggleClass("expanded");

    if ($("#grow" + id).hasClass("expanded")) {
      grow.style.height = 0;
      document.getElementById("propertySaveButton" + id).style.display = "none";
    } else {
      var wrapper = document.querySelector(".measuringWrapper" + id);
      grow.style.height = wrapper.clientHeight + "px";
      document.getElementById("propertySaveButton" + id).style.display = "block";
    }
  };

  $rootScope.customerCar = [];
  $scope.companyData = [];
  $scope.carmerkData = [];
  $scope.getCompanyData = function () {
    if (isEmpty($scope.companyData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1544591440502" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.companyData = datas;
      });
    }
  };
  $scope.getCarmarkData = function (val) {
    var json = { systemmetagroupid: "1544591440537", factoryid: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.carmerkData = datas;
    });
  };
  $scope.getCompanyData();

  $scope.saveRegNums = function () {
    if (keyInput.value.length < 8) {
      $rootScope.alert("Регистер ээ бүрэн оруулна уу.", "warning");
    } else {
      $scope.modal.hide();
    }
  };
  $scope.cancelRegNums = function () {
    $("#regCharA").text($scope.regNum.substr(0, 1));
    $("#regCharB").text($scope.regNum.substr(1, 1));
    $("#regNums").val($scope.regNum.substr(2, 8));
    $scope.modal.hide();
  };
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
      backdropClickToClose: false,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  if (!isEmpty($scope.nextPath)) {
    $scope.overlayOn();
  }
  var keyInput;
  $ionicPlatform.ready(function () {
    setTimeout(function () {
      var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "Ю", "Ф", "Х", "У", "Ч"];
      new MobileSelect({
        trigger: ".profileRegSelector",
        wheels: [{ data: regChars }, { data: regChars }],
        position: [0, 0],
        ensureBtnText: "Хадгалах",
        cancelBtnText: "Хаах",
        transitionEnd: function (indexArr, data) {
          //scroll xiij bhd ajillah func
        },
        callback: function (indexArr, data) {
          console.log("data", data);
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
  $scope.overlayKeyOn = function () {
    $scope.modal.show();
  };
  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
  $("#odo").mask("000000000");
  $("#nationalNumber").mask("0000 AAA", {
    translation: {
      A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
    },
  });
  // $scope.addDealBank = function () {
  //   $scope.customerDealBank.dim1 = $scope.loginUserInfo.customerid;
  //   serverDeferred.requestFull("dcApp_deal_bank_customer_001", $scope.customerDealBank).then(function (response) {
  //     // console.log("customerDealBank", response);
  //     serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1604389075984789", id: response[1].id }).then(function (response) {
  //       // console.log("response", response);
  //       var appendEl = '<div class="col added-deal-bank">' + '<div class="deal-bank-remove">-</div>' + "<img src=" + $rootScope.imagePath + response[0].banklogo + " />" + "<p>" + response[0].departmentname + "</p>" + "</div>";
  //       $(appendEl).insertBefore(".profile-bank-list select:last");
  //     });
  //   });
  //   $scope.customerDealBank.dim2 = null;
  // };
  $rootScope.backFromProfile = function () {
    $state.go("home");
  };
  $ionicPlatform.onHardwareBackButton(function () {
    console.log("ASDAD");
    $state.go("home");
  });
  // $ionicPlatform.registerBackButtonAction(function (e) {
  //   e.preventDefault();
  //   console.log("ASDAD");
  //   $state.go("home");
  // }, 101);
});
