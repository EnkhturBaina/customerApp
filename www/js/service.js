angular
  .module("ServerServices", [])
  .factory("serverDeferred", function ($http, $q, $log, $sce, $ionicLoading, $rootScope, $cordovaNetwork) {
    return {
      request: function (jsoncommand, parameters) {
        var deferred = $q.defer();
        if ($cordovaNetwork.isOnline()) {
          $rootScope.OfflineLogin = false;
          var json = reqiuestJsonFormat($rootScope.serverUrl, { request: { sessionId: $rootScope.sessionid, zip: "0", command: jsoncommand, parameters: parameters } });
          $http({
            method: "POST",
            url: $rootScope.serverUrl,
            data: json,
            headers: $rootScope.serverHeader,
            timeout: 10000,
            transformResponse: [
              function (data) {
                var dd = data;
                try {
                  dd = decomZ(data);
                } catch (ex) {
                  dd = data;
                }
                return JSON.parse(dd.replace(/\t/g, ""));
              },
            ],
          }).then(
            function (response) {
              var serverData = [];
              if (response.data.response !== undefined) {
                if (response.data.response.status === "error") {
                  $ionicLoading.hide();
                  $rootScope.alert(response.data.response.text);
                  deferred.resolve(null);
                } else {
                  angular.forEach(response.data.response.result, function (element) {
                    serverData.push(element);
                  });
                  deferred.resolve(serverData);
                }
              }
            },
            function (response) {
              deferred.reject("Серверт холбогдоход алдаа гарлаа");
            }
          );
        } else if ($rootScope.isOfflineMode()) {
          $rootScope.OfflineLogin = true;
          $rootScope.offlineCommand(jsoncommand, parameters).then(function (commandValue) {
            if (isEmpty(commandValue)) {
              deferred.reject("Оффлайн горимд ажиллах боломжгүй");
            } else if (commandValue == "write") {
              $rootScope.writefileNewOfflineFile("newOfflineProcess.txt", JSON.stringify({ command: jsoncommand, parameters: parameters }));
              deferred.resolve({ status: "success", result: "" });
            } else {
              deferred.resolve(commandValue);
            }
          });
        } else {
          deferred.reject("Интернэт холболтоо шалгана уу");
        }
        return deferred.promise;
      },
      requestFull: function (jsoncommand, parameters) {
        var deferred = $q.defer();
        if ($cordovaNetwork.isOnline()) {
          $rootScope.OfflineLogin = false;
          var json = reqiuestJsonFormat($rootScope.serverUrl, { request: { sessionId: $rootScope.sessionid, zip: "0", command: jsoncommand, parameters: parameters } });
          $http({
            method: "POST",
            url: $rootScope.serverUrl,
            data: json,
            timeout: 10000,
            headers: $rootScope.serverHeader,
            transformResponse: [
              function (data) {
                var dd = data;
                try {
                  dd = decomZ(data);
                } catch (ex) {
                  dd = data;
                }
                var response = dd.replace(/\t/g, "");
                return JSON.parse(response);
              },
            ],
          }).then(
            function (response) {
              var serverData = [];
              if (response.data.response != undefined) {
                if (response.data.response.status == "error") {
                  $ionicLoading.hide();
                  $rootScope.alert(response.data.response.text);
                  deferred.resolve(null);
                } else {
                  angular.forEach(response.data.response, function (element) {
                    serverData.push(element);
                  });
                  deferred.resolve(serverData);
                }
              }
            },
            function (response) {
              deferred.reject("Серверт холбогдоход алдаа гарлаа");
            }
          );
        } else if ($rootScope.isOfflineMode()) {
          $rootScope.OfflineLogin = true;
          $rootScope.offlineCommand(jsoncommand, parameters).then(function (commandValue) {
            if (isEmpty(commandValue)) {
              deferred.reject("Оффлайн горимд ажиллах боломжгүй");
            } else if (commandValue == "write") {
              $rootScope.writefileNewOfflineFile("newOfflineProcess.txt", JSON.stringify({ command: jsoncommand, parameters: parameters }));
              deferred.resolve({ status: "success", result: "" });
            } else {
              deferred.resolve(commandValue);
            }
          });
        } else {
          deferred.reject("Интернэт холболтоо шалгана уу");
        }
        return deferred.promise;
      },
      carCalculation: function (json, newurl) {
        var deferred = $q.defer();
        $rootScope.OfflineLogin = false;
        var url = "https://services.digitalcredit.mn/api/services/v1";
        if (newurl) {
          url = newurl;
        }
        $http({
          method: "POST",
          url: url,
          // url: "http://digitalcredit.mn/service/v2",
          data: json,
          timeout: 10000,
          headers: $rootScope.serverHeader,
          transformResponse: [
            function (data) {
              var dd = data;
              try {
                dd = decomZ(data);
              } catch (ex) {
                dd = data;
              }
              var response = dd.replace(/\t/g, "");
              return JSON.parse(response);
            },
          ],
        }).then(
          function (response) {
            var serverData = [];
            if (!isEmpty(response.data)) {
              deferred.resolve({ status: "success", result: response.data });
            }
          },
          function (response) {
            deferred.reject("Серверт холбогдоход алдаа гарлаа");
          }
        );
        return deferred.promise;
      },
    };
  })
  .factory("serverjQuery", function ($http, $q, $log, $sce, $ionicLoading, $rootScope, $cordovaNetwork) {
    return {
      request: function (jsoncommand, parameters) {
        var serverData = [];
        var json = { request: { sessionId: $rootScope.sessionid, ismobile: "1", command: jsoncommand, parameters: parameters } };
        $.ajax({
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          type: "post",
          url: $rootScope.serverUrl,
          data: JSON.stringify(json),
          dataType: "text",
          async: false,
          success: function (data) {
            var dd = data;
            try {
              dd = decomZ(data);
            } catch (ex) {
              dd = data;
            }
            response = JSON.parse(dd.replace(/\t/g, ""));
            if (response.response != undefined) {
              if (response.response.status == "error") {
                $ionicLoading.hide();
                $rootScope.alert(response.response.text);
                serverData = null;
              } else {
                angular.forEach(response.response.result, function (element) {
                  serverData.push(element);
                });
              }
            }
          },
          error: function (data) {
            serverData = null;
            $rootScope.alert("Серверт холбогдоход алдаа гарлаа");
          },
        });
        return serverData;
      },
      requestFull: function (jsoncommand, parameters) {
        if ($cordovaNetwork.isOnline()) {
          var serverData = [];
          var json = { request: { sessionId: $rootScope.sessionid, ismobile: "1", command: jsoncommand, parameters: parameters } };
          $.ajax({
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            type: "post",
            url: $rootScope.serverUrl,
            data: JSON.stringify(json),
            dataType: "text",
            async: false,
            success: function (data) {
              var dd = data;
              try {
                dd = decomZ(data);
              } catch (ex) {
                dd = data;
              }
              response = JSON.parse(dd.replace(/\t/g, ""));
              if (response.response != undefined) {
                if (response.response.status == "error") {
                  $ionicLoading.hide();
                  $rootScope.alert(response.response.text);
                  serverData = null;
                } else {
                  angular.forEach(response.response, function (element) {
                    serverData.push(element);
                  });
                }
              }
            },
            error: function (data) {
              serverData = null;
              $rootScope.alert("Серверт холбогдоход алдаа гарлаа");
            },
          });
        } else if ($rootScope.isOfflineMode()) {
          $rootScope.OfflineLogin = true;
          $rootScope.offlineCommand(jsoncommand, parameters).then(function (commandValue) {
            if (isEmpty(commandValue)) {
              serverData = "Оффлайн горимд ажиллах боломжгүй";
            } else if (commandValue == "write") {
              $rootScope.writefileNewOfflineFile("newOfflineProcess.txt", JSON.stringify({ command: jsoncommand, parameters: parameters }));
              serverData = { status: "success", result: "" };
            } else {
              serverData = commandValue;
            }
          });
        } else {
          serverData = null;
          $rootScope.alert("Интернэт холболтоо шалгана уу");
        }
        return serverData;
      },
    };
  });
