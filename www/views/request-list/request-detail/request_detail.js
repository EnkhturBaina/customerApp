angular.module("request_detail.Ctrl", ["ngAnimate"]).controller("request_detailCtrl", function (serverDeferred, $scope, $ionicModal, $rootScope, $ionicPopup) {
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
      dvId = "1614748505027675";
    } else if ($rootScope.loanType === "5") {
    } else {
      dvId = "16231354990841";
    }
    if (dvId != "") {
      serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: dvId, mapId: $rootScope.selectedMapBank.mapid }).then(function (response) {
        $rootScope.selectedMapBankDTL = response[0];
        if ($rootScope.selectedMapBankDTL.wfmstatusid != 1609944955126013) {
          $rootScope.selectedMapBankDTL.loanamount = "";
          $rootScope.selectedMapBankDTL.loanmonth = "";
          $rootScope.selectedMapBankDTL.loanfeetext = "";
        }
      });
    }
  };
  $scope.getRequestDTL();

  $scope.getChatHistory = function () {
    $scope.userChat = [];
    $scope.bankChat = [];
    $scope.bankFirstChat = "";
    $scope.bankFirstChatDate = "";
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602494134391582", dim1: $rootScope.selectedMapBank.mapid }).then(function (response) {
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
    $rootScope.acceptRequestData.wfmStatusId = 1609944955126013;

    $rootScope.cancelRequestData = {};
    $rootScope.cancelRequestData.id = $rootScope.selectedMapBank.mapid;
    $rootScope.cancelRequestData.wfmStatusId = 1609944902958196;

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
              serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.acceptRequestData).then(function (response) {});
            } else if (type == "decline") {
              serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.cancelRequestData).then(function (response) {});
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
        $rootScope.sendChatData.text1 = "";
        $scope.getChatHistory();
      });
    }
  };
  $scope.isConfirm = { checked: false };
  $scope.isConfirmCheck = false;
  $scope.isConfirmedOrCanceled = function () {
    if ($rootScope.selectedMapBank.wfmstatusid != 1609944955126013) {
      $scope.isConfirmCheck = true;
    }
  };
  $scope.isConfirmedOrCanceled();
  $scope.checkIsConfirmed = function () {
    if ($rootScope.selectedMapBank.wfmstatusid != 1609944955126013) {
      $rootScope.alert("Таны хүсэлт банкинд батлагдаагүй байна", "warning");
    }
  };
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
});
