angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $rootScope, $state) {
  $scope.locationData = [];
  $scope.getLookUpDataCarColl = function () {
    if (isEmpty($rootScope.locationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613011719373208" }).then(function (response) {
        $rootScope.locationData = response;
      });
    }
  };
  $scope.getLookUpDataCarColl();
  console.log("$rootScope.isDanLoginAutoColl", $rootScope.isDanLoginAutoColl);
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
  //автомашин барьцаалсан зээлийн хүсэлтийн мэдээлэл
  $rootScope.carCollateralRequestData = {};

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

  localStorage.setItem("requestType", "autoColl");

  $scope.getbankDataCarColl = function () {
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};
    $rootScope.newReqiust = {};
    json.type = "carLoanFilter";
    json.totalLoan = $rootScope.carCollateralRequestData.loanAmount;
    json.isPerson = 1;
    json.location = $rootScope.carCollateralRequestData.locationId;
    json.month = $rootScope.carCollateralRequestData.loanMonth;
    json.currency = 16074201974821;
    json.isMortgage = $rootScope.loginUserInfo.mikmortgagecondition;
    json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
    json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
    json.monthPay = $rootScope.loginUserInfo.monthlypayment;
    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
    });
    console.log("json", json);
  };

  // localStorage.removeItem("carColl");
  $scope.saveCarCol = function () {
    if (isEmpty($rootScope.newCarReq)) {
      $rootScope.newCarReq = {};
    }
    if ($scope.carCollCheckReqiured("step1")) {
      localStorage.setItem("requestType", "autoColl");

      // localStorage.removeItem("carColl");
      localStorage.setItem("carColl", JSON.stringify($rootScope.newCarReq));
      console.log("carColl DATAAAAAAAAA", JSON.parse(localStorage.getItem("carColl")));
      var next = $rootScope.checkLoginUserDatas("car_coll", "car_coll2");
      $state.go(next.now, { path: next.nextpath });

      console.log("local", localStorage);
      // $state.go("car_coll2");
    }
  };
  if ($state.current.name == "car_coll2") {
    $scope.getbankDataCarColl();
  }
  $scope.backFromCarCollStep1 = function () {
    $state.go("home");
  };
  $scope.backFromCarCollStep2 = function () {
    $state.go("car_coll");
  };

  $scope.saveCarCollRequestData = function () {
    console.log("saveCarCollRequestData", $rootScope.carCollateralRequestData);
    if ($scope.carCollCheckReqiured("step2")) {
      $state.go("autoleasing-3");
    }
  };

  $scope.carCollCheckReqiured = function (param) {
    if (param == "step1") {
      if (isEmpty($rootScope.newCarReq.carCategoryId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Автомашины төрөлөө сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newCarReq.brandId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Үйлдвэрээ сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newCarReq.markId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Загвараа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newCarReq.manufacturedYearId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Үйлдвэрлэсэн он оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newCarReq.cameYearId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Орж ирсэн он оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newCarReq.itemPic)) {
        $rootScope.alert("Автомашины зураг оруулна уу", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "step2") {
      if (isEmpty($rootScope.carCollateralRequestData.loanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carCollateralRequestData.loanMonth)) {
        $rootScope.alert("Зээл авах хугацаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carCollateralRequestData.locationId)) {
        $rootScope.alert("Зээл авах байршил сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carCollateralRequestData.serviceAgreementId) || $rootScope.carCollateralRequestData.serviceAgreementId == 1554263832151) {
        $rootScope.alert("Та үйлчилгээний нөхцлийг зөвшөөрөөгүй байна", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    }
    console.log("$root.newCarReq.itemPic", $root.newCarReq.itemPic);
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
  $("#carDoorCount").mask("0");
  $("#engineCapacity").mask("000000000");

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
