angular.module("autoleasing.Ctrl", ["ngAnimate"]).controller("autoleasingCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicHistory, $window, $ionicPlatform) {
  $rootScope.requestType = "";
  $rootScope.requestType = localStorage.getItem("requestType");

  $scope.getCarDatasId = function (itemCode) {
    $scope.carData = [];
    if ($scope.checkReqiured("step1")) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", itemCode: itemCode }).then(function (response) {
        if (!isEmpty(response) && !isEmpty(response[0])) {
          $rootScope.selectedCarData = response[0];

          $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
          $state.go("car-info");
        } else {
          $rootScope.alert("Код буруу байна", "danger");
        }
      });
    }
  };

  $scope.getCarDatasIdEnterkey = function (event, itemCode) {
    if (event.keyCode === 13) {
      $scope.getCarDatasId(itemCode);
    }
  };

  $scope.getLookupData = function () {
    if (isEmpty($rootScope.monthData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1579493650561919" }).then(function (response) {
        $rootScope.monthData = response;
      });
    }
    if (isEmpty($rootScope.locationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
        $rootScope.locationData = response;
      });
    }
  };

  if ($rootScope.requestType == "consumer") {
    if ($state.current.name == "autoleasing-2") {
      $rootScope.newReqiust = {};
    }
    $scope.getLoanAmount = $rootScope.sumPrice;
    $rootScope.loanAmountField = $rootScope.sumPrice;
  } else {
    if (!isEmpty($rootScope.selectedCarData)) {
      $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
      $rootScope.loanAmountField = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
    }
  }

  $scope.getLookupData();

  $scope.getbankData = function () {
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.totalLoan = $rootScope.newReqiust.loanAmount;
    json.preTotal = $rootScope.newReqiust.advancePayment;
    json.isPerson = 1;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.currency = 16074201974821;
    json.isMortgage = $rootScope.loginUserInfo.mikmortgagecondition;
    json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
    json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
    json.monthPay = $rootScope.loginUserInfo.monthlypayment;

    if ($rootScope.requestType == "consumer") {
      //Хэрэглээний лизинг банк шүүлт
      json.type = "consumerLeasingFilter";
      json.supplier = $rootScope.otherGoodsData[0].shopId;
      serverDeferred.carCalculation(json).then(function (response) {
        $rootScope.bankListFilter = response.result.data;
      });
    } else {
      //Авто лизинг банд шүүлт
      if (!isEmpty($rootScope.selectedCarData) && !isEmpty($rootScope.selectedCarData.itemcode)) {
        json.type = "autoLeasingFilter";
        json.isCollateral = $rootScope.newReqiust.collateralConditionId;
        json.code = $rootScope.selectedCarData.itemcode;
        serverDeferred.carCalculation(json).then(function (response) {
          $rootScope.bankListFilter = response.result.data;
        });
      }
    }
    console.log("json", json);
  };

  //Банк шүүлт autoleasing-2 дээр шууд ажиллах
  //Банк сонгох autoleasing-3 хуудасруу ороход ажиллах
  if ($state.current.name == "autoleasing-3" || $state.current.name == "autoleasing-2") {
    $scope.getbankData();
  }
  $scope.showQRreader = function () {
    var optionCodeCam = {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: true, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt: "Код уншуулна уу", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false, // iOS and Android
    };
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (!isEmpty(result.text)) {
          $rootScope.newReqiust.itemcode = result.text;
          $scope.getCarDatasId(result.text);
        }
      },
      function (error) {
        $scope.backbutton();
      },
      optionCodeCam
    );
  };

  $rootScope.selectedBankSuccess = "";
  $rootScope.carCollateralData = {};
  $rootScope.consumerData = [];
  $scope.perOfAdvancePayment;
  var selectedbanks = [];

  $scope.sendRequest = async function () {
    console.log("$rootScope.requestType", $rootScope.requestType);
    if ($rootScope.requestType == "autoColl") {
      //===================Авто машин барьцаалсан зээл===================
      $scope.carCollateralData = JSON.parse(localStorage.getItem("carColl"));

      $scope.carCollateralData.customerId = $rootScope.loginUserInfo.customerid;

      $scope.carCollateralRequestData.customerId = $rootScope.loginUserInfo.customerid;
      $scope.carCollateralRequestData.perOfAdvancePayment = $scope.perOfAdvancePayment.replace(/,/g, "");

      //Барьцаалах автомашин бүртгэх
      serverDeferred.requestFull("dcApp_car_collateral_loan_001", $scope.carCollateralData).then(function (saveResponse) {
        if (saveResponse[0] == "success" && saveResponse[1] != "") {
          // console.log("response car collateral", saveResponse);
          //Хүсэлт бүртгэх
          serverDeferred.requestFull("dcApp_carCollRequestDV_001", $scope.carCollateralRequestData).then(function (sendReqResponse) {
            // console.log("sendReqResponse", sendReqResponse);
            if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
              $state.go("loan_success");
            } else {
              $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
            }
          });
        } else {
          $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
        }
      });
    } else if ($rootScope.requestType == "consumer") {
      //==================Хэрэглээний лизинг===================
      $scope.consumerData = JSON.parse(localStorage.getItem("otherGoods"));

      $scope.newReqiust.customerId = $rootScope.loginUserInfo.customerid;
      $scope.newReqiust.perOfAdvancePayment = $scope.perOfAdvancePayment.replace(/,/g, "");

      console.log("$scope.newReqiust", $scope.newReqiust);
      //Хүсэлт бүртгэх
      serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
        if (response[0] == "success" && response[1] != "") {
          //нөхцөл хангасан банкууд
          angular.forEach($rootScope.bankListFilter.Agree, function (item) {
            if (item.checked) {
              var AgreeBank = {
                loanId: response[1].id,
                customerId: $rootScope.loginUserInfo.customerid,
                bankId: item.id,
                wfmStatusId: 1585206036474051,
                productId: item.products[0].id,
              };
              selectedbanks.push(AgreeBank);
            }
          });

          //нөхцөл хангаагүй банкууд
          angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
            if (item.checked) {
              var NotAgreeBank = {
                loanId: response[1].id,
                customerId: $rootScope.loginUserInfo.customerid,
                bankId: item.id,
                wfmStatusId: 1585206036474051,
                productId: item.products[0].id,
              };
              selectedbanks.push(NotAgreeBank);
            }
          });

          var mapBankSuccess = false;

          //MAP table рүү сонгосон банкуудыг бичих
          selectedbanks.map((bank) => {
            serverDeferred.requestFull("dcApp_request_map_bank_for_detail_001", bank).then(function (response) {
              if (response[0] == "success" && response[1] != "") {
                mapBankSuccess = true;
                console.log("CONSUMER BANK res", response);
              }
            });
          });
          //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
          $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree.concat($rootScope.bankListFilter.NotAgree);

          $scope.consumerData.map((product) => {
            product.leasingId = response[1].id;
            if (product.picture1) {
              product.picture1 = product.image.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            //Бүтээгдэхүүн бүртгэх
            serverDeferred.requestFull("dcApp_consumer_loan_001", product).then(function (responseProduct) {
              // console.log("responseProduct", responseProduct);
              if (responseProduct[0] == "success" && responseProduct[1] != "" && mapBankSuccess) {
                $state.go("loan_success");
              } else {
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
              }
            });
          });
        } else {
          $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
        }
      });
    } else if ($rootScope.requestType == "business") {
      //===================Бизнесийн зээл===================
    } else if ($rootScope.requestType == "estate") {
      //===================Үл хөдлөх барьцаат зээл===================
    } else {
      //==================AutoLeasing===================
      if ($scope.checkReqiured("step4")) {
        $scope.newReqiust.customerId = $rootScope.loginUserInfo.customerid;
        $scope.newReqiust.perOfAdvancePayment = $scope.perOfAdvancePayment.replace(/,/g, "");

        serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
          if (response[0] == "success" && response[1] != "") {
            //нөхцөл хангасан банкууд
            angular.forEach($rootScope.bankListFilter.Agree, function (item) {
              if (item.checked) {
                var AgreeBank = {
                  loanId: response[1].id,
                  customerId: $rootScope.loginUserInfo.customerid,
                  bankId: item.id,
                  wfmStatusId: 1585206036474051,
                  productId: item.products[0].id,
                };
                selectedbanks.push(AgreeBank);
              }
            });

            //нөхцөл хангаагүй банкууд
            angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
              if (item.checked) {
                var NotAgreeBank = {
                  loanId: response[1].id,
                  customerId: $rootScope.loginUserInfo.customerid,
                  bankId: item.id,
                  wfmStatusId: 1585206036474051,
                  productId: item.products[0].id,
                };
                selectedbanks.push(NotAgreeBank);
              }
            });
            //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
            $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree.concat($rootScope.bankListFilter.NotAgree);

            var onlineLeasingProduct = {
              leasingId: response[1].id,
              itemCode: $rootScope.selectedCarData.itemcode,
              shopId: $rootScope.selectedCarData.supplierid,
              dcApp_request_map_bank_for_detail: selectedbanks,
            };

            serverDeferred.requestFull("dcApp_request_product_dv_with_detail_001", onlineLeasingProduct).then(function (response) {
              if (response[0] == "success" && response[1] != "") {
                $state.go("loan_success");
              } else {
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
              }
            });
          } else {
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
          }
        });
      }
    }
  };

  $scope.goStep3 = function (param) {
    if ($scope.checkReqiured("step2")) {
      if (isEmpty($rootScope.newReqiust.serviceAgreementId)) {
        $rootScope.newReqiust.serviceAgreementId = "1554263832132";
      }
      $state.go("autoleasing-3");
    }
    $scope.getCustomerId();
  };

  $scope.selectBankInfo = function (bank) {
    $rootScope.selectedBank = bank;
    $state.go("autoleasing-bank-info");
  };

  //other
  $scope.checkReqiured = function (param) {
    if (isEmpty($rootScope.newReqiust)) {
      $rootScope.newReqiust = {};
      $rootScope.newReqiust.customerId = "";
    }
    if (param == "step1") {
      if (isEmpty($rootScope.newReqiust.itemcode)) {
        $rootScope.alert("Код оо оруулна уу", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "step2") {
      if (isEmpty($scope.getLoanAmount)) {
        $rootScope.newReqiust.loanAmountReq = true;
        $rootScope.alert("Зээлийн хэмжээгээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.alert("Урьдчилгаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаагаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Байршил сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "step4") {
      if (input.value === "0" || input.value === 0 || input.value === "") {
        $rootScope.alert("Та сард төлөх боломжтой дүнгээ оруулна уу", "warning");
        return false;
      } else {
        $rootScope.newReqiust.perOfAdvancePayment = parseInt(input.value);
        return true;
      }
    }
  };

  $scope.getCustomerId = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmCustomerId: $rootScope.loginUserInfo.id }).then(function (response) {
      if (!isEmpty(response) && !isEmpty(response[0])) {
        $rootScope.newReqiust.customerId = response[0].id;
      }
    });
  };

  $scope.growDiv = function () {
    var growDiv = document.getElementById("car-grow");
    if (growDiv.clientHeight) {
      growDiv.style.height = 0;
    } else {
      var wrapper = document.querySelector(".car-measuringWrapper");
      growDiv.style.height = wrapper.clientHeight + "px";
    }
  };
  var input = document.getElementById("inputId");
  if (input) {
    function addThousandsSeparator(x) {
      retVal = x ? parseFloat(x.replace(/,/g, "")) : 0;
      return retVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    $scope.clearD = function () {
      input.value = input.value.slice(0, input.value.length - 1);
    };

    $scope.addCode = function (key) {
      input.value = addThousandsSeparator(input.value + key);
      $scope.perOfAdvancePayment = input.value;
    };

    $scope.emptyCode = function () {
      input.value = "";
    };

    $scope.emptyCode();
  }

  $scope.calcLoanAmount = function () {
    var input = document.getElementById("sendRequestAdvancePayment");
    $scope.getLoanAmount = $rootScope.loanAmountField;
    if (parseFloat($scope.getLoanAmount) >= parseFloat($rootScope.newReqiust.advancePayment) || input.value == 0) {
      $scope.getLoanAmount = $scope.getLoanAmount - $rootScope.newReqiust.advancePayment;
      $rootScope.newReqiust.loanAmount = $scope.getLoanAmount;
    } else {
      input.value = $scope.loanAmountField;
      $scope.getLoanAmount = 0;
    }
  };

  $scope.backFromStep2 = function () {
    if ($rootScope.requestType == "consumer") {
      $state.go("otherGoods");
    } else if ($ionicHistory.viewHistory().backView.stateName == "login" && !isEmpty($rootScope.loginUserInfo)) {
      $state.go("car-info");
    } else {
      $ionicHistory.goBack();
    }
  };

  $scope.isAmountDisable = false;
  $scope.collateralConditionId = false;
  $scope.loanAmountDisable = function () {
    var local = localStorage.getItem("requestType");
    if (local == "autoColl") {
      $scope.isAmountDisable = false;
      $scope.collateralConditionId = true;
    } else {
      $scope.isAmountDisable = true;
      $scope.collateralConditionId = false;
    }
  };

  $scope.loanAmountDisable();
});
