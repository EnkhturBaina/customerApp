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
      } else if (isEmpty($rootScope.newReqiust.buildingLoanType)) {
        $rootScope.alert("Орон сууцны зээлийн төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.buildingPrice)) {
        $rootScope.alert("Орон сууцны үнэ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.buildingSurvey)) {
        $rootScope.alert("Судалгаанд о/с-ны мэдээлэл өгөх боломжтой сонгоно уу", "warning");
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
  $scope.buildingStep2 = function () {
    if ($scope.checkReqiured("building-valid")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("autoleasing-2");
      }
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
    // json.totalLoan = $rootScope.newReqiust.buildingPrice;
    json.location = $rootScope.newReqiust.locationId;
    json.month = $rootScope.newReqiust.loanMonth;
    json.salaries = $rootScope.filterSalaries;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
    });
    console.log("json", json);
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
  });
});
