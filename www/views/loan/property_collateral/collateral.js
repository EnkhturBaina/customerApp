angular.module("property_collateral.Ctrl", []).controller("property_collateralCtrl", function ($scope, $ionicPlatform, $ionicPopup) {
  // When button is clicked, the popup will be shown...
  $scope.showPopup = function () {
    $scope.data = {};

    // Custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type = "text" ng-model = "data.model">',
      title: "Title",
      subTitle: "Subtitle",
      scope: $scope,

      buttons: [
        { text: "Cancel" },
        {
          text: "<b>Save</b>",
          type: "button-positive",
          onTap: function (e) {
            if (!$scope.data.model) {
              //don't allow the user to close unless he enters model...
              e.preventDefault();
            } else {
              return $scope.data.model;
            }
          },
        },
      ],
    });

    myPopup.then(function (res) {
      // console.log("Tapped!", res);
    });
  };
});
