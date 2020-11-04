var expandCollapseApp = angular.module("request_list.Ctrl", ["ngAnimate"]);
expandCollapseApp.controller("requestListCtrl", function ($scope, serverDeferred, $rootScope, $state) {
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
  $scope.getRequetData = function () {
    $scope.requetData = [];
    // console.log("$rootScope.loginUserInfo.id", $rootScope.loginUserInfo);
    if ($rootScope.loginUserInfo !== undefined) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597814217394980", crmCustomerId: $rootScope.loginUserInfo.id }).then(function (response) {
        if (response == "") {
          $scope.isEmpty = true;
        } else {
          $scope.isEmpty = false;
          // console.log("response", response);
          angular.forEach(response, function (item) {
            // console.log("item", item);
            if (isObject(item)) {
              // console.log("isObject - item", item);
              $scope.requetData.push(item);
              // console.log("requetData", $scope.requetData);
            }
          });
        }
      });
    } else {
      $scope.isEmpty = true;
    }
  };
  $scope.getRequetData();
  $scope.selectbank = function (bank) {
    // console.log(bank);
    $rootScope.selectbank = bank;
    $state.go("request_detail");
  };
});
