angular.module("trend.Ctrl", []).controller("trendCtrl", function ($ionicSlideBoxDelegate, $scope, $rootScope, serverDeferred, $state) {
  $scope.getTrendCarData = function (id) {
    $rootScope.trendCarData = [];

    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727" }).then(function (response) {
      angular.forEach(response, function (item) {
        if (!isEmpty(item)) {
          $rootScope.trendCarData.push(item);
        }
      });
      // $rootScope.carDatas = response;
    });
  };
  $scope.getTrendCarData();
  $scope.selectCar = function (item) {
    $rootScope.selectedCarData = item;
    $state.go("car-info");
  };
});
