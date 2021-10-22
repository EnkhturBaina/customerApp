angular.module("dan_page.Ctrl", []).controller("dan_pageCtrl", function ($scope, $rootScope, serverDeferred, $timeout, $state) {
  $scope.getCustomerDataFromDan = function () {
    $rootScope.danCustomerData = {};
    $rootScope.danIncomeData = {};
    serverDeferred.carCalculation({ type: "auth_auto", redirect_uri: "customerapp" }, "https://services.digitalcredit.mn/api/v1/c").then(function (response) {
      $rootScope.stringHtmlsLink = response.result.data;
      var authWindow = cordova.InAppBrowser.open($rootScope.stringHtmlsLink.url, "_blank", "location=no,toolbar=no");
      $(authWindow).on("loadstart", function (e) {
        var url = e.originalEvent.url;
        var code = url.indexOf("https://services.digitalcred");
        var error = /\?error=(.+)$/.exec(url);
        if (code == 0 || error) {
          authWindow.close();
        }

        if (code == 0) {
          serverDeferred.carCalculation({ state: $rootScope.stringHtmlsLink.state }, "https://services.digitalcredit.mn/api/sso/check").then(function (response) {
            // console.log("response autoLEASING DAN", response);
            if (!isEmpty(response.result.data)) {
              var userInfo = JSON.parse(response.result.data.info);
              // console.log("userInfo", userInfo);
              if (!isEmpty(userInfo)) {
                $scope.registerFunctionDanPage(userInfo);
              }
              var userSalaryInfo = JSON.parse(response.result.data.salary);

              serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: userInfo.result.regnum.toUpperCase() }).then(function (checkedValue) {
                // console.log("checkedValue", checkedValue);
                if (!isEmpty(checkedValue[1])) {
                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597805077396905", crmcustomerid: checkedValue[1].custuserid }).then(function (responseCustomerData) {
                    // console.log("responseCustomerData", responseCustomerData);
                    if (responseCustomerData[0] != "") {
                      //Бүртгэлтэй USER -н дата татаж харуулах
                      $rootScope.danCustomerData = responseCustomerData[0];
                      $rootScope.danCustomerData.id = checkedValue[1].dccustomerid;
                    } else {
                      $rootScope.alert("Мэдээлэл татахад алдаа гарлаа", "warning");
                    }
                  });

                  serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1597804840588155", customerid: checkedValue[1].dccustomerid }).then(function (response) {
                    // console.log("get income data response", response);
                    if (response[0] != "") {
                      $rootScope.danIncomeData = response[0];
                    }
                  });
                }
              });
              $timeout(function () {
                $rootScope.danCustomerData.lastname = userInfo.result.lastname;
                $rootScope.danCustomerData.customertypeid = "1";
                $rootScope.danCustomerData.firstname = userInfo.result.firstname;
                $rootScope.danCustomerData.uniqueidentifier = userInfo.result.regnum.toUpperCase();

                // console.log("userSalaryInfo", userSalaryInfo);
                if (userSalaryInfo) {
                  serverDeferred.carCalculation(userSalaryInfo.result.list, "https://services.digitalcredit.mn/api/salary").then(function (response) {
                    if (response.status == "success" && !isEmpty(response.result)) {
                      $rootScope.monthlyAverage = response.result[0];
                      $rootScope.monthlyIncomeDisable = true;
                      $rootScope.danIncomeData.monthlyincome = response.result[0];
                      //хувааж төлөх нөхцөл
                      $rootScope.danIncomeData.incyearofemployment = response.result[1];
                      $rootScope.danIncomeData.workplace = response.result[2];
                      $rootScope.danIncomeData.incmonthlynetincome = response.result[3];
                      $rootScope.danIncomeData.workedmonths = response.result[4];
                    }
                  });
                }
              }, 1000);

              $state.go("salary");
              $rootScope.alert("Таны мэдээллийг амжилттай татлаа. Та мэдээллээ шалгаад дутуу мэдээллээ оруулна уу", "success");
            } else {
              $rootScope.alert("Мэдээлэл татахад алдаа гарлаа", "warning");
            }
          });
        } else if (error) {
          console.log(error);
        }
      });
      //Дан-н цонх дуудагдахад Регистр оруулах талбар харуулах
      $(authWindow).on("loadstop", function (e) {
        authWindow.executeScript({ code: "$('#m-one-sign').attr('class', 'show');" });
      });
    });
    $rootScope.isDanLoginAutoColl = true;
    //Дан -р нэвтэрсэн үед disable хийх
    $rootScope.lastNameDanDisable = true;
    $rootScope.firstNameDanDisable = true;
    $rootScope.uniqueIdentifierDanDisable = true;
  };
  $scope.registerFunctionDanPage = function (param) {
    var value = param.result;
    var json = {
      customerCode: value.regnum.toUpperCase(),
      siRegNumber: value.regnum.toUpperCase(),
      isActive: "1",
    };
    json.dcApp_crmUser_dan = {
      userName: "",
      userId: "1",
      isActive: "1",
    };
    json.dcApp_crmUser_dan.dcApp_dcCustomer_dan = {
      familyName: value.surname,
      firstName: value.firstname,
      lastName: value.lastname,
      birthDate: value.birthDateAsText.substring(0, 10),
      uniqueIdentifier: value.regnum.toUpperCase(),
      profilePictureClob: value.image,
      isActive: "1",
      customerTypeId: "1",
    };

    $rootScope.profilePictureSideMenu = value.image;
    localStorage.removeItem("profilePictureSideMenu");
    localStorage.setItem("profilePictureSideMenu", value.image);
    $rootScope.sidebarUserName = value.lastname.substr(0, 1) + ". " + value.firstname;

    serverDeferred.requestFull("dcApp_getCustomerRegistered_004", { uniqueIdentifier: value.regnum.toUpperCase() }).then(function (checkedValue) {
      // console.log("checkedValue", checkedValue);
      if (!isEmpty(checkedValue[1]) && !isEmpty(checkedValue[1].customerid)) {
        // console.log("IS REGISTERED !!!");
        json.id = checkedValue[1].customerid;
        json.dcApp_crmUser_dan.id = checkedValue[1].custuserid;
        json.dcApp_crmUser_dan.dcApp_dcCustomer_dan.id = checkedValue[1].dccustomerid;
      }
      serverDeferred.requestFull("dcApp_crmCustomer_dan_001", json).then(function (responseCRM) {
        // console.log("responseCRM", responseCRM);

        $rootScope.changeUserDan();

        $rootScope.loginUserInfo = mergeJsonObjs(responseCRM[1], $rootScope.loginUserInfo);
        localStorage.setItem("loginUserInfo", JSON.stringify($rootScope.loginUserInfo));

        $timeout(function () {
          if (!isEmpty(responseCRM[1]) && responseCRM[0] == "success") {
            serverDeferred.request("PL_MDVIEW_004", { systemmetagroupid: "1617609253392068", dcCustomerId: responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id }).then(function (responseALLID) {
              // console.log("res all_ID", responseALLID);
              localStorage.setItem("ALL_ID", JSON.stringify(responseALLID[0]));
              $rootScope.danCustomerData.id = responseCRM[1].dcapp_crmuser_dan.dcapp_dccustomer_dan.id;
              // console.log("localStorage", localStorage);
            });
          }
        }, 500);
      });
    });
  };

  $rootScope.$on("$ionicView.enter", function () {});

  $rootScope.$on("$ionicView.loaded", function () {});
});
