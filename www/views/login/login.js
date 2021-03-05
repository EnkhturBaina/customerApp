angular.module("login.Ctrl", []).controller("loginCtrl", function($scope, $http, $ionicModal, $stateParams, $rootScope, $cordovaNetwork, $ionicLoading, $state, serverDeferred) {
    $scope.inputType = "password";
    $scope.user = {};

    $rootScope.hideFooter = true;

    $(".login-mobile").mask("00000000");
    $scope.hideShowPassword = function() {
        if ($scope.inputType == "password") {
            $("#eye-icon").removeClass("ion-eye");
            $("#eye-icon").addClass("ion-eye-disabled");
            $scope.inputType = "text";
        } else {
            $scope.inputType = "password";
            $("#eye-icon").removeClass("ion-eye-disabled");
            $("#eye-icon").addClass("ion-eye");
        }
    };

    $scope.cC = function(connectClient, callBack) {
        var json = reqiuestJsonFormat($rootScope.serverUrl, {
            request: { zip: "1", command: "connectClient", sessionId: "" + connectClient.sessionid + "", parameters: { userKeyId: "" + connectClient.userkeys[0].id + "" } },
        });
        $http({
            method: "POST",
            url: $rootScope.serverUrl,
            data: json,
            headers: { "content-type": "application/json;charset=UTF-8" },
            transformResponse: [
                function(data) {
                    var response = decomZ(data).replace(/\t/g, "");
                    return JSON.parse(response);
                },
            ],
        }).then(
            function(response) {
                $ionicLoading.hide();
                if ($scope.loginChecks.fingerprint != "1") {
                    $state.go("appHome", { beforePath: "login" });
                    $rootScope.runFunctionDataView = true;
                } else {
                    $scope.FingerPrintRegister();
                }
            },
            function(response) {
                if (typeof callBack === "function") {
                    $ionicLoading.hide();
                    callBack("Серверт холбогдоход алдаа гарлаа");
                }
            }
        );
    };
    $scope.ls = function(username, password, callBack) {
        var json = {
            request: {
                command: "login",
                zip: "1",
                isCustomer: "1",
                parameters: { username: username.toString(), password: password, isCustomer: "1" },
            },
        };
        $http({
            method: "POST",
            url: $rootScope.serverUrl,
            data: json,
            headers: { "content-type": "application/json;charset=UTF-8" },
            transformResponse: [
                function(data) {
                    var response = decomZ(data).replace(/\t/g, "");
                    return JSON.parse(response);
                },
            ],
        }).then(
            function(response) {
                if (!isEmpty(response.data) && response.data.response.status === "success") {
                    localStorage.setItem("loginUserData", JSON.stringify(response.data.response.result));
                    $rootScope.loginUserInfo = response.data.response.result;
                    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602495774664319", crmCustomerId: $rootScope.loginUserInfo.id }).then(function(response) {
                        if (!isEmpty(response) && !isEmpty(response[0])) {
                            $rootScope.loginUserInfo = mergeJsonObjs(response[0], $rootScope.loginUserInfo);
                            // console.log($rootScope.loginUserInfo);

                            if ($rootScope.loginUserInfo) {
                                $rootScope.sidebarUserName = $rootScope.loginUserInfo.lastname.substr(0, 1) + ". " + $rootScope.loginUserInfo.firstname;
                            }
                            $rootScope.hideFooter = false;
                        }
                    });
                    if (isEmpty($stateParams.path)) {
                        $state.go("profile");
                    } else {
                        $state.go($stateParams.path);
                    }
                } else {
                    $ionicLoading.hide();
                    $rootScope.alert("Нэр, Нууц үг буруу байна");
                }
            },
            function(response) {
                $ionicLoading.hide();
                if (typeof callBack === "function") {
                    callBack("Серверт холбогдоход алдаа гарлаа");
                }
            }
        );
    };
    $scope.user.username = "";
    $scope.Login = function(a, b) {
        // $rootScope.ShowLoader();
        if (isEmpty(a)) {
            $ionicLoading.hide();
            $rootScope.alert("Нэвтрэх нэрээ оруулна уу");
        } else if (isEmpty(b)) {
            $ionicLoading.hide();
            $rootScope.alert("Нууц үгээ оруулна уу");
        } else {
            var network = $cordovaNetwork.isOnline();
            if (network) {
                $scope.ls(a, b);
            }
        }
        $rootScope.hideFooter = true;
    };
    $scope.gotoDanLogin = function() {
        serverDeferred.carCalculation({ "type": "auth", "redirect_uri": "customerapp" }, 'https://services.digitalcredit.mn/api/v1/c').then(function(response) {
            $rootScope.stringHtmlsLink = response.result.data.url;
            console.log($rootScope.stringHtmlsLink);
            $ionicModal.fromTemplateUrl('views/login/bind.html', {
                    scope: $scope,
                    animation: 'fade-in-scale'
                })
                .then(function(modalend) {
                    $rootScope.htmlBindModel = modalend;
                    $rootScope.htmlBindModel.show();
                    $ionicLoading.hide();
                });
        });
    }
    $scope.loginKey = function(value, username, password) {
        if (value.keyCode === 13) {
            $scope.Login(username, password);
            document.getElementById("userpassLogin").blur();
        }
    };
    $scope.backShowFooter = function() {
        $rootScope.hideFooter = true;
    };
    $scope.closeHtmlBindBluetooth = function() {
        $scope.htmlBindModel.remove();
    }
});