angular.module("business_loan.Ctrl", []).controller("business_loanCtrl", function (serverDeferred, $ionicSlideBoxDelegate, $rootScope, $scope, $state) {
  $scope.saveBusinessLoanStep1 = function () {
    $state.go("business_loan2");
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
  $scope.selectProjectSector = function (id) {
    console.log("id", id);
  };
  $scope.selectProjectSubSector = function (id) {
    console.log("id", id);
  };
  $scope.replaceCompanyName = function (companyName) {
    console.log("companyName");
    var rex = /^[А-ЯӨҮа-яөү\-\s]+$/;
    var inputcompanyName = document.getElementById("businessLoanCompanyName");
    if (rex.test(companyName) == false) {
      document.getElementById("companyNameError").style.display = "block";
      inputcompanyName.value = "";
    } else {
      document.getElementById("companyNameError").style.display = "none";
    }
  };
  $scope.$on("$ionicView.enter", function () {
    $rootScope.hideFooter = true;
    console.log("business step1");
    if ($state.current.name == "business_loan") {
      $scope.getLookupDatas();
      console.log("step1");
    }
    if ($state.current.name == "business_loan2") {
      $scope.getLookupDatasStep2();
      console.log("step2");
    }
  });
});
