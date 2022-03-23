angular.module("autoleasing.Ctrl", ["ngAnimate"]).controller("autoleasingCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicHistory, $timeout, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup, $ionicPlatform, $location, $anchorScroll) {
  $rootScope.requestType = "";
  $rootScope.requestType = localStorage.getItem("requestType");
  $scope.regNum = "";
  $scope.isSelected0001 = ""; //Автомашины сонгосон эсэх
  $scope.selectedCarCat = "";

  $("#step1CarCode").mask("00000000");
  $(".mobile-number-step4").mask("00000000");
  // $("#sendRequestAdvancePayment").mask("000000000000");
  $("#step2loanMonth").mask("000");

  $("#step4UniqueIdentifier").mask("AA00000000", {
    translation: {
      A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
    },
  });
  //Сүүлийн Step дээр сонгосон банк
  $rootScope.selectedBanksList = [];
  if ($state.current.name == "autoleasing-1") {
    $rootScope.hideFooter = true;
    $ionicModal
      .fromTemplateUrl("templates/auto.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (autoModal) {
        $scope.autoModal = autoModal;
      });
    $timeout(function () {
      // $scope.autoModal.show();
    }, 300);
  }

  $ionicModal
    .fromTemplateUrl("templates/danIs.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (danIsModal) {
      $scope.danIsModal = danIsModal;
    });
  //element ruu scroll hiih
  $scope.slideTo = function (location) {
    var newHash = location;
    if ($location.hash() !== newHash) {
      $location.hash(location);
    } else {
      $anchorScroll();
    }
  };
  // Регистрийн дугаар huseltiin dund oorchlogdox bolomjgu tul haaw !!!
  // $ionicPlatform.ready(function () {
  //   setTimeout(function () {
  //     var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Э", "Ю", "Я"];

  //     new MobileSelect({
  //       trigger: ".step2RegSelector",
  //       wheels: [{ data: regChars }, { data: regChars }],
  //       position: [0, 0],
  //       ensureBtnText: "Хадгалах",
  //       cancelBtnText: "Хаах",
  //       transitionEnd: function (indexArr, data) {
  //         //scroll xiij bhd ajillah func
  //       },
  //       callback: function (indexArr, data) {
  //         $("#regCharA").text(data[0]);
  //         $("#regCharB").text(data[1]);
  //         $scope.overlayKeyOn();

  //         keyInput = document.getElementById("regNums");
  //         if (keyInput) {
  //           $scope.clearD = function () {
  //             keyInput.value = keyInput.value.slice(0, keyInput.value.length - 1);
  //           };

  //           $scope.addCode = function (key) {
  //             keyInput.value = keyInput.value + key;
  //           };

  //           $scope.emptyCode = function () {
  //             keyInput.value = "";
  //           };

  //           $scope.emptyCode();
  //         }
  //       },
  //       onShow: function () {},
  //     });
  //     $("#regNums").mask("00000000");
  //   }, 1000);
  // });
  $scope.overlayKeyOn = function () {
    $scope.modal.show();
  };
  $scope.saveRegNums = function () {
    if (keyInput.value.length < 8) {
      $rootScope.alert("Регистер ээ бүрэн оруулна уу.", "warning");
    } else {
      $scope.modal.hide();
      $rootScope.danCustomerData.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();
    }
  };
  $scope.cancelRegNums = function () {
    if (!isEmpty($rootScope.loginUserInfo) && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
      $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
      $("#regCharA").text($rootScope.loginUserInfo.uniqueidentifier.substr(0, 1));
      $("#regCharB").text($rootScope.loginUserInfo.uniqueidentifier.substr(1, 1));
      $("#regNums").val($rootScope.loginUserInfo.uniqueidentifier.substr(2, 8));
    }
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
  $scope.goStep2AutoLeasing = function () {
    if ($scope.checkReqiured("step1")) {
      $state.go("autoleasing-2");
    }
  };

  $scope.getLoanAmountFunc = function () {
    $rootScope.loanAmountField = "";
    // input.value = "";
    $rootScope.requestType = localStorage.getItem("requestType");

    if ($rootScope.requestType == "consumer") {
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
      $rootScope.newReqiust.loanAmount = $rootScope.sumPrice.toString();
      $rootScope.newReqiust.getLoanAmount = $rootScope.sumPrice.toString();
      $rootScope.loanAmountField = $rootScope.sumPrice.toString();
    } else if ($rootScope.requestType == "eco") {
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
      $rootScope.newReqiust.loanAmount = $rootScope.ecoProduct.unitPrice;
      $rootScope.newReqiust.getLoanAmount = $rootScope.ecoProduct.unitPrice;
      $rootScope.loanAmountField = $rootScope.ecoProduct.unitPrice;
    } else if ($rootScope.requestType == "building") {
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
      $rootScope.newReqiust.loanAmount = $rootScope.newReqiust.buildingPrice;
      $rootScope.newReqiust.getLoanAmount = $rootScope.newReqiust.buildingPrice;
      $rootScope.loanAmountField = $rootScope.newReqiust.buildingPrice;
    } else {
      if (!isEmpty($rootScope.selectedCarData)) {
        $rootScope.newReqiust.getLoanAmount = $rootScope.selectedCarData.price;
        $rootScope.loanAmountField = $rootScope.selectedCarData.price;
      }
    }

    $timeout(function () {
      if (!isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.newReqiust.getLoanAmount = $rootScope.newReqiust.getLoanAmount - $rootScope.newReqiust.advancePayment;
      }
    }, 200);
  };
  $scope.removeItemAll = function (arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  };
  // console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
  $rootScope.getbankData = function (a) {
    $rootScope.isSupplierLoanLocal = localStorage.getItem("isSupplierLoan");
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.currency = 16074201974821;
    json.isMortgage = "";
    json.salaries = $rootScope.filterSalaries;
    if (!isEmpty($rootScope.danIncomeData) /*&& $state.current.name == "autoleasing-4"*/) {
      json.income = $rootScope.danIncomeData.incometypeid;
    } else {
      json.income = null;
    }

    if ($state.current.name == "autoleasing-4") {
      json.isMortgage = isEmpty($rootScope.danCustomerData.mikmortgagecondition) ? "" : $rootScope.danCustomerData.mikmortgagecondition;
      json.totalIncome = isEmpty($rootScope.danIncomeData.totalincomehousehold) ? 0 : $rootScope.danIncomeData.totalincomehousehold;
      json.monthIncome = isEmpty($rootScope.danIncomeData.monthlyincome) ? 0 : $rootScope.danIncomeData.monthlyincome;
      json.monthPay = isEmpty($rootScope.danIncomeData.monthlypayment) ? 0 : $rootScope.danIncomeData.monthlypayment;
      $rootScope.danIncomeData.totalincomehousehold = 0;
      $rootScope.danIncomeData.monthlypayment = 0;
    }

    if ($rootScope.isSupplierLoanLocal == "yes") {
      json.totalIncome = isEmpty($rootScope.danIncomeData.totalincomehousehold) ? 0 : $rootScope.danIncomeData.totalincomehousehold;
      json.monthIncome = isEmpty($rootScope.danIncomeData.monthlyincome) ? 0 : $rootScope.danIncomeData.monthlyincome;
      json.monthPay = isEmpty($rootScope.danIncomeData.monthlypayment) ? 0 : $rootScope.danIncomeData.monthlypayment;
    }

    if ($rootScope.requestType == "consumer") {
      json.type = "consumerLeasingFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      if ($rootScope.isSupplierLoanLocal != "yes") {
        json.supplier = $rootScope.otherGoodsData[0].shopId;
      } else {
        json.supplier = $rootScope.selectedSupplierID;
      }
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
    } else if ($rootScope.requestType == "autoColl") {
      json.type = "carLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.isConfirm = $rootScope.newReqiust.proveIncome;
      json.carCategory = $rootScope.carDetailData.carCategoryId;
    } else if ($rootScope.requestType == "estate") {
      json.type = "estateLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.isConfirm = $rootScope.newReqiust.proveIncome;
      json.collType = $rootScope.newReqiust.collateralType;
    } else if ($rootScope.requestType == "auto") {
      json.type = "autoLeasingFilterZeelMe";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.isCollateral = isEmpty($rootScope.newReqiust.collateralConditionId) ? "" : $rootScope.newReqiust.collateralConditionId;
      if ($scope.isSelected0001 === "0001") {
        json.code = $rootScope.carProduct.itemCode;
      }
      if ($rootScope.newReqiust.choose === "16430027873822") {
        json.carUsageCondition = $rootScope.carProduct.productTypeId;
      } else {
        json.carUsageCondition = "";
      }
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
    } else if ($rootScope.requestType == "supLoan") {
      json.type = "divideLoanFilter";
      json.totalLoan = $rootScope.newReqiust.loanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
    } else if ($rootScope.requestType == "eco") {
      json.type = "ecoLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
    } else if ($rootScope.requestType == "building") {
      json.type = "buildingLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
      json.buildingType = $rootScope.newReqiust.buildingLoanType;
    } else if ($rootScope.requestType == "card") {
      json.type = "cardLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
    } else if ($rootScope.requestType == "salary") {
      json.type = "salaryLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.income = 1600939426988;
    } else if ($rootScope.requestType == "money") {
      json.type = "moneyLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
    }
    serverDeferred.carCalculation(json).then(function (response) {
      // console.log("response", response);
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();

      $rootScope.products = [];
      $rootScope.result = [];
      $rootScope.months = [];
      $rootScope.minPayments = [];
      $rootScope.maxAmounts = [];
      $rootScope.minAmounts = [];
      //Зөвхөн Step2 -д ажлуулах
      if ($state.current.name == "autoleasing-2" && isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.bankListFilter.Agree.map((el) => {
          $rootScope.products.push(el.products);
        });
        $rootScope.products.map((obj) => {
          $rootScope.result = [].concat($rootScope.result, obj);
        });
        $rootScope.result.map((a) => {
          $rootScope.months.push(parseInt(a.max_loan_month_id));
          $rootScope.maxAmounts.push(a.loan_max_amount);
          $rootScope.minAmounts.push(a.loan_min_amount);
          if (a.min_payment != 0 && a.min_payment != null) {
            $rootScope.minPayments.push(a.min_payment);
          } else {
            $rootScope.minPayment = 0;
          }
        });
        $rootScope.maxMonth = Math.max(...$rootScope.months);
        $rootScope.maxLoanAmount = Math.max(...$rootScope.maxAmounts);
        $rootScope.minLoanAmount = Math.min(...$scope.removeItemAll($rootScope.minAmounts, 0));
        $rootScope.minLoanAmount = Math.min(...$scope.removeItemAll($rootScope.minAmounts, 1));
        $rootScope.minPayment = Math.min(...$rootScope.minPayments);

        //тэнцсэн банкуудын урьдчилгаа 0 үед ажиллах
        if (isEmpty($rootScope.minPayments)) {
          $rootScope.bankListFilter.NotAgree.map((el) => {
            $rootScope.products.push(el.products);
          });
          $rootScope.products.map((obj) => {
            $rootScope.result = [].concat($rootScope.result, obj);
          });

          $rootScope.result.map((a) => {
            $rootScope.months.push(parseInt(a.max_loan_month_id));
            $rootScope.maxAmounts.push(a.loan_max_amount);
            $rootScope.minAmounts.push(a.loan_min_amount);
            if (a.min_payment !== 0 && a.min_payment !== null) {
              $rootScope.minPayments.push(a.min_payment);
            } else {
              $rootScope.minPayments.push(0);
            }
          });
          isEmpty($rootScope.months) ? ($rootScope.maxMonth = 0) : ($rootScope.maxMonth = Math.max(...$rootScope.months));
          $rootScope.maxLoanAmount = Math.max(...$rootScope.maxAmounts);
          $rootScope.minLoanAmount = Math.min(...$scope.removeItemAll($rootScope.minAmounts, 0));
          $rootScope.minLoanAmount = Math.min(...$scope.removeItemAll($rootScope.minAmounts, 1));
          if (isEmpty($rootScope.minPayments)) {
            $rootScope.minPayment = 0;
          } else {
            if (Math.min(...$rootScope.minPayments) == 0) {
              $rootScope.minPayment = Math.min(...$scope.removeItemAll($rootScope.minPayments, 0));
              if (isEmpty($rootScope.minPayments)) {
                $rootScope.minPayment = 0;
              }
            } else {
              $rootScope.minPayment = Math.min(...$rootScope.minPayments);
              if (isEmpty($rootScope.minPayments)) {
                $rootScope.minPayment = 0;
              }
            }
          }
        }
        $rootScope.filteredMonths = [];
        if (isEmpty($rootScope.minMonth)) {
          $rootScope.minMonth = 0;
        }
        Object.keys($rootScope.monthsArr).forEach(function (key) {
          if ($rootScope.requestType == key) {
            $rootScope.monthsArr[key].map((el) => {
              if ($rootScope.months.includes(el) && el >= $rootScope.minMonth && el <= $rootScope.maxMonth) {
                $rootScope.filteredMonths.push(el);
              }
            });
          }
        });

        if ($rootScope.requestType == "consumer") {
          $rootScope.displayMinPayment = ($rootScope.sumPrice * $rootScope.minPayment).toFixed(2);
        } else if ($rootScope.requestType == "eco") {
          $rootScope.displayMinPayment = ($rootScope.ecoProduct.unitPrice * $rootScope.minPayment).toFixed(2);
        } else if ($rootScope.requestType == "building") {
          $rootScope.displayMinPayment = ($rootScope.newReqiust.buildingPrice * $rootScope.minPayment).toFixed(2);
        } else if ($rootScope.requestType == "auto" && !isEmpty($rootScope.newReqiust.carPrice)) {
          $rootScope.displayMinPayment = ($rootScope.newReqiust.carPrice * $rootScope.minPayment).toFixed(2);
        }
      }
    });
    console.log("json", json);
  };
  //Банк шүүлт step 2 дээр шууд ажиллах
  //Банк сонгох autoleasing-3 хуудасруу ороход ажиллах
  if ($state.current.name == "autoleasing-3" && $rootScope.requestType != "autoColl") {
    $timeout(function () {
      $scope.getbankData();
    }, 100);
  }
  if ($state.current.name == "autoleasing-4") {
    $timeout(function () {
      $scope.getbankData();
      $("#monthlyIncome").mask("0000000000");
      $("#totalIncomeHousehold").mask("0000000000");
      $("#monthlyPayment").mask("0000000000");
    }, 1000);
  }

  $rootScope.selectedBankSuccess = "";
  var selectedbanks = [];
  $scope.sendRequest = function () {
    //all_ID.dccustomerid
    //1639133516578203

    $scope.disabledBtnSendReq = true;
    $rootScope.ShowLoader();
    if (!isEmpty($rootScope.selectedBanksList)) {
      $rootScope.requestType = localStorage.getItem("requestType");
      var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
      // console.log("$rootScope.requestType", $rootScope.requestType);
      if ($rootScope.requestType == "autoColl") {
        //===================Авто машин барьцаалсан зээл===================
        $scope.carDetailData.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.requestTypeId = "16082024252301";
        $scope.newReqiust.loanAmount = $scope.newReqiust.getLoanAmount;
        //Хүсэлт бүртгэх

        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }

        serverDeferred.requestFull("dcApp_carCollRequestDV_001", $scope.newReqiust).then(function (sendReqResponse) {
          // console.log("sendReqResponse", sendReqResponse);
          if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
            //Барьцаалах автомашин бүртгэх
            $rootScope.danIncomeData.leasingid = sendReqResponse[1].id;
            $scope.carDetailData.leasingid = sendReqResponse[1].id;
            serverDeferred.requestFull("dcApp_car_collateral_loan_001", $scope.carDetailData).then(function (saveResponse) {
              // console.log("saveResponse", saveResponse);
              if (saveResponse[0] == "success" && saveResponse[1] != "") {
                //Сонгосон банк
                selectedbanks = [];
                angular.forEach($rootScope.bankListFilter.Agree, function (item) {
                  if (item.checked) {
                    var AgreeBank = {
                      loanId: sendReqResponse[1].id,
                      customerId: $rootScope.all_ID.dccustomerid,
                      bankId: item.id,
                      isAgree: "1",
                      isMobile: "1626864048648",
                      wfmStatusId: "1609944755118135",
                      productId: item.products[0].id,
                    };
                    selectedbanks.push(AgreeBank);
                  }
                });
                var mapBankSuccess = false;
                //MAP table рүү сонгосон банкуудыг бичих
                selectedbanks.map((bank) => {
                  serverDeferred.requestFull("dcApp_request_map_bank_for_detail_001", bank).then(function (response) {
                    if (response[0] == "success" && response[1] != "") {
                      mapBankSuccess = true;
                    }
                  });
                });
                //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
                $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
                $timeout(function () {
                  if (sendReqResponse[0] == "success" && sendReqResponse[1] != "" && mapBankSuccess) {
                    $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
                    delete $rootScope.danIncomeData.id;

                    if (DanloginUserInfo.dcapp_crmuser_dan) {
                      $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                      $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                      $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                    }

                    $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;

                    serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                      // console.log("danCustomerDataResponse", danCustomerDataResponse);
                      serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                        // console.log("danIncomeDataResponse", danIncomeDataResponse);
                        if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                          //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                          var json = {
                            id: $rootScope.all_ID.crmcustomerid,
                            mobileNumber: $rootScope.danCustomerData.mobilenumber,
                            siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                          };
                          json.dcApp_crmUser_update = {
                            id: $rootScope.all_ID.crmuserid,
                            customerId: $rootScope.all_ID.crmcustomerid,
                            userName: $rootScope.danCustomerData.mobilenumber,
                          };
                          serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                            $rootScope.HideLoader();
                            localStorage.removeItem("carColl");
                            $state.go("loan_success");
                          });
                        }
                      });
                    });
                  } else {
                    $rootScope.HideLoader();
                    $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
                  }
                }, 500);
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 200", "danger");
              }
            });
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 300", "danger");
          }
        });
      } else if ($rootScope.requestType == "eco") {
        //===================Ногоон зээл===================
        $scope.newReqiust.requestTypeId = "16082024252192";
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.loanAmount = $scope.newReqiust.getLoanAmount;
        //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
        $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
        //Сонгосон банк
        selectedbanks = [];
        //нөхцөл хангасан банкууд
        angular.forEach($rootScope.bankListFilter.Agree, function (item) {
          if (item.checked) {
            var AgreeBank = {
              bankId: item.id,
              isAgree: "1",
              isMobile: "1626864048648",
              wfmStatusId: "1609944755118135",
              productId: item.products[0].id,
            };
            selectedbanks.push(AgreeBank);
          }
        });
        $rootScope.newReqiust.dcApp_preLoanRequestMapDV = selectedbanks;

        // console.log("$rootScope.newReqiust", $rootScope.newReqiust);

        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
          // console.log("res", response);
          if (response[0] == "success" && response[1] != "") {
            $rootScope.danIncomeData.leasingid = response[1].id;
            $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
            delete $rootScope.danIncomeData.id;
            $scope.ecoProduct.leasingid = response[1].id;

            //Бүтээгдэхүүн бүртгэх
            serverDeferred.requestFull("dcApp_consumer_loan_001", $rootScope.ecoProduct).then(function (responseEcoProduct) {
              DTLPRODUCTSuccess = true;
              if (responseEcoProduct[0] == "success" && responseEcoProduct[1] != "") {
                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }
                $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                    var json = {
                      id: $rootScope.all_ID.crmcustomerid,
                      mobileNumber: $rootScope.danCustomerData.mobilenumber,
                      siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                    };
                    json.dcApp_crmUser_update = {
                      id: $rootScope.all_ID.crmuserid,
                      customerId: $rootScope.all_ID.crmcustomerid,
                      userName: $rootScope.danCustomerData.mobilenumber,
                    };
                    serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                      $rootScope.HideLoader();
                      $state.go("loan_success");
                    });
                  });
                });
              }
            });
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
          }
        });
      } else if ($rootScope.requestType == "building" || $rootScope.requestType == "card" || $rootScope.requestType == "salary") {
        //===================Орон сууцны зээл===================
        //===================Кредит карт===================
        //===================Цалингийн зээл===================
        if ($rootScope.requestType == "building") {
          $scope.newReqiust.requestTypeId = "16082024283632";
        } else if ($rootScope.requestType == "card") {
          $scope.newReqiust.requestTypeId = "16082024283628";
        } else if ($rootScope.requestType == "salary") {
          $scope.newReqiust.requestTypeId = "16082024283627";
        }
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.loanAmount = $scope.newReqiust.getLoanAmount;
        //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
        $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
        //Сонгосон банк
        selectedbanks = [];
        //нөхцөл хангасан банкууд
        angular.forEach($rootScope.bankListFilter.Agree, function (item) {
          if (item.checked) {
            var AgreeBank = {
              bankId: item.id,
              isAgree: "1",
              isMobile: "1626864048648",
              wfmStatusId: "1609944755118135",
              productId: item.products[0].id,
            };
            selectedbanks.push(AgreeBank);
          }
        });
        $rootScope.newReqiust.dcApp_preLoanRequestMapDV = selectedbanks;

        // console.log("$rootScope.newReqiust", $rootScope.newReqiust);

        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
          // console.log("res", response);
          if (response[0] == "success" && response[1] != "") {
            $rootScope.danIncomeData.leasingid = response[1].id;
            $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
            delete $rootScope.danIncomeData.id;

            if (DanloginUserInfo.dcapp_crmuser_dan) {
              $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
              $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
              $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
            }
            $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;

            serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
              //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
              serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                var json = {
                  id: $rootScope.all_ID.crmcustomerid,
                  mobileNumber: $rootScope.danCustomerData.mobilenumber,
                  siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                };
                json.dcApp_crmUser_update = {
                  id: $rootScope.all_ID.crmuserid,
                  customerId: $rootScope.all_ID.crmcustomerid,
                  userName: $rootScope.danCustomerData.mobilenumber,
                };
                serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                  $rootScope.HideLoader();
                  $state.go("loan_success");
                });
              });
            });
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
          }
        });
      } else if ($rootScope.requestType == "supLoan") {
        //===================supLoan===================
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.requestTypeId = "16082024283630";

        //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
        $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
        //Сонгосон банк
        selectedbanks = [];
        //нөхцөл хангасан банкууд
        angular.forEach($rootScope.bankListFilter.Agree, function (item) {
          if (item.checked) {
            var AgreeBank = {
              bankId: item.id,
              isAgree: "1",
              isMobile: "1626864048648",
              wfmStatusId: "1609944755118135",
              productId: item.products[0].id,
            };
            selectedbanks.push(AgreeBank);
          }
        });
        $rootScope.newReqiust.dcApp_preLoanRequestMapDV = selectedbanks;

        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
          // console.log("res", response);
          if (response[0] == "success" && response[1] != "") {
            $rootScope.danIncomeData.leasingid = response[1].id;
            $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
            delete $rootScope.danIncomeData.id;

            if (DanloginUserInfo.dcapp_crmuser_dan) {
              $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
              $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
              $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
            }
            $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;

            serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
              //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
              serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                var json = {
                  id: $rootScope.all_ID.crmcustomerid,
                  mobileNumber: $rootScope.danCustomerData.mobilenumber,
                  siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                };
                json.dcApp_crmUser_update = {
                  id: $rootScope.all_ID.crmuserid,
                  customerId: $rootScope.all_ID.crmcustomerid,
                  userName: $rootScope.danCustomerData.mobilenumber,
                };
                serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                  $rootScope.HideLoader();
                  $state.go("loan_success");
                });
              });
            });
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
          }
        });
      } else if ($rootScope.requestType == "consumer") {
        //==================Хэрэглээний лизинг===================
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.requestTypeId = "16082024252191";
        //Хүсэлт бүртгэх
        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
          // console.log("respionse OL", response);
          if (response[0] == "success" && response[1] != "") {
            $rootScope.danIncomeData.leasingid = response[1].id;
            $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
            //Сонгосон банк
            selectedbanks = [];
            //нөхцөл хангасан банкууд
            angular.forEach($rootScope.bankListFilter.Agree, function (item) {
              if (item.checked) {
                var AgreeBank = {
                  loanId: response[1].id,
                  customerId: $rootScope.all_ID.dccustomerid,
                  bankId: item.id,
                  isAgree: "1",
                  isMobile: "1626864048648",
                  wfmStatusId: "1609944755118135",
                  productId: item.products[0].id,
                  vendorId: $rootScope.selectedSupplierID,
                };
                selectedbanks.push(AgreeBank);
              }
            });
            var mapBankSuccess = false;
            //MAP table рүү сонгосон банкуудыг бичих
            selectedbanks.map((bank) => {
              serverDeferred.requestFull("dcApp_request_map_bank_for_detail_001", bank).then(function (response) {
                if (response[0] == "success" && response[1] != "") {
                  mapBankSuccess = true;
                }
              });
            });
            //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
            $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
            var DTLPRODUCTSuccess = false;
            if ($rootScope.isSupplierLoanLocal != "yes") {
              $rootScope.consumerData.map((product) => {
                product.leasingId = response[1].id;

                //Бүтээгдэхүүн бүртгэх
                serverDeferred.requestFull("dcApp_consumer_loan_001", product).then(function (responseProduct) {
                  DTLPRODUCTSuccess = true;
                  // console.log("responseProduct", responseProduct);
                });
              });
            } else {
              var product = {
                leasingId: response[1].id,
                subVendorId: $rootScope.newReqiust.subVendorId,
                unitPrice: 1,
                shopId: $rootScope.selectedSupplierID,
              };

              serverDeferred.requestFull("dcApp_consumer_loan_001", product).then(function (responseProduct) {
                DTLPRODUCTSuccess = true;
                // console.log("responseProduct", responseProduct);
              });
            }

            $timeout(function () {
              if (DTLPRODUCTSuccess && mapBankSuccess) {
                delete $rootScope.danIncomeData.id;

                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }

                $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;
                // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                  // console.log("danCustomerDataResponse", danCustomerDataResponse);
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                    // console.log("danIncomeDataResponse", danIncomeDataResponse);
                    if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                      //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                      var json = {
                        id: $rootScope.all_ID.crmcustomerid,
                        mobileNumber: $rootScope.danCustomerData.mobilenumber,
                        siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                      };
                      json.dcApp_crmUser_update = {
                        id: $rootScope.all_ID.crmuserid,
                        customerId: $rootScope.all_ID.crmcustomerid,
                        userName: $rootScope.danCustomerData.mobilenumber,
                      };
                      serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                        $rootScope.HideLoader();
                        $state.go("loan_success");
                      });
                    } else {
                      $rootScope.HideLoader();
                      $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
                    }
                  });
                });
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 200", "danger");
              }
            }, 500);
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 300", "danger");
          }
        });
      } else if ($rootScope.requestType == "business") {
        //===================Бизнесийн зээл===================
      } else if ($rootScope.requestType == "estate") {
        //===================Үл хөдлөх барьцаат зээл===================
        $rootScope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $rootScope.newReqiust.requestTypeId = "16082024283512";
        $scope.newReqiust.loanAmount = $scope.newReqiust.getLoanAmount;
        //Хүсэлт бүртгэх
        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_carCollRequestDV_001", $rootScope.newReqiust).then(function (sendReqResponse) {
          // console.log("sendReqResponse", sendReqResponse);

          if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
            //ҮХХ бүртгэх
            $rootScope.danIncomeData.leasingid = sendReqResponse[1].id;
            //Сонгосон банк
            selectedbanks = [];
            angular.forEach($rootScope.bankListFilter.Agree, function (item) {
              if (item.checked) {
                var AgreeBank = {
                  loanId: sendReqResponse[1].id,
                  customerId: $rootScope.all_ID.dccustomerid,
                  bankId: item.id,
                  isAgree: "1",
                  isMobile: "1626864048648",
                  wfmStatusId: "1609944755118135",
                  productId: item.products[0].id,
                };
                selectedbanks.push(AgreeBank);
              }
            });
            var mapBankSuccess = false;
            //MAP table рүү сонгосон банкуудыг бичих
            selectedbanks.map((bank) => {
              serverDeferred.requestFull("dcApp_request_map_bank_for_detail_001", bank).then(function (response) {
                if (response[0] == "success" && response[1] != "") {
                  mapBankSuccess = true;
                }
              });
            });
            //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
            $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
            $timeout(function () {
              if (sendReqResponse[0] == "success" && sendReqResponse[1] != "" && mapBankSuccess) {
                $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;

                // console.log("DanloginUserInfo", DanloginUserInfo);
                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }

                $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;
                // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                  // console.log("danCustomerDataResponse", danCustomerDataResponse);
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                    // console.log("danIncomeDataResponse", danIncomeDataResponse);
                    if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                      //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                      var json = {
                        id: $rootScope.all_ID.crmcustomerid,
                        mobileNumber: $rootScope.danCustomerData.mobilenumber,
                        siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                      };
                      json.dcApp_crmUser_update = {
                        id: $rootScope.all_ID.crmuserid,
                        customerId: $rootScope.all_ID.crmcustomerid,
                        userName: $rootScope.danCustomerData.mobilenumber,
                      };
                      serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                        $state.go("loan_success");
                        $rootScope.HideLoader();
                      });
                    }
                  });
                });
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
              }
            }, 500);
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 300", "danger");
          }
        });
      } else {
        //===================AutoLeasing===================
        $scope.newReqiust.customerId = $rootScope.all_ID.dccustomerid;
        $scope.newReqiust.requestTypeId = "16082024283142";
        /*===================AutoLeasing Хүсэлт бүртгэл===================*/
        //Харилцагчийн дата clone
        $scope.newReqiust.cRegNum = $rootScope.danCustomerData.uniqueidentifier;
        $scope.newReqiust.cPhNum = $rootScope.danCustomerData.mobilenumber;
        $scope.newReqiust.cEmail = $rootScope.danCustomerData.email;
        $scope.newReqiust.cLastname = $rootScope.danCustomerData.lastname;
        $scope.newReqiust.cFirstname = $rootScope.danCustomerData.firstname;
        $scope.newReqiust.isSixPercent = $rootScope.danCustomerData.mikmortgagecondition;
        $scope.newReqiust.isMarried = $rootScope.danCustomerData.ismarried;
        $scope.newReqiust.educationId = $rootScope.danCustomerData.educationid;
        $scope.newReqiust.sectorOfLastYear = $rootScope.danCustomerData.sectoroflastyear;
        $scope.newReqiust.areasOfActivity = $rootScope.danCustomerData.areasofactivity;
        $scope.newReqiust.jobPositionId = $rootScope.danCustomerData.jobpositionid;
        $scope.newReqiust.experiencePeriodId = $rootScope.danCustomerData.experienceperiodid;

        if (DanloginUserInfo.dcapp_crmuser_dan) {
          $scope.newReqiust.cOwnPicClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
          $scope.newReqiust.cAddress = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.address;
          $scope.newReqiust.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
        }
        serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
          // console.log("res", response);
          if (response[0] == "success" && response[1] != "") {
            //Сонгосон банк
            selectedbanks = [];
            $rootScope.danIncomeData.leasingid = response[1].id;
            //нөхцөл хангасан банкууд
            angular.forEach($rootScope.bankListFilter.Agree, function (item) {
              if (item.checked) {
                var AgreeBank = {
                  loanId: response[1].id,
                  customerId: $rootScope.all_ID.dccustomerid,
                  bankId: item.id,
                  isAgree: "1",
                  isMobile: "1626864048648",
                  wfmStatusId: "1609944755118135",
                  productId: item.products[0].id,
                };
                selectedbanks.push(AgreeBank);
              }
            });
            //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
            $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree;
            var onlineLeasingProduct = {
              leasingId: response[1].id,
              itemCode: $rootScope.carProduct.itemCode,
              categoryId: $rootScope.carProduct.categoryId,
              productTypeId: $rootScope.carProduct.productTypeId,
              factoryId: $rootScope.carProduct.factoryId,
              modelId: $rootScope.carProduct.modelId,
              yearEntryMongolia: $rootScope.carProduct.yearEntryMongolia,
              yearProduction: $rootScope.carProduct.yearProduction,
              dcApp_request_map_bank_for_detail: selectedbanks,
            };
            /*===================AutoLeasing бүтээгдэхүүн бүртгэл===================*/
            serverDeferred.requestFull("dcApp_request_product_dv_with_detail_001", onlineLeasingProduct).then(function (response) {
              if (response[0] == "success" && response[1] != "") {
                $rootScope.danIncomeData.customerid = $rootScope.all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;

                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }
                $rootScope.danCustomerData.crmCustomerId = $rootScope.all_ID.crmuserid;

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                    var json = {
                      id: $rootScope.all_ID.crmcustomerid,
                      mobileNumber: $rootScope.danCustomerData.mobilenumber,
                      siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                    };
                    json.dcApp_crmUser_update = {
                      id: $rootScope.all_ID.crmuserid,
                      customerId: $rootScope.all_ID.crmcustomerid,
                      userName: $rootScope.danCustomerData.mobilenumber,
                    };
                    serverDeferred.requestFull("dcApp_crmCustomer_update_002", json).then(function (crmResponse) {
                      $rootScope.HideLoader();
                      $state.go("loan_success");
                    });
                  });
                });
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 100", "danger");
              }
            });
          } else {
            $rootScope.HideLoader();
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 200", "danger");
          }
        });
      }
      $timeout(function () {
        $rootScope.HideLoader();
      }, 2000);
    } else {
      $rootScope.HideLoader();
      $scope.disabledBtnSendReq = false;
      $rootScope.alert("Та 3 хүртэлх Банк, ББСБ-ыг сонгож зээлийн хүсэлтээ илгээгээрэй.", "warning");
    }
  };

  $scope.goStep3 = function (param) {
    if ($scope.checkReqiured("step2")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("income");
      }
    }
  };
  $scope.goStep5ORIdent = function () {
    if ($scope.checkReqiured("step4CustomerData")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("ident-pic");
      }
    }
  };
  // $scope.checkBankSelectedStep = function () {
  //   if ($scope.checkReqiured("danIncomeReq")) {
  //     if ($scope.checkReqiured("agreeBank")) {
  //       $state.go("ident-pic");
  //     }
  //   } else {
  //   }
  // };
  $scope.goStep5 = function () {
    if ($scope.checkReqiured("identPic")) {
      $state.go("autoleasing-3");
    }
  };

  $scope.selectBankInfo = function (bank) {
    $rootScope.selectedBank = bank;
  };

  //other
  $scope.checkReqiured = function (param) {
    if (isEmpty($rootScope.newReqiust)) {
      $rootScope.requestType = localStorage.getItem("requestType");
      // console.log("$rootScope.requestType", $rootScope.requestType);
      $rootScope.newReqiust = {};
      $rootScope.newReqiust.customerId = "";
    }
    if (param == "step1") {
      if (isEmpty($rootScope.newReqiust.choose)) {
        $rootScope.alert("Автомашинаа сонгосон эсэх сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carProduct.categoryId)) {
        $rootScope.alert("Авах автомашины төрөл сонгоно уу", "warning");
        return false;
      } else if ($scope.isSelected0001 === "0001" && isEmpty($rootScope.carProduct.itemCode)) {
        $rootScope.alert("Автомашины кодоо оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 === "0001" && $rootScope.carProduct.itemCode.length < 8) {
        $rootScope.alert("Автомашины кодоо бүрэн оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 === "yes" && isEmpty($rootScope.carProduct.productTypeId)) {
        $rootScope.alert("Автомашины төлөв сонгоно уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.factoryId)) {
        $rootScope.alert("Үйлдвэр сонгоно уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.modelId)) {
        $rootScope.alert("Марк сонгоно уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.yearProduction)) {
        $rootScope.alert("Үйлдвэрлэсэн он оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && $rootScope.carProduct.yearProduction.length < 4) {
        $rootScope.alert("Үйлдвэрлэсэн он бүрэн оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.yearEntryMongolia)) {
        $rootScope.alert("Орж ирсэн он оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && $rootScope.carProduct.yearEntryMongolia.length < 4) {
        $rootScope.alert("Орж ирсэн он бүрэн оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.proveIncome)) {
        $rootScope.alert("Орлого нотлох эсэх сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "step2") {
      if (isEmpty($rootScope.newReqiust.carPrice) && $rootScope.is0001Price) {
        $rootScope.alert("Авах автомашины үнэ оруулна уу", "warning");
        return false;
      } else if ((isEmpty($rootScope.newReqiust.collateralConditionId) && $scope.isCollShow) || (isEmpty($rootScope.newReqiust.collateralConditionId) && $scope.isHideFromConsumers)) {
        $rootScope.alert("ҮХХөрөнгө барьцаалах эсэхээ сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment) && !$rootScope.isHiddenAdvanePayment && !$rootScope.isCarColl) {
        $rootScope.alert("Урьдчилгаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.newReqiust.loanAmountReq = true;
        $rootScope.alert("Зээлийн хэмжээгээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Зээл авах хугацаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.uniqueidentifier)) {
        $rootScope.alert("Регистрийн дугаараа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.mobilenumber)) {
        $rootScope.alert("Утасны дугаараа оруулна уу", "warning");
        return false;
      } else if ($rootScope.danCustomerData.mobilenumber.length < 8) {
        $rootScope.alert("Утасны дугаараа бүрэн оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.email)) {
        $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.incometypeid) && $rootScope.isIncomeConfirm) {
        $rootScope.alert("Орлогын төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.proofofincome) && $rootScope.isIncomeConfirm) {
        $rootScope.alert("Орлого нотлогдох байдал сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.isCoBorrower)) {
        $rootScope.alert("Хамтран зээлдэгчтэй эсэхээ сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Оршин суугаа хаяг сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.serviceAgreementId) || $rootScope.newReqiust.serviceAgreementId == 1554263832151) {
        $rootScope.alert("Үйлчилгээний нөхцлийг зөвшөөрөөгүй байна", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "step4") {
      angular.forEach($rootScope.bankListFilter.Agree, function (item) {
        if (item.checked) {
          return true;
        } else {
          return false;
        }
      });
      angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
        if (item.checked) {
          return true;
        } else {
          return false;
        }
      });
    } else if (param == "step4CustomerData") {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (isEmpty($rootScope.danCustomerData.lastname)) {
        $rootScope.alert("Овогоо оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.firstname)) {
        $rootScope.alert("Өөрийн нэрээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.monthlyincome) && $rootScope.isIncomeConfirm) {
        $rootScope.alert("Сарын орлогоо оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.mikmortgagecondition) && !$rootScope.isSupLoan) {
        $rootScope.alert("Ипотекийн зээлтэй эсэхээ сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.ismarried) && !$rootScope.isSupLoan) {
        $rootScope.alert("Гэрлэлтийн байдал сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.educationid)) {
        $rootScope.alert("Боловсрол сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.sectoroflastyear)) {
        $rootScope.alert("Ажиллаж буй салбар сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.areasofactivity)) {
        $rootScope.alert("Ажиллаж буй хэвшил сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.jobpositionid)) {
        $rootScope.alert("Албан тушаал сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.experienceperiodid) && !$rootScope.isSupLoan) {
        $rootScope.alert("Ажилласан жилээ сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "identPic") {
      if (isEmpty($rootScope.danCustomerData.identfrontpic)) {
        $rootScope.alert("Иргэний үнэмлэхний урд талын зургийг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.identbackpic)) {
        $rootScope.alert("Иргэний үнэмлэхний ард талын зургийг оруулна уу", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "agreeBank") {
      if (isEmpty($rootScope.bankListFilter.Agree)) {
        $rootScope.alert("Таны оруулсан зээлийн нөхцөлд тохирох Банк, ББСБ байхгүй байна. Та мэдээллээ дахин шалгаад хүсэлтээ илгээгээрэй.", "success");
        return false;
      } else {
        return true;
      }
    }
  };

  $rootScope.calcLoanAmount = function () {
    if (!$rootScope.is0001Price) {
      if (parseInt($rootScope.newReqiust.advancePayment) < $rootScope.loanAmountField) {
        $rootScope.newReqiust.getLoanAmount = $rootScope.loanAmountField - $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.loanAmount = $rootScope.newReqiust.getLoanAmount;
      } else if (parseInt($rootScope.newReqiust.advancePayment) > $rootScope.loanAmountField) {
        var tmp = $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.advancePayment = tmp.slice(0, -1);
      }
    } else {
      if (parseInt($rootScope.newReqiust.advancePayment) < $rootScope.newReqiust.carPrice) {
        $rootScope.newReqiust.getLoanAmount = $rootScope.newReqiust.carPrice - $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.loanAmount = $rootScope.newReqiust.getLoanAmount;
      } else if (parseInt($rootScope.newReqiust.advancePayment) > $rootScope.newReqiust.carPrice) {
        var tmp = $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.advancePayment = tmp.slice(0, -1);
      }
    }
  };

  $scope.backFromStep2 = function () {
    var local = localStorage.getItem("requestType");
    if (local == "consumer") {
      $state.go("otherGoods");
    } else if ($ionicHistory.viewHistory().backView.stateName == "login" || ($ionicHistory.viewHistory().backView.stateName == "profile" && !isEmpty($rootScope.loginUserInfo))) {
      $state.go("car-info");
    } else {
      $ionicHistory.goBack();
    }
  };
  $scope.changeToolTipData = function () {
    if ($rootScope.newReqiust.collateralConditionId == "1554263832132") {
      $rootScope.collTrueStep2 = true;
    } else {
      $rootScope.collTrueStep2 = false;
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $rootScope.showMIN_MAXloanAMOUNT = false;
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    if (firstReq === "yes" && $state.current.name == "autoleasing-2") {
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      $rootScope.newReqiust.getLoanAmount = "";
      localStorage.setItem("firstReq", "no");
    }
    $rootScope.all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    if ($state.current.name == "autoleasing-2") {
      $("#carPrice").mask("00000000000");
      $("#loanAmountRequest").mask("00000000000");

      if (local == "consumer" || local == "eco" || local == "building" || local == "estate") {
        $scope.getLoanAmountFunc();
        $rootScope.showMIN_MAXloanAMOUNT = true;
      }
      if (!isEmpty($rootScope.all_ID)) {
        if ("uniqueidentifier" in $rootScope.all_ID && !isEmpty($rootScope.all_ID.uniqueidentifier)) {
          $scope.regNum = $rootScope.all_ID.uniqueidentifier;
          $rootScope.danCustomerData.uniqueidentifier = $rootScope.all_ID.uniqueidentifier;
          $("#regCharA").text($rootScope.all_ID.uniqueidentifier.substr(0, 1));
          $("#regCharB").text($rootScope.all_ID.uniqueidentifier.substr(1, 1));
          $("#regNums").val($rootScope.all_ID.uniqueidentifier.substr(2, 8));
        }
        if ("mobilenumber" in $rootScope.all_ID && !isEmpty($rootScope.all_ID.mobilenumber)) {
          $rootScope.danCustomerData.mobilenumber = $rootScope.all_ID.mobilenumber;
        }
        if ("email" in $rootScope.all_ID && !isEmpty($rootScope.all_ID.email)) {
          $rootScope.danCustomerData.email = $rootScope.all_ID.email;
        }
        if ("identfrontpic" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.identfrontpic)) {
          $rootScope.danCustomerData.identfrontpic = $rootScope.loginUserInfo.identfrontpic;
        }
        if ("identbackpic" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.identbackpic)) {
          $rootScope.danCustomerData.identbackpic = $rootScope.loginUserInfo.identbackpic;
        }
      }
    }
    $rootScope.isCarColl = false;
    if (firstReq === "yes" && $state.current.name == "autoleasing-1") {
      $rootScope.newReqiust = {};
      $rootScope.carProduct = {};
    }
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "auto") {
      $rootScope.is0001Price = true;
    } else if (firstReq === "yes" && local != "auto") {
      $rootScope.carProduct = {};
      $rootScope.newReqiust = {};
      localStorage.setItem("firstReq", "no");
      $rootScope.displayMinPayment = 0;
      $rootScope.maxMonth = 0;
    }
    if (local == "estate" || (local == "autoColl" && $state.current.name == "autoleasing-2")) {
      $rootScope.isCarColl = true;
      $rootScope.showMIN_MAXloanAMOUNT = true;
      document.getElementById("loanAmountRequest").disabled = false;
    } else {
      $rootScope.isCarColl = false;
    }
    $scope.factoryData = $rootScope.carFactoryData;
    $scope.modelData = $rootScope.carModelData;
    $scope.isHideFromConsumer = false;
    $rootScope.isHiddenAdvanePayment = false;
    $scope.disabledBtnSendReq = false;
    $rootScope.hideFooter = true;
    $rootScope.collTrueStep2 = false;
    var local = localStorage.getItem("requestType");

    if ($state.current.name == "autoleasing-2") {
      if (local == "auto") {
        $scope.isCollShow = true;
      } else if (local == "building") {
        $scope.isHideFromConsumer = false;
      } else if (local != "auto") {
        $scope.isHideFromConsumer = true;
      } else if (local == "salary" || local == "money" || local == "card" || local == "estate" || local == "autoColl") {
        $rootScope.isHiddenAdvanePayment = true;
      } else {
        $scope.isCollShow = false;
      }
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
      $timeout(function () {
        $scope.getbankData("forced");
      }, 100);
    }
  });
  if ($state.current.name == "autoleasing-2") {
    $timeout(function () {
      $rootScope.checkUserService($rootScope.danIncomeData.incometypeid, $rootScope.danIncomeData.proofofincome);
    }, 1000);
  }
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.selectBankLastStep = function (item, id) {
    if ($rootScope.selectedBanksList.includes(id)) {
      var index = $rootScope.selectedBanksList.indexOf(id);
      if (index !== -1) {
        $rootScope.selectedBanksList.splice(index, 1);
      }
    } else {
      if ($rootScope.selectedBanksList.length == 3) {
        $rootScope.alert("Уучлаарай, Та 3-н банк, ББСБ-д илгээх боломжтой.", "warning");
        item.checked = false;
      } else {
        $rootScope.selectedBanksList.push(id);
      }
    }
  };
  //Урьдчилгаа дээр дарахад хоосон болгох
  $scope.removeAdvancePayment = function () {
    $rootScope.newReqiust.advancePayment = "";
  };
  // dan connection
  $scope.gotoDanLoginAutoIncome = function () {
    $rootScope.stringHtmlsLink = {};
    if (isEmpty($rootScope.userDataFromCheckService.dan)) {
      if ("uniqueidentifier" in $rootScope.loginUserInfo) {
        $rootScope.stringHtmlsLink.state = $rootScope.loginUserInfo.uniqueidentifier;
      } else if ("customercode" in $rootScope.loginUserInfo) {
        $rootScope.stringHtmlsLink.state = $rootScope.loginUserInfo.customercode;
      } else if ("siregnumber" in $rootScope.loginUserInfo) {
        $rootScope.stringHtmlsLink.state = $rootScope.loginUserInfo.siregnumber;
      }
    }
    // console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
    if ($rootScope.isDanCalled) {
      $state.go("autoleasing-4");
    } else if (isEmpty($rootScope.userDataFromCheckService.dan)) {
      // console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
      serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://devservices.digitalcredit.mn/api/sso/check").then(function (response) {
        $scope.dangetDataFunction(response);
      });
    } else {
      serverDeferred.carCalculation({ type: "auth_auto", redirect_uri: "customerapp" }, "https://devservices.digitalcredit.mn/api/v1/c").then(function (response) {
        // console.log("ressssssssss", response);
        $rootScope.stringHtmlsLink = response.result.data;
        var authWindow = cordova.InAppBrowser.open($rootScope.stringHtmlsLink.url, "_blank", "location=no,toolbar=no");
        $(authWindow).on("loadstart", function (e) {
          var url = e.originalEvent.url;
          var code = url.indexOf("https://devservices.digitalcred");
          var error = /\?error=(.+)$/.exec(url);
          if (code == 0 || error) {
            authWindow.close();
          }
          if (code == 0) {
            if (isEmpty($rootScope.userDataFromCheckService.dan)) {
              $rootScope.stringHtmlsLink = $rootScope.loginUserInfo.uniqueidentifier;
            } else {
              $rootScope.stringHtmlsLink = response.result.data;
            }
            // console.log("cod$rootScope.stringHtmlsLinke", $rootScope.stringHtmlsLink);
            serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://devservices.digitalcredit.mn/api/sso/check").then(function (response) {
              // console.log("response autoLEASING DAN", response);
              $scope.dangetDataFunction(response);
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
      $rootScope.isDanLoginAutoColl = true;
      //Дан -р нэвтэрсэн үед disable хийх
      $rootScope.lastNameDanDisable = true;
      $rootScope.firstNameDanDisable = true;
      $rootScope.uniqueIdentifierDanDisable = true;
    }
  };

  $scope.dangetDataFunction = function (response) {
    if (!isEmpty(response.result.data)) {
      var userInfo = JSON.parse(response.result.data.info);
      var addressInfo = JSON.parse(response.result.data.address);
      // console.log("userInfo", userInfo);
      if (!isEmpty(userInfo)) {
        // $scope.registerFunctionAuto(userInfo);
        var value = userInfo.result;
        var json = {
          customerCode: value.regnum.toUpperCase(),
          siRegNumber: value.regnum.toUpperCase(),
          isActive: "1",
        };
        json.dcApp_crmUser_dan = {
          userName: $rootScope.danCustomerData.mobilenumber,
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
          address: addressInfo.result.fullAddress,
        };

        $rootScope.profilePictureSideMenu = value.image;
        localStorage.removeItem("profilePictureSideMenu");
        localStorage.setItem("profilePictureSideMenu", value.image);
        $rootScope.sidebarUserName = value.lastname.substr(0, 1) + ". " + value.firstname;

        serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: value.regnum.toUpperCase() }).then(function (checkedValue) {
          // console.log("checkedValue", checkedValue);
          if (!isEmpty(checkedValue[1]) && !isEmpty(checkedValue[1].customerid)) {
            // console.log("IS REGISTERED !!!");
            json.id = checkedValue[1].customerid;
            json.dcApp_crmUser_dan.id = checkedValue[1].custuserid;
            json.dcApp_crmUser_dan.dcApp_dcCustomer_dan.id = checkedValue[1].dccustomerid;
          }
          serverDeferred.requestFull("dcApp_crmCustomer_dan_001", json).then(function (responseCRM) {
            // console.log("responseCRM", responseCRM);

            $rootScope.changeUserDan();

            $rootScope.loginUserInfo = mergeJsonObjs(responseCRM[1], $rootScope.loginUserInfo);
            localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

            $timeout(function () {
              if (!isEmpty(responseCRM[1]) && responseCRM[0] == "success") {
                serverDeferred.requestFull("dcApp_allUserID_by_dcid_004", { dcCustomerId: responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id }).then(function (responseALLID) {
                  // console.log("responseALLIDresponseALLIDresponseALLIDresponseALLIDresponseALLIDresponseALLID", responseALLID);

                  if (responseALLID[0] == "success" && !isEmpty(responseALLID[1])) {
                    localStorage.setItem("ALL_ID", JSON.stringify(responseALLID[1]));
                    $rootScope.danCustomerData.id = responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
                    // console.log("localStorage", localStorage);
                    // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                  }
                });
              }
            }, 500);
          });
        });
      }
      var userSalaryInfo = JSON.parse(response.result.data.salary);

      serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.result.regnum.toUpperCase() }).then(function (checkedValue) {
        // console.log("checkedValue", checkedValue);
        if (!isEmpty(checkedValue[1])) {
          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
            // console.log("responseCustomerData", responseCustomerData);
            if (responseCustomerData[0] != "") {
              //Бүртгэлтэй USER -н дата татаж харуулах
              $rootScope.danCustomerData.id = responseCustomerData[0].id;
              $rootScope.danCustomerData.crmcustomerid = responseCustomerData[0].crmcustomerid;
              $rootScope.danCustomerData.customertypeid = responseCustomerData[0].customertypeid;
              $rootScope.danCustomerData.firstname = responseCustomerData[0].firstname;
              $rootScope.danCustomerData.lastname = responseCustomerData[0].lastname;
              $rootScope.danCustomerData.mobilenumber = responseCustomerData[0].mobilenumber;
              $rootScope.danCustomerData.profilepicture = responseCustomerData[0].profilepicture;
              $rootScope.danCustomerData.uniqueidentifier = responseCustomerData[0].uniqueidentifier;
              $rootScope.danCustomerData.areasofactivity = responseCustomerData[0].areasofactivity;
              $rootScope.danCustomerData.experienceperiodid = responseCustomerData[0].experienceperiodid;
              $rootScope.danCustomerData.ismarried = responseCustomerData[0].ismarried;
              $rootScope.danCustomerData.jobpositionid = responseCustomerData[0].jobpositionid;
              $rootScope.danCustomerData.mikmortgagecondition = responseCustomerData[0].mikmortgagecondition;
              $rootScope.danCustomerData.sectoroflastyear = responseCustomerData[0].sectoroflastyear;
              $rootScope.danCustomerData.educationid = responseCustomerData[0].educationid;
              $rootScope.danCustomerData.identbackpic = responseCustomerData[0].identbackpic;
              $rootScope.danCustomerData.identfrontpic = responseCustomerData[0].identfrontpic;
            } else {
              $rootScope.isDanCalled = false;
              $rootScope.alert("Мэдээлэл татахад алдаа гарлаа 200", "warning");
            }
          });

          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
            // console.log("get income data response", response);
            if (response[0] != "") {
              // $rootScope.danIncomeData.customerid = response[0].customerid;
              // $rootScope.danIncomeData.leasingid = response[0];
            }
          });
        }
      });
      $timeout(function () {
        $rootScope.danCustomerData.lastname = userInfo.result.lastname;
        $rootScope.danCustomerData.customertypeid = "1";
        $rootScope.danCustomerData.firstname = userInfo.result.firstname;
        $rootScope.danCustomerData.uniqueidentifier = userInfo.result.regnum.toUpperCase();

        if (userSalaryInfo) {
          serverDeferred.carCalculation(userSalaryInfo.result.list, "https://services.digitalcredit.mn/api/salary").then(function (response) {
            // console.log("salary response", response);
            if (response.status == "success" && !isEmpty(response.result)) {
              $rootScope.monthlyAverage = response.result[3];
              $rootScope.monthlyIncomeDisable = true;
              $rootScope.danIncomeData.monthlyincome = response.result[3];
              //хувааж төлөх нөхцөл
              $rootScope.danIncomeData.incyearofemployment = response.result[1];
              $rootScope.danIncomeData.workplace = response.result[2];
              $rootScope.danIncomeData.incmonthlynetincome = response.result[3];
              $rootScope.danIncomeData.workedmonths = response.result[4];
              $rootScope.filterSalaries = response.result[5];
            }
          });
        }
      }, 1000);

      $state.go("autoleasing-4");
      $rootScope.isDanCalled = true;
      $rootScope.alert("Таны мэдээллийг амжилттай татлаа. Та мэдээллээ шалгаад дутуу мэдээллээ оруулна уу", "success");
    } else {
      $rootScope.alert("Мэдээлэл татахад алдаа гарлаа 300", "warning");
      $rootScope.isDanCalled = false;
    }
  };
  $scope.replaceCyrAuto = function (lastName) {
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputLastName = document.getElementById("customerLastNameDan");
    if (rex.test(lastName) == false) {
      document.getElementById("lastNameErrorDan").style.display = "block";
      inputLastName.value = inputLastName.value.replace(inputLastName.value, "");
    } else {
      document.getElementById("lastNameErrorDan").style.display = "none";
    }
  };
  $scope.replaceCyr2Auto = function (firstName) {
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputFirstName = document.getElementById("customerFirstNameDan");
    if (rex.test(firstName) == false) {
      document.getElementById("firstNameErrorDan").style.display = "block";
      inputFirstName.value = inputFirstName.value.replace(inputFirstName.value, "");
    } else {
      document.getElementById("firstNameErrorDan").style.display = "none";
    }
  };
  $scope.ppSourceSelectOnReq = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayProfilePicuteRequest").style.display = "block";
  };
  $scope.ppSourceSelectOffReq = function () {
    document.getElementById("overlayProfilePicuteRequest").style.display = "none";
  };
  $scope.takePhoto = function (type) {
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if ($scope.selectedImagePath == 1) {
          $rootScope.danCustomerData.identfrontpic = imageData;
        } else if ($scope.selectedImagePath == 2) {
          $rootScope.danCustomerData.identbackpic = imageData;
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
  $scope.backFromStep4 = function () {
    if ($rootScope.requestType == "auto" && $ionicHistory.viewHistory().backView.stateName == "login") {
      window.history.go(-2);

      $timeout(function () {
        $ionicHistory.viewHistory().backView.stateId = "autoleasing-2";
        $ionicHistory.viewHistory().backView.stateName = "autoleasing-2";
        $ionicHistory.viewHistory().backView.url = "/views/autoleasing-2";
      }, 500);
    } else if ($rootScope.requestType == "consumer" && $ionicHistory.viewHistory().backView.stateName == "login") {
      window.history.go(-2);

      $timeout(function () {
        $ionicHistory.viewHistory().backView.stateId = "autoleasing-2";
        $ionicHistory.viewHistory().backView.stateName = "autoleasing-2";
        $ionicHistory.viewHistory().backView.url = "/views/autoleasing-2";
      }, 500);
    } else {
      $ionicHistory.goBack();
    }
  };
  $scope.backFromStep1 = function () {
    $state.go("home");
  };
  $scope.repeatDone = function () {
    $ionicSlideBoxDelegate.update();
    //$ionicSlideBoxDelegate.slide($scope.week.length - 1, 1);
  };

  $scope.selectCarChoose = function (id) {
    $rootScope.carProduct = {};

    $rootScope.yearsArray = [];
    $scope.generateArrayOfYears = function () {
      var max = new Date().getFullYear();
      var min = max - 30;

      for (var i = max; i >= min; i--) {
        $rootScope.yearsArray.push(i);
      }
    };
    $scope.generateArrayOfYears();
    if (id !== "16430027874252") {
      $ionicPlatform.ready(function () {
        setTimeout(function () {
          new MobileSelect({
            trigger: ".productYearPicker",
            wheels: [{ data: $rootScope.yearsArray }],
            position: [0, 0],
            ensureBtnText: "Хадгалах",
            title: "Үйлдвэрлэсэн он",
            maskOpacity: 0.5,
            cancelBtnText: "Хаах",
            transitionEnd: function (indexArr, data) {
              //scrolldood duusahad ajillah func
            },
            callback: function (indexArr, data) {
              var a = data.join("");
              $scope.setNumber("yearProduction", a);
              $rootScope.carProduct.yearProduction = a;
              mobileSelect4.show();
            },
          });
          var mobileSelect4 = new MobileSelect({
            trigger: ".cameYearPicker",
            wheels: [{ data: $rootScope.yearsArray }],
            position: [0, 0],
            ensureBtnText: "Хадгалах",
            title: "Орж ирсэн он",
            maskOpacity: 0.5,
            cancelBtnText: "Хаах",
            transitionEnd: function (indexArr, data) {
              //scrolldood duusahad ajillah func
            },
            callback: function (indexArr, data) {
              var a = data.join("");
              $scope.setNumber("yearEntryMongolia", a);
              $rootScope.carProduct.yearEntryMongolia = a;
            },
          });
          $("#regNums").mask("00000000");
        }, 1000);
      });
      $scope.setNumber = function (type, data) {
        //ulsiin dugaariin input ruu songoson ulsiin dugaariig set hiih func
        $(function () {
          if (type == "yearProduction") {
            $("#productYear").val(data).trigger("input");
          } else if (type == "yearEntryMongolia") {
            $("#entryYear").val(data).trigger("input");
          } else if (type == "nationalNumber") {
            $("#nationalNumber").val(data).trigger("input");
          }
        });
      };
    }
    id != "" ? (document.getElementById("categorySelect").disabled = false) : (document.getElementById("categorySelect").disabled = true);
    if (id === "16430027874252") {
      $scope.isSelected0001 = "0001";
      id != "" ? (document.getElementById("categorySelect").disabled = true) : (document.getElementById("categorySelect").disabled = false);
    } else if (id === "16430027873822") {
      $scope.isSelected0001 = "yes";
    } else if (id === "16430027874512") {
      $scope.isSelected0001 = "no";
    } else {
      $scope.isSelected0001 = "";
    }
    $timeout(function () {
      $("#step1CarCode").mask("00000000");
      $("#entryYear").mask("0000");
      $("#productYear").mask("0000");
    }, 500);
  };

  $scope.getCarFactoryCategoryAuto = function (val) {
    // $scope.selectedCarCat = val;
    if ($scope.isSelected0001 === "yes" || $scope.isSelected0001 === "0001") {
      $scope.factoryData = [];
      $rootScope.carProduct.factoryId = "";
      $rootScope.carFactoryData.map((item) => {
        if (item.number1 === val) {
          $scope.factoryData.push(item);
          return true;
        }
      });
      val != "" ? (document.getElementById("brandSelect").disabled = false) : (document.getElementById("brandSelect").disabled = true);
    }
  };
  $scope.getCarModelDataAuto = function (val) {
    if ($scope.isSelected0001 === "yes" || $scope.isSelected0001 === "0001") {
      $scope.modelData = [];
      $rootScope.carProduct.markId = "";

      $rootScope.carModelData.map((item) => {
        if (item.parentid === val) {
          $scope.modelData.push(item);
          return true;
        }
      });
      val != "" ? (document.getElementById("modelSelect").disabled = false) : (document.getElementById("modelSelect").disabled = true);
    }
  };

  $scope.getCarDataByCode = function (carCode) {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597800986357471", itemcode: carCode }).then(function (response) {
      if (!isEmpty(response[0])) {
        $rootScope.carProduct.categoryId = response[0].itemcategoryid;
        $rootScope.carProduct.factoryId = response[0].factoryid;
        $rootScope.carProduct.modelId = response[0].modelid;
        $rootScope.carProduct.yearEntryMongolia = response[0].entryyear;
        $rootScope.carProduct.yearProduction = response[0].productyear;
        $rootScope.newReqiust.carPrice = response[0].price;
      } else {
        $rootScope.alert("Машин бүртгэлгүй байна.", "warning");
      }
    });
  };
  $scope.selectIncomeType = function (id) {
    $rootScope.proofOfIncomeData = [];
    $rootScope.incomeTypeWithCondition.forEach((el) => {
      if (el.id === id) {
        $rootScope.proofOfIncomeData.push(el);
      }
    });
  };
  $scope.selectIncomeCondition = function (id) {
    //E-Mongolia дуудах эсэх
    $rootScope.isEMongolia = "";
    $rootScope.incomeTypeWithCondition.forEach((el) => {
      if (el.conditionid === id) {
        $rootScope.isEMongolia = el.number1;
      }
    });
  };
  $scope.calcLoanMonth = function () {
    if ($rootScope.newReqiust.loanMonth > $rootScope.maxMonth) {
      $rootScope.newReqiust.loanMonth = $rootScope.maxMonth;
    }
  };
  $scope.changeCarPrice = function () {
    $rootScope.newReqiust.getLoanAmount = 0;
    $rootScope.newReqiust.advancePayment = 0;
  };
});
