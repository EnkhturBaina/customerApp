angular.module("car_collateral.Ctrl", []).controller("car_collateralCtrl", function (serverDeferred, $scope, $rootScope, $state, $ionicModal, $ionicPlatform, $timeout) {
  //Төрөл
  $scope.carCategory = [];
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
    if (isEmpty($scope.carColorData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364305380357" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.carFactoryData = datas;
      });
    }
    if (isEmpty($scope.carColorData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1613364325545258" }).then(function (datas) {
        delete datas.aggregatecolumns;
        $scope.carModelData = datas;
      });
    }
  };

  $scope.getCarFactoryCategory = function (val) {
    $scope.factoryData = [];
    $rootScope.newCarReq.brandId = "";

    $scope.carFactoryData.map((item) => {
      if (item.number1 === val) {
        $scope.factoryData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("brandSelect").disabled = false) : (document.getElementById("brandSelect").disabled = true);
  };
  $scope.getCarModelData = function (val) {
    $scope.modelData = [];
    $rootScope.newCarReq.markId = "";

    $scope.carModelData.map((item) => {
      if (item.parentid === val) {
        $scope.modelData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("modelSelect").disabled = false) : (document.getElementById("modelSelect").disabled = true);
  };

  $scope.getbankDataCarColl = function () {
    //Шүүгдсэн банкууд
    $rootScope.bankListFilter = [];
    var json = {};
    $rootScope.newReqiust = {};
    json.type = "carLoanFilter";
    json.totalLoan = $rootScope.carCollateralRequestData.loanAmount;
    json.isPerson = "1";
    json.location = $rootScope.carCollateralRequestData.locationId;
    json.month = $rootScope.carCollateralRequestData.loanMonth;
    json.currency = 16074201974821;
    if (!isEmpty($rootScope.loginUserInfo)) {
      json.isMortgage = $rootScope.loginUserInfo.mikmortgagecondition;
      json.totalIncome = $rootScope.loginUserInfo.totalincomehousehold;
      json.monthIncome = $rootScope.loginUserInfo.monthlyincome;
      json.monthPay = $rootScope.loginUserInfo.monthlypayment;
    }
    serverDeferred.carCalculation(json).then(function (response) {
      $rootScope.bankListFilter = response.result.data;

      $rootScope.products = [];
      $rootScope.result = [];
      $rootScope.months = [];
      //Зөвхөн Step2 -д ажлуулах
      if ($state.current.name == "car_coll2") {
        $rootScope.bankListFilter.Agree.map((el) => {
          $rootScope.products.push(el.products);
        });

        $rootScope.products.map((obj) => {
          $rootScope.result = [].concat($rootScope.result, obj);
        });

        $rootScope.result.map((a) => {
          $rootScope.months.push(a.max_loan_month_id);
        });
        if (!isEmpty($rootScope.products)) {
          $rootScope.maxMonth = Math.max(...$rootScope.months);
        } else {
          $rootScope.maxMonth = 0;
        }
      }
    });
    // console.log("json", json);
  };

  // localStorage.removeItem("carColl");
  $scope.saveCarCol = function () {
    if (isEmpty($rootScope.newCarReq)) {
      $rootScope.newCarReq = {};
    }
    if ($scope.carCollCheckReqiured("step1")) {
      localStorage.setItem("requestType", "autoColl");
      localStorage.setItem("carColl", JSON.stringify($rootScope.newCarReq));

      $state.go("car_coll2");
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
          ensureBtnText: "Болсон",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("nationalNumber", a);
            $rootScope.newCarReq.nationalNumber = a;
          },
        });
        new MobileSelect({
          trigger: ".productYearPicker",
          wheels: [{ data: $rootScope.yearsArray }],
          position: [0, 0],
          ensureBtnText: "Болсон",
          title: "Үйлдвэрлэсэн он",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("manufacturedYearId", a);
            $rootScope.newCarReq.manufacturedYearId = a;
            mobileSelect4.show();
          },
        });
        var mobileSelect4 = new MobileSelect({
          trigger: ".cameYearPicker",
          wheels: [{ data: $rootScope.yearsArray }],
          position: [0, 0],
          ensureBtnText: "Болсон",
          title: "Орж ирсэн он",
          maskOpacity: 0.5,
          cancelBtnText: "Хаах",
          transitionEnd: function (indexArr, data) {
            //scrolldood duusahad ajillah func
          },
          callback: function (indexArr, data) {
            var a = data.join("");
            $scope.setNumber("cameYearId", a);
            $rootScope.newCarReq.cameYearId = a;
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
    if ($scope.carCollCheckReqiured("step2")) {
      if ($scope.carCollCheckReqiured("agreeBank")) {
        $state.go("autoleasing-4");
      }
    }
  };

  $scope.carCollCheckReqiured = function (param) {
    if (param == "step1") {
      if (isEmpty($rootScope.newCarReq.carCategoryId) && !$rootScope.isDanLoginAutoColl) {
        $rootScope.alert("Машины төрлөө сонгоно уу", "warning");
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
        $rootScope.alert("Машины зураг оруулна уу", "warning");
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
        if (isEmpty($rootScope.newCarReq)) {
          $rootScope.newCarReq = {};
        }
        $rootScope.newCarReq[$scope.selectedImagePath] = imageData;
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
  $("#monthInput").mask("00");
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
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $ionicModal
    .fromTemplateUrl("templates/autoCollDan.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (autoCollDan) {
      $scope.autoCollDan = autoCollDan;
    });
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
    $timeout(function () {
      if ($state.current.name == "car_coll") {
        //автомашин барьцаалсан зээлийн хүсэлтийн мэдээлэл
        $rootScope.carCollateralRequestData = {};
        $rootScope.carCollateralRequestData.loanAmount = 0;
        $rootScope.carCollateralRequestData.serviceAgreementId = 1554263832132;
        if (!isEmpty($rootScope.propJsonAutoColl) && $rootScope.isDanLoginAutoColl) {
          $scope.autoCollDan.show();
        } else if (($rootScope.isDanLoginAutoColl && isEmpty($rootScope.propJsonAutoColl)) || ($rootScope.isDanLoginAutoColl && $rootScope.propJsonAutoColl != undefined)) {
          $rootScope.alert("Таньд автомашин бүртгэлгүй байна", "warning");
        }
      }
    }, 500);
  });

  $scope.selectDanAutoColl = function (el) {
    $rootScope.autoCollDanCarData = el;
    $rootScope.autoCollDanCarData.importDate = formatDate(el.importDate);
  };
  $scope.registerHandAutoColl = function () {
    $rootScope.autoCollDanCarData = {};
    $rootScope.isDanLoginAutoColl = false;
  };
});
