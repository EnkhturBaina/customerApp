app.controller("loan_successCtrl", function ($scope, $ionicPlatform, $rootScope, serverDeferred) {
  console.log("ASDASD");
  // console.log("$rootScope.selectedBankSuccess", $rootScope.selectedBankSuccess);
  $rootScope.sentBank = [];

  angular.forEach($rootScope.selectedBankSuccess, function (item) {
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1603958798356", id: item.trgRecordId }).then(function (response) {
      // console.log("response", response);
      $rootScope.sentBank.push(response[0]);
    });
  });
});
