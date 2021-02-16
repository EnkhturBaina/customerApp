angular.module("autoleasing.Ctrl", ["ngAnimate"]).controller("autoleasingCtrl", function ($scope, serverDeferred, $rootScope, $state) {
  $scope.getCarDatasId = function (itemCode) {
    $scope.carData = [];
    if ($scope.checkReqiured("step1")) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", itemCode: itemCode }).then(function (response) {
        if (!isEmpty(response) && !isEmpty(response[0])) {
          $rootScope.selectedCarData = response[0];

          $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
          $state.go("car-info");
        } else {
          $rootScope.alert("Код буруу байна");
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

  if (!isEmpty($rootScope.selectedCarData)) {
    $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
  }

  $scope.getLookupData();

  $scope.getbankData = function (type) {
    // console.log("selectedCarData", $rootScope.selectedCarData);
    $rootScope.bankListFilter = [];
    if (!isEmpty($rootScope.selectedCarData) && !isEmpty($rootScope.selectedCarData.itemcode)) {
      var json = { type: "car", operation: "calculation", productCode: $rootScope.selectedCarData.itemcode };
      if (type == "dtl") {
        json.customerTypeId = 1;
        json.loanMonth = $rootScope.newReqiust.loanMonth;
        json.advancePayment = $rootScope.newReqiust.advancePayment.replace(/'/g, "");
        json.type = "autoLeasingFilter";
        json.code = $rootScope.selectedCarData.itemcode;
        json.totalLoan = $rootScope.newReqiust.loanAmountReq;
        json.preTotal = $rootScope.newReqiust.advancePayment;
        json.isPerson = 1;
        json.location = $rootScope.newReqiust.locationId;
        json.month = $rootScope.newReqiust.loanMonth;
        json.currency = 16074201974821;
        json.isCollateral = 1554263832132;
        json.isMortgage = 1554263832151;
        json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
        json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
        json.monthPay = $rootScope.loginUserInfo.monthlypayment;
      }
      // {
      //   "type":"autoLeasingFilter",
      //   "code":$rootScope.selectedCarData.itemcode,
      //   "totalLoan":$scope.getLoanAmount,
      //   "preTotal":5000000,
      //   "isPerson":1,
      //   "location":16077034878012,
      //   "month":18,
      //   "currency":16074201974821,
      //   "isCollateral":1554263832132,
      //   "isMortgage":1554263832151,
      //   "totalIncome":4000000,
      //   "monthIncome":2500000,
      //   "monthPay":500000
      // }
      serverDeferred.carCalculation(json).then(function (response) {
        $rootScope.bankListFilter = response.result;
      });
    }
  };
  if ($state.current.name == "autoleasing-2" && isEmpty($rootScope.bankListFilter)) {
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
  $scope.sendRequest = function () {
    if ($scope.checkReqiured("step4")) {
      //Сонгосон банк
      var selectedbanks = [];
      serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
        angular.forEach($rootScope.bankList.correct, function (item) {
          if (item.checked) {
            var jsonDtl = {
              loanId: response[1].id,
              bankId: item.PARENT_ID,
              //   customerId:,
              //   productId: '',
              wfmStatusId: 1585206036474051,
            };
            selectedbanks.push(jsonDtl);
          }
        });
        var json = {
          leasingId: response[1].id,
          itemCode: $rootScope.selectedCarData.itemcode,
          shopId: $rootScope.selectedCarData.supplierid,
          dcApp_request_map_bank_for_detail: selectedbanks,
        };
        serverDeferred.requestFull("dcApp_request_product_dv_with_detail_001", json);

        $state.go("loan_success");
      });
      $rootScope.selectedBankSuccess = selectedbanks;
    }
  };
  $scope.goStep3 = function (param) {
    if ($scope.checkReqiured("step2")) {
      if (isEmpty($rootScope.newReqiust.serviceAgreementId)) {
        $rootScope.newReqiust.serviceAgreementId = "1554263832132";
      }
      $scope.getbankData("dtl");
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
        $rootScope.alert("Барааны код оо оруулна уу");
        return false;
      } else {
        return true;
      }
    } else if (param == "step2") {
      if (isEmpty($scope.getLoanAmount)) {
        $rootScope.newReqiust.loanAmountReq = true;
        $rootScope.alert("Зээлийн хэмжээгээ оруулна уу");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.alert("Урьдчилгаа оруулна уу");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаагаа сонгоно уу");
        return false;
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Байршил сонгоно уу");
        return false;
      } else {
        return true;
      }
    } else if (param == "step4") {
      if (input.value === "0" || input.value === 0 || input.value === "") {
        $rootScope.alert("Та сард төлөх боломжтой дүнгээ оруулна уу");
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

  $scope.toggleRealState = function () {
    $("#step2-toggle-on").toggleClass("active");
    $("#step2-toggle-off").toggleClass("active");
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
      //input.value =  addThousandsSeparator(input.value + key);
      input.value = input.value + key;
    };

    $scope.emptyCode = function () {
      input.value = "";
    };

    $scope.emptyCode();
  }

  $scope.calcLoanAmount = function () {
    var input = document.getElementById("sendRequestAdvancePayment");
    $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
    if ($scope.getLoanAmount > $rootScope.newReqiust.advancePayment) {
      $scope.getLoanAmount = $scope.getLoanAmount - $rootScope.newReqiust.advancePayment;
      $rootScope.newReqiust.loanAmount = $scope.getLoanAmount;
    } else {
      input.value = input.value.slice(0, input.value.length - 1);
    }
  };
});
