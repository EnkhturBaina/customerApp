var settings = angular.module("settings.Ctrl", ["ngAnimate"]);
settings.controller("settingsCtrl", function ($scope, serverDeferred, $rootScope, $state) {
  $scope.data = {};
  $scope.data.pickupAfter = 12;
  $scope.toggleLanguage = function () {
    $("#side-menu-toggle-on").toggleClass("active");
    $("#side-menu-toggle-off").toggleClass("active");
  };
});
