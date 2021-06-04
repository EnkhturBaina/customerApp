app.controller("loan_successCtrl", function ($scope, $rootScope, $state, $ionicPlatform) {
  $rootScope.selectedCarData = [];
  $rootScope.carData = [];

  $rootScope.bankListFilter = [];
  localStorage.removeItem("requestType");
  $rootScope.newReqiust.getLoanAmount = "";
  $rootScope.newCarReq = {};
  $rootScope.newReqiust = {};
  $rootScope.carCollateralRequestData = {};

  $rootScope.danIncomeData = {};
  $rootScope.loanAmountField = "";

  localStorage.removeItem("otherGoods");
  localStorage.removeItem("consumerRequestData");
  localStorage.removeItem("otherGoodsMaxId");

  $rootScope.propertyData = {};
  $rootScope.propertyRequestData = {};
  $rootScope.template = {};

  $scope.goBankMenu = function () {
    $state.go("requestList");
    $rootScope.hideFooter = false;
  };
});
