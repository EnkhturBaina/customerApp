angular.module("preLoan.Ctrl", ["ngAnimate"]).controller("pre_loanCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicHistory, $timeout, $ionicModal, $ionicLoading) {
  $("#step2loanMonth").mask("00");
  $("#loanAmountRequest").mask("000000000000");
  $("#sendRequestAdvancePayment").mask("000000000000");

  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });

  $rootScope.getbankDataPreLoan = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = 1;
    json.currency = 16074201974821;
    json.isMortgage = 1554263832151;

    //банк шүүлт
    json.type = "autoLeasingLoanFilter";
    json.totalLoan = $rootScope.newReqiust.loanAmount;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.preTotal = $rootScope.newReqiust.advancePayment;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
    });
    // console.log("json", json);
  };

  $scope.checkReqiuredPreLoan = function (param) {
    if (param == "step2") {
      if (isEmpty($rootScope.newReqiust.carCategoryId)) {
        $rootScope.alert("Автомашины ангилалаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.carChosen)) {
        $rootScope.alert("Автомашины сонгосон эсэх?", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanAmount)) {
        $rootScope.newReqiust.loanAmountReq = true;
        $rootScope.alert("Хүсч буй зээлийн дүнгээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.collateralConditionId)) {
        $rootScope.alert("ҮХХөрөнгө барьцаалах эсэхээ сонгоно уу", "warning");
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
      } else if (isEmpty($rootScope.newReqiust.isCoBorrower)) {
        $rootScope.alert("Хамтран зээлдэгчтэй эсэхээ сонгоно уу", "warning");
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
    localStorage.setItem("requestType", "preLoan");
    $rootScope.hideFooter = true;

    $rootScope.newReqiust.serviceAgreementId = 1554263832132;

    if ($state.current.name == "pre_loan") {
      $timeout(function () {
        $scope.getbankDataPreLoan("forced");
      }, 200);
    }
  });
});
