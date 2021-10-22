angular.module("salary.Ctrl", []).controller("salaryCtrl", function ($scope, $rootScope, $state, $timeout, serverDeferred) {
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
    console.log("json", json);
  };

  $rootScope.$on("$ionicView.enter", function () {
    $rootScope.newReqiust = {};
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
});
