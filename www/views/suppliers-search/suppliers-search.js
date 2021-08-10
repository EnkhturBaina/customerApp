angular.module("suppliers-search.Ctrl", []).controller("suppliers-searchCtrl", function ($timeout, $scope, $rootScope, $state, serverDeferred, $ionicPlatform, $ionicModal) {
  $rootScope.hideFooter = true;
  $scope.search = { suppliername: "" };
  $scope.isShowOption = false;

  $scope.selectedCats = [];
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
    if (isEmpty($scope.search.suppliername) && $scope.isGrid) {
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
    $scope.isShowOption = !$scope.isShowOption;
    $("#supplier-search-ion-list").toggle(200, function () {});
  };

  $scope.selectCat = function (id, name) {
    var index = $scope.selectedCats.findIndex((x) => x.id == id);
    if (index === -1) {
      $scope.selectedCats.push({ id, name });
    }
    $rootScope.getFilteredSuppliers($scope.selectedCats);
  };
  $scope.clearSelectedSubCat = function (id) {
    for (var i = 0; i < $scope.selectedCats.length; i++) {
      if ($scope.selectedCats[i].id === id) {
        $scope.selectedCats.splice(i, 1);
      }
    }
    $rootScope.getFilteredSuppliers($scope.selectedCats);
  };

  $rootScope.getFilteredSuppliers = function (cats) {
    $rootScope.ShowLoader();

    $rootScope.suppliersList = [];

    var responseArr = [];
    if (!isEmpty(cats)) {
      for (i = 0; i < cats.length; i++) {
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16285670132431", categoryid: cats[i].id }).then(function (response) {
          responseArr = response.filter((value) => Object.keys(value).length !== 0);

          if (!isEmpty(responseArr)) {
            angular.forEach(responseArr, function (item) {
              if (!isEmpty(item)) {
                $rootScope.suppliersList.push(item);

                $rootScope.HideLoader();
              } else {
                $rootScope.HideLoader();
              }
            });
          } else {
            $rootScope.HideLoader();
          }
        });
      }
    } else {
      $rootScope.suppliersList = $rootScope.dcSuppliers;
      $rootScope.HideLoader();
    }
  };
  $rootScope.getFilteredSuppliers();
});
