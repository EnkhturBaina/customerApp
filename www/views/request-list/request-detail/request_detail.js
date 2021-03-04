angular.module("request_detail.Ctrl", ["ngAnimate"]).controller("request_detailCtrl", function (serverDeferred, $scope, $ionicModal, $rootScope, $ionicPopup) {
  // console.log("selectedMapBank", $rootScope.selectedMapBank);
  $rootScope.loanType = $rootScope.selectedMapBank.loantype;
  $rootScope.selectedMapBankDTL = [];

  $scope.getRequestDTL = function () {
    var dvId = "";
    if ($rootScope.loanType === "1") {
      dvId = "1614740464289125";
    } else if ($rootScope.loanType === "2") {
      dvId = "1614748505027675";
    } else if ($rootScope.loanType === "3") {
      dvId = "1614744306112512";
    } else if ($rootScope.loanType === "4") {
      dvId = 0;
    } else if ($rootScope.loanType === "5") {
      dvId = 0;
    }
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: dvId, mapId: $rootScope.selectedMapBank.mapid }).then(function (response) {
      // console.log("res", response);
      $rootScope.selectedMapBankDTL = response[0];
    });
  };
  $scope.getRequestDTL();

  $scope.getChatHistory = function () {
    $scope.userChat = [];
    $scope.bankChat = [];
    $scope.bankFirstChat = "";
    $scope.bankFirstChatDate = "";
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602494134391582", dim1: $rootScope.selectedMapBank.mapid }).then(function (response) {
      // console.log("getChatHistory response", response);
      $rootScope.chatHistory = [];
      angular.forEach(response, function (item) {
        $rootScope.chatHistory.push(item);
      });
      if (response != "") {
        $scope.bankFirstChat = response[0].text1;
        $scope.bankFirstChatDate = response[0].createddate;
      } else {
        $scope.bankFirstChat = "Банктай холбогдох";
      }
    });
  };
  $scope.showPopupDTL = function (text, type) {
    $rootScope.acceptRequestData = {};
    $rootScope.acceptRequestData.id = $rootScope.selectedMapBank.mapid;
    $rootScope.acceptRequestData.wfmStatusId = "1585206036474051";

    $rootScope.cancelRequestData = {};
    $rootScope.cancelRequestData.id = $rootScope.selectedMapBank.mapid;
    $rootScope.cancelRequestData.wfmStatusId = "1585206036474051";

    var templateBody = "";
    var alertBody = "";
    if (type == "confirm") {
      templateBody = "Та " + "<span class='dtl-pop-up-bank-name'>" + $rootScope.selectedMapBankDTL.departmentname + "</span>" + " руу зөвшөөрөл илгээхдээ итгэлтэй байна уу";
      alertBody = "" + "<span class='dtl-pop-up-bank-name'>" + $rootScope.selectedMapBankDTL.departmentname + "</span>" + " руу амжилттай илгээгдлээ";
    } else if (type == "decline") {
      templateBody = "Та " + "<span class='dtl-pop-up-bank-name'>" + $rootScope.selectedMapBankDTL.departmentname + "</span>" + " руу илгээсэн хүсэлтээ цуцлахад итгэлтэй байна уу<br/>" + "<span class='dtl-pop-up-sub-title'>" + "Хүсэлтээ цуцалснаар банкинд зээл авахгүй гэсэн мэдэгдэл очихыг анхаарна уу" + "</span>";
      alertBody = "" + "<span class='dtl-pop-up-bank-name'>" + $rootScope.selectedMapBankDTL.departmentname + "</span>" + " руу илгээсэн хүсэлт цуцлагдлаа";
    }
    $ionicPopup.show({
      title: text,
      template: templateBody,
      cssClass: "confirmPopup",
      buttons: [
        {
          text: "Хаах",
          type: "button-decline",
        },
        {
          text: "Илгээх",
          type: "button-confirm",
          onTap: function () {
            if (type == "confirm") {
              // console.log("$rootScope.customerRequestData", $rootScope.acceptRequestData);
              serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.acceptRequestData).then(function (response) {
                // console.log("confirm", response);
              });
            } else if (type == "decline") {
              // console.log("$rootScope.customerRequestData", $rootScope.cancelRequestData);
              serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.cancelRequestData).then(function (response) {
                // console.log("decline", response);
              });
            }
            $rootScope.alert(alertBody, "success");
          },
        },
      ],
    });
  };
  $scope.getChatHistory();

  $rootScope.sendChatData = {};

  $scope.sendChat = function () {
    if (isEmpty($rootScope.sendChatData.text1)) {
      $rootScope.alert("Банкинд илгээх зурвасаа бичнэ үү", "warning");
    } else {
      $rootScope.sendChatData.dim1 = $rootScope.selectedMapBank.mapid;

      serverDeferred.requestFull("dcApp_chat_dv_001", $rootScope.sendChatData).then(function (response) {
        // console.log("send chat", response);
        $rootScope.sendChatData.text1 = "";
        $scope.getChatHistory();
      });
    }
  };

  $scope.isConfirm = true;
  $scope.isConfirmCheck = false;
  $scope.isCanceled = false;
  $scope.isConfirmedOrCanceled = function () {
    if ($rootScope.selectedMapBank.wfmstatusid == 1601547332926267) {
      $scope.isConfirmCheck = true;
      $scope.isCanceled = true;
    } else if ($rootScope.selectedMapBank.wfmstatusid == 1601547332659475) {
      $scope.isConfirmCheck = true;
      $scope.isCanceled = true;
    }
  };
  $scope.isConfirmedOrCanceled();

  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
});
