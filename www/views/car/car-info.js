angular.module("carinfo.Ctrl", []).controller("carinfoCtrl", function($rootScope, $state, serverDeferred, $window, $scope, $ionicSlideBoxDelegate) {
    $scope.Math = $window.Math;
    $rootScope.newReqiust = {};

    // auto Leasing
    $scope.goAutoleasing = function() {
        var next = $rootScope.checkLoginUserDatas("car-info", "autoleasing-2");
        $state.go(next.now, { path: next.nextpath });
    };
    // get car Data
    $scope.getCarinfo = function() {
        $scope.isCarDetail = true;
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597654926672135", id: $rootScope.selectedCarData.id }).then(function(response) {
            if (!isEmpty(response[0]) && isObject(response[0])) {
                if (response[0].text10 == "101") {
                    $scope.isCarDetail = false;
                } else if (response[0].text10 == "102") {
                    $scope.isCarDetail = true;
                }
                var images = [];
                if (response[0].itempic) images.push(response[0].itempic);
                if (response[0].itempic2) images.push(response[0].itempic2);
                if (response[0].itempic3) images.push(response[0].itempic3);
                if (response[0].itempic4) images.push(response[0].itempic4);
                if (response[0].itempic5) images.push(response[0].itempic5);
                if (response[0].itempic6) images.push(response[0].itempic6);
                if (response[0].itempic7) images.push(response[0].itempic7);
                if (response[0].itempic8) images.push(response[0].itempic8);
                response[0].images = images;
                $scope.carData = response[0];
                $rootScope.selectedCarData = response[0];
                $scope.getbankData();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
                $ionicSlideBoxDelegate.update();
            }
        });
    };
    $scope.getbankData = function() {
        $rootScope.bankList = [];
        if (!isEmpty($rootScope.selectedCarData) && !isEmpty($rootScope.selectedCarData.itemcode)) {
            // { type: "car", operation: "calculation", productCode: $rootScope.selectedCarData.itemcode }
            serverDeferred.carCalculation({ "type": "autoLeasingFilter", "code": $rootScope.selectedCarData.itemcode }).then(function(response) {
                $rootScope.bankList = response.result.data;
                // console.log(response);
            });
        }
    };
    $scope.getCarinfo();

    // basket
    $scope.addtoBasket = function() {
        var value = searchJsonValue($rootScope.basketData, "id", $rootScope.selectedCarData.id);
        $rootScope.selectedCarData.itemquantity = "1";
        if (isEmpty(value)) {
            $rootScope.basketData.push($rootScope.selectedCarData);
            localStorage.setItem("basketData", JSON.stringify($rootScope.basketData));
            $rootScope.alert("Сагсанд нэмэгдлээ");
        } else {
            $rootScope.alert("Сагслагдсан байна");
        }
    };

    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
    $rootScope.newReqiust = {};

    $scope.payOn = function() {
        document.getElementById("paypopup").style.display = "block";
    };
    $scope.payOff = function() {
        document.getElementById("paypopup").style.display = "none";
    };
    $scope.tabhide = function() {
        document.getElementById("home-tab").style.display = "none";
    };
    $scope.collapse = function() {
        document.getElementById("addition-info").style.display = "block";
        document.getElementById("collapse-btn").style.display = "none";
        document.getElementById("uncollapse-btn").style.display = "block";
    };
    $scope.uncollapse = function() {
        document.getElementById("addition-info").style.display = "none";
        document.getElementById("collapse-btn").style.display = "block";
        document.getElementById("uncollapse-btn").style.display = "none";
    };
    $scope.shouldHide = function() {
        switch ($state.current.name) {
            case "statename1":
                return true;
            case "statename2":
                return true;
            default:
                return false;
        }
    };
});