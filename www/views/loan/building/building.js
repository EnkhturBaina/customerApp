angular.module("building.Ctrl", []).controller("buildingCtrl", function ($scope, $rootScope, serverDeferred, $ionicModal, $state, $timeout) {
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
    if (param == "building-valid") {
      if (isEmpty($rootScope.newReqiust.choose)) {
        $rootScope.alert("Орон сууцаа сонгосон эсэх", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.vendorId)) {
        $rootScope.alert("Агентын оффис сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Орон сууцны үнэ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.advancePayment)) {
        $rootScope.alert("Урьдчилгаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.collateralConditionId)) {
        $rootScope.alert("ҮХХөрөнгө барьцаалах уу", "warning");
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
  $scope.buildingStep2 = function () {
    if ($scope.checkReqiured("building-valid")) {
      $state.go("income");
    }
  };
  $rootScope.getbankDataBuilding = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "buildingLoanFilter";
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
    if ($state.current.name == "building") {
      $rootScope.newReqiust = {};
    }
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;

    if ($state.current.name == "building") {
      $timeout(function () {
        $scope.getbankDataBuilding("forced");
      }, 200);
    }
  });

  $rootScope.$on("$ionicView.loaded", function () {
    $rootScope.hideFooter = true;
    $scope.selectedSupplierCategory = [];
    $scope.supplierHaveCategory.map((item) => {
      if (item.categoryid === "1578891191298") {
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
    $rootScope.buildingAgent = selectedCategory;
  });
});
