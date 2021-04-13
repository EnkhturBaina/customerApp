var expandCollapseApp = angular.module("request_list.Ctrl", ["ngAnimate"]);
expandCollapseApp.controller("requestListCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicLoading, $timeout, $ionicPlatform, $ionicHistory) {
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
          $timeout(function () {
            for (i = 0; i < $scope.requetData.length - 1; i++) {
              $scope.growDiv(i);
            }
            $ionicLoading.hide();
          }, 100);
        }
      });
    } else {
      $scope.isEmptyReq = true;
      $ionicLoading.hide();
    }
    $timeout(function () {
      $ionicLoading.hide();
    }, 2000);
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
  $scope.growDiv = function (id) {
    var grow = document.getElementById("grow" + id);
    if (grow.clientHeight) {
      grow.style.height = 0;
    } else {
      var wrapper = document.querySelector(".measuringWrapper" + id);
      grow.style.height = wrapper.clientHeight + "px";
    }
  };
  // $ionicPlatform.registerBackButtonAction(function (e) {
  //   console.log("AAAA 1 ");
  //   console.log("$ionicHistory.viewHistory().backView.stateName", $ionicHistory.viewHistory().backView.stateName);
  //   console.log("$ionicHistory.viewHistory().backView.stateName");
  //   e.preventDefault();
  //   if ($ionicHistory.viewHistory().backView.stateName == "loan_success") {
  //     console.log("BBBB 2 ");
  //     $state.go("home");
  //   } else {
  //     $ionicHistory.viewHistory().backView.go();
  //   }
  // }, 101);
});
