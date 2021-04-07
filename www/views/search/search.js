var app = angular.module("search.Ctrl", []);

app.controller("searchCtrl", function ($scope, $rootScope, serverDeferred, $state) {
  $scope.endDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  $scope.endDay = 5;
  $scope.searchVal = {};
  $scope.searchValPrice = { min: "", max: "" };
  $scope.getCategory = function () {
    if (isEmpty($rootScope.categoryData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597644413889185" }).then(function (response) {
        $rootScope.categoryData = response;
      });
    }
  };
  $scope.getCarDatas = function (id) {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1544591440537", factoryid: id }).then(function (response) {
      $scope.carData = response;
    });
  };
  $scope.getCategory();
  $scope.searchBtn = function () {
    var criteria = {};
    angular.forEach(Object.keys($scope.searchVal), function (key) {
      if (!isEmpty($scope.searchVal[key])) {
        criteria[key] = { 0: { operator: "=", operand: "" + $scope.searchVal[key] + "" } };
      }
    });
    criteria.price = { 0: { operator: ">", operand: "" + $scope.searchValPrice.max + "" }, 1: { operator: "<", operand: "" + $scope.searchValPrice.min + "" } };
    $rootScope.searchData = criteria;
    $state.go("carlist");
  };
  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
});
