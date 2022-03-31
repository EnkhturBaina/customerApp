angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $rootScope, $state, $ionicModal, $ionicPlatform, $timeout) {
  //Загвар
  $scope.modelData = [];
  //Хөдөлгүүрийн төрөл
  $scope.engineTypeData = [];
  //Хөдөлгүүрийн багтаамж
  $scope.engineCapData = [];
  //Хурдны хайрцаг
  $scope.transmissionData = [];
  //Хөтлөгч
  $scope.driveTypeData = [];
  //Жолооны хүрд
  $scope.steeringWheelData = [];
  //Машины өнгө
  $scope.carColorData = [];

  $rootScope.getbankDataCarColl = function (a) {
    if (a != "forced") $rootScope.ShowLoader();

    $rootScope.requestType = localStorage.getItem("requestType");
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};

    json.isPerson = "1";
    json.isCollateral = "";

    //банк шүүлт
    json.type = "carLoanFilter";
    json.totalLoan = 0;
    json.location = "";
    json.month = 0;
    json.salaries = "";
    json.isConfirm = $rootScope.newReqiust.proveIncome;
    json.carCategory = $rootScope.carDetailData.carCategoryId;

    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;
      $rootScope.HideLoader();
    });
    console.log("json", json);
  };
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
    var firstReq = localStorage.getItem("firstReq");
    $scope.factoryData = $rootScope.carFactoryData;
    $scope.modelData = $rootScope.carModelData;
    if (firstReq === "yes" && $state.current.name == "car_coll") {
      $rootScope.carDetailData = {};
      $rootScope.newReqiust = {};
      $rootScope.danCustomerData = {};
      $rootScope.danIncomeData = {};
      $rootScope.filteredMonths = [];
      localStorage.setItem("firstReq", "no");
    }
    if ($state.current.name == "car_coll2") {
      $ionicModal
        .fromTemplateUrl("templates/autoColl.html", {
          scope: $scope,
          animation: "slide-in-up",
        })
        .then(function (autoCollModal) {
          $scope.autoCollModal = autoCollModal;
        });
      $timeout(function () {
        // $scope.autoCollModal.show();
      }, 100);
    }
    if ($state.current.name == "car_coll") {
      $timeout(function () {
        $scope.getbankDataCarColl("forced");
      }, 200);
    }
  });
  $scope.getCarCollateralLookupData = function () {
    if (isEmpty($scope.engineTypeData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613363836067418" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.engineTypeData = datas;
      });
    }
    if (isEmpty($scope.engineCapData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16215890441161" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.engineCapData = datas;
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
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16433624973471" }).then(function (datas) {
      delete datas.aggregatecolumns;
      $rootScope.ownershipSelect = datas;
    });
  };

  $scope.getCarFactoryCategory = function (val) {
    $scope.factoryData = [];
    $rootScope.carDetailData.brandId = "";

    $rootScope.carFactoryData.map((item) => {
      if (item.number1 === val) {
        $scope.factoryData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("brandSelect").disabled = false) : (document.getElementById("brandSelect").disabled = true);
  };
  $scope.getCarModelData = function (val) {
    $scope.modelData = [];
    $rootScope.carDetailData.markId = "";

    $rootScope.carModelData.map((item) => {
      if (item.parentid === val) {
        $scope.modelData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("modelSelect").disabled = false) : (document.getElementById("modelSelect").disabled = true);
  };

  $scope.saveCarCol = function () {
    if ($scope.carCollCheckReqiured("step1")) {
      // $state.go("car_pic_coll");
      $state.go("autoleasing-2");
    }
  };
  $rootScope.yearsArray = [];
  if ($state.current.name == "car_coll") {
    $scope.getCarCollateralLookupData();
    var charA = ["А", "Б", "Г", "Д", "З", "Н", "О", "Ө", "С", "Т", "Х", "У", "Ц", "Ч"];
    var chars = ["А", "Б", "В", "Г", "Д", "Е", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "Х", "У", "Ү", "Ц", "Ч", "Э", "Я"];
    var nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    $scope.generateArrayOfYears = function () {
      var max = new Date().getFullYear();
      var min = max - 30;

      for (var i = max; i >= min; i--) {
        $rootScope.yearsArray.push(i);
      }
    };
    $scope.generateArrayOfYears();
    $ionicPlatform.ready(function () {
      setTimeout(function () {
        new MobileSelect({
          trigger: ".nationalNumberPicker",
          wheels: [{ data: nums }, { data: nums }, { data: nums }, { data: nums }, { data: charA }, { data: chars }, { data: chars }],
          position: [0, 0],
          ensureBtnText: "Хадгалах",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("nationalNumber", a);
            $rootScope.carDetailData.nationalNumber = a;
          },
        });
        new MobileSelect({
          trigger: ".productYearPicker",
          wheels: [{ data: $rootScope.yearsArray }],
          position: [0, 0],
          ensureBtnText: "Хадгалах",
          title: "Үйлдвэрлэсэн он",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("manufacturedYearId", a);
            $rootScope.carDetailData.manufacturedYearId = a;
            mobileSelect4.show();
          },
        });
        var mobileSelect4 = new MobileSelect({
          trigger: ".cameYearPicker",
          wheels: [{ data: $rootScope.yearsArray }],
          position: [0, 0],
          ensureBtnText: "Хадгалах",
          title: "Орж ирсэн он",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("cameYearId", a);
            $rootScope.carDetailData.cameYearId = a;
            if ($rootScope.carDetailData.manufacturedYearId > $rootScope.carDetailData.cameYearId) {
              $rootScope.alert("Орж ирсэн он зөв оруулна уу", "warning");
              $rootScope.carDetailData.cameYearId = "";
            }
          },
        });
      }, 1000);
    });

    $scope.setNumber = function (type, data) {
      //ulsiin dugaariin input ruu songoson ulsiin dugaariig set hiih func
      $(function () {
        if (type == "manufacturedYearId") {
          $("#productYear").val(data).trigger("input");
        } else if (type == "cameYearId") {
          $("#entryYear").val(data).trigger("input");
        } else if (type == "nationalNumber") {
          $("#nationalNumber").val(data).trigger("input");
        }
      });
    };
  }

  $scope.carCollCheckReqiured = function (param) {
    if (isEmpty($rootScope.newReqiust)) {
      $rootScope.newReqiust = {};
    }
    if (param == "step1") {
      if (isEmpty($rootScope.carDetailData.carCategoryId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Барьцаалах автомашины төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.ownershipTypeId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Автомашины өмчлөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.nationalNumber) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Улсын дугаар оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.brandId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Үйлдвэр сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.markId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Загвар сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.manufacturedYearId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Үйлдвэрлэсэн он оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.cameYearId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Орж ирсэн он оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.proveIncome)) {
        $rootScope.alert("Орлого нотлох эсэх сонгоно уу", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "step2Images") {
      if (isEmpty($rootScope.carDetailData.itempic)) {
        $rootScope.alert("Машины гэрчилгээний зураг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.itempic2)) {
        $rootScope.alert("Машины нүүрэн талын зураг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.itempic3)) {
        $rootScope.alert("Машины баруун талын зураг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.itempic4)) {
        $rootScope.alert("Машины зүүн талын зураг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.carDetailData.itempic5)) {
        $rootScope.alert("Машины хойд талын зураг оруулна уу", "warning");
        return false;
      } else {
        return true;
      }
      return true;
    } else if (param == "agreeBank") {
      if (isEmpty($rootScope.bankListFilter.Agree)) {
        $rootScope.alert("Таны мэдээллийн дагуу зээл олгох банк, ББСБ байхгүй байна. Та мэдээллээ дахин оруулна уу.", "warning");
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
        $rootScope.carDetailData[$scope.selectedImagePath] = imageData;
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
  $("#monthInput").mask("000");
  $("#productYear").mask("0000");
  $("#entryYear").mask("0000");
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
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.saveCarColStep2 = function () {
    if ($scope.carCollCheckReqiured("step2Images")) {
      $state.go("autoleasing-2");
    }
  };
});
