angular.module("money.Ctrl", []).controller("moneyCtrl", function ($scope, $rootScope, $state, $timeout, serverDeferred, $ionicModal, $ionicPlatform, $location, $anchorScroll) {
  $("#step2loanMonth").mask("000");
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $rootScope.getbankDataMoney = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "moneyLoanFilter";
    json.totalLoan = $rootScope.newReqiust.getLoanAmount;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.salaries = $rootScope.filterSalaries;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();

      $rootScope.products = [];
      $rootScope.result = [];
      $rootScope.months = [];
      $rootScope.minPayments = [];
      //Зөвхөн Step2 -д ажлуулах
      if ($state.current.name == "money") {
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
          });

          $rootScope.maxMonth = Math.max(...$rootScope.months);
          isEmpty($rootScope.months) ? ($rootScope.maxMonth = 0) : "";
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
  $scope.checkReqiured = function (param) {
    if (param == "money-valid") {
      if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Зээл авах хугацаа  оруулна уу", "warning");
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
    } else if (param == "agreeBank") {
      if (isEmpty($rootScope.bankListFilter.Agree)) {
        $rootScope.alert("Таны мэдээллийн дагуу зээл олгох банк, ББСБ байхгүй байна. Та мэдээллээ дахин оруулна уу.", "warning");
        return false;
      } else {
        return true;
      }
    }
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
  // Регистрийн дугаар huseltiin dund oorchlogdox bolomjgu tul haaw !!!
  // $ionicPlatform.ready(function () {
  //   setTimeout(function () {
  //     var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Э", "Ю", "Я"];

  //     new MobileSelect({
  //       trigger: ".moneyRegSelector",
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
  $rootScope.$on("$ionicView.enter", function () {
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    $("#loanAmountRequest").mask("000000000");
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "money") {
      $rootScope.newReqiust = {};
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      $rootScope.filteredMonths = [];
      localStorage.setItem("firstReq", "no");
    }
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;
    if ($state.current.name == "money") {
      $timeout(function () {
        $scope.getbankDataMoney("forced");
      }, 200);
    }
    if (!isEmpty($rootScope.all_ID)) {
      if ("uniqueidentifier" in $rootScope.all_ID && !isEmpty($rootScope.all_ID.uniqueidentifier)) {
        $scope.regNum = $rootScope.all_ID.uniqueidentifier;
        $rootScope.danCustomerData.uniqueidentifier = $rootScope.all_ID.uniqueidentifier;
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
  });
  $timeout(function () {
    $rootScope.checkUserService();
  }, 1000);

  $rootScope.$on("$ionicView.loaded", function () {});
  $scope.moneyStep2 = function () {
    if ($scope.checkReqiured("money-valid")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("income");
      }
    }
  };
});
