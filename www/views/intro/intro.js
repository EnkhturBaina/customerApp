angular.module("intro.Ctrl", []).controller("introCtrl", function ($ionicSlideBoxDelegate, $scope, $rootScope) {
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
  $rootScope.hideFooter = true;
});
