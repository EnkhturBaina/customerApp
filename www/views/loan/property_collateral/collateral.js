angular.module("property_collateral.Ctrl", []).controller("property_collateralCtrl", function ($scope, $timeout, $state, $ionicModal, $rootScope, serverDeferred) {
  $scope.pCSourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayCollateralLoan").style.display = "block";
  };
  $scope.pCSourceSelectOff = function () {
    document.getElementById("overlayCollateralLoan").style.display = "none";
  };
  $scope.takePhoto = function (type) {
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        $rootScope.propertyData[$scope.selectedImagePath] = "jpg♠" + imageData;
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

  //ҮХХ барьцаалсан зээлийн хүсэлтийн мэдээлэл
  $rootScope.propertyRequestData = {};

  $scope.saveProperty = function () {
    if ($scope.propertyCheckReqiured("step1")) {
      localStorage.setItem("requestType", "estate");
      console.log("local", localStorage);
      console.log("$rootScope.propertyData", $rootScope.propertyData);
      $state.go("property_collateral2");
    }
  };
  $ionicModal
    .fromTemplateUrl("templates/property.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (propertyModal) {
      $scope.propertyModal = propertyModal;
    });
  $timeout(function () {
    if ($state.current.name == "property_collateral_danselect") {
      // $scope.propertyModal.show();
    }
  }, 300);
  $ionicModal
    .fromTemplateUrl("templates/danIs.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (danIsModal) {
      $scope.danIsModal = danIsModal;
    });
  $scope.backFromPropertyStep1 = function () {
    $state.go("home");
  };

  $scope.gotoDanLoginDanSelectEstate = function () {
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
    serverDeferred.carCalculation({ type: "auth_estate_collateral", redirect_uri: "customerapp" }, "https://services.digitalcredit.mn/api/v1/c").then(function (response) {
      $rootScope.stringHtmlsLink = response.result.data;
      var authWindow = cordova.InAppBrowser.open($rootScope.stringHtmlsLink.url, "_blank", "location=no,toolbar=no");
      $(authWindow).on("loadstart", function (e) {
        var url = e.originalEvent.url;

        var code = url.indexOf("https://services.digitalcred");
        var error = /\?error=(.+)$/.exec(url);
        if (code == 0 || error) {
          authWindow.close();
        }

        if (code == 0) {
          serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://services.digitalcredit.mn/api/sso/check").then(function (response) {
            console.log("response Estate DAN", response);
            if (!isEmpty(response.result.data)) {
              var userInfo = JSON.parse(response.result.data.info);
              console.log("userInfo", userInfo);
              if (!isEmpty(response.result.data.property)) {
                $rootScope.userPropertyData = JSON.parse(response.result.data.property);
                $rootScope.propJson = $rootScope.userPropertyData.listData;
                console.log("$rootScope.propJson", $rootScope.propJson);
                console.log("$rootScope.userPropertyData", $rootScope.userPropertyData);
              }
              if (!isEmpty(userInfo)) {
                $scope.registerFunctionEstate(userInfo);
              }

              var userSalaryInfo = JSON.parse(response.result.data.salary);
              serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.regnum.toUpperCase() }).then(function (checkedValue) {
                console.log("checkedValue", checkedValue);
                if (!isEmpty(checkedValue[1])) {
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
                    console.log("responseCustomerData", responseCustomerData);
                    if (responseCustomerData[0] != "") {
                      //Бүртгэлтэй USER -н дата татаж харуулах
                      $rootScope.danCustomerData = responseCustomerData[0];
                      $rootScope.danCustomerData.id = checkedValue[1].customerid;
                    } else {
                      $rootScope.alert("Мэдээлэл татахад алдаа гарлаа", "warning");
                    }
                  });

                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
                    console.log("get income data response", response);
                    if (response[0] != "") {
                      $rootScope.danIncomeData = response[0];
                    }
                  });
                  console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                }
                serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
                  $rootScope.mortgageData = response;
                });
                serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
                  $rootScope.familtStatData = response;
                });
              });
              $timeout(function () {
                $rootScope.danCustomerData.lastname = userInfo.lastname;
                $rootScope.danCustomerData.firstname = userInfo.firstname;
                $rootScope.danCustomerData.uniqueidentifier = userInfo.regnum.toUpperCase();

                console.log("userSalaryInfo", userSalaryInfo);
                if (userSalaryInfo) {
                  serverDeferred.carCalculation(userSalaryInfo.list, "https://services.digitalcredit.mn/api/salary").then(function (response) {
                    console.log("res salary", response);
                    $rootScope.monthlyAverage = response.result;
                    console.log("$rootScope.monthlyAverage", $rootScope.monthlyAverage);
                    $rootScope.danIncomeData.monthlyincome = response.result;
                    console.log("$rootScope.danIncomeData", $rootScope.danIncomeData);
                  });
                }
              }, 1000);
            } else {
              $rootScope.alert("Мэдээлэл татахад алдаа гарлаа", "warning");
            }
          });
        } else if (error) {
          console.log(error);
        }
      });
      //Дан-н цонх дуудагдахад Регистр оруулах талбар харуулах
      $(authWindow).on("loadstop", function (e) {
        authWindow.executeScript({ code: "$('#m-one-sign').attr('class', 'show');" });
      });
    });
    $rootScope.propertyIsDan = true;
  };
  $scope.registerFunctionEstate = function (value) {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    var json = {
      customerCode: value.regnum.toUpperCase(),
      siRegNumber: value.regnum.toUpperCase(),
      isActive: "1",
    };
    json.dcApp_crmUser_dan = {
      userName: "",
      userId: "1",
      isActive: "1",
    };
    json.dcApp_crmUser_dan.dcApp_dcCustomer_dan = {
      familyName: value.surname,
      firstName: value.firstname,
      lastName: value.lastname,
      birthDate: value.birthDateAsText.substring(0, 10),
      uniqueIdentifier: value.regnum.toUpperCase(),
      profilePictureClob: value.image,
      isActive: "1",
      customerTypeId: "1",
    };

    serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: value.regnum.toUpperCase() }).then(function (checkedValue) {
      console.log("checkedValue", checkedValue);
      if (!isEmpty(checkedValue[1]) && !isEmpty(checkedValue[1].customerid)) {
        json.id = checkedValue[1].customerid;
        json.dcApp_crmUser_dan.id = checkedValue[1].custuserid;
        json.dcApp_crmUser_dan.dcApp_dcCustomer_dan.id = checkedValue[1].dccustomerid;
      }

      serverDeferred.requestFull("dcApp_crmCustomer_dan_001", json).then(function (responseCRM) {
        console.log("responseCRM", responseCRM);
        if (!isEmpty(responseCRM) && !isEmpty(responseCRM[0])) {
          $rootScope.loginUserInfo = mergeJsonObjs(responseCRM[1], $rootScope.loginUserInfo);
          localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
          $timeout(function () {
            if (!isEmpty(responseCRM[1]) && responseCRM[0] == "success") {
              console.log("responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id", responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id);
              serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id }).then(function (responseALLID) {
                console.log("res all_ID", responseALLID);
                localStorage.setItem("ALL_ID", JSON.stringify(responseALLID[0]));
                $rootScope.danCustomerData.id = responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
                console.log("localStorage", localStorage);
              });
            }
          }, 500);
          $state.go("property_collateral");
        }
      });
    });
  };
  $scope.propertyHand = function () {
    $rootScope.propertyIsDan = false;
  };
  $scope.savePropertyRequestData = function () {
    if ($scope.propertyCheckReqiured("step2")) {
      $state.go("autoleasing-4");
    }
  };

  console.log("$rootScope.propertyIsDan", $rootScope.propertyIsDan);
  $scope.propertyCheckReqiured = function (param) {
    if (param == "step1") {
      if (isEmpty($rootScope.propertyData.squareSize)) {
        $rootScope.alert("Талбайн хэмжээ оруулна уу", "warning");
        return false;
      } else if (["A001", "A002", "A003", "A004"].includes($scope.template.code) && isEmpty($rootScope.propertyData.roomCount)) {
        $rootScope.alert("Өрөөний тоо оруулна уу", "warning");
        return false;
      } else if (["A001", "A002"].includes($scope.template.code) && isEmpty($rootScope.propertyData.floorCount) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Давхарын тоо оруулна уу", "warning");
        return false;
      } else if (["A001", "A004"].includes($scope.template.code) && isEmpty($rootScope.propertyData.floorCount) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Давхарын байршил оруулна уу", "warning");
        return false;
      } else if (["A002", "A003"].includes($scope.template.code) && isEmpty($rootScope.propertyData.isConCentralInf) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Төвийн дэд бүтцэд холбогдсон эсэх", "warning");
        return false;
      } else if ($scope.template.code == "A008" && isEmpty($rootScope.propertyData.dedicationId)) {
        $rootScope.alert("Зориулалт сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyData.line1) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Хот/аймаг сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyData.line2) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Дүүрэг/сум сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyData.line3) && !$rootScope.propertyIsDan) {
        $rootScope.alert("Хороо/баг сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "step2") {
      if (isEmpty($rootScope.propertyRequestData.loanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyRequestData.loanMonth)) {
        $rootScope.alert("Зээл авах хугацаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyRequestData.locationId)) {
        $rootScope.alert("Зээл авах байршил сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.propertyRequestData.serviceAgreementId) || $rootScope.propertyRequestData.serviceAgreementId == 1554263832151) {
        $rootScope.alert("Та үйлчилгээний нөхцлийг зөвшөөрөөгүй байна", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    }
  };
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.getbankDataProperty = function () {
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};
    $rootScope.newReqiust = {};
    json.type = "estateLoanFilter";
    json.totalLoan = $rootScope.propertyRequestData.loanAmount;
    json.isPerson = 1;
    json.location = $rootScope.propertyRequestData.locationId;
    json.month = $rootScope.propertyRequestData.loanMonth;
    json.currency = 16074201974821;
    if (!isEmpty($rootScope.loginUserInfo)) {
      json.isMortgage = $rootScope.loginUserInfo.mikmortgagecondition;
      json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
      json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
      json.monthPay = $rootScope.loginUserInfo.monthlypayment;
    }
    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
    });
    console.log("getbankDataProperty json", json);
  };
  if ($state.current.name == "property_collateral2") {
    $scope.getbankDataProperty();
  }
  $scope.locationData = [];
  $scope.provinceData = [];
  $scope.districtData = [];
  $scope.streetData = [];
  $scope.dedicateData = [];
  $scope.isConCentralInfData = [];
  $scope.propertyCategory = [];
  $scope.getLookUpDataProperty = function () {
    if (isEmpty($scope.propertyCategory)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1618473508871492" }).then(function (response) {
        $scope.propertyCategory = response;
        // $scope.template = response[0];
        $rootScope.propertyData = {};
        $rootScope.propertyData.categoryId = response[0].id;
      });
    }
    if (isEmpty($scope.provinceData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1539849694654266" }).then(function (response) {
        $scope.provinceData = response;
      });
    }
    if (isEmpty($scope.isConCentralInfData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
        $scope.isConCentralInfData = response;
      });
    }
    if (isEmpty($scope.dedicateData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1618545785227116" }).then(function (response) {
        $scope.dedicateData = response;
      });
    }
  };
  if ($state.current.name == "property_collateral") {
    $scope.getLookUpDataProperty();
  }
  if ($state.current.name == "property_collateral2") {
    if (isEmpty($scope.locationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
        $scope.locationData = response;
      });
    }
  }
  $scope.savePropertyRequestData = function () {
    console.log("propertyRequestData", $rootScope.propertyRequestData);
    if ($scope.propertyCheckReqiured("step2")) {
      $state.go("autoleasing-4");
    }
  };
  $scope.getDistrictData = function (val) {
    var json = { systemmetagroupid: "1539850393334332", cityId: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.districtData = datas;
    });
    val != "" ? (document.getElementById("districtSelect").disabled = false) : (document.getElementById("districtSelect").disabled = true);
  };
  $scope.getStreetData = function (val) {
    var json = { systemmetagroupid: "1539850576148471", districtId: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.streetData = datas;
    });
    val != "" ? (document.getElementById("streetSelect").disabled = false) : (document.getElementById("streetSelect").disabled = true);
  };
  $scope.categoryChange = function (val) {
    $scope.template = val;
    // $rootScope.propertyData = {};
    $rootScope.propertyData.categoryId = val.id;
    console.log("$rootScope.propertyData", $rootScope.propertyData);
  };
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
  });
  $ionicModal
    .fromTemplateUrl("templates/propertyDan.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (propertyDan) {
      $scope.propertyDan = propertyDan;
    });
  $timeout(function () {
    if ($state.current.name == "property_collateral") {
      if (!isEmpty($rootScope.propJson) && $rootScope.propertyIsDan) {
        $scope.propertyDan.show();
      } else if (($rootScope.propertyIsDan && isEmpty($rootScope.propJson)) || ($rootScope.propertyIsDan && $rootScope.propJson != undefined)) {
        $rootScope.alert("Таньд ҮХХ бүртгэлгүй байна", "warning");
      }
    }
  }, 300);
  $scope.selectDanProperty = function (el) {
    if (el.propertySize.match(/,/g)) {
      $rootScope.propertyData.squareSize = parseFloat(el.propertySize.replace(",", "."));
    } else {
      $rootScope.propertyData.squareSize = parseFloat(el.propertySize);
    }
    $rootScope.propertyData.assetName = el.codeName;
    $rootScope.propertyData.address = el.fullAddress;
  };
});
