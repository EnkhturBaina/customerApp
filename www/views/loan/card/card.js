angular.module("card.Ctrl", []).controller("cardCtrl", function ($scope, $rootScope) {
  $rootScope.$on("$ionicView.enter", function () {
    console.log("step2");
  });

  $rootScope.$on("$ionicView.loaded", function () {
    console.log("step1");
  });
});
