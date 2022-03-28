angular.module("property_collateral.Ctrl", []).controller("property_collateralCtrl", function ($scope, $timeout, $state, $ionicModal, $rootScope, serverDeferred, $ionicPlatform, $location, $anchorScroll) {
  $("#propertyStep2loanMonth").mask("000");

  $scope.saveProperty = function () {
    if ($scope.propertyCheckReqiured("step1")) {
      $state.go("autoleasing-2");
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

  $scope.savePropertyRequestData = function () {
    if ($scope.propertyCheckReqiured("step2")) {
      if ($scope.propertyCheckReqiured("agreeBank")) {
        $state.go("income");
      }
    }
  };

  $scope.propertyCheckReqiured = function (param) {
    if (param == "step1") {
      if (isEmpty($rootScope.newReqiust.collateralType)) {
        $rootScope.alert("Барьцаалах хөрөнгийн төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.proveIncome)) {
        $rootScope.alert("Орлого нотлох эсэх сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "step2") {
      if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
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
        $rootScope.alert("Та үйлчилгээний нөхцлийг зөвшөөрөөгүй байна", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "agreeBank") {
      if (isEmpty($rootScope.bankListFilter.Agree)) {
        $rootScope.alert("Таны мэдээллийн дагуу зээл олгох банк, ББСБ байхгүй байна. Та мэдээллээ дахин оруулна уу.", "warning");
        return false;
      } else {
        return true;
      }
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
  $scope.getbankDataProperty = function (a) {
    if (a != "forced") $rootScope.ShowLoader();
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};
    json.type = "estateLoanFilter";
    json.totalLoan = $rootScope.newReqiust.getLoanAmount;
    json.isPerson = "1";
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.currency = 16074201974821;
    json.salaries = $rootScope.filterSalaries;
    json.isConfirm = $rootScope.newReqiust.proveIncome;
    json.collType = $rootScope.newReqiust.collateralType;

    if (!isEmpty($rootScope.loginUserInfo)) {
      json.isMortgage = $rootScope.loginUserInfo.mikmortgagecondition;
      json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
      json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
      json.monthPay = $rootScope.loginUserInfo.monthlypayment;
    }
    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();

      $rootScope.products = [];
      $rootScope.result = [];
      $rootScope.months = [];
      $rootScope.minPayments = [];
      //Зөвхөн Step2 -д ажлуулах
      if ($state.current.name == "property_collateral2") {
        $rootScope.bankListFilter.Agree.map((el) => {
          $rootScope.products.push(el.products);
        });
        $rootScope.products.map((obj) => {
          $rootScope.result = [].concat($rootScope.result, obj);
        });

        $rootScope.result.map((a) => {
          $rootScope.months.push(parseInt(a.max_loan_month_id));
          a.min_payment != 0 ? $rootScope.minPayments.push(a.min_payment) : "";
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
            $rootScope.months.push(parseInt(a.max_loan_month_id));
            a.min_payment != 0 ? $rootScope.minPayments.push(a.min_payment) : $rootScope.minPayments.push(0);
          });

          $rootScope.maxMonth = Math.max(...$rootScope.months);
          $rootScope.minPayment = Math.min(...$rootScope.minPayments);
        }

        if (isEmpty($rootScope.minMonth)) {
          $rootScope.minMonth = 0;
        }
        if (isEmpty($rootScope.filteredMonths)) {
          Object.keys($rootScope.monthsArr).forEach(function (key) {
            if ($rootScope.requestType == key) {
              $rootScope.monthsArr[key].map((el) => {
                if ($rootScope.months.includes(el) && el >= $rootScope.minMonth && el <= $rootScope.maxMonth) {
                  $rootScope.filteredMonths.push(el);
                }
              });
            }
          });
        }
      }
    });
    console.log("json", json);
  };
  //element ruu scroll hiih
  $scope.slideTo = function (location) {
    var newHash = location;
    if ($location.hash() !== newHash) {
      $location.hash(location);
    } else {
      $anchorScroll();
    }
  };
  // $ionicPlatform.ready(function () {
  //   setTimeout(function () {
  //     var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Э", "Ю", "Я"];

  //     new MobileSelect({
  //       trigger: ".estateRegSelector",
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
  // $scope.overlayKeyOn = function () {
  //   $scope.modal.show();
  // };
  // $scope.saveRegNums = function () {
  //   if (keyInput.value.length < 8) {
  //     $rootScope.alert("Регистер ээ бүрэн оруулна уу.", "warning");
  //   } else {
  //     $scope.modal.hide();
  //     $rootScope.danCustomerData.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();
  //   }
  // };
  // $scope.cancelRegNums = function () {
  //   if (!isEmpty($rootScope.loginUserInfo) && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
  //     $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
  //     $("#regCharA").text($rootScope.loginUserInfo.uniqueidentifier.substr(0, 1));
  //     $("#regCharB").text($rootScope.loginUserInfo.uniqueidentifier.substr(1, 1));
  //     $("#regNums").val($rootScope.loginUserInfo.uniqueidentifier.substr(2, 8));
  //   }
  //   $scope.modal.hide();
  // };
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
      backdropClickToClose: false,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.$on("$ionicView.enter", function () {
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "estate") {
      $rootScope.filteredMonths = [];
      $rootScope.newReqiust = {};
    }
    if ($state.current.name == "property_collateral") {
      $timeout(function () {
        $scope.getbankDataProperty("forced");
      }, 200);
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      if (!isEmpty($rootScope.loginUserInfo)) {
        if ("uniqueidentifier" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
          $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
          $rootScope.danCustomerData.uniqueidentifier = $rootScope.loginUserInfo.uniqueidentifier;
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
    }
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;
  });
  $timeout(function () {
    $rootScope.checkUserService($rootScope.danIncomeData.incometypeid, $rootScope.danIncomeData.proofofincome);
  }, 1000);
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
});
