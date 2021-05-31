angular.module("business_loan.Ctrl", []).controller("business_loanCtrl", function ($ionicSlideBoxDelegate, $scope) {
  $scope.saveBusinessLoan = function () {
    localStorage.setItem("requestType", "business");
    $rootScope.bankproductDtlNumber = $rootScope.bankproductDtl.find((o) => o.categoryid === "16082024283622");
  };
});
