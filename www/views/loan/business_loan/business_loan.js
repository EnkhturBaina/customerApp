angular.module("business_loan.Ctrl", []).controller("business_loanCtrl", function (serverDeferred, $ionicSlideBoxDelegate, $rootScope, $scope, $state) {
  $scope.saveBusinessLoanStep1 = function () {
    if ($scope.checkReqiured("business-valid")) {
      if ($scope.checkReqiured("agreeBank")) {
        $state.go("business_loan2");
      }
    }
  };
  $scope.saveBusinessLoanStep2 = function () {};
  $scope.getLookupDatas = function () {
    console.log("getLookupDatas business ajiljiiiiiiin");
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
    console.log("getLookupDatas step2 business ajiljiiiiiiin");
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
    console.log("business step1");
    if (firstReq === "yes" && $state.current.name == "business_loan") {
      $scope.getLookupDatas();
      $rootScope.newReqiust = {};
      $rootScope.customerDataBusiness = {};
      $rootScope.businessInfo = {};
      console.log("step1");
      localStorage.setItem("firstReq", "no");
      $rootScope.newReqiust.serviceAgreementId = 1554263832132;
    }
    if ($state.current.name == "business_loan2") {
      $scope.getLookupDatasStep2();
      console.log("step2");
    }
  });
});
