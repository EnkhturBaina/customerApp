angular.module("property_collateral.Ctrl", []).controller("property_collateralCtrl", function ($scope, $ionicPlatform, $ionicPopup) {
  // When button is clicked, the popup will be shown...
  $scope.pCSourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlayCollateralLoan").style.display = "block";
  };
  $scope.pCSourceSelectOff = function () {
    document.getElementById("overlayCollateralLoan").style.display = "none";
  };
  $scope.takePhoto = function (type) {
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if ($scope.selectedImagePath == 1) {
          $scope.collateralLoanData.picture1 = "jpg♠" + imageData;
        } else if ($scope.selectedImagePath == 2) {
          $scope.collateralLoanData.picture2 = "jpg♠" + imageData;
        }
        $scope.$apply();
      },
      function onFail(message) {},
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
      }
    );
  };
});
