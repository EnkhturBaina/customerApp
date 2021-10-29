angular.module("salary.Ctrl", []).controller("salaryCtrl", function ($scope, $rootScope, $state, $timeout, serverDeferred, $ionicModal) {
  $("#step2loanMonth").mask("000");
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $rootScope.getbankDataSalary = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "salaryLoanFilter";
    json.totalLoan = $rootScope.newReqiust.getLoanAmount;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
    });
    // console.log("json", json);
  };

  $rootScope.$on("$ionicView.enter", function () {
    if ($state.current.name == "salary") {
      $rootScope.newReqiust = {};
    }
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;
    if ($state.current.name == "salary") {
      $timeout(function () {
        $scope.getbankDataSalary("forced");
      }, 200);
    }
  });

  $rootScope.$on("$ionicView.loaded", function () {
    $rootScope.hideFooter = true;
  });
  $scope.checkReqiured = function (param) {
    if (param == "salary-valid") {
      if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаа оруулна уу", "warning");
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
    }
  };
  $scope.salaryStep2 = function () {
    if ($scope.checkReqiured("salary-valid")) {
      console.log("$rootScope.newReqiust", $rootScope.newReqiust);
      $state.go("autoleasing-4");
    }
  };
});
