var expandCollapseApp = angular.module("request_list.Ctrl", ["ngAnimate"]);
expandCollapseApp.controller("requestListCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicLoading, $ionicPlatform) {
  $scope.growDiv = function (id) {
    var grow = document.getElementById("grow" + id);
    if (grow.clientHeight) {
      grow.style.height = 0;
    } else {
      var wrapper = document.querySelector(".measuringWrapper" + id);
      grow.style.height = wrapper.clientHeight + "px";
    }
  };
  $scope.isEmptyReq = true;
  // ====== Get Data  ========
  $rootScope.getRequetData = function () {
    $rootScope.ShowLoader();
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    $scope.requetData = [];
    if (!isEmpty($rootScope.loginUserInfo)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597814217394980", crmCustomerId: all_ID.crmcustomerid }).then(function (response) {
        if (isEmpty(response[0])) {
          $scope.isEmptyReq = true;
          $ionicLoading.hide();
        } else {
          $scope.isEmptyReq = false;
          $scope.requetData = response;
          $ionicLoading.hide();
        }
      });
    } else {
      $scope.isEmptyReq = true;
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $scope.getRequetData();
  });
  $scope.selectbank = function (bank) {
    // console.log(bank);
    $rootScope.selectedMapBank = bank;
    $state.go("request_detail");
  };

  //Банк цэснээс нэвтрэх
  $rootScope.isLoginFromRequestList = false;
  $scope.loginFromRequestList = function () {
    $rootScope.isLoginFromRequestList = true;
  };
});
