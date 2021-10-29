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
    }
  };
  $scope.ecoStep2 = function () {
    if ($scope.checkReqiured("eco-valid")) {
      $state.go("income");
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

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
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
});
