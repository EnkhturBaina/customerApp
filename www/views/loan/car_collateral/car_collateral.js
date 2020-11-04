angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $rootScope, $state) {
  $scope.getMonthData = function () {
    if (isEmpty($rootScope.categoryData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1579493650561919" }).then(function (response) {
        $rootScope.monthData = response;
      });
    }
  };
  $scope.getMonthData();

  // $scope.newCarReq = {};
  $scope.companyData = [];
  $scope.carmerkData = [];
  $scope.defualtbank = [];
  $scope.getCompanyData = function () {
    if (isEmpty($scope.companyData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1544591440502" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.companyData = datas;
      });
    }
    if (isEmpty($scope.defualtbank)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1603952821400122" }).then(function (datas) {
        delete datas.aggregatecolumns;
        angular.forEach(datas, function (item) {
          item.BANK_LOGO = item.banklogo;
          item.DEPARTMENT_NAME = item.departmentname;
        });
        $rootScope.bankList = { correct: datas };
        $scope.defualtbank = datas;
      });
    }
  };
  $scope.getCarmarkData = function (val) {
    var json = { systemmetagroupid: "1544591440537", factoryid: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.carmerkData = datas;
    });
  };
  $scope.getCompanyData();

  $scope.saveCarCol = function () {
    if (isEmpty($rootScope.newCarReq)) {
      $rootScope.newCarReq = {};
    }
    if ($scope.checkReqiured("step1")) {
      serverDeferred.requestFull("dcApp_car_collateral_loan_001", $rootScope.newCarReq).then(function (response) {
        console.log(response);
        $rootScope.selectedCarData = response[1];
        $state.go("car_coll2");
      });
    }
  };
  $scope.checkReqiured = function (param) {
    if (param == "step1") {
      if (isEmpty($rootScope.newCarReq.nationalNumber) || isEmpty($rootScope.newCarReq.factoryId) || isEmpty($rootScope.newCarReq.modelId) || isEmpty($rootScope.newCarReq.productYear) || isEmpty($rootScope.newCarReq.entryYear) || isEmpty($rootScope.newCarReq.mile)) {
        $rootScope.alert("Мэдээллээ бүрэн оруулна уу");
        return false;
      } else if ($rootScope.newCarReq.nationalNumber.length < 8) {
        $rootScope.alert("Улсын дугаар дутуу");
        return false;
      } else if ($rootScope.newCarReq.productYear.length < 4) {
        $rootScope.alert("Үйлдвэрлэсэн он буруу");
        return false;
      } else if ($rootScope.newCarReq.entryYear.length < 4) {
        $rootScope.alert("Орж ирсэн он буруу");
        return false;
      } else {
        return true;
      }
    }
  };

  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
  $("#odo").mask("000000000");
  $("#nationalNumber").mask("0000 AAA", {
    translation: {
      A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
    },
  });
  $scope.callModal = function () {
    if (document.getElementById("nationalNumberModal")) {
      document.getElementById("nationalNumberModal").style.display = "block";
    }
  };
  $scope.closeModal = function () {
    if (document.getElementById("nationalNumberModal")) {
      document.getElementById("nationalNumberModal").style.display = "none";
    }
  };
  $("#nationalNumberModal").find("input[type=number]").mask("0");
  $("#nationalNumberModal")
    .find("input[type=text]")
    .mask("A", {
      translation: {
        A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
      },
    });
  $scope.sourceSelectOn = function (path) {
    document.getElementById("overlay").style.display = "block";
    $scope.takePhoto = function () {
      navigator.camera.getPicture(
        function (imageData) {
          if (isEmpty($rootScope.newCarReq)) {
            $rootScope.newCarReq = {};
          }
          $rootScope.newCarReq[path] = "jpeg♠" + imageData;
          $scope.sourceSelectOff();
        },
        function onFail(message) {
          alert("Failed because: " + message);
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          correctOrientation: true,
        }
      );
    };
    $scope.getPhoto = function () {
      navigator.camera.getPicture(
        function (imageData) {
          if (isEmpty($rootScope.newCarReq)) {
            $rootScope.newCarReq = {};
          }
          $rootScope.newCarReq[path] = "jpeg♠" + imageData;
          $scope.sourceSelectOff();
        },
        function onFail(message) {
          alert("Failed because: " + message);
        },
        {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        }
      );
    };
  };
  $scope.sourceSelectOff = function () {
    document.getElementById("overlay").style.display = "none";
  };
});
