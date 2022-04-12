app.controller("loan_calcCtrl", function ($scope, $rootScope, $timeout) {
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;

    $rootScope.loanAmount = 0;
    $rootScope.loanMonth = 0;
    $rootScope.loanFee = 0;
    $rootScope.rePayment = 0;

    $rootScope.loanMonths = [];
    $rootScope.loanFees = [];
    $rootScope.loan_condition.map((el) => {
      if (!isEmpty(el)) {
        $rootScope.loanMonths.push(el.maxloanmonth, el.minloanmonth);
        $rootScope.loanFees.push((el.minfee * 100).toFixed(2), (el.maxfee * 100).toFixed(2));
      }
    });
    $timeout(function () {
      $rootScope.minMonth = Math.min(...$rootScope.loanMonths);
      $rootScope.maxMonth = Math.max(...$rootScope.loanMonths);

      $rootScope.minFee = Math.min(...$rootScope.loanFees);
      $rootScope.maxFee = Math.max(...$rootScope.loanFees);
    }, 1000);
  });

  function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0) return -(pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);

    if (type === 1) pmt /= 1 + ir;

    return pmt;
  }
  $scope.calcPayment = function () {
    if ($rootScope.loanMonth !== 0 && $rootScope.loanAmount !== 0) {
      $rootScope.rePayment = Math.round(-PMT(parseFloat($rootScope.loanFee) / 100, $rootScope.loanMonth, $rootScope.loanAmount));
      if ($rootScope.rePayment == Infinity) {
        $rootScope.rePayment = 0;
      }
    } else {
      $rootScope.rePayment = 0;
    }
  };
  $scope.changeLoanMonth = function () {
    $rootScope.loanMonth = 0;
    $rootScope.loanFee = 0;
  };
});
