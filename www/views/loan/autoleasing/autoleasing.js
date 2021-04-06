﻿angular.module("autoleasing.Ctrl", ["ngAnimate"]).controller("autoleasingCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicHistory, $timeout, $ionicModal, $ionicLoading, $stateParams) {
  $rootScope.requestType = "";
  $rootScope.requestType = localStorage.getItem("requestType");

  $rootScope.selectedBanksList = [];
  if ($state.current.name == "autoleasing-1") {
    // $rootScope.alert("Та авах автомашиныхаа кодыг оруулах эсвэл QR кодыг уншуулна уу", "success");
    $ionicModal
      .fromTemplateUrl("templates/auto.html", {
        scope: $scope,
        animation: "slide-in-up",
      })
      .then(function (autoModal) {
        $scope.autoModal = autoModal;
      });
    // modals.show();
    $timeout(function () {
      $scope.autoModal.show();
    }, 300);
    $rootScope.hideFooter = true;
  }
  $scope.getCarDatasId = function (itemCode) {
    $rootScope.selectedCarData = [];
    $scope.getLoanAmount = "";
    localStorage.setItem("requestType", "auto");
    $rootScope.carDatas = [];
    if ($scope.checkReqiured("step1")) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", itemCode: itemCode }).then(function (response) {
        console.log("res", response);
        if (!isEmpty(response) && !isEmpty(response[0])) {
          $rootScope.selectedCarData = response[0];
          console.log("$rootScope.selectedCarData", $rootScope.selectedCarData);
          $scope.selectCarName = response[0].modelname.split(" ")[0];
          serverDeferred
            .request("PL_MDVIEW_004", {
              systemmetagroupid: "1597646717653727",
            })
            .then(function (response) {
              angular.forEach(response, function (item) {
                if (!isEmpty(item)) {
                  $rootScope.carDatas.push(item);
                }
              });
            });
          if (!isEmpty($rootScope.selectedCarData.itemquantity)) {
            $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
          } else {
            $scope.getLoanAmount = $rootScope.selectedCarData.price;
          }
          $state.go("car-info");
        } else {
          $rootScope.alert("Код буруу байна", "danger");
        }
      });
    }
    $rootScope.carData = [];
  };

  $scope.getCarDatasIdEnterkey = function (event, itemCode) {
    if (event.keyCode === 13) {
      $scope.getCarDatasId(itemCode);
    }
  };

  $scope.getLookupData = function () {
    if (isEmpty($rootScope.locationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
        $rootScope.locationData = response;
      });
    }
  };

  $rootScope.getLoanAmountFunc = function () {
    $rootScope.requestType = localStorage.getItem("requestType");
    if ($rootScope.requestType == "consumer") {
      if ($state.current.name == "autoleasing-2") {
        $rootScope.newReqiust = {};
      }
      $scope.getLoanAmount = $rootScope.sumPrice;
      $rootScope.loanAmountField = $rootScope.sumPrice;
    } else {
      if (!isEmpty($rootScope.selectedCarData)) {
        if (!isEmpty($rootScope.selectedCarData.itemquantity)) {
          $scope.getLoanAmount = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
          $rootScope.loanAmountField = $rootScope.selectedCarData.price * parseInt($rootScope.selectedCarData.itemquantity);
        } else {
          $scope.getLoanAmount = $rootScope.selectedCarData.price;
          $rootScope.loanAmountField = $rootScope.selectedCarData.price;
        }
      }
    }
  };

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
    json.isMortgage = 1554263832151;
    if ($state.current.name == "autoleasing-5") {
      json.totalIncome = $rootScope.danIncomeData.totalincomehousehold;
      json.monthIncome = $rootScope.danIncomeData.monthlyincome;
      json.monthPay = $rootScope.danIncomeData.monthlypayment;
    }

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
  if (($state.current.name == "autoleasing-3" && $rootScope.requestType != "autoColl") || $state.current.name == "autoleasing-2") {
    $rootScope.newReqiust.collateralConditionId = 1554263832151;
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
  $rootScope.consumerData = [];
  //Дан -с нийгмийн даатгалын мэдээлэл татаж хадгалах
  $scope.getCustomerIncomeData = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    $rootScope.danIncomeData = {};
    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: all_ID.dccustomerid }).then(function (response) {
        if (response[0] != "") {
          $rootScope.danIncomeData = response[0];
        }
        console.log("get income data $rootScope.danIncomeData", $rootScope.danIncomeData);
      });
    }
    $timeout(function () {
      $scope.getbankData();
    }, 1000);
  };
  var selectedbanks = [];
  $scope.checkBankSelectedStep = function () {
    // if ($scope.checkReqiured("danIncomeReq")) {
    //   // $state.go("income");
    //   $state.go("autoleasing-3");
    // } else {
    // }
    $state.go("autoleasing-3");
  };
  $scope.sendRequest = async function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    console.log("$rootScope.isDanHand", $rootScope.isDanHand);
    if ($rootScope.isDanHand) {
      $scope.getCustomerIncomeData();
    }
    $rootScope.requestType = localStorage.getItem("requestType");
    if ($rootScope.requestType == "autoColl") {
      $scope.carCollateralData = {};
      $rootScope.ShowLoader();
      //===================Авто машин барьцаалсан зээл===================
      $scope.carCollateralData = JSON.parse(localStorage.getItem("carColl"));
      $scope.carCollateralData.customerId = all_ID.dccustomerid;
      $scope.carCollateralRequestData.customerId = all_ID.dccustomerid;
      //Хүсэлт бүртгэх
      serverDeferred.requestFull("dcApp_carCollRequestDV_001", $scope.carCollateralRequestData).then(function (sendReqResponse) {
        if (sendReqResponse[0] == "success" && sendReqResponse[1] != "") {
          //Барьцаалах автомашин бүртгэх
          $scope.carCollateralData.leasingid = sendReqResponse[1].id;
          serverDeferred.requestFull("dcApp_car_collateral_loan_001", $scope.carCollateralData).then(function (saveResponse) {
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
                    isMobile: "1",
                    wfmStatusId: "1609944755118135",
                    productId: item.products[0].id,
                  };
                  selectedbanks.push(AgreeBank);
                }
              });
              //нөхцөл хангаагүй банкууд
              angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
                if (item.checked) {
                  var NotAgreeBank = {
                    loanId: sendReqResponse[1].id,
                    customerId: all_ID.dccustomerid,
                    bankId: item.id,
                    isAgree: "0",
                    isMobile: "1",
                    wfmStatusId: "1609944755118135",
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
                  }
                });
              });
              //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
              $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree.concat($rootScope.bankListFilter.NotAgree);
              $timeout(function () {
                if (sendReqResponse[0] == "success" && sendReqResponse[1] != "" && mapBankSuccess) {
                  localStorage.removeItem("carColl");
                  $ionicLoading.hide();
                  $state.go("loan_success");
                } else {
                  $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
                }
              }, 1000);
            } else {
              $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
            }
          });
        } else {
          $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
        }
      }); /*8888888888888888888888888888*/
    } else if ($rootScope.requestType == "consumer") {
      $rootScope.ShowLoader();
      //==================Хэрэглээний лизинг===================
      $scope.consumerData = JSON.parse(localStorage.getItem("otherGoods"));
      $scope.newReqiust.customerId = all_ID.dccustomerid;
      //Хүсэлт бүртгэх
      serverDeferred.requestFull("dcApp_send_request_dv1_001", $rootScope.newReqiust).then(function (response) {
        if (response[0] == "success" && response[1] != "") {
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
                isMobile: "1",
                wfmStatusId: "1609944755118135",
                productId: item.products[0].id,
                vendorId: $rootScope.selectedCarData.vendorid,
              };
              selectedbanks.push(AgreeBank);
            }
          });
          //нөхцөл хангаагүй банкууд
          angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
            if (item.checked) {
              var NotAgreeBank = {
                loanId: response[1].id,
                customerId: all_ID.dccustomerid,
                bankId: item.id,
                isAgree: "0",
                isMobile: "1",
                wfmStatusId: "1609944755118135",
                productId: item.products[0].id,
                vendorId: $rootScope.selectedCarData.vendorid,
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
              }
            });
          });
          //Амжилттай илгээгдсэн банкуудыг харуулахад ашиглах
          $rootScope.selectedBankSuccess = $rootScope.bankListFilter.Agree.concat($rootScope.bankListFilter.NotAgree);
          $scope.consumerData.map((product) => {
            product.leasingId = response[1].id;
            if (product.picture1) {
              product.picture1 = product.picture1.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            if (product.picture2) {
              product.picture2 = product.picture2.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            if (product.picture3) {
              product.picture3 = product.picture3.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            if (product.picture4) {
              product.picture4 = product.picture4.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            //Бүтээгдэхүүн бүртгэх
            serverDeferred.requestFull("dcApp_consumer_loan_001", product).then(function (responseProduct) {
              if (responseProduct[0] == "success" && responseProduct[1] != "" && mapBankSuccess) {
                localStorage.removeItem("otherGoods");
                localStorage.removeItem("consumerRequestData");
                localStorage.removeItem("otherGoodsMaxId");
                $ionicLoading.hide();
                $rootScope.newReqiust = {};
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
      if (!isEmpty($rootScope.selectedBanksList)) {
        $rootScope.ShowLoader();
        //==================AutoLeasing===================
        $scope.newReqiust.customerId = all_ID.dccustomerid;

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
                  isMobile: "1",
                  wfmStatusId: "1609944755118135",
                  productId: item.products[0].id,
                  vendorId: $rootScope.selectedCarData.vendorid,
                };
                selectedbanks.push(AgreeBank);
              }
            });
            //нөхцөл хангаагүй банкууд
            angular.forEach($rootScope.bankListFilter.NotAgree, function (item) {
              if (item.checked) {
                var NotAgreeBank = {
                  loanId: response[1].id,
                  customerId: all_ID.dccustomerid,
                  bankId: item.id,
                  isAgree: "0",
                  isMobile: "1",
                  wfmStatusId: "1609944755118135",
                  productId: item.products[0].id,
                  vendorId: $rootScope.selectedCarData.vendorid,
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
                $rootScope.danIncomeData.customerid = all_ID.dccustomerid;
                delete $rootScope.danIncomeData.id;
                console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);
                serverDeferred.requestFull("dcApp_profile_dv_002", $rootScope.danCustomerData).then(function (response) {
                  console.log("response SAVE CUSTOMER DATA", response);
                  console.log("$rootScope.danIncomeData", $rootScope.danIncomeData);
                  //Дан -с авсан нийгмийн даатгалын мэдээлэл хадгалах
                  serverDeferred.requestFull("dcApp_profile_income_dv_001", $rootScope.danIncomeData).then(function (response) {
                    console.log("response", response);
                    $ionicLoading.hide();
                    $rootScope.newReqiust = {};
                    $rootScope.selectedCarData = [];
                    $rootScope.carData = [];
                    $state.go("loan_success");
                  });
                });
              } else {
                $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
              }
            });
          } else {
            $rootScope.alert("Хүсэлт илгээхэд алдаа гарлаа", "danger");
          }
        });
      } else {
        $rootScope.alert("Та хүсэлт илгээх банкаа сонгоно уу", "warning");
      }
    }
    $rootScope.hideFooter = false;
  };

  $scope.goStep3 = function (param) {
    if ($scope.checkReqiured("step2")) {
      if (isEmpty($rootScope.newReqiust.serviceAgreementId)) {
        $rootScope.newReqiust.serviceAgreementId = "1554263832132";
      }

      if (isEmpty($rootScope.bankListFilter.Agree) && isEmpty($rootScope.bankListFilter.NotAgree)) {
        $rootScope.alert("Банк олдсонгүй", "warning");
      } else {
        // $state.go("autoleasing-3");
        $state.go("income");
      }
    }
  };
  $scope.goStep5 = function () {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554274244505" }).then(function (response) {
      $rootScope.incomeType = response;
    });
    $state.go("autoleasing-5");
    console.log("$rootScope.isDanHand", $rootScope.isDanHand);
    if ($rootScope.isDanHand) {
      $scope.getCustomerIncomeData();
    }
  };

  $scope.selectBankInfo = function (bank) {
    $rootScope.selectedBank = bank;
    // $state.go("autoleasing-bank-info");
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
    } else if (param == "danIncomeReq") {
      if (isEmpty($rootScope.danIncomeData.incometypeid)) {
        $rootScope.alert("Та орлогын эх үүсвэр сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.monthlyincome)) {
        $rootScope.alert("Та сарын орлогоо оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.totalincomehousehold)) {
        $rootScope.alert("Та өрхийн нийт орлогоо оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.danIncomeData.monthlypayment)) {
        $rootScope.alert("Та төлж буй зээлийн дүнгээ оруулна уу", "warning");
        return false;
      } else {
        return true;
      }
    }
  };

  // $scope.growDivAuto = function () {
  //   var growDiv = document.getElementById("car-grow");
  //   if (growDiv.clientHeight) {
  //     growDiv.style.height = 0;
  //   } else {
  //     var wrapper = document.querySelector(".car-measuringWrapper");
  //     growDiv.style.height = wrapper.clientHeight + "px";
  //   }
  // };
  $rootScope.calcLoanAmount = function () {
    $timeout(function () {
      var input = document.getElementById("sendRequestAdvancePayment");
      $scope.getLoanAmount = $rootScope.loanAmountField;
      if (parseFloat($scope.getLoanAmount) >= parseFloat($rootScope.newReqiust.advancePayment) || input.value == 0) {
        $scope.getLoanAmount = $scope.getLoanAmount - parseFloat($rootScope.newReqiust.advancePayment);
        $rootScope.newReqiust.loanAmount = $scope.getLoanAmount;
      } else {
        input.value = input.value.slice(0, input.value.length - 1);
        input.value = $rootScope.loanAmountField - input.value;
      }
    }, 500);
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
    $rootScope.newReqiust = {};
  };

  $scope.isAmountDisable = false;
  $scope.collateralConditionId = false;
  //Үйлчилгээний нөхцлийг зөвшөөрөх
  $scope.agreementChecked = false;
  $scope.loanAmountDisable = function () {
    var local = localStorage.getItem("requestType");
    if (local == "autoColl") {
      $scope.isAmountDisable = false;
      $scope.collateralConditionId = true;
      $scope.agreementChecked = true;
    } else if (local == "auto") {
      $scope.isAmountDisable = true;
      $scope.collateralConditionId = true;
      $scope.agreementChecked = true;
    } else {
      $scope.isAmountDisable = true;
      $scope.collateralConditionId = false;
    }
  };

  $scope.$on("$ionicView.enter", function () {
    $scope.getLoanAmountFunc();
    $scope.getLookupData();
    $scope.loanAmountDisable();
  });
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.itemShow = function (item, id) {
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
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
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
            console.log("response autoLEASING DAN", response);
            if (!isEmpty(response.result.data)) {
              var userInfo = JSON.parse(response.result.data.info);
              console.log("userInfo", userInfo);
              if (!isEmpty(userInfo)) {
                $scope.registerFunctionAuto(userInfo);
              }
              var userSalaryInfo = JSON.parse(response.result.data.salary);

              serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.regnum.toUpperCase() }).then(function (checkedValue) {
                console.log("checkedValue", checkedValue);
                serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
                  console.log("responseCustomerData", responseCustomerData);
                  if (responseCustomerData[0] != "") {
                    //Бүртгэлтэй USER -н дата татаж харуулах
                    $rootScope.danCustomerData = responseCustomerData[0];
                    $rootScope.danCustomerData.id = checkedValue[1].dccustomerid;
                  }
                });

                serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
                  console.log("get income data response", response);
                  if (response[0] != "") {
                    $rootScope.danIncomeData = response[0];
                  }
                });
                console.log("$rootScope.danCustomerData", $rootScope.danCustomerData);

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

              $state.go("autoleasing-4");
              $rootScope.alert("Таны мэдээллийг амжилттай татлаа. Та мэдээллээ шалгаад дутуу мэдээллээ оруулна уу", "success");
            }
          });
        } else if (error) {
          console.log(error);
        }
      });
    });
    $rootScope.isDanLoginAutoColl = true;
  };
  $rootScope.isDanHand = false;
  $scope.danHand = function () {
    $rootScope.isDanHand = true;
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1554263831966" }).then(function (response) {
      $rootScope.mortgageData = response;
    });
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "21553236817016" }).then(function (response) {
      $rootScope.familtStatData = response;
    });
    $state.go("autoleasing-4");
  };
  $scope.registerFunctionAuto = function (value) {
    console.log("value", value);
    var json = {
      customerCode: value.regnum.toUpperCase(),
      siRegNumber: value.regnum.toUpperCase(),
      isActive: "1",
    };
    json.dcApp_crmUser_dan = {
      userName: value.regnum.toUpperCase(),
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
        console.log("IS REGISTERED !!!");
        json.id = checkedValue[1].customerid;
        json.dcApp_crmUser_dan.id = checkedValue[1].custuserid;
        json.dcApp_crmUser_dan.dcApp_dcCustomer_dan.id = checkedValue[1].dccustomerid;
      }
      serverDeferred.requestFull("dcApp_crmCustomer_dan_001", json).then(function (response) {
        console.log("res", response);
        if (!isEmpty(response) && !isEmpty(response[0])) {
          $rootScope.loginUserInfo = {};
          serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
            if (response[0] != "") {
              $rootScope.customerIncomeProfileData = response[0];
              $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);

              localStorage.removeItem("loginUserInfo");
              localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));
              console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
              serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: checkedValue[1].dccustomerid }).then(function (response) {
                console.log("res", response);
                localStorage.setItem("ALL_ID", JSON.stringify(response[0]));
                console.log("localStorage", localStorage);
              });
            } else {
            }
          });
        }
      });
    });
  };
});
