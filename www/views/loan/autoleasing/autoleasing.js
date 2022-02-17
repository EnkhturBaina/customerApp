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
  $ionicPlatform.ready(function () {
    setTimeout(function () {
      var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Э", "Ю", "Я"];

      new MobileSelect({
        trigger: ".step2RegSelector",
        wheels: [{ data: regChars }, { data: regChars }],
        position: [0, 0],
        ensureBtnText: "Хадгалах",
        cancelBtnText: "Хаах",
        transitionEnd: function (indexArr, data) {
          //scroll xiij bhd ajillah func
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
        onShow: function () {},
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
  // $scope.getCarDatasId = function (itemCode) {
  //   $rootScope.selectedCarData = [];
  //   $rootScope.carDatas = [];
  //   if (!isEmpty($rootScope.newReqiust.choose)) {
  //     if ($rootScope.newReqiust.choose !== "1") {
  //       $state.go("autoleasing-2");
  //       $rootScope.is0001Price = true;
  //     } else if ($scope.checkReqiured("step1")) {
  //       $rootScope.is0001Price = false;
  //       serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", itemCode: itemCode }).then(function (response) {
  //         // console.log("res", response);
  //         if (!isEmpty(response) && !isEmpty(response[0])) {
  //           $rootScope.selectedCarData = response[0];
  //           // console.log("$rootScope.selectedCarData", $rootScope.selectedCarData);
  //           $scope.selectCarName = response[0].modelname.split(" ")[0];
  //           serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727" }).then(function (response) {
  //             angular.forEach(response, function (item) {
  //               if (!isEmpty(item)) {
  //                 $rootScope.carDatas.push(item);
  //               }
  //             });
  //           });
  //           $state.go("car-info");
  //         } else {
  //           $rootScope.alert("Код буруу байна", "danger");
  //         }
  //       });
  //     }
  //   } else {
  //     $rootScope.alert("Автомашины сонгосон эсэх?", "warning");
  //   }
  //   $rootScope.carData = [];
  // };

  // $scope.getCarDatasIdEnterkey = function (event, itemCode) {
  //   if (event.keyCode === 13) {
  //     $scope.getCarDatasId(itemCode);
  //   }
  // };

  $scope.getLoanAmountFunc = function () {
    var input = document.getElementById("loanAmountRequest");
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
      $rootScope.newReqiust.loanAmount = $rootScope.newReqiust.itemPrice;
      $rootScope.newReqiust.getLoanAmount = $rootScope.newReqiust.itemPrice;
      $rootScope.loanAmountField = $rootScope.newReqiust.itemPrice;
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
    json.isMortgage = 1554263832151;
    json.salaries = $rootScope.filterSalaries;
    if (!isEmpty($rootScope.danIncomeData) && $state.current.name == "autoleasing-4") {
      json.income = $rootScope.danIncomeData.incometypeid;
    } else {
      json.income = null;
    }

    if ($state.current.name == "autoleasing-4") {
      json.isMortgage = isEmpty($rootScope.danCustomerData.mikmortgagecondition) ? "" : $rootScope.danCustomerData.mikmortgagecondition;
    }
    if ($state.current.name == "autoleasing-5") {
      json.totalIncome = isEmpty($rootScope.danIncomeData.totalincomehousehold) ? 0 : $rootScope.danIncomeData.totalincomehousehold;
      json.monthIncome = isEmpty($rootScope.danIncomeData.monthlyincome) ? 0 : $rootScope.danIncomeData.monthlyincome;
      json.monthPay = isEmpty($rootScope.danIncomeData.monthlypayment) ? 0 : $rootScope.danIncomeData.monthlypayment;
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
    } else if ($rootScope.requestType == "estate") {
      json.type = "estateLoanFilter";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
    } else if ($rootScope.requestType == "auto") {
      json.type = "autoLeasingFilterZeelMe";
      json.totalLoan = $rootScope.newReqiust.getLoanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.isCollateral = isEmpty($rootScope.newReqiust.collateralConditionId) ? "" : $rootScope.newReqiust.collateralConditionId;
      if ($scope.isSelected0001 === "0001") {
        json.code = $rootScope.carProduct.itemCode;
      }
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
    } else if ($rootScope.requestType == "preLoan") {
      json.type = "autoLeasingLoanFilter";
      json.totalLoan = $rootScope.newReqiust.loanAmount;
      json.location = isEmpty($rootScope.newReqiust.locationId) ? 0 : $rootScope.newReqiust.locationId;
      json.month = isEmpty($rootScope.newReqiust.loanMonth) ? 0 : $rootScope.newReqiust.loanMonth;
      json.preTotal = isEmpty($rootScope.newReqiust.advancePayment) ? 0 : $rootScope.newReqiust.advancePayment;
      json.isCollateral = "";
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
      //Зөвхөн Step2 -д ажлуулах
      if ($state.current.name == "autoleasing-2" && isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.bankListFilter.Agree.map((el) => {
          $rootScope.products.push(el.products);
        });
        $rootScope.products.map((obj) => {
          $rootScope.result = [].concat($rootScope.result, obj);
        });
        $rootScope.result.map((a) => {
          $rootScope.months.push(a.max_loan_month_id);
          if (a.min_payment != 0 && a.min_payment != null) {
            $rootScope.minPayments.push(a.min_payment);
          }
        });

        $rootScope.maxMonth = Math.max(...$rootScope.months);
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
            $rootScope.months.push(a.max_loan_month_id);
            if (a.min_payment !== 0 && a.min_payment !== null) {
              $rootScope.minPayments.push(a.min_payment);
            } else {
              $rootScope.minPayments.push(0);
            }
          });
          isEmpty($rootScope.months) ? ($rootScope.maxMonth = 0) : ($rootScope.maxMonth = Math.max(...$rootScope.months));
          if (isEmpty($rootScope.minPayments)) {
            $rootScope.minPayment = 0;
          } else {
            if (Math.min(...$rootScope.minPayments) == 0) {
              $rootScope.minPayment = Math.min(...$scope.removeItemAll($rootScope.minPayments, 0));
            } else {
              $rootScope.minPayment = Math.min(...$rootScope.minPayments);
            }
          }
        }

        if ($rootScope.requestType == "consumer") {
          $rootScope.displayMinPayment = ($rootScope.sumPrice * $rootScope.minPayment).toFixed(2);
        } else if ($rootScope.requestType == "eco") {
          $rootScope.displayMinPayment = ($rootScope.newReqiust.itemPrice * $rootScope.minPayment).toFixed(2);
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
  if ($state.current.name == "autoleasing-4" || $state.current.name == "autoleasing-5") {
    $timeout(function () {
      $scope.getbankData();
    }, 300);
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
  //Дан -с нийгмийн даатгалын мэдээлэл татаж хадгалах
  $scope.getCustomerIncomeData = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    //Нэвтэрсэн үед мэдээлэл татах
    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
        if (response[0] != "") {
          $rootScope.danIncomeData = response[0];
        }
      });
    }
    $timeout(function () {
      $scope.getbankData();
    }, 500);
  };
  var selectedbanks = [];
  $scope.sendRequest = function () {
    var requestCategoryId = JSON.parse(localStorage.getItem("requestCategory"));
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    //all_ID.dccustomerid
    //1639133516578203

    serverDeferred.requestFull("dcApp_loan_with_category_day_004", { customerId: all_ID.dccustomerid, reqeustTypeId: requestCategoryId }).then(function (responseLoan30) {
      if (!isEmpty(responseLoan30[1]) && responseLoan30[1].days < 30) {
        $scope.alertPopup = $ionicPopup.alert({
          title: "",
          template: (template = '<div class="svg-box"><svg class="circular yellow-stroke">' + '<circle class="path" cx="75" cy="75" r="50" fill="none" stroke-width="4" stroke-miterlimit="10"/></svg>' + '<svg class="alert-sign yellow-stroke">' + '<g transform="matrix(1,0,0,1,-615.516,-257.346)">' + '<g transform="matrix(0.56541,-0.56541,0.56541,0.56541,93.7153,495.69)">' + '<path class="line" d="M634.087,300.805L673.361,261.53" fill="none"/>' + "</g>" + '<g transform="matrix(2.27612,-2.46519e-32,0,2.27612,-792.339,-404.147)">' + '<circle class="dot" cx="621.52" cy="316.126" r="1.318" />' + "</g>" + "</g>" + "</svg></div>" + "<style>.popup { text-align:center;}</style>" + responseLoan30[1].text + ""),
          cssClass: "confirmPopup",
          buttons: [
            {
              text: "OK",
              type: "button-outline button-positive OutbuttonSize OutbuttonSizeFirst button-dc-default",
              onTap: function (e) {
                $state.go("home");
              },
            },
          ],
        });
      } else {
        $scope.disabledBtnSendReq = true;
        $rootScope.ShowLoader();
        if (!isEmpty($rootScope.selectedBanksList)) {
          $rootScope.requestType = localStorage.getItem("requestType");
          // console.log("$rootScope.requestType", $rootScope.requestType);
          if ($rootScope.requestType == "autoColl") {
            $scope.carCollateralData = {};
            //===================Авто машин барьцаалсан зээл===================
            $scope.carCollateralData = JSON.parse(localStorage.getItem("carColl"));
            $scope.carCollateralData.customerId = all_ID.dccustomerid;
            $scope.carCollateralRequestData.customerId = all_ID.dccustomerid;
            $scope.carCollateralRequestData.requestTypeId = "16082024252301";
            //Хүсэлт бүртгэх
            serverDeferred.requestFull("dcApp_carCollRequestDV_001", $scope.carCollateralRequestData).then(function (sendReqResponse) {
              // console.log("sendReqResponse", sendReqResponse);
              if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
                //Барьцаалах автомашин бүртгэх
                $rootScope.danIncomeData.leasingid = sendReqResponse[1].id;
                $scope.carCollateralData.leasingid = sendReqResponse[1].id;
                serverDeferred.requestFull("dcApp_car_collateral_loan_001", $scope.carCollateralData).then(function (saveResponse) {
                  // console.log("saveResponse", saveResponse);
                  if (saveResponse[0] == "success" && saveResponse[1] != "") {
                    //Сонгосон банк
                    selectedbanks = [];
                    angular.forEach($rootScope.bankListFilter.Agree, function (item) {
                      if (item.checked) {
                        var AgreeBank = {
                          loanId: sendReqResponse[1].id,
                          customerId: all_ID.dccustomerid,
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
                        $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                        delete $rootScope.danIncomeData.id;

                        var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                        // console.log("DanloginUserInfo", DanloginUserInfo);
                        if (DanloginUserInfo.dcapp_crmuser_dan) {
                          $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                          $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                          $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                        }

                        $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;
                        // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);

                        serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                          // console.log("danCustomerDataResponse", danCustomerDataResponse);
                          serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                            // console.log("danIncomeDataResponse", danIncomeDataResponse);
                            if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                              //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                              var json = {
                                id: all_ID.crmcustomerid,
                                mobileNumber: $rootScope.danCustomerData.mobilenumber,
                                siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                              };
                              json.dcApp_crmUser_update = {
                                id: all_ID.crmuserid,
                                customerId: all_ID.crmcustomerid,
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
          } else if ($rootScope.requestType == "preLoan") {
            //===================preLoan===================
            $scope.newReqiust.customerId = all_ID.dccustomerid;
            $scope.newReqiust.requestTypeId = "16082024283623";

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
            // console.log("selectedbanks", selectedbanks);
            $rootScope.newReqiust.dcApp_preLoanRequestMapDV = selectedbanks;

            // console.log("$rootScope.newReqiust", $rootScope.newReqiust);

            serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
              // console.log("res", response);
              if (response[0] == "success" && response[1] != "") {
                $rootScope.danIncomeData.leasingid = response[1].id;
                $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;

                var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }
                $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                    var json = {
                      id: all_ID.crmcustomerid,
                      mobileNumber: $rootScope.danCustomerData.mobilenumber,
                      siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                    };
                    json.dcApp_crmUser_update = {
                      id: all_ID.crmuserid,
                      customerId: all_ID.crmcustomerid,
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
          } else if ($rootScope.requestType == "eco" || $rootScope.requestType == "building" || $rootScope.requestType == "card" || $rootScope.requestType == "salary") {
            //===================Ногоон зээл===================
            //===================Орон сууцны зээл===================
            //===================Кредит карт===================
            //===================Цалингийн зээл===================
            if ($rootScope.requestType == "eco") {
              $scope.newReqiust.requestTypeId = "16082024252192";
            } else if ($rootScope.requestType == "building") {
              $scope.newReqiust.requestTypeId = "16082024283632";
            } else if ($rootScope.requestType == "card") {
              $scope.newReqiust.requestTypeId = "16082024283628";
            } else if ($rootScope.requestType == "salary") {
              $scope.newReqiust.requestTypeId = "16082024283627";
            }
            $scope.newReqiust.customerId = all_ID.dccustomerid;
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

            serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
              // console.log("res", response);
              if (response[0] == "success" && response[1] != "") {
                $rootScope.danIncomeData.leasingid = response[1].id;
                $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;

                var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }
                $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                    var json = {
                      id: all_ID.crmcustomerid,
                      mobileNumber: $rootScope.danCustomerData.mobilenumber,
                      siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                    };
                    json.dcApp_crmUser_update = {
                      id: all_ID.crmuserid,
                      customerId: all_ID.crmcustomerid,
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
            $scope.newReqiust.customerId = all_ID.dccustomerid;
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

            serverDeferred.requestFull("dcApp_preLoan_001", $rootScope.newReqiust).then(function (response) {
              // console.log("res", response);
              if (response[0] == "success" && response[1] != "") {
                $rootScope.danIncomeData.leasingid = response[1].id;
                $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;

                var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                if (DanloginUserInfo.dcapp_crmuser_dan) {
                  $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                  $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                  $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                }
                $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;

                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                    var json = {
                      id: all_ID.crmcustomerid,
                      mobileNumber: $rootScope.danCustomerData.mobilenumber,
                      siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                    };
                    json.dcApp_crmUser_update = {
                      id: all_ID.crmuserid,
                      customerId: all_ID.crmcustomerid,
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
            $scope.newReqiust.customerId = all_ID.dccustomerid;
            $scope.newReqiust.requestTypeId = "16082024252191";
            //Хүсэлт бүртгэх
            serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
              // console.log("respionse OL", response);
              if (response[0] == "success" && response[1] != "") {
                $rootScope.danIncomeData.leasingid = response[1].id;
                $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                //Сонгосон банк
                selectedbanks = [];
                //нөхцөл хангасан банкууд
                angular.forEach($rootScope.bankListFilter.Agree, function (item) {
                  if (item.checked) {
                    var AgreeBank = {
                      loanId: response[1].id,
                      customerId: all_ID.dccustomerid,
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

                    var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                    if (DanloginUserInfo.dcapp_crmuser_dan) {
                      $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                      $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                      $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                    }

                    $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;
                    // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                    serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                      // console.log("danCustomerDataResponse", danCustomerDataResponse);
                      serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                        // console.log("danIncomeDataResponse", danIncomeDataResponse);
                        if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                          //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                          var json = {
                            id: all_ID.crmcustomerid,
                            mobileNumber: $rootScope.danCustomerData.mobilenumber,
                            siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                          };
                          json.dcApp_crmUser_update = {
                            id: all_ID.crmuserid,
                            customerId: all_ID.crmcustomerid,
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
            $rootScope.newReqiust.customerId = all_ID.dccustomerid;
            $rootScope.newReqiust.requestTypeId = "16082024283512";
            //Хүсэлт бүртгэх
            serverDeferred.requestFull("dcApp_carCollRequestDV_001", $rootScope.newReqiust).then(function (sendReqResponse) {
              // console.log("sendReqResponse", sendReqResponse);

              if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
                //ҮХХ бүртгэх
                $rootScope.danIncomeData.leasingid = sendReqResponse[1].id;
                $scope.propertyData.leasingId = sendReqResponse[1].id;
                $scope.propertyData.customerId = all_ID.dccustomerid;
                serverDeferred.requestFull("dcApp_property_data_001", $scope.propertyData).then(function (saveResponse) {
                  // console.log("saveResponse", saveResponse);
                  if (saveResponse[0] == "success" && saveResponse[1] != "") {
                    //Сонгосон банк
                    selectedbanks = [];
                    angular.forEach($rootScope.bankListFilter.Agree, function (item) {
                      if (item.checked) {
                        var AgreeBank = {
                          loanId: sendReqResponse[1].id,
                          customerId: all_ID.dccustomerid,
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
                        $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                        delete $rootScope.danIncomeData.id;

                        var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                        // console.log("DanloginUserInfo", DanloginUserInfo);
                        if (DanloginUserInfo.dcapp_crmuser_dan) {
                          $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                          $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                          $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                        }

                        $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;
                        // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);

                        serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (danCustomerDataResponse) {
                          // console.log("danCustomerDataResponse", danCustomerDataResponse);
                          serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (danIncomeDataResponse) {
                            // console.log("danIncomeDataResponse", danIncomeDataResponse);
                            if (danIncomeDataResponse[0] == "success" && danIncomeDataResponse[1] != "") {
                              //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                              var json = {
                                id: all_ID.crmcustomerid,
                                mobileNumber: $rootScope.danCustomerData.mobilenumber,
                                siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                              };
                              json.dcApp_crmUser_update = {
                                id: all_ID.crmuserid,
                                customerId: all_ID.crmcustomerid,
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
                    $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 200", "danger");
                  }
                });
              } else {
                $rootScope.HideLoader();
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа 300", "danger");
              }
            });
          } else {
            //===================AutoLeasing===================
            $scope.newReqiust.customerId = all_ID.dccustomerid;
            $scope.newReqiust.requestTypeId = "16082024283142";

            serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
              if (response[0] == "success" && response[1] != "") {
                //Сонгосон банк
                selectedbanks = [];
                $rootScope.danIncomeData.leasingid = response[1].id;
                //нөхцөл хангасан банкууд
                angular.forEach($rootScope.bankListFilter.Agree, function (item) {
                  if (item.checked) {
                    var AgreeBank = {
                      loanId: response[1].id,
                      customerId: all_ID.dccustomerid,
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
                serverDeferred.requestFull("dcApp_request_product_dv_with_detail_001", onlineLeasingProduct).then(function (response) {
                  if (response[0] == "success" && response[1] != "") {
                    $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                    delete $rootScope.danIncomeData.id;

                    var DanloginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
                    if (DanloginUserInfo.dcapp_crmuser_dan) {
                      $rootScope.danCustomerData.profilePictureClob = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.profilepictureclob;
                      $rootScope.danCustomerData.familyName = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.familyname;
                      $rootScope.danCustomerData.birthDate = DanloginUserInfo.dcapp_crmuser_dan.dcapp_dccustomer_dan.birthdate.substring(0, 10);
                    }
                    $rootScope.danCustomerData.crmCustomerId = all_ID.crmuserid;

                    serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                      //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                      serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                        //Утасны дугаар регистр өөрчлөгдсөн бол Update хийх
                        var json = {
                          id: all_ID.crmcustomerid,
                          mobileNumber: $rootScope.danCustomerData.mobilenumber,
                          siRegNumber: $rootScope.danCustomerData.uniqueidentifier,
                        };
                        json.dcApp_crmUser_update = {
                          id: all_ID.crmuserid,
                          customerId: all_ID.crmcustomerid,
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
          $rootScope.alert("Та хүсэлт илгээх банкаа сонгоно уу", "warning");
        }
      }
    });
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
        if ($rootScope.isDanHand) {
          $scope.getCustomerIncomeData();
        }
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
    if (isEmpty($rootScope.carProduct)) {
      $rootScope.carProduct = {};
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
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.yearEntryMongolia)) {
        $rootScope.alert("Орж ирсэн он оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && $rootScope.carProduct.yearEntryMongolia.length < 4) {
        $rootScope.alert("Орж ирсэн он бүрэн оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && isEmpty($rootScope.carProduct.yearProduction)) {
        $rootScope.alert("Үйлдвэрлэсэн он оруулна уу", "warning");
        return false;
      } else if ($scope.isSelected0001 !== "no" && $rootScope.carProduct.yearProduction.length < 4) {
        $rootScope.alert("Үйлдвэрлэсэн он бүрэн оруулна уу", "warning");
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
      } else if ((isEmpty($rootScope.newReqiust.advancePayment) && $rootScope.newReqiust.collateralConditionId == "1554263832151" && !$rootScope.isCarColl) || (isEmpty($rootScope.newReqiust.advancePayment) && !$scope.isCollShow && !$rootScope.isCarColl)) {
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
      }
      // else if (isEmpty($rootScope.danIncomeData.incometypeid) && $rootScope.isIncomeConfirm) {
      //   $rootScope.alert("Орлогын төрөл сонгоно уу", "warning");
      //   return false;
      // }
      else if (isEmpty($rootScope.newReqiust.isCoBorrower)) {
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
      } else if (isEmpty($rootScope.danIncomeData.totalincomehousehold) && $rootScope.isIncomeConfirm) {
        $rootScope.alert("Сарын бусад орлогоо оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.monthlypayment)) {
        $rootScope.alert("Төлж буй зээлийн төлбөр оруулна уу", "warning");
        return false;
      }
      // else if (isEmpty($rootScope.danCustomerData.email)) {
      //   $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
      //   return false;
      // }
      // else if (!re.test($scope.danCustomerData.email)) {
      //   $rootScope.alert("И-мэйл хаягаа зөв оруулна уу", "warning");
      //   return false;
      // }
      else if (isEmpty($rootScope.danCustomerData.mikmortgagecondition) && !$rootScope.isSupLoan) {
        $rootScope.alert("Ипотекийн зээлтэй эсэхээ сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.ismarried) && !$rootScope.isSupLoan) {
        $rootScope.alert("Гэрлэлтийн байдал сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danCustomerData.educationid) && $rootScope.isSupLoan) {
        $rootScope.alert("Боловсрол сонгоно уу", "warning");
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
        $rootScope.alert("Таны мэдээллийн дагуу зээл олгох банк, ББСБ байхгүй байна. Та мэдээллээ дахин оруулна уу.", "warning");
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
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    $rootScope.isCarColl = false;
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "auto") {
      $rootScope.is0001Price = true;
      $rootScope.carProduct = {};
      $rootScope.newReqiust = {};
      localStorage.setItem("firstReq", "no");
      $rootScope.displayMinPayment = 0;
      $rootScope.maxMonth = 0;
    }
    if (local == "autoColl") {
      $rootScope.isCarColl = true;
      document.getElementById("loanAmountRequest").disabled = false;
    } else {
      $rootScope.isCarColl = false;
    }
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
    // $rootScope.carProduct = {};
    if (!isEmpty($rootScope.loginUserInfo)) {
      if ("uniqueidentifier" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
        $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
        $rootScope.danCustomerData.uniqueidentifier = $rootScope.loginUserInfo.uniqueidentifier;
        $("#regCharA").text($rootScope.loginUserInfo.uniqueidentifier.substr(0, 1));
        $("#regCharB").text($rootScope.loginUserInfo.uniqueidentifier.substr(1, 1));
        $("#regNums").val($rootScope.loginUserInfo.uniqueidentifier.substr(2, 8));
      }
      if ("mobilenumber" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.mobilenumber)) {
        $rootScope.danCustomerData.mobilenumber = $rootScope.loginUserInfo.mobilenumber;
      }
      if ("email" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.email)) {
        $rootScope.danCustomerData.email = $rootScope.loginUserInfo.email;
      }
      if ("identfrontpic" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.identfrontpic)) {
        $rootScope.danCustomerData.identfrontpic = $rootScope.loginUserInfo.identfrontpic;
      }
      if ("identbackpic" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.identbackpic)) {
        $rootScope.danCustomerData.identbackpic = $rootScope.loginUserInfo.identbackpic;
      }
    }
    $scope.factoryData = $rootScope.carFactoryData;
    $scope.modelData = $rootScope.carModelData;
    $scope.isHideFromConsumer = false;
    $scope.disabledBtnSendReq = false;
    $rootScope.hideFooter = true;
    $rootScope.collTrueStep2 = false;
    var local = localStorage.getItem("requestType");
    if (local == "estate" && $state.current.name == "autoleasing-4" && !$rootScope.propertyIsDan) {
      $scope.danHand();
    } else if (local == "autoColl" && $state.current.name == "autoleasing-4" && !$rootScope.isDanLoginAutoColl) {
      $scope.danHand();
    }

    if ($state.current.name == "autoleasing-2") {
      if (local == "auto") {
        $scope.isCollShow = true;
      } else if (local == "consumer" || local == "eco" || local == "autoColl") {
        $scope.isHideFromConsumer = true;
      } else {
        $scope.isCollShow = false;
      }
      $rootScope.newReqiust.getLoanAmount = "";
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
      $scope.getLoanAmountFunc();
      $timeout(function () {
        $scope.getbankData("forced");
      }, 200);
    }
  });
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
    if (item) {
      $rootScope.selectedBanksList.push(id);
    } else {
      var index = $rootScope.selectedBanksList.indexOf(id);
      if (index !== -1) {
        $rootScope.selectedBanksList.splice(index, 1);
      }
    }
  };
  //Урьдчилгаа дээр дарахад хоосон болгох
  $scope.removeAdvancePayment = function () {
    $rootScope.newReqiust.advancePayment = "";
  };
  // dan connection
  $scope.gotoDanLoginAutoIncome = function () {
    serverDeferred.carCalculation({ type: "auth_auto", redirect_uri: "customerapp" }, "https://services.digitalcredit.mn/api/v1/c").then(function (response) {
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
            // console.log("response autoLEASING DAN", response);
            if (!isEmpty(response.result.data)) {
              var userInfo = JSON.parse(response.result.data.info);
              // console.log("userInfo", userInfo);
              if (!isEmpty(userInfo)) {
                $scope.registerFunctionAuto(userInfo);
              }
              var userSalaryInfo = JSON.parse(response.result.data.salary);

              serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.result.regnum.toUpperCase() }).then(function (checkedValue) {
                // console.log("checkedValue", checkedValue);
                if (!isEmpty(checkedValue[1])) {
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
                    // console.log("responseCustomerData", responseCustomerData);
                    if (responseCustomerData[0] != "") {
                      //Бүртгэлтэй USER -н дата татаж харуулах
                      $rootScope.danCustomerData = responseCustomerData[0];
                      $rootScope.danCustomerData.id = checkedValue[1].dccustomerid;
                    } else {
                      $rootScope.alert("Мэдээлэл татахад алдаа гарлаа", "warning");
                    }
                  });

                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
                    // console.log("get income data response", response);
                    if (response[0] != "") {
                      $rootScope.danIncomeData = response[0];
                    }
                  });
                }
              });
              $timeout(function () {
                $rootScope.danCustomerData.lastname = userInfo.result.lastname;
                $rootScope.danCustomerData.customertypeid = "1";
                $rootScope.danCustomerData.firstname = userInfo.result.firstname;
                $rootScope.danCustomerData.uniqueidentifier = userInfo.result.regnum.toUpperCase();

                // console.log("userSalaryInfo", userSalaryInfo);
                if (userSalaryInfo) {
                  serverDeferred.carCalculation(userSalaryInfo.result.list, "https://services.digitalcredit.mn/api/salary").then(function (response) {
                    // console.log("salary response", response);
                    if (response.status == "success" && !isEmpty(response.result)) {
                      $rootScope.monthlyAverage = response.result[0];
                      $rootScope.monthlyIncomeDisable = true;
                      $rootScope.danIncomeData.monthlyincome = response.result[0];
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
              $rootScope.alert("Таны мэдээллийг амжилттай татлаа. Та мэдээллээ шалгаад дутуу мэдээллээ оруулна уу", "success");
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
    $rootScope.isDanLoginAutoColl = true;
    //Дан -р нэвтэрсэн үед disable хийх
    $rootScope.lastNameDanDisable = true;
    $rootScope.firstNameDanDisable = true;
    $rootScope.uniqueIdentifierDanDisable = true;
  };

  $rootScope.isDanHand = false;
  $scope.danHand = function () {
    //Гараар бөглөх үед харилцагчийн хувийн мэдээлэл болон орлогын мэдээлэл татаж харуулах
    $rootScope.isDanHand = true;
    $rootScope.monthlyIncomeDisable = false;
    $rootScope.loginFromAutoLeasing = true;

    if (isEmpty($rootScope.loginUserInfo)) {
      $state.go("login");
    } else {
      $state.go("autoleasing-4");
      // $rootScope.alert("Та гараар мэдээллээ бөглөсөн тохиолдолд зээл олгох байгууллагаас нэмэлт материал авах хүсэлт ирэхийг анхаарна уу", "");
      var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
      //Нэвтэрсэн үед мэдээлэл татах
      if (!isEmpty($rootScope.loginUserInfo)) {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: all_ID.crmuserid }).then(function (responseCustomerData) {
          // console.log("responseCustomerData", responseCustomerData);
          if (responseCustomerData[0] != "") {
            $rootScope.danCustomerData = responseCustomerData[0];
            $rootScope.danCustomerData.id = all_ID.dccustomerid;
            // console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
              // console.log("get income data response", response);
              if (response[0] != "") {
                $rootScope.danIncomeData = response[0];
              }
            });
          }
        });
      }
    }
    $rootScope.lastNameDanDisable = false;
    $rootScope.firstNameDanDisable = false;
    $rootScope.uniqueIdentifierDanDisable = false;
  };
  $scope.registerFunctionAuto = function (param) {
    var value = param.result;
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
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id }).then(function (responseALLID) {
              // console.log("res all_ID", responseALLID);
              localStorage.setItem("ALL_ID", JSON.stringify(responseALLID[0]));
              $rootScope.danCustomerData.id = responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
              // console.log("localStorage", localStorage);
            });
          }
        }, 500);
      });
    });
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
    if (id === "1") {
      $scope.isSelected0001 = "0001";
    } else if (id === "1554263832132") {
      $scope.isSelected0001 = "yes";
    } else if (id === "1554263832151") {
      $scope.isSelected0001 = "no";
    } else {
      $scope.isSelected0001 = "";
    }
    $timeout(function () {
      $("#step1CarCode").mask("00000000");
      $("#entryYear").mask("0000");
      $("#prodYear").mask("0000");
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
});
