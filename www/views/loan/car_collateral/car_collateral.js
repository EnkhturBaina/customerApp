angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $ionicLoading, $rootScope, $state) {
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
          item.PARENT_ID = item.id;
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
      $rootScope.ShowLoader();
      serverDeferred.requestFull("dcApp_car_collateral_loan_001", $rootScope.newCarReq).then(function (response) {
        // console.log(response);
        $rootScope.selectedCarData = response[1];
        $state.go("car_coll2");
        $ionicLoading.hide();
      });
    }
  };
  $scope.checkReqiured = function (param) {
    //console.log("$rootScope.newCarReq", $rootScope.newCarReq);
    if (param == "step1") {
      if (isEmpty($rootScope.newCarReq.nationalNumber) || isEmpty($rootScope.newCarReq.factoryId) || isEmpty($rootScope.newCarReq.modelId) || isEmpty($rootScope.newCarReq.productYear) || isEmpty($rootScope.newCarReq.entryYear) || isEmpty($rootScope.newCarReq.mile)) {
        $rootScope.alert("Мэдээллээ бүрэн оруулна уу");
        return false;
      } else if ($rootScope.newCarReq.nationalNumber.length < 7) {
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
  $scope.takePhoto = function (type) {
    var srcType = Camera.PictureSourceType.CAMERA;
    if (type == "1") {
      srcType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
    navigator.camera.getPicture(
      function (imageData) {
        if (isEmpty($rootScope.newCarReq)) {
          $rootScope.newCarReq = {};
        }
        $rootScope.newCarReq[$scope.selectedImagePath] = "jpeg♠" + imageData;
        if (!$scope.$$phase) {
          $scope.$apply();
        }
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
  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
  $("#odo").mask("000000000");
  // $("#nationalNumber").mask("0000 AAA", {
  //   translation: {
  //     A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
  //   },
  // });
  // $("#nationalNumberModal").find("input[type=number]").mask("0");
  $("#nationalNumberModal")
    .find("input[type=text]")
    .mask("A", {
      translation: {
        A: { pattern: /^[А-ЯӨҮа-яөү\-\s]+$/ },
      },
    });
  $scope.sourceSelectOn = function (path) {
    $scope.selectedImagePath = path;
    document.getElementById("overlay").style.display = "block";
  };
  $scope.sourceSelectOff = function () {
    document.getElementById("overlay").style.display = "none";
  };
  var charA = ["А", "Б", "Г", "Д", "З", "Н", "О", "Ө", "С", "Т", "Х", "У", "Ц", "Ч"];
  var chars = ["А", "Б", "В", "Г", "Д", "Е", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "Х", "У", "Ү", "Ц", "Ч", "Э", "Я"];
  var nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  new MobileSelect({
    trigger: ".nationalNumberPicker",
    wheels: [{ data: nums }, { data: nums }, { data: nums }, { data: nums }, { data: charA }, { data: chars }, { data: chars }],
    position: [0, 0],
    ensureBtnText: "Болсон",
    maskOpacity: 0.5,
    cancelBtnText: "Хаах",
    transitionEnd: function (indexArr, data) {
      //scrolldood duusahad ajillah func
    },
    callback: function (indexArr, data) {
      var a = data.join("");
      $scope.setNumber(a);
      $rootScope.newCarReq.nationalNumber = a;
    },
  });

  $scope.setNumber = function (data) {
    //ulsiin dugaariin input ruu songoson ulsiin dugaariig set hiih func
    $(function () {
      $("#nationalNumber").val(data).trigger("input");
    });
  };
});
