angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $ionicLoading, $rootScope, $state) {
  // $scope.goCarCollLeasing = function () {
  //   var next = $rootScope.checkLoginUserDatas("home", "car_coll");
  //   $state.go(next.now, { path: next.nextpath });
  // };

  // $scope.goCarCollLeasing();

  // console.log("$rootScope.loginUserInfo", $rootScope.loginUserInfo);
  $rootScope.monthData = [];
  $scope.locationData = [];
  $scope.getMonthData = function () {
    if (isEmpty($rootScope.monthData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1579493650561919" }).then(function (response) {
        $rootScope.monthData = response;
      });
    }
    if (isEmpty($rootScope.locationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
        $rootScope.locationData = response;
      });
    }
  };
  $scope.getMonthData();

  //Төрөл
  $scope.carCategory = [];
  //Үйлдвэр
  $scope.factoryData = [];
  //Загвар
  $scope.modelData = [];
  //Хөдөлгүүрийн төрөл
  $scope.engineTypeData = [];
  //Хурдны хайрцаг
  $scope.transmissionData = [];
  //Хөтлөгч
  $scope.driveTypeData = [];
  //Жолооны хүрд
  $scope.steeringWheelData = [];
  //Машины өнгө
  $scope.carColorData = [];

  $scope.defualtbank = [];

  $scope.getCarCollateralLookupData = function () {
    if (isEmpty($scope.carCategory)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363794516634" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.carCategory = datas;
      });
    }
    if (isEmpty($scope.engineTypeData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363836067418" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.engineTypeData = datas;
      });
    }
    if (isEmpty($scope.transmissionData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363933194927" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.transmissionData = datas;
      });
    }
    if (isEmpty($scope.driveTypeData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363974428880" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.driveTypeData = datas;
      });
    }
    if (isEmpty($scope.steeringWheelData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364026973240" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.steeringWheelData = datas;
      });
    }
    if (isEmpty($scope.carColorData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364064613427" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.carColorData = datas;
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
  $scope.getCarFactoryCategory = function (val) {
    var json = { systemmetagroupid: "1613364305380357", number1: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.factoryData = datas;
    });
    val != "" ? (document.getElementById("brandSelect").disabled = false) : (document.getElementById("brandSelect").disabled = true);
  };
  $scope.getCarModelData = function (val) {
    var json = { systemmetagroupid: "1613364325545258", parentId: val };
    serverDeferred.request("PL_MDVIEW_004", json).then(function (datas) {
      delete datas.aggregatecolumns;
      $scope.modelData = datas;
    });
    val != "" ? (document.getElementById("modelSelect").disabled = false) : (document.getElementById("modelSelect").disabled = true);
  };
  $scope.getCarCollateralLookupData();

  $scope.saveCarCol = function () {
    if (isEmpty($rootScope.newCarReq)) {
      $rootScope.newCarReq = {};
    }
    if ($scope.carCollCheckReqiured("step1")) {
      // $rootScope.ShowLoader();
      // serverDeferred.requestFull("dcApp_car_collateral_loan_001", $rootScope.newCarReq).then(function (response) {
      //   $rootScope.selectedCarData = response[1];
      //   $state.go("car_coll2");
      //   $ionicLoading.hide();
      // });
      localStorage.removeItem("carColl");
      console.log("CAR COLL", localStorage.getItem("carColl"));
      localStorage.setItem("carColl", JSON.stringify($rootScope.newCarReq));

      console.log("CAR COLL", localStorage.getItem("carColl"));
      console.log("local", localStorage);
      $state.go("car_coll2");
    }
  };

  $scope.carCollCheckReqiured = function (param) {
    if (param == "step1") {
      // if (isEmpty($rootScope.newCarReq.carCategoryId) || isEmpty($rootScope.newCarReq.brandId) || isEmpty($rootScope.newCarReq.markId) || isEmpty($rootScope.newCarReq.mile) || isEmpty($rootScope.newCarReq.engineId) || isEmpty($rootScope.newCarReq.engineCapacity) || isEmpty($rootScope.newCarReq.transmissionId) || isEmpty($rootScope.newCarReq.driveTypeId) || isEmpty($rootScope.newCarReq.steeringWheelId) || isEmpty($rootScope.newCarReq.carDoorCount) || isEmpty($rootScope.newCarReq.manufacturedYearId) || isEmpty($rootScope.newCarReq.cameYearId) || isEmpty($rootScope.newCarReq.nationalNumber) || isEmpty($rootScope.newCarReq.carColorId)) {
      //   $rootScope.alert("Мэдээллээ бүрэн оруулна уу");
      //   return false;
      // } else {
      //   return true;
      // }
      return true;
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
