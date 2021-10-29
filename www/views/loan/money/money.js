angular.module("money.Ctrl", []).controller("moneyCtrl", function ($scope, $rootScope, $state, $ionicModal) {
  $("#step2loanMonth").mask("000");
  $rootScope.$on("$ionicView.enter", function () {
    $rootScope.newReqiust.serviceAgreementId = 1554263832132;
  });

  $rootScope.$on("$ionicView.loaded", function () {});
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.checkReqiured = function (param) {
    if (param == "money-valid") {
      if (isEmpty($rootScope.newReqiust.getLoanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Хугацаа оруулна уу", "warning");
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
  $scope.moneyStep2 = function () {
    if ($scope.checkReqiured("money-valid")) {
      $state.go("income");
    }
  };
});
