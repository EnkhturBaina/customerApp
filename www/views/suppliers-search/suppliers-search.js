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
    $("#supplier-search-ion-list").toggleClass("active-ion-list");
  };

  //Ангилалаар шүүх
  $scope.selectCat = function (id, name) {
    var index = $scope.selectedCats.findIndex((x) => x.id == id);
    if (index === -1) {
      $scope.selectedCats.push({ id, name });
    }
    $rootScope.getFilteredSuppliers($scope.selectedCats);
  };

  //Сонгогдсон ангилал хасах
  $scope.clearSelectedSubCat = function (id) {
    for (var i = 0; i < $scope.selectedCats.length; i++) {
      if ($scope.selectedCats[i].id === id) {
        $scope.selectedCats.splice(i, 1);
      }
    }
    //Онцлох, Шинэ -г сонгогдсоноос хасах
    if (id == 1 || id == 2) {
      $rootScope.isNewOrSpecial = "";
    }
    $rootScope.getFilteredSuppliers($scope.selectedCats);
  };

  $scope.$on("$ionicView.loaded", function () {
    $rootScope.ShowLoader();

    //Онцлох, Шинэ ээс бүгдийг харах дарсан эсэх
    if ($rootScope.isNewOrSpecial == "Онцлох") {
      $scope.selectedCats.push({ id: 1, name: "Онцлох" });
    } else if ($rootScope.isNewOrSpecial == "Шинэ") {
      $scope.selectedCats.push({ id: 2, name: "Шинэ" });
    }
  });

  $scope.$on("$ionicView.enter", function () {
    $rootScope.HideLoader();
  });

  //Шүүлтээр data татах func
  $rootScope.getFilteredSuppliers = function (cats) {
    $rootScope.ShowLoader();

    //supplier result
    $rootScope.suppliersList = [];

    var responseArr = [];

    //сонгогдсон ангилал эсвэл шинэ, онцлогоос хамаарч гарч шүүх
    var filters = {};

    if (!isEmpty(cats)) {
      //сонгогдсон бүх ангилалаар давтах
      for (i = 0; i < cats.length; i++) {
        //Онцлохтой хамт ангилалаар шүүх
        if ($rootScope.isNewOrSpecial == "Онцлох") {
          if (cats.length == 1 && cats[0].id == 1) {
            filters = { systemmetagroupid: "16285670132431", isspecial: 1 };
          } else {
            filters = { systemmetagroupid: "16285670132431", categoryid: cats[i].id, isspecial: 1 };
          }
          //Шинэтэй хамт ангилалаар шүүх
        } else if ($rootScope.isNewOrSpecial == "Шинэ") {
          if (cats.length == 1 && cats[i].id == 2) {
            filters = { systemmetagroupid: "16285670132431" };
          } else {
            filters = { systemmetagroupid: "16285670132431", categoryid: cats[i].id };
          }
          //Дан ангилалаар шүүх
        } else {
          filters = { systemmetagroupid: "16285670132431", categoryid: cats[i].id };
        }
        //data татах
        serverDeferred.request("PL_MDVIEW_004", filters).then(function (response) {
          if (!isEmpty(response)) {
            responseArr = response.filter((value) => Object.keys(value).length !== 0);
          } else {
            responseArr = [];
          }
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
      //Ямар ч шүүлтгүй үед ажиллах

      if ($rootScope.isNewOrSpecial == "Онцлох") {
        filters = { systemmetagroupid: "1628559883022530", isspecial: 1 };
      } else {
        filters = { systemmetagroupid: "1628559883022530" };
      }

      serverDeferred.request("PL_MDVIEW_004", filters).then(function (response) {
        $rootScope.suppliersList = response.filter((value) => Object.keys(value).length !== 0);
      });
      $rootScope.HideLoader();
    }
  };
  $rootScope.getFilteredSuppliers();
});
