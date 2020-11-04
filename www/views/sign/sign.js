angular.module("sign.Ctrl", []).controller("signCtrl", function ($stateParams,$state, $scope) {
  // $scope.a = document.getElementById("ion-footer-tabs").attributes[3].value;
  // if ($scope.a == "footerIsHidden") {
  //   document.getElementById("ion-footer-tabs").style.display = "none";
  // } else {
  //   document.getElementById("ion-footer-tabs").style.display = "flex";
  // }
  // console.log($scope.a);
  $scope.loginbtn = function () {
    $state.go('login', { path: $stateParams.path })
  }
});
