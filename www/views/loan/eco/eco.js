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

  $scope.checkReqiured = function (param) {
    if (param == "eco-valid") {
      if (isEmpty($rootScope.newReqiust.typeId)) {
        $rootScope.alert("Барааны төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.shopId)) {
        $rootScope.alert("Бараа авах дэлгүүр сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.subVendorId)) {
        $rootScope.alert("Дэлгүүрийн салбар сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.itemPrice)) {
        $rootScope.alert("Барааны үнэ оруулна уу", "warning");
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
        $state.go("autoleasing-2");
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
    });
    // console.log("json", json);
  };
  $rootScope.$on("$ionicView.enter", function () {
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "eco") {
      $rootScope.newReqiust = {};
      localStorage.setItem("firstReq", "no");
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

  //Бараны нийлүүлэгч хамаарч Барааны төрөл -г lookup -д дахин сэт хийх
  $scope.changeSupCategoryEco = function (supppp) {
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
