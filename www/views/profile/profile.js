angular.module("profile.Ctrl", []).controller("profileCtrl", function ($scope, $ionicHistory, $state, $stateParams, $rootScope, serverDeferred, $ionicPlatform, $ionicModal, $timeout, $ionicTabsDelegate) {
  $scope.backbutton = function () {
    if (isEmpty($rootScope.loginUserInfo)) {
      $ionicHistory.goBack();
    } else {
      $state.go("home");
      $rootScope.hideFooter = false;
    }
  };

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
  };
  $scope.getProfileLookupData();

  $scope.nextPath = $stateParams.path;

  $rootScope.customerProfileData = {};
  $rootScope.customerProfilePicture = {};
  $scope.customerProfileData.mobilenumber = "";
  $scope.customerProfileData.customerTypeId = 1;

  $rootScope.customerIncomeProfileData = {};
  $scope.customerId;

  $scope.regNum = "";

  $scope.customerEmail;

  $rootScope.basePersonData = {};
  $rootScope.umSystemUser = {};
  $rootScope.umUser = {};

  if (!isEmpty($rootScope.loginUserInfo)) {
    $rootScope.customerProfileData.crmCustomerId = $rootScope.loginUserInfo.id;
    $rootScope.customerProfileData.mobilenumber = $rootScope.loginUserInfo.customercode;
  }

  $scope.getProfileData = function () {
    if (!isEmpty($rootScope.loginUserInfo)) {
      console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: $rootScope.loginUserInfo.id }).then(function (response) {
        console.log("getProfileData", response);
        $rootScope.hideFooter = true;
        if (response[0] != "") {
          $rootScope.customerProfileData = response[0];
          console.log("$rootScope.customerProfileData", $rootScope.customerProfileData);
          $scope.customerProfilePicture.profilepicture = response[0].profilepicture;
          $scope.customerId = response[0].id;
          if (response[0].uniqueidentifier) {
            $scope.regNum = response[0].uniqueidentifier;
            $("#regCharA").text(response[0].uniqueidentifier.substr(0, 1));
            $("#regCharB").text(response[0].uniqueidentifier.substr(1, 1));
            $("#regNums").val(response[0].uniqueidentifier.substr(2, 8));
          }

          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: response[0].id }).then(function (response) {
            console.log("get income data", response);
            if (response[0] != "") {
              $rootScope.customerIncomeProfileData = response[0];
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

              // localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

              console.log("old user income");
            } else {
              console.log("shine user income");
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
    document.getElementById("lastNameLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("firstNameLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("regLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("mailLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("phoneLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("marriageLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("mikLabel").style.borderBottom = "1px solid #ddd";
    document.getElementById("workLabel").style.borderBottom = "1px solid #ddd";
    $scope.customerProfileData.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();

    $rootScope.customerProfileData.crmCustomerId = $rootScope.loginUserInfo.id;
    // $rootScope.customerProfileData.mobilenumber = $rootScope.loginUserInfo.customercode;
    if (isEmpty($scope.customerProfileData.lastname)) {
      $rootScope.alert("Та овогоо оруулна уу", "warning");
      document.getElementById("lastNameLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.firstname)) {
      $rootScope.alert("Та өөрийн нэрээ оруулна уу", "warning");
      document.getElementById("firstNameLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.uniqueidentifier)) {
      $rootScope.alert("Регситрын дугаараа оруулна уу", "warning");
      document.getElementById("regLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.email)) {
      $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
      document.getElementById("mailLabel").style.borderBottom = "2px solid red";
    }
    // else if (isEmpty($scope.customerProfileData.address)) {
    //   $rootScope.alert("Хаягаа оруулна уу", "warning");
    // }
    else if (isEmpty($scope.customerProfileData.mobilenumber)) {
      $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
      document.getElementById("phoneLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.ismarried)) {
      $rootScope.alert("Гэрлэсэн эсэхээ сонгоно уу", "warning");
      document.getElementById("marriageLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.mikmortgagecondition)) {
      $rootScope.alert("Гэрлэсэн эсэхээ сонгоно уу", "warning");
      document.getElementById("mikLabel").style.borderBottom = "2px solid red";
    } else if (isEmpty($scope.customerProfileData.experienceperiodid)) {
      $rootScope.alert("Ажилласан жилээ оруулна уу", "warning");
      document.getElementById("workLabel").style.borderBottom = "2px solid red";
    } else {
      if ($rootScope.isDanLogin) {
        console.log("isDanLogin IF", $rootScope.isDanLogin);
        $scope.customerProfileData.id = $rootScope.loginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
      } else if (!$rootScope.isDanLogin) {
        console.log("isDanLogin ELSE", $rootScope.isDanLogin);
        $scope.customerProfileData.id = $rootScope.loginUserInfo.customerid;
      }
      $scope.customerProfileData.customertypeid = 1;
      $scope.customerEmail = $scope.customerProfileData.email;
      console.log("customerProfileData", $scope.customerProfileData);

      serverDeferred.requestFull("dcApp_profile_dv_002", $scope.customerProfileData).then(function (response) {
        console.log("response customerProfileData", response);
        $rootScope.loginUserInfo = mergeJsonObjs($scope.customerProfileData, $rootScope.loginUserInfo);

        localStorage.removeItem("loginUserInfo");
        localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

        $rootScope.basePersonData = {
          firstName: response[1].firstname,
          lastName: response[1].lastname,
          stateRegNumber: response[1].uniqueidentifier.toUpperCase(),
          parentId: response[1].id,
        };

        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613634433158205", stateRegNumber: response[1].uniqueidentifier.toUpperCase() }).then(function (response) {
          console.log("parentId response", response);
          if (response[0] == "") {
            //BasePerson
            serverDeferred.requestFull("dcApp_basePerson_002", $scope.basePersonData).then(function (response) {
              console.log("basePersonData", response);
              $rootScope.umSystemUser = {
                username: response[1].stateregnumber.toUpperCase(),
                email: $scope.customerEmail,
                personId: response[1].id,
              };
              //umSystemUser
              serverDeferred.requestFull("dcApp_umSystemUser_001", $scope.umSystemUser).then(function (response) {
                console.log("umSystemUser", response);
                $rootScope.umUser = {
                  systemUserId: response[1].id,
                };
                //umUser
                serverDeferred.requestFull("dcApp_umUser_001", $scope.umUser).then(function (response) {
                  console.log("umUser", response);
                });
              });
            });
          } else {
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613634471804840", personId: response[0].id }).then(function (response) {
              $rootScope.umSystemUser = {
                id: response[0].id,
                email: $scope.customerEmail,
              };

              serverDeferred.requestFull("dcApp_umSystemUserEmailChange_002", $scope.umSystemUser).then(function (response) {
                console.log("umSystemUser  response", response);
              });
            });
          }
          $rootScope.alert("Амжилттай", "success", "profile");
        });

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
      $rootScope.alert("Та орлогын эх үүсвэр сонгоно уу", "warning");
    } else if (isEmpty($scope.customerIncomeProfileData.monthlyincome)) {
      $rootScope.alert("Та сарын орлогоо оруулна уу", "warning");
    } else if (isEmpty($scope.customerIncomeProfileData.totalincomehousehold)) {
      $rootScope.alert("Та өрхийн нийт орлогоо оруулна уу", "warning");
    } else if (isEmpty($scope.customerIncomeProfileData.monthlypayment)) {
      $rootScope.alert("Та төлж буй зээлийн дүнгээ оруулна уу", "warning");
    } else {
      // $scope.getProfileData();

      $timeout(function () {
        if ($scope.customerIncomeProfileData != "") {
          if ($rootScope.isDanLogin) {
            $scope.customerIncomeProfileData.customerid = $rootScope.loginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
          } else if (!$rootScope.isDanLogin) {
            $scope.customerIncomeProfileData.customerid = $rootScope.loginUserInfo.customerid;
          }
          console.log("$rootScope.customerIncomeProfileData", $rootScope.customerIncomeProfileData);
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {
            console.log("save income response", response);
            $rootScope.alert("Амжилттай", "success");
          });
        } else {
          serverDeferred.requestFull("dcApp_profile_income_dv_002", $rootScope.customerIncomeProfileData).then(function (response) {
            // console.log("save income response", response);
          });
        }
      }, 1000);
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

  $scope.generateQR = function () {
    $rootScope.customeridforQR = {};
    $scope.showCreateQr = true;
    $rootScope.customeridforQR.text = $scope.loginUserInfo.customerid;

    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.requestFull("dcApp_qr_generator", $rootScope.customeridforQR).then(function (response) {
        console.log("response", response);
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
  $scope.clickReg = function () {};
  var keyInput;
  $ionicPlatform.ready(function () {
    setTimeout(function () {
      var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "Ф", "Х", "У", "Ч"];
      new MobileSelect({
        trigger: ".profileRegSelector",
        wheels: [{ data: regChars }, { data: regChars }],
        position: [0, 0],
        ensureBtnText: "Хадгалах",
        cancelBtnText: "Хаах",
        transitionEnd: function (indexArr, data) {
          //scroll xiij bhd ajillah func
          // console.log(data);
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
});
