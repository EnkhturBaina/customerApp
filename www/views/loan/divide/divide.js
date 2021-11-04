angular.module("divide.Ctrl", []).controller("divideCtrl", function ($scope, $rootScope, $state, $ionicModal) {
  $("#step2loanMonth").mask("000");
  $rootScope.$on("$ionicView.enter", function () {
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;
  });

  $rootScope.$on("$ionicView.loaded", function () {
    $rootScope.fidteredSupplierConditions = [];
    $rootScope.supplierConditionsNotMap.map((xxx) => {
      if (xxx.isactive == 1 && xxx.id !== "1626850331608") {
        $rootScope.fidteredSupplierConditions.push(xxx);
      }
    });
  });
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.changeDivideCondition = function (cond) {
    cond != "" ? ($scope.monthCond = "Хүүгүй") : "";
  };
  $scope.checkReqiured = function (param) {
    if (param == "divide-valid") {
      if (isEmpty($rootScope.newReqiust.vendorId)) {
        $rootScope.alert("Бараа нийлүүлэгч сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.locationId)) {
        $rootScope.alert("Нөхцөл сонгоно уу", "warning");
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
  $scope.divideStep2 = function () {
    if ($scope.checkReqiured("divide-valid")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("income");
      }
    }
  };
});
