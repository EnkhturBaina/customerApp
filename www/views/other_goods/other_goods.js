angular.module("addOtherGoods.Ctrl", []).controller("addOtherGoodsCtrl", function($rootScope, serverDeferred, $scope, $state, $ionicPopup, $ionicModal, $timeout) {
    $rootScope.otherGoods = [];
    $rootScope.newCarReq = {};
    $rootScope.otherGoodsData = [];

    $rootScope.suppliers = [];
    $rootScope.getLocalGoodsData = function() {
        $rootScope.otherGoodsData = JSON.parse(localStorage.getItem("otherGoods"));
        // console.log("otherGoodsData", otherGoodsData);
        console.log("$rootScope.otherGoodsData", $rootScope.otherGoodsData);
        serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1614232214127503" }).then(function(response) {
            $rootScope.suppliers = response;
            // console.log("allSupplierList respionse", response);
        });
    };
    $rootScope.getLocalGoodsData();
    //Нийт үнэ
    $rootScope.sumPrice = 0;
    $rootScope.calcTotalPrice = function() {
        $rootScope.sumPrice = 0;
        var local = localStorage.getItem("otherGoods");
        if (!isEmpty(local) && local != "undefined") {
            $rootScope.otherGoods = JSON.parse(localStorage.getItem("otherGoods"));
            for (var i = 0; i < $rootScope.otherGoods.length; i++) {
                $rootScope.sumPrice += parseInt($rootScope.otherGoods[i].unitPrice);
            }
        } else if ($rootScope.otherGoods.length == 0) {
            $rootScope.sumPrice = 0;
        }
    };
    $rootScope.calcTotalPrice();

    $scope.nexClivk = function() {
        if (!isEmpty($rootScope.otherGoodsData)) {
            var next = $rootScope.checkLoginUserDatas("otherGoods", "autoleasing-2");
            localStorage.setItem("requestType", "consumer");
            // $rootScope.getLoanAmountFunc();
            $state.go(next.now, { path: next.nextpath }, { reload: true });

            // $state.go("autoleasing-2");
        } else {
            $rootScope.alert("Та зээлээр авах бараагаа бүртгэнэ үү", "warning");
        }
    };

    $scope.otherGoodsDelete = function(id) {
        $ionicPopup.show({
            template: "<b>Бараа устгах уу ?</b>",
            cssClass: "confirmPopup",
            buttons: [{
                    text: "Үгүй",
                    type: "button-decline",
                },
                {
                    text: "Устгах",
                    type: "button-confirm",
                    onTap: function() {
                        for (var i = 0; i < $rootScope.otherGoodsData.length; i++) {
                            if ($rootScope.otherGoodsData[i].itemid === id) {
                                $rootScope.otherGoodsData.splice(i, 1);

                                localStorage.removeItem("otherGoods");
                                localStorage.setItem("otherGoods", JSON.stringify($rootScope.otherGoodsData));

                                $rootScope.calcTotalPrice();
                                $rootScope.getLocalGoodsData();
                            }
                        }
                    },
                },
            ],
        });
    };

    $scope.selectItemConsumer = function(item, aa) {
        console.log(item);
        console.log("aa", aa);
    };
    $scope.backFromOtherGoods = function() {
        $state.go("home");
    };
    $ionicModal
        .fromTemplateUrl("templates/consumer.html", {
            scope: $scope,
            animation: "slide-in-up",
        })
        .then(function(consumerModal) {
            $scope.consumerModal = consumerModal;
        });
    $timeout(function() {
        $scope.consumerModal.show();
    }, 0);
});