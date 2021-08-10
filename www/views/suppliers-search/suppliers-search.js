angular.module("suppliers-search.Ctrl", []).controller("suppliers-searchCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.search = { modelname: "" };

  $scope.isGrid = false;
  $scope.gridChange = function () {
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

    $scope.isGrid = !$scope.isGrid;
  };

  $scope.getSearchDatra = function () {
    if (isEmpty($scope.search.modelname) && $scope.isGrid) {
      $scope.gridChange();
    }
  };
  $scope.supplierDetailFromSuppliersSearch = function (id) {
    $rootScope.selectSupplierID = id;
    $state.go("supplier-detail");
  };

  $scope.toggleGroup = function (group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function (group) {
    return $scope.shownGroup === group;
  };
  $scope.showHideOption = function () {
    $("#supplier-search-ion-list").toggle(200, function () {});
  };
});
