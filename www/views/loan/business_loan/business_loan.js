angular.module("business_loan.Ctrl", []).controller("business_loanCtrl", function ($ionicSlideBoxDelegate, $scope) {
  $scope.saveBusinessLoan = function () {
    localStorage.setItem("requestType", "business");
    console.log("local", localStorage);
  };
});
