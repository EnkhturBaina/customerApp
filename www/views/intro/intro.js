angular.module("intro.Ctrl", []).controller("introCtrl", function ($ionicSlideBoxDelegate, $scope, $rootScope, serverDeferred) {
  // ========= Slide =============
  $scope.activeSlideIndex = 0;
  $scope.showBanner = true;
  $scope.getBanner = function () {
    $scope.bannerData = JSON.parse(localStorage.getItem("banner"));
    serverDeferred.requestFull("PL_MDVIEW_004", { systemmetagroupid: "1597631698242718" }).then(function (data) {
      delete data[1].aggregatecolumns;
      delete data[1].paging;
      if (!isEmpty(data[1])) {
        $scope.bannerData = data[1];
        localStorage.setItem("banner", JSON.stringify(data[1]));
        $ionicSlideBoxDelegate.update();
      }
    });
  };
  $scope.slideChanged = function (index) {
    $scope.activeSlideIndex = index;
  };
  $scope.nextSlideChanged = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.endSlideChanged = function (index) {
    $ionicSlideBoxDelegate.slide(Object.keys($scope.bannerData).length - 1, 0);
  };
  $scope.getBanner();
  $rootScope.hideFooter = true;
});
