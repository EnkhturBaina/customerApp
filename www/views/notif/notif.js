angular.module("notif.Ctrl", []).controller("notifCtrl", function ($scope, $state, $stateParams, $rootScope, serverDeferred, $ionicTabsDelegate) {
  $scope.goFor = function () {
    var selected = $ionicTabsDelegate.$getByHandle("notifTabsHandler").selectedIndex();
    if (selected != -1) {
      $ionicTabsDelegate.$getByHandle("notifTabsHandler").select(selected + 1);
    }
  };

  $scope.goBack = function () {
    var selected = $ionicTabsDelegate.$getByHandle("notifTabsHandler").selectedIndex();
    if (selected != -1 && selected != 0) {
      $ionicTabsDelegate.$getByHandle("notifTabsHandler").select(selected - 1);
    }
  };
});
