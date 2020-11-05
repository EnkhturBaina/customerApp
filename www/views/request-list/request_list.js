var expandCollapseApp = angular.module("request_list.Ctrl", ["ngAnimate"]);
expandCollapseApp.controller("requestListCtrl", function($scope, serverDeferred, $rootScope, $state, $ionicLoading) {
    $scope.growDiv = function(id) {
        var grow = document.getElementById("grow" + id);
        if (grow.clientHeight) {
            grow.style.height = 0;
        } else {
            var wrapper = document.querySelector(".measuringWrapper" + id);
            grow.style.height = wrapper.clientHeight + "px";
        }
    };
    $scope.isEmpty = true;
    // ====== Get Data  ========
    $scope.getRequetData = function() {
        $scope.requetData = [];
        // console.log("$rootScope.loginUserInfo.id", $rootScope.loginUserInfo);
        if ($rootScope.loginUserInfo !== undefined) {
            $rootScope.ShowLoader();
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597814217394980", crmCustomerId: $rootScope.loginUserInfo.id }).then(function(response) {
                $ionicLoading.hide()
                if (isEmpty(response)) {
                    $scope.isEmpty = true;
                } else {
                    $scope.isEmpty = false;
                    $scope.requetData = response;
                    // angular.forEach(response, function(item) {
                    //     if (isObject(item)) {
                    //         $scope.requetData.push(item);
                    //     }
                    // });
                }
            });
        } else {
            $scope.isEmpty = true;
        }
    };
    $scope.getRequetData();
    $scope.selectbank = function(bank) {
        // console.log(bank);
        $rootScope.selectbank = bank;
        $state.go("request_detail");
    };
});