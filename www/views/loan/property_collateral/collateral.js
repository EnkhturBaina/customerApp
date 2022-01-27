angular.module("property_collateral.Ctrl", []).controller("property_collateralCtrl", function ($scope, $timeout, $state, $ionicModal, $rootScope, serverDeferred) {
  $("#propertyStep2loanMonth").mask("000");

  $scope.saveProperty = function () {
    if ($scope.propertyCheckReqiured("step1")) {
      $state.go("property_collateral2");
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
  $timeout(function () {
    if ($state.current.name == "property_collateral_danselect") {
      $scope.propertyModal.show();
    }
  }, 300);

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
        $rootScope.alert("Орлогоо нотлох эсэх сонгоно уу", "warning");
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
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Зээл авах байршил сонгоно уу", "warning");
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
            a.min_payment != 0 ? $rootScope.minPayments.push(a.min_payment) : $rootScope.minPayments.push(0);
          });

          $rootScope.maxMonth = Math.max(...$rootScope.months);
          $rootScope.minPayment = Math.min(...$rootScope.minPayments);
        }
      }
    });
    console.log("json", json);
  };
  $scope.$on("$ionicView.enter", function () {
    if ($state.current.name == "property_collateral") {
      $rootScope.newReqiust = {};
      console.log("1");
    }
    if ($state.current.name == "property_collateral2") {
      if ($state.current.name == "estate") {
        $timeout(function () {
          $scope.getbankDataProperty("forced");
        }, 200);
      }
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      if (!isEmpty($rootScope.loginUserInfo)) {
        if ("uniqueidentifier" in $rootScope.loginUserInfo && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
          $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
          $rootScope.danCustomerData.uniqueidentifier = $rootScope.loginUserInfo.uniqueidentifier;
          $("#regCharA").text($rootScope.loginUserInfo.uniqueidentifier.substr(0, 1));
          $("#regCharB").text($rootScope.loginUserInfo.uniqueidentifier.substr(1, 1));
          $("#regNums").val($rootScope.loginUserInfo.uniqueidentifier.substr(2, 8));
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
    $rootScope.danCustomerData = {};
  });
});
