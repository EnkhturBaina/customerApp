angular.module("supplier-detail.Ctrl", []).controller("supplier-detailCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.supplierName = [{ title: "supplierName" }];
  $rootScope.supplierFee = "";
  $scope.$on("$ionicView.loaded", function (ev, info) {
    $rootScope.ShowLoader();
    $rootScope.dcSuppliers.map((el) => {
      if (el.id == $rootScope.selectSupplierID) {
        $scope.selectedSupplierData = el;
        $rootScope.supplierFee = el.supplierfee;
      }
    });
    $scope.supplierName[0].title = $scope.selectedSupplierData.suppliername;
  });

  $scope.$on("$ionicView.enter", function (ev, info) {
    if (!isEmpty($scope.selectedSupplierData)) {
      $rootScope.HideLoader();
    }
  });

  $scope.sendRequestFromSupplier = function () {
    $state.go("supplier-detail2");
  };
  $rootScope.selected = "";
  //тухайн нөхцөлийн дэлгэрэнгүй
  $scope.isConditionSelected = false;
  //Хугацаа сонгох үед slider харуулах эсэх
  $scope.isSlideSelected = false;

  $scope.selectCondition = function (id) {
    $scope.isConditionSelected = true;
    $rootScope.supplierConditions.map((el) => {
      if (el.id == id) {
        $scope.selectedConditionDetail = el.text1;
        $scope.selectedConditionFee = el.text2;
        $scope.selectedConditionMonth = el.number1 + " хоног";
        //Хугацаа сонгох үед
        if (el.number2 === "1") {
          $scope.isSlideSelected = true;
          //Slide -н max range
          $scope.maxRange = el.number1;
          $rootScope.selectedMonth = el.number1 - (el.number1 - 1);
          $scope.selectedConditionMonth = 3 + " сар";
          $scope.selectedConditionFee = $rootScope.supplierFee + " %";
          $scope.selectedConditionAmount = 0;
        } else {
          $scope.selectedConditionAmount = Math.ceil($rootScope.newReqiust.loanAmount / el.number2);
          $scope.isSlideSelected = false;
        }
      }
    });
  };
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
  //slide гүйлгэх
  $scope.selectMonth = function () {
    $scope.selectedConditionMonth = $rootScope.selectedMonth + " сар";
    //1 udaagiin tololt bodoh
    $scope.selectedConditionAmount = Math.round(-PMT(parseFloat($rootScope.supplierFee) / 100, $rootScope.selectedMonth, $rootScope.newReqiust.loanAmount));
  };
  var loanAmount;
  $scope.changeLoanAmountSupplier = function () {
    loanAmount = $rootScope.newReqiust.loanAmount;
    $rootScope.newReqiust.advancePayment = "";
  };
  $scope.calcLoanAmountSupplier = function () {
    if (!isEmpty($rootScope.newReqiust.loanAmount)) {
      if (parseInt($rootScope.newReqiust.advancePayment) < parseInt(loanAmount)) {
        $rootScope.newReqiust.loanAmount = loanAmount - $rootScope.newReqiust.advancePayment;
      } else if (parseInt($rootScope.newReqiust.advancePayment) > parseInt(loanAmount)) {
        var tmp = $rootScope.newReqiust.advancePayment;
        $rootScope.newReqiust.advancePayment = tmp.slice(0, -1);
      }
    }
    $scope.selectedConditionAmount = Math.round(-PMT(parseFloat($rootScope.supplierFee) / 100, $rootScope.selectedMonth, $rootScope.newReqiust.loanAmount));
  };

  $scope.step2 = function () {
    if ($scope.checkReqiuredSupplierDtl("step2")) {
    }
  };
  $scope.checkReqiuredSupplierDtl = function (param) {
    if (param == "step2") {
      if (isEmpty($rootScope.newReqiust.loanAmount)) {
        $rootScope.alert("Зээлийн хэмжээгээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment) && $scope.isSlideSelected) {
        $rootScope.alert("Урьдчилгаагаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.selected)) {
        $rootScope.alert("Зээлийн нөхцөлөө сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
    }
  };
});
