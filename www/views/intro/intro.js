angular.module("intro.Ctrl", []).controller("introCtrl", function ($ionicSlideBoxDelegate, $scope, $rootScope, serverDeferred) {
  // ========= Slide =============
  $scope.activeSlideIndex = 0;
  $scope.showBanner = true;
  $scope.slideChanged = function (index) {
    $scope.activeSlideIndex = index;
  };
  $scope.nextSlideChanged = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.endSlideChanged = function (index) {
    $ionicSlideBoxDelegate.slide(Object.keys($rootScope.bannerData).length - 1, 0);
  };
  $scope.getBanner = function () {
    serverDeferred.requestFull("PL_MDVIEW_004", { systemmetagroupid: "1597631698242718" }).then(function (data) {
      // console.log(data);
      delete data[1].aggregatecolumns;
      delete data[1].paging;
      if (!isEmpty(data[1])) {
        $rootScope.bannerData = data[1];
        $ionicSlideBoxDelegate.update();
      }
    });
  };

  $scope.$on("$ionicView.loaded", function (ev, info) {
    $rootScope.ShowLoader();
    $scope.getBanner();
    $rootScope.hideFooter = true;
  });

  $scope.$on("$ionicView.enter", function () {
    $rootScope.HideLoader();
  });
});
