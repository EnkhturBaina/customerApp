var expandCollapseApp = angular.module("request_list.Ctrl", ["ngAnimate"]);
expandCollapseApp.controller("requestListCtrl", function ($scope, serverDeferred, $rootScope, $state, $ionicLoading, $timeout, $filter) {
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
          $rootScope.HideLoader();
        } else {
          $scope.isEmptyReq = false;
          $scope.requetData = response;
          $timeout(function () {
            for (i = 0; i < $scope.requetData.length - 1; i++) {
              // $scope.growDiv(i);
            }
            $rootScope.HideLoader();
          }, 100);
        }
      });
    } else {
      $scope.isEmptyReq = true;
      $rootScope.HideLoader();
    }
    $timeout(function () {
      $rootScope.HideLoader();
    }, 2000);
  };
  $scope.$on("$ionicView.enter", function () {
    $scope.getRequetData();
    $rootScope.hideFooter = false;
  });
  $scope.selectbank = function (bank, request_id, type_id) {
    $rootScope.selectedMapBank = bank;
    $rootScope.externalLink = request_id;
    $rootScope.reqTypeId_inReqList = type_id;
    $state.go("request_detail");
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
  $scope.min = function (arr) {
    return $filter("min")($filter("map")(arr, "createddate"));
  };
});
