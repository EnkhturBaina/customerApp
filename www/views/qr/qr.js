angular.module("qr.Ctrl", []).controller("qrCtrl", function ($ionicPlatform, $ionicHistory, $rootScope, serverDeferred, $scope) {
  $rootScope.selectedCarData = {};
  $scope.showQRreader = function () {
    var optionCodeCam = {
      preferFrontCamera: false, // iOS and Android
      showFlipCameraButton: true, // iOS and Android
      showTorchButton: true, // iOS and Android
      torchOn: false, // Android, launch with the torch switched on (if available)
      prompt: "Код уншуулна уу", // Android
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      orientation: "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
      disableAnimations: true, // iOS
      disableSuccessBeep: false, // iOS and Android
    };
    cordova.plugins.barcodeScanner.scan(
      function (result) {
        if (!isEmpty(result.text)) {
          $scope.getCarDatasId(result.text);
        }
      },
      function (error) {
        $rootScope.selectedCarData = {};
        $ionicHistory.goBack();
      },
      optionCodeCam
    );
  };
  $scope.getCarDatasId = function (itemCode) {
    $scope.carData = [];
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", itemCode: itemCode }).then(function (response) {
      if (!isEmpty(response) && !isEmpty(response[0])) {
        $rootScope.selectedCarData = response[0];
      } else {
        $rootScope.alert("Код буруу байна", "warning");
        $scope.showQRreader();
      }
    });
  };
  $scope.addtoBasket = function () {
    var value = searchJsonValue($rootScope.basketData, "id", $rootScope.selectedCarData.id);
    if (isEmpty(value)) {
      $rootScope.basketData.push($rootScope.selectedCarData);
      localStorage.setItem("basketData", JSON.stringify($rootScope.basketData));
    }
    $state.go("basket");
  };
  $ionicPlatform.ready(function () {
    $scope.showQRreader();
  });
});
