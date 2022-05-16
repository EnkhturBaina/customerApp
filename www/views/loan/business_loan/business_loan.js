angular.module("business_loan.Ctrl", []).controller("business_loanCtrl", function (serverDeferred, $ionicSlideBoxDelegate, $rootScope, $scope, $state, $ionicPlatform, $location, $anchorScroll, $ionicModal) {
  $("#loanAmountRequest").mask("00000000000");
  $("#step2loanMonth").mask("000");
  $scope.saveBusinessLoanStep1 = function () {
    // if ($scope.checkReqiured("business-valid")) {
    //   if ($scope.checkReqiured("agreeBank")) {
    $state.go("business_loan2");
    //   }
    // }
  };
  $scope.saveBusinessLoanStep2 = function () {
    // if ($scope.checkReqiured("business-valid-step2")) {
    //   if ($scope.checkReqiured("agreeBank")) {
    $state.go("business_loan3");
    //   }
    // }
  }; // MODAL
  $ionicModal
    .fromTemplateUrl("templates/term-content.html", {
      scope: $scope,
      animation: "slide-in-up",
    })
    .then(function (termModalAgreement) {
      $scope.termModalAgreement = termModalAgreement;
    });
  $scope.getLookupDatas = function () {
    if (isEmpty($rootScope.purposeOfloanData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430046921272" }).then(function (response) {
        $rootScope.purposeOfloanData = response;
      });
    }
    if (isEmpty($rootScope.collConditionData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430046922962" }).then(function (response) {
        $rootScope.collConditionData = response;
      });
    }
  };
  $scope.getLookupDatasStep2 = function () {
    if (isEmpty($rootScope.projectSectorData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1646622257271491" }).then(function (response) {
        $rootScope.projectSectorData = response;
      });
    }
    if (isEmpty($rootScope.projectSubSectorData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430047014462" }).then(function (response) {
        $rootScope.projectSubSectorData = response;
      });
    }
    if (isEmpty($rootScope.projectTypeData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430047018742" }).then(function (response) {
        $rootScope.projectTypeData = response;
      });
    }
    if (isEmpty($rootScope.projectLocationData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430047026452" }).then(function (response) {
        $rootScope.projectLocationData = response;
      });
    }
    if (isEmpty($rootScope.incomeGuaranteeData)) {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "16430047029772" }).then(function (response) {
        $rootScope.incomeGuaranteeData = response;
      });
    }
  };
  $scope.selectProjectSector = function (val) {
    $rootScope.filteredProjectSubSectorData = [];

    $rootScope.businessInfo.projectSubSector = "";
    $rootScope.projectSubSectorData.map((item) => {
      if (item.parentid === val) {
        $rootScope.filteredProjectSubSectorData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("subSector").disabled = false) : (document.getElementById("subSector").disabled = true);
  };
  $scope.selectProjectSubSector = function (val) {
    $rootScope.filteredProjectTypeData = [];

    $rootScope.businessInfo.projectType = "";
    $rootScope.projectTypeData.map((item) => {
      if (item.parentid === val) {
        $rootScope.filteredProjectTypeData.push(item);
        return true;
      }
    });
    val != "" ? (document.getElementById("projectType").disabled = false) : (document.getElementById("projectType").disabled = true);
  };
  $scope.replaceCompanyName = function (companyName) {
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputcompanyName = document.getElementById("businessLoanCompanyName");
    if (rex.test(companyName) == false) {
      document.getElementById("companyNameError").style.display = "block";
      inputcompanyName.value = "";
    } else {
      document.getElementById("companyNameError").style.display = "none";
    }
  };
  $scope.selectCustomerType = function (val) {
    if (val == 1) {
      $rootScope.customerType = 1;
      $ionicPlatform.ready(function () {
        setTimeout(function () {
          var regChars = ["А", "Б", "В", "Г", "Д", "Е", "Ё", "Ж", "З", "И", "Й", "К", "Л", "М", "Н", "О", "Ө", "П", "Р", "С", "Т", "У", "Ү", "Ф", "Х", "Ц", "Ч", "Ш", "Щ", "Ъ", "Ь", "Ы", "Э", "Ю", "Я"];

          new MobileSelect({
            trigger: ".businessRegSelector",
            wheels: [{ data: regChars }, { data: regChars }],
            position: [0, 0],
            ensureBtnText: "Хадгалах",
            cancelBtnText: "Хаах",
            transitionEnd: function (indexArr, data) {
              //scroll xiij bhd ajillah func
            },
            callback: function (indexArr, data) {
              $("#regCharA").text(data[0]);
              $("#regCharB").text(data[1]);
              $scope.overlayKeyOn();

              keyInput = document.getElementById("regNums");
              if (keyInput) {
                $scope.clearD = function () {
                  keyInput.value = keyInput.value.slice(0, keyInput.value.length - 1);
                };

                $scope.addCode = function (key) {
                  keyInput.value = keyInput.value + key;
                };

                $scope.emptyCode = function () {
                  keyInput.value = "";
                };

                $scope.emptyCode();
              }
            },
            onShow: function () {},
          });
          $("#regNums").mask("00000000");
        }, 1000);
      });
    } else if (val == 2) {
      $rootScope.customerType = 2;
    }
  };
  $scope.checkReqiured = function (param) {
    if (param == "business-valid") {
      if (isEmpty($rootScope.newReqiust.loanAmount)) {
        $rootScope.alert("Зээлийн хэмжээ оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.loanMonth)) {
        $rootScope.alert("Зээл авах хугацаа оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.purposeOfLoan)) {
        $rootScope.alert("Зээлийн зориулалт сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.collateralConditionId)) {
        $rootScope.alert("Зээлийн барьцаа сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.customerDataBusiness.customerTypeId)) {
        $rootScope.alert("Зээл авах төрөл сонгоно уу", "warning");
        return false;
      } else if (isEmpty($rootScope.customerDataBusiness.uniqueIdentifier)) {
        $rootScope.alert("Регистрийн дугаар оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.customerDataBusiness.companyName)) {
        $rootScope.alert("Компанийн нэр оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.customerDataBusiness.mobileNumber)) {
        $rootScope.alert("Утасны дугаар оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.customerDataBusiness.email)) {
        $rootScope.alert("И-мэйл хаяг оруулна уу", "warning");
        return false;
      } else if (isEmpty($rootScope.newReqiust.serviceAgreementId) || $rootScope.newReqiust.serviceAgreementId == 1554263832151) {
        $rootScope.alert("Үйлчилгээний нөхцлийг зөвшөөрөөгүй байна", "warning");
        return false;
      } else {
        return true;
      }
    } else if (param == "agreeBank") {
      if (isEmpty($rootScope.bankListFilter.Agree)) {
        $rootScope.alert("Таны мэдээллийн дагуу зээл олгох банк, ББСБ байхгүй байна. Та мэдээллээ дахин оруулна уу.", "warning");
        return false;
      } else {
        return true;
      }
    }
  };
  $scope.$on("$ionicView.enter", function () {
    var firstReq = localStorage.getItem("firstReq");
    $rootScope.customerType = null;
    $rootScope.hideFooter = true;
    //Business loan step1
    if (firstReq === "yes" && $state.current.name == "business_loan") {
      $scope.getLookupDatas();
      $rootScope.newReqiust = {};
      $rootScope.customerDataBusiness = {};
      $rootScope.businessInfo = {};
      $rootScope.filteredMonths = [];
      localStorage.setItem("firstReq", "no");
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
    }
    //Business loan step2
    if ($state.current.name == "business_loan2") {
      $scope.getLookupDatasStep2();
    }
    //Business loan step3
    if ($state.current.name == "business_loan3") {
      $scope.getLookupDatasStep2();
    }
  });
  //element ruu scroll hiih
  $scope.slideTo = function (location) {
    var newHash = location;
    if ($location.hash() !== newHash) {
      $location.hash(location);
    } else {
      $anchorScroll();
    }
  };
  $scope.overlayKeyOn = function () {
    $scope.modal.show();
  };
  $scope.saveRegNums = function () {
    if (keyInput.value.length < 8) {
      $rootScope.alert("Регистер ээ бүрэн оруулна уу.", "warning");
    } else {
      $scope.modal.hide();
      $rootScope.customerDataBusiness.uniqueidentifier = $("#regCharA").text() + $("#regCharB").text() + $("#regNums").val();
    }
  };
  $scope.cancelRegNums = function () {
    if (!isEmpty($rootScope.loginUserInfo) && !isEmpty($rootScope.loginUserInfo.uniqueidentifier)) {
      $scope.regNum = $rootScope.loginUserInfo.uniqueidentifier;
      $("#regCharA").text($rootScope.loginUserInfo.uniqueidentifier.substr(0, 1));
      $("#regCharB").text($rootScope.loginUserInfo.uniqueidentifier.substr(1, 1));
      $("#regNums").val($rootScope.loginUserInfo.uniqueidentifier.substr(2, 8));
    }
    $scope.modal.hide();
  };
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
      backdropClickToClose: false,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.sendRequestBusiness = function () {
    $rootScope.ShowLoader();
    serverDeferred.requestFull("process_CODE", $rootScope.customerDataBusiness).then(function (businessCustomerResponse) {
      // console.log("businessCustomerResponse", businessCustomerResponse);
      if (businessCustomerResponse[0] == "success" && businessCustomerResponse[1] != "") {
        $rootScope.HideLoader();
        // $state.go("loan_success");
      }
    });
  };
});
