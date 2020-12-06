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
      // console.log("$rootScope.allBankList", $rootScope.allBankList);
    });
  };

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
          // console.log($rootScope.loginUserInfo);
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
          // console.log("customerDealBanks", $rootScope.customerDealBanks);
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
      // console.log($scope.customerProfileData);
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
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if ($scope.selectedImagePath == 1) {
          $scope.customerProfileData.identfrontpic = "jpg♠" + imageData;
        } else if ($scope.selectedImagePath == 2) {
          $scope.customerProfileData.identbackpic = "jpg♠" + imageData;
        } else if ($scope.selectedImagePath == 3) {
          $scope.customerProfilePicture.profilepicture = "jpg♠" + imageData;

          $scope.customerProfilePicture.id = $scope.loginUserInfo.customerid;

          serverDeferred.requestFull("dcApp_profile_pricture_dv_002", $scope.customerProfilePicture).then(function (response) {});
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
      // console.log("customerDealBank", response);
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1604389075984789", id: response[1].id }).then(function (response) {
        // console.log("response", response);
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
      serverDeferred.requestFull("dcApp_qr_generator", $rootScope.customeridforQR).then(function (response) {
        $rootScope.customerQrData = {};
        $rootScope.customerQrData.id = $scope.loginUserInfo.customerid;
        $rootScope.customerQrData.customerqr = "jpg♠" + response[1].value;

        serverDeferred.requestFull("dcApp_customer_qr_dv_002", $rootScope.customerQrData).then(function (response) {
          // console.log("customerQrData response", response);
          $scope.getProfileData();
        });
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
  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
  $("#odo").mask("000000000");
  $("#nationalNumber").mask("0000 AAA", {
    translation: {
      A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
    },
  });
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
    if (isEmpty($scope.defualtbank)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1603952821400122" }).then(function (datas) {
        delete datas.aggregatecolumns;
        angular.forEach(datas, function (item) {
          item.BANK_LOGO = item.banklogo;
          item.DEPARTMENT_NAME = item.departmentname;
          item.PARENT_ID = item.id;
        });
        $rootScope.bankList = { correct: datas };
        $scope.defualtbank = datas;
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
  $scope.saveCustomerCar = function () {
    //console.log("saveCustomerCar");
  };

  var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "Ф", "Х", "У", "Ч"];
  new MobileSelect({
    trigger: "#trigger",
    wheels: [{ data: regChars }, { data: regChars }],
    position: [0, 0],
    ensureBtnText: "Болсон",
    cancelBtnText: "Хаах",
    transitionEnd: function (indexArr, data) {
      //scroll xiij bhd ajillah func
      // console.log(data);
    },
    callback: function (indexArr, data) {
      //console.log("asdasd", data);
    },
  });

  // $("body").append(
  //   "<div class='mobileSelect'>" +
  //     "<div class='grayLayer'></div>" +
  //     "<div class='content'>" +
  //     "<div class='btnBar'>" +
  //     "<div class='fixWidth marginWidth'>" +
  //     "<div class='cancel'>Хаах</div>" +
  //     "<div class='title'></div>" +
  //     "<div class='ensure'>Болсон</div>" +
  //     "</div>" +
  //     "</div>" +
  //     "<div class='panel'>" +
  //     "<div class='fixWidth'>" +
  //     "<div class='wheels'>" +
  //     "<div class='wheel' style='width: 50%;'>" +
  //     "<ul class='selectContainer' style='transform: translate3d(0px, 80px, 0px);'>" +
  //     "<li>А</li>" +
  //     "<li>Б</li>" +
  //     "<li>В</li>" +
  //     "<li>Г</li>" +
  //     "<li>Д</li>" +
  //     "<li>Е</li>" +
  //     "<li>Ж</li>" +
  //     "<li>З</li>" +
  //     "<li>И</li>" +
  //     "<li>Й</li>" +
  //     "<li>К</li>" +
  //     "<li>Л</li>" +
  //     "<li>М</li>" +
  //     "<li>Н</li>" +
  //     "<li>О</li>" +
  //     "<li>П</li>" +
  //     "<li>Р</li>" +
  //     "<li>С</li>" +
  //     "<li>Т</li>" +
  //     "<li>Ф</li>" +
  //     "<li>Х</li>" +
  //     "<li>У</li>" +
  //     "<li>Ч</li>" +
  //     "</ul>" +
  //     "</div>" +
  //     "<div class='wheel' style='width: 50%;'>" +
  //     "<ul class='selectContainer' style='transform: translate3d(0px, 80px, 0px);'>" +
  //     "<li>А</li>" +
  //     "<li>Б</li>" +
  //     "<li>В</li>" +
  //     "<li>Г</li>" +
  //     "<li>Д</li>" +
  //     "<li>Е</li>" +
  //     "<li>Ж</li>" +
  //     "<li>З</li>" +
  //     "<li>И</li>" +
  //     "<li>Й</li>" +
  //     "<li>К</li>" +
  //     "<li>Л</li>" +
  //     "<li>М</li>" +
  //     "<li>Н</li>" +
  //     "<li>О</li>" +
  //     "<li>П</li>" +
  //     "<li>Р</li>" +
  //     "<li>С</li>" +
  //     "<li>Т</li>" +
  //     "<li>Ф</li>" +
  //     "<li>Х</li>" +
  //     "<li>У</li>" +
  //     "<li>Ч</li>" +
  //     "</ul>" +
  //     "</div>" +
  //     "</div>" +
  //     "<div class='selectLine'></div>" +
  //     "<div class='shadowMask'></div>" +
  //     "</div>" +
  //     "</div>" +
  //     "</div>" +
  //     "</div>"
  // );
});
