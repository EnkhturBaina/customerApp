app.controller("loan_successCtrl", function ($scope, $rootScope, $state, $ionicPlatform) {
  $rootScope.selectedCarData = [];
  $rootScope.carData = [];

  $rootScope.bankListFilter = [];
  localStorage.removeItem("requestType");
  $rootScope.newReqiust.getLoanAmount = "";
  $rootScope.newCarReq = {};
  $rootScope.newReqiust = {};

  $rootScope.danIncomeData = {};
  $rootScope.loanAmountField = "";

  localStorage.removeItem("otherGoods");
  localStorage.removeItem("consumerRequestData");
  localStorage.removeItem("otherGoodsMaxId");

  $rootScope.propertyRequestData = {};
  $rootScope.template = {};
  localStorage.setItem("isSupplierLoan", "no");

  $scope.goBankMenu = function () {
    $state.go("requestList");
    $rootScope.hideFooter = false;
  };

  $scope.$on("$ionicView.enter", function () {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    let day = weekday[d.getDay()];
    let hour = d.getHours();
    console.log(day);
    if (day == "Sunday" || day == "Saturday") {
      $rootScope.success_msg = "Танд баярлалаа. Амралтын өдөр ажиллаж байгаа Банк, ББСБ-ууд Таны зээлийн хариуг өгнө. Бусад нь ажлын цаг эхэлмэгц хариу өгөх болохыг анхаараарай.";
    } else if (hour > 9 && hour < 19) {
      $rootScope.success_msg = "Танд баярлалаа. Таны хүсэлтэд тун удахгүй хариу өгөх болно.";
    } else {
      $rootScope.success_msg = "Танд баярлалаа. Ажлын цаг эхэлмэгц Таны зээлийн хүсэлтэд хариу өгөх болно.";
    }
  });
});
