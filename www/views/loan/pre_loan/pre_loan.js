angular.module("preLoan.Ctrl", ["ngAnimate"]).controller("pre_loanCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicHistory, $timeout, $ionicModal, $ionicLoading) {
  $("#step2loanMonth").mask("000");

  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $ionicModal
    .fromTemplateUrl("templates/preloan.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (preloanModal) {
      $scope.preloanModal = preloanModal;
    });

  $rootScope.getbankDataPreLoan = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "autoLeasingLoanFilter";
    json.totalLoan = $rootScope.newReqiust.loanAmount;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.preTotal = $rootScope.newReqiust.advancePayment;
    json.salaries = $rootScope.filterSalaries;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();

      $rootScope.products = [];
      $rootScope.result = [];
      $rootScope.months = [];
      $rootScope.minPayments = [];
      //Зөвхөн pre_loan -д ажлуулах
      if ($state.current.name == "pre_loan") {
        $rootScope.bankListFilter.Agree.map((el) => {
          $rootScope.products.push(el.products);
        });

        $rootScope.products.map((obj) => {
          $rootScope.result = [].concat($rootScope.result, obj);
        });

        $rootScope.result.map((a) => {
          $rootScope.months.push(a.max_loan_month_id);
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
            $rootScope.months.push(a.max_loan_month_id);
            a.min_payment != 0 ? $rootScope.minPayments.push(a.min_payment) : "";
          });

          $rootScope.maxMonth = Math.max(...$rootScope.months);
          $rootScope.minPayment = Math.min(...$rootScope.minPayments);
        }
        $rootScope.displayMinPayment = $rootScope.newReqiust.loanAmount * $rootScope.minPayment;
      }
    });
    console.log("json", json);
  };

  $scope.changeToolTipData = function () {
    // if ($rootScope.newReqiust.collateralConditionId == "1554263832132") {
    //   $rootScope.collTrueStep2 = true;
    // } else {
    //   $rootScope.collTrueStep2 = false;
    // }
  };
  $scope.checkReqiuredPreLoan = function (param) {
    if (param == "step2") {
      if (isEmpty($rootScope.newReqiust.loanAmount)) {
        $rootScope.newReqiust.loanAmountReq = true;
        $rootScope.alert("Хүсч буй зээлийн дүнгээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.alert("Урьдчилгаагаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаагаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Байршил сонгоно уу", "warning");
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

  $scope.goStep3PreLoan = function (param) {
    if ($scope.checkReqiuredPreLoan("step2")) {
      if ($scope.checkReqiuredPreLoan("agreeBank")) {
        $state.go("income");
      }
    }
  };

  var loanAmount;
  $scope.changeLoanAmount = function () {
    loanAmount = $rootScope.newReqiust.loanAmount;
    $rootScope.newReqiust.advancePayment = "";
  };

  $scope.calcLoanAmountPreLoan = function () {
    if (!isEmpty($rootScope.newReqiust.loanAmount)) {
      if (parseInt($rootScope.newReqiust.advancePayment) < parseInt(loanAmount)) {
        $rootScope.newReqiust.loanAmount = loanAmount - $rootScope.newReqiust.advancePayment;
      } else if (parseInt($rootScope.newReqiust.advancePayment) > parseInt(loanAmount)) {
        var tmp = $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.advancePayment = tmp.slice(0, -1);
      }
    }
  };

  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;

    $rootScope.collTrueStep2 = false;

    $rootScope.newReqiust.serviceAgreementId = 1554263832132;

    if ($state.current.name == "pre_loan") {
      $timeout(function () {
        $scope.getbankDataPreLoan("forced");
      }, 200);
      $scope.preloanModal.show();
    }
  });
});
