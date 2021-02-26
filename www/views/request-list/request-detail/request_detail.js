angular.module("request_detail.Ctrl", ["ngAnimate"]).controller("request_detailCtrl", function (serverDeferred, $scope, $ionicHistory, $ionicPopup, $ionicModal, $rootScope) {
  // console.log("selectbank", $rootScope.selectbank);

  $scope.getChatHistory = function () {
    $scope.userChat = [];
    $scope.bankChat = [];
    $scope.bankFirstChat = "";
    $scope.bankFirstChatDate = "";
    serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1602494134391582", dim1: $rootScope.selectbank.mapid }).then(function (response) {
      //console.log("respo", response);
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

  $scope.getChatHistory();

  $rootScope.sendChatData = {};

  $scope.sendChat = function () {
    if (isEmpty($rootScope.sendChatData.text1)) {
      $rootScope.alert("Банкинд илгээх зурвасаа бичнэ үү", "warning");
    } else {
      $rootScope.sendChatData.dim1 = $rootScope.selectbank.mapid;

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
    if ($rootScope.selectbank.wfmstatusid == 1601547332926267) {
      $scope.isConfirmCheck = true;
      $scope.isCanceled = true;
    } else if ($rootScope.selectbank.wfmstatusid == 1601547332659475) {
      $scope.isConfirmCheck = true;
      $scope.isCanceled = true;
    }
  };
  $scope.isConfirmedOrCanceled();

  $rootScope.acceptRequestData = {};
  $rootScope.acceptRequestData.id = $rootScope.selectbank.mapid;
  $rootScope.acceptRequestData.wfmStatusId = 1601547332926267;

  $rootScope.cancelRequestData = {};
  $rootScope.cancelRequestData.id = $rootScope.selectbank.mapid;
  $rootScope.cancelRequestData.wfmStatusId = 1601547332659475;
  // MODAL
  $ionicModal
    .fromTemplateUrl("templates/modal.html", {
      scope: $scope,
    })
    .then(function (modal) {
      $scope.modal = modal;
    });
  $scope.successRequestPopupOn = function () {
    if (document.getElementById("successRequestPopup")) {
      document.getElementById("successRequestPopup").style.display = "block";
    }
  };
  $scope.successRequestPopupOff = function () {
    if (document.getElementById("successRequestPopup")) {
      document.getElementById("successRequestPopup").style.display = "none";
    }
    // console.log("$rootScope.customerRequestData", $rootScope.acceptRequestData);
    serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.acceptRequestData).then(function (response) {
      // console.log("zowsoorson", response);
    });
  };
  $scope.responseSuccessRequestPopupOn = function () {
    if (document.getElementById("responseSuccessRequestPopup")) {
      $scope.successRequestPopupOff();
      document.getElementById("responseSuccessRequestPopup").style.display = "block";
    }
  };
  $scope.responseSuccessRequestPopupOff = function () {
    if (document.getElementById("responseSuccessRequestPopup")) {
      document.getElementById("responseSuccessRequestPopup").style.display = "none";
    }
  };
  $scope.cancelRequestPopupOn = function () {
    if (document.getElementById("cancelRequestPopup")) {
      document.getElementById("cancelRequestPopup").style.display = "block";
    }
  };
  $scope.cancelRequestPopupOff = function () {
    if (document.getElementById("cancelRequestPopup")) {
      document.getElementById("cancelRequestPopup").style.display = "none";
    }
    // console.log("$rootScope.customerRequestData", $rootScope.cancelRequestData);
    serverDeferred.requestFull("dcApp_decline_accept_request_002", $scope.cancelRequestData).then(function (response) {
      // console.log("cancel", response);
    });
  };
  $scope.responseCancelRequestPopupOn = function () {
    if (document.getElementById("cancelRequestPopup")) {
      $scope.cancelRequestPopupOff();
      document.getElementById("responeCancelRequestPopup").style.display = "block";
    }
  };
  $scope.responseCancelRequestPopupOff = function () {
    if (document.getElementById("cancelRequestPopup")) {
      document.getElementById("responeCancelRequestPopup").style.display = "none";
    }
  };

  $scope.closeOverlay = function () {
    document.getElementById("cancelRequestPopup").style.display = "none";
    document.getElementById("successRequestPopup").style.display = "none";
  };
  $scope.overlayOnConfirm = function () {
    if (document.getElementById("confirm-overlay")) {
      document.getElementById("confirm-overlay").style.display = "block";
    }
  };
  $scope.overlayOffConfirm = function () {
    if (document.getElementById("confirm-overlay")) {
      document.getElementById("confirm-overlay").style.display = "none";
    }
  };
  $scope.overlayOnConfirm();
});
// BITGII USTGAARAI !!!
// 1601547332926267 -- Харилцагч зөвшөөрсөн
// 1601547332659475 -- Харилцагч цуцалсан
// 1585206036474051 -- Одоо байгаа төлөв
