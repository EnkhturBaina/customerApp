angular.module("carlist.Ctrl", []).controller("carlistCtrl", function ($rootScope, $state, serverDeferred, $scope) {
  $scope.grid = function () {
    if ($("#changeLayout").hasClass("layout-list")) {
      $("#changeLayout").removeClass("layout-list");
      $("#changeLayout").addClass("layout-grid");

      $("#buttonIcon").removeClass("custom-grid");
      $("#buttonIcon").addClass("custom-col");
      document.getElementById("glayout").setAttribute("class", "grid");
      var arr = Array.prototype.slice.call(document.getElementsByClassName("car-detail-column"));
      arr.forEach((element) => {
        element.setAttribute("class", "car-detail-grid");
      });
    } else {
      $("#changeLayout").removeClass("layout-grid");
      $("#changeLayout").addClass("layout-list");

      $("#buttonIcon").removeClass("custom-col");
      $("#buttonIcon").addClass("custom-grid");
      document.getElementById("glayout").setAttribute("class", "");
      var arr = Array.prototype.slice.call(document.getElementsByClassName("car-detail-grid"));
      arr.forEach((element) => {
        element.setAttribute("class", "car-detail-column");
      });
    }
  };
  $scope.getCarDatas = function () {
    $scope.carListData = [];
    var criteria = {};
    if (!isEmpty($rootScope.searchData)) {
      criteria = $rootScope.searchData;
    }
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597646717653727", factoryid: $rootScope.selectedCategoryId, criteria: criteria }).then(function (response) {
      $scope.carListData = response;
      $rootScope.searchData = "";
      // console.log("response", response);
    });
  };
  $scope.getCarDatas();
  $scope.selectCar = function (item) {
    $rootScope.selectedCarData = item;
    $state.go("car-info");
  };
});
