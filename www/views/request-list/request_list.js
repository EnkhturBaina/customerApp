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
  $scope.isEmpty = true;
  // ====== Get Data  ========
  $rootScope.getRequetData = function () {
    var all_ID = JSON.parse(localStorage.getItem("ALL_ID"));
    $scope.requetData = [];
    if (!isEmpty($rootScope.loginUserInfo)) {
      $rootScope.ShowLoader();

      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597814217394980", crmCustomerId: all_ID.crmcustomerid }).then(function (response) {
        $ionicLoading.hide();
        if (isEmpty(response)) {
          $scope.isEmpty = true;
        } else {
          $scope.isEmpty = false;
          $scope.requetData = response;
          // console.log("$scope.requetData", $scope.requetData);
          // angular.forEach(response, function(item) {
          //     if (isObject(item)) {
          //         $scope.requetData.push(item);
          //     }
          // });
        }
      });
    } else {
      $scope.isEmpty = true;
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
