angular.module("eco.Ctrl", []).controller("ecoCtrl", function ($scope, $rootScope, serverDeferred, $ionicModal, $state, $timeout) {
  $("#step2loanMonth").mask("000");
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  //Барааны төрөл -с хамаарч Бараны нийлүүлэгч-г lookup -д дахин сэт хийх
  $scope.changeSupSubCategory = function (supppp) {
    $scope.selectedSupplierCategory = [];

    $scope.supplierHaveSubCategory.map((item) => {
      if (item.categoryid === supppp) {
        $scope.selectedSupplierCategory.push(item.supplierid);
        return true;
      }
    });

    var selectedCategory = [];

    $rootScope.allSupplierList = $rootScope.suppcategoryStore.some((item) => {
      $scope.selectedSupplierCategory.map((item2) => {
        if (item2 == item.id) {
          selectedCategory.push(item);
          return true;
        }
      });
    });
    $rootScope.allSupplierList = selectedCategory;
    supppp != "" ? (document.getElementById("shopId").disabled = false) : (document.getElementById("shopId").disabled = true);
  };

  $scope.checkReqiured = function (param) {
    if (param == "eco-valid") {
      if (isEmpty($rootScope.newReqiust.typeId)) {
        $rootScope.alert("Барааны төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.shopId)) {
        $rootScope.alert("Барааны дэлгүүр сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.subVendorId)) {
        $rootScope.alert("Барааны салбар дэлгүүр сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.itemPrice)) {
        $rootScope.alert("Барааны үнэ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.alert("Урьдчилгаа төлбөр оруулна уу", "warning");
        return false;
      }
      //  else if (isEmpty($rootScope.newReqiust.vendorId)) {
      //   $rootScope.alert("Нийлүүлэгч сонгоно уу", "warning");
      //   return false;
      // }
      else if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.isCoBorrower)) {
        $rootScope.alert("Хамтран зээлдэгчтэй эсэх сонгоно уу", "warning");
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
  $scope.ecoStep2 = function () {
    if ($scope.checkReqiured("eco-valid")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("income");
      }
    }
  };
  $rootScope.getbankDataEco = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "ecoLoanFilter";
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
      if ($state.current.name == "eco") {
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
    // console.log("json", json);
  };
  $rootScope.$on("$ionicView.enter", function () {
    if ($state.current.name == "eco") {
      $rootScope.newReqiust = {};
    }
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;

    if ($state.current.name == "eco") {
      $timeout(function () {
        $scope.getbankDataEco("forced");
      }, 200);
    }
  });

  $rootScope.$on("$ionicView.loaded", function () {
    $rootScope.hideFooter = true;
  });
  //Урьдчилгаа дээр дарахад хоосон болгох
  $scope.removeAdvancePayment = function () {
    $rootScope.newReqiust.advancePayment = "";
  };
  $rootScope.calcLoanAmountEco = function () {
    if (parseInt($rootScope.newReqiust.advancePayment) < $rootScope.newReqiust.itemPrice) {
      $rootScope.newReqiust.getLoanAmount = $rootScope.newReqiust.itemPrice - $rootScope.newReqiust.advancePayment;
      $rootScope.newReqiust.loanAmount = $rootScope.newReqiust.getLoanAmount;
    } else if (parseInt($rootScope.newReqiust.advancePayment) > $rootScope.newReqiust.itemPrice) {
      var tmp = $rootScope.newReqiust.advancePayment;
      $rootScope.newReqiust.advancePayment = tmp.slice(0, -1);
    }
  };

  //Бараны нийлүүлэгч хамаарч Барааны төрөл -г lookup -д дахин сэт хийх
  $scope.changeSupCategory = function (supppp) {
    $rootScope.selectedSupplierCategory = [];

    $rootScope.supplierHaveCategory.map((item) => {
      if (item.categoryid === supppp) {
        $rootScope.selectedSupplierCategory.push(item.supplierid);
        return true;
      }
    });

    var selectedCategory = [];

    $rootScope.allSupplierList = $rootScope.suppcategoryStore.some((item) => {
      $rootScope.selectedSupplierCategory.map((item2) => {
        if (item2 == item.id) {
          selectedCategory.push(item);
          return true;
        }
      });
    });
    $rootScope.allSupplierList = selectedCategory;
    supppp != "" ? (document.getElementById("shopId").disabled = false) : (document.getElementById("shopId").disabled = true);
  };
  $scope.changeSubVendor = function (parentId) {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619503143703351", parentId: parentId }).then(function (response) {
      if (!isEmpty(response[0])) {
        $rootScope.subVendor = response;
      } else {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1619503143703351", id: parentId }).then(function (response) {
          $rootScope.subVendor = response;
        });
      }
    });
    parentId != "" ? (document.getElementById("subVendorId").disabled = false) : (document.getElementById("subVendorId").disabled = true);
  };
});
