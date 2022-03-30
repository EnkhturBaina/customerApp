angular.module("building.Ctrl", []).controller("buildingCtrl", function ($scope, $rootScope, serverDeferred, $ionicModal, $state, $timeout) {
  $("#buildingPrice").mask("00000000000");
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
        $rootScope.alert("Орон сууцаа сонгосон эсэх сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.buildingLoanType)) {
        $rootScope.alert("Орон сууцны зээлийн төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.buildingPrice)) {
        $rootScope.alert("Орон сууцны үнэ оруулна уу", "warning");
        return false;
      }
      //  else if (isEmpty($rootScope.newReqiust.buildingSurvey) && $rootScope.isAgent) {
      //   $rootScope.alert("Судалгаанд о/с-ны мэдээлэл өгөх боломжтой сонгоно уу", "warning");
      //   return false;
      // }
      // else if (isEmpty($rootScope.newReqiust.buildingSurvey) && !$rootScope.isAgent) {
      //   $rootScope.alert("Орон сууцны агенттай холбохыг зөвшөөрөх үү?", "warning");
      //   return false;
      // }
      else if (isEmpty($rootScope.newReqiust.serviceAgreementId) || $rootScope.newReqiust.serviceAgreementId == 1554263832151) {
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
        $rootScope.isIncomeConfirm = true;
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
    json.buildingType = $rootScope.newReqiust.buildingLoanType;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
    });
    console.log("json", json);
  };
  $rootScope.$on("$ionicView.enter", function () {
    $rootScope.isAgent = false;
    $rootScope.msgShow = false;
    var firstReq = localStorage.getItem("firstReq");
    var local = localStorage.getItem("requestType");
    $rootScope.isCarColl = false;
    //нүүрнээс зээлийн хүсэлтрүү орох үед талбаруудыг шинэчлэх
    if (firstReq === "yes" && local == "building") {
      $rootScope.newReqiust = {};
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      $rootScope.filteredMonths = [];
      localStorage.setItem("firstReq", "no");
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
  $scope.buildingChosen = function (id) {
    if (id === "1554263832132") {
      $rootScope.isAgent = true;
      if ($rootScope.newReqiust.buildingSurvey === "1554263832151") {
        $rootScope.msgShow = true;
      } else {
        $rootScope.msgShow = false;
      }
    } else {
      $rootScope.isAgent = false;
      $rootScope.msgShow = false;
    }
  };
  $scope.surveyChosen = function (id) {
    if (id === "1554263832151") {
      $rootScope.msgShow = true;
    } else {
      $rootScope.msgShow = false;
    }
  };
});
