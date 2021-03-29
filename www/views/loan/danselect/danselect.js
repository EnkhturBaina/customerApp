angular.module("danselect.Ctrl", []).controller("danselectCtrl", function ($scope, $ionicModal, $timeout) {
  $ionicModal
    .fromTemplateUrl("templates/autoColl.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (autoCollModal) {
      $scope.autoCollModal = autoCollModal;
    });
  // modals.show();
  $timeout(function () {
    $scope.autoCollModal.show();
  }, 0);
});
