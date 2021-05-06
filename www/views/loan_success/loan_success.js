app.controller("loan_successCtrl", function ($ionicPlatform, $scope, $rootScope) {
  //   $ionicPlatform.registerBackButtonAction(function (e) {
  //     console.log("AAAA");
  //     e.preventDefault();
  //     if ($state.current.name == "loan_success") {
  //       console.log("BBBB");
  //       $state.go("requestList");
  //     } else {
  //       $ionicHistory.viewHistory().backView.go();
  //     }
  //   }, 101);
  $scope.goBankMenu = function () {
    console.log("ASD");
    $rootScope.hideFooter = false;
  };
});
