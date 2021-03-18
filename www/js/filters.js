angular
  .module("Filters", [])
  .filter("unsafeHTML", function ($sce) {
    return $sce.trustAsHtml;
  })
  .filter("trustVideo", function ($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  })
  .filter("trustedhtmlField", function ($sce, $rootScope) {
    return function (html) {
      if (!isEmpty(html) && typeof html == "string") {
        var txt = document.createElement("textarea");
        txt.innerHTML = html.replace(/&gt;&lt;img src=&quot;/g, "&gt;&lt;img src=&quot;" + $rootScope.imagePath);
        return $sce.trustAsHtml(txt.value);
      }
    };
  })
  .filter("trustedhtml", function ($sce) {
    return function (html) {
      if (!isEmpty(html) && typeof html == "string") return $sce.trustAsHtml(html);
    };
  })
  .filter("htmlDecode", function ($sce) {
    return function (text) {
      var entities = [
        ["amp", "&"],
        ["apos", "'"],
        ["#x27", "'"],
        ["#x2F", "/"],
        ["#39", "'"],
        ["#47", "/"],
        ["lt", "<"],
        ["gt", ">"],
        ["nbsp", " "],
        ["quot", '"'],
      ];

      for (var i = 0, max = entities.length; i < max; ++i) {
        try {
          text = text.replace(new RegExp("&" + entities[i][0] + ";", "g"), entities[i][1]);
        } catch (err) {
          console.log(err);
        }
      }

      return text;
    };
  })
  .filter("slice", function () {
    return function (arr, start, end) {
      if (isEmpty(arr)) return null;
      else if (isObject(arr)) return null;
      else return arr.slice(start, end);
    };
  })
  .filter("startFrom", function () {
    return function (input, start) {
      if (input) {
        start = +start;
        return input.slice(start);
      }
      return [];
    };
  })
  .filter("getObjectKey", function () {
    return function (str) {
      return Object.keys(str);
    };
  })
  .filter("isEmptyCust", function () {
    return function (str) {
      return !str || 0 === str.length;
    };
  })
  .filter("objectDataViewKey", function () {
    return function (array, key) {
      return !isNaN(Object.keys(array)[key]);
    };
  })

  .filter("isEmptyShowImg", function () {
    return function (arr) {
      var empty = true;
      angular.forEach(arr, function (item) {
        if (item.isshow == "1") {
          empty = false;
        }
      });
      return empty;
    };
  })
  .filter("isShowField", function () {
    return function (field, config) {
      if (eval("typeof field." + config.fieldpath.toLowerCase() + "hideShow") == "undefined" || eval("field." + config.fieldpath.toLowerCase() + "hideShow") != "hide") return true;
      else return false;
    };
  })
  .filter("setFieldValue", function () {
    return function (arr, start) {
      try {
        var dd = eval("arr." + start.toLowerCase());
        if (dd == NaN || dd == undefined) {
          dd = null;
        }
        return dd;
      } catch (ex) {
        return null;
      }
    };
  })
  .filter("setFieldValueDataView", function ($filter) {
    return function (arr, start, addpath) {
      if (!isEmpty(start) && !isEmpty(start.fieldpath)) {
        var dd = null;
        try {
          if (start.datatype == "file" || start.datatype == "base64") dd = arr.filename;
          else if (start.lookuptype == "combo" || start.lookuptype == "popup") {
            var ds = eval("arr." + start.fieldpath.toLowerCase() + "combo.dtl");
            if (!isEmpty(ds) && typeof ds != "object") {
              ds = JSON.parse(ds);
            }
            dd = ds[start.displayfield.toLowerCase()];
          } else if (start.datatype == "time") dd = dateFormatter("H:i", eval("arr." + start.fieldpath.toLowerCase()));
          else dd = eval("arr." + start.fieldpath.toLowerCase());
        } catch (x) {}
        if (!isEmpty(start.datatype)) {
          if (dd == NaN || dd == undefined) {
            dd = null;
          } else {
            dd = $filter("formatField")(dd, start.datatype.toLowerCase());
          }
        }
        return dd;
      } else {
        return null;
      }
    };
  })

  .filter("inputtype", function ($sce) {
    return function (type) {
      type = type.toLowerCase();
      if (type == "bigdecimal" || type == "number" || type == "decimal") {
        return "number";
      } else {
        return "text";
      }
    };
  })
  .filter("highlight", function ($sce) {
    return function (text, phrase) {
      if (phrase && text != null) text = text.replace(new RegExp("(" + phrase + ")", "gi"), '<span class="highlighted">$1</span>');
      return $sce.trustAsHtml(text);
    };
  })
  .filter("formatNumber", function () {
    return function (num) {
      if (num != undefined) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        return 0;
      }
    };
  })

  .filter("checkProcessTab", function () {
    return function (array, fieldRow, fieldValue, level) {
      var fieldData = [];
      if (array != undefined) {
        angular.forEach(array, function (item) {
          var itemRow = "";
          if (item[fieldRow].split(".").length == level) {
            for (var a = 0; a < level - 1; a++) {
              itemRow = itemRow + "." + item[fieldRow].split(".")[a];
            }
            if (itemRow.replace(".", "") == fieldValue) {
              fieldData.push(item);
            }
          }
        });
      }
      return fieldData;
    };
  })

  .filter("getSingle", function () {
    return function (array) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          var long = item.paramrealpath.split(".").length;
          if (long == 1) {
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })
  .filter("getKpi", function () {
    return function (array) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          var long = item.paramrealpath.split(".");
          if (long.length > 1 && long[0].toLowerCase() === "kpidmdtl") {
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })
  .filter("getRow", function () {
    return function (array, field) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          var long = item.paramrealpath.split(".");
          try {
            if (long.length > 1 && long[0] == field.paramrealpath && field.recordtype == "row") {
              item.RowFieldName = long[0];
              returnVal.push(item);
            }
          } catch (ex) {}
        }
      });
      return returnVal;
    };
  })

  .filter("getRows", function () {
    return function (array, field) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          //  item.fieldpath = item.paramrealpath;
          var long = item.paramrealpath.split(".");
          if (long.length == 2 && long[0].toLowerCase() == field.paramrealpath.toLowerCase() && field.recordtype.toLowerCase() == "rows") {
            item.RowFieldName = long[0].toLowerCase();
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })
  .filter("getRowsinRows", function () {
    return function (array, field) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          //  item.fieldpath = item.paramrealpath;
          var long = item.parampath.split(".");
          var path = long[0] + "." + long[1];
          if (long.length == 3 && path.toLowerCase() == field.parampath.toLowerCase() && field.recordtype.toLowerCase() == "rows") {
            item.RowFieldName = long[0].toLowerCase();
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })
  .filter("getRowsDtl", function () {
    return function (array, field, index) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        var item = angular.copy(item);
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          //  item.fieldpath = item.paramrealpath;
          var long = item.paramrealpath.split(".");
          var path = item.paramrealpath.substr(0, item.paramrealpath.lastIndexOf("."));
          if (long.length > 1 && path.toLowerCase() == field.paramrealpath.toLowerCase() && field.recordtype.toLowerCase() == "rows") {
            item.RowFieldName = path.toLowerCase();
            var n = item.paramrealpath.lastIndexOf(".");
            item.paramrealpath = item.paramrealpath.substr(0, n) + "[" + index + "]" + item.paramrealpath.substr(n, item.paramrealpath.length);
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })
  .filter("getRowsAll", function () {
    return function (array, field) {
      var returnVal = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && !isEmpty(field) && !isEmpty(field.paramrealpath)) {
          //  item.fieldpath = item.paramrealpath;
          var long = item.paramrealpath.split(".");
          if (long.length > 1 && long[0].toLowerCase() == field.paramrealpath.toLowerCase() && field.recordtype.toLowerCase() == "rows") {
            item.RowFieldName = long[0].toLowerCase();
            returnVal.push(item);
          }
        }
      });
      return returnVal;
    };
  })

  .filter("isNaN", function () {
    return function (key) {
      return isNaN(key);
    };
  })
  .filter("isObject", function () {
    return function (object) {
      if (object !== null && typeof object === "object" && Object.keys(object).length > 0) {
        return true;
      } else {
        return false;
      }
    };
  })
  .filter("isObjectRow", function () {
    return function (object, key) {
      if (object !== null && typeof object === "object" && Object.keys(object).length > 0 && !isNaN(key)) {
        return true;
      } else {
        return false;
      }
    };
  })
  .filter("checkProcessTabisChecked", function () {
    return function (array, fieldRow, fieldValue) {
      var fieldData = false;
      if (array != undefined) {
        angular.forEach(array, function (item) {
          if (item[fieldRow] == fieldValue) {
            fieldData = true;
          }
        });
      }
      return fieldData;
    };
  })
  .filter("fieldLength", function () {
    return function (array, fieldRow) {
      var count = 0;
      if (array != undefined) {
        angular.forEach(array, function (item) {
          if (!isEmpty(item[fieldRow])) {
            count++;
          }
        });
      }
      return count;
    };
  })

  .filter("processRowsPlusBtn", function () {
    return function (object, type, index, config) {
      var count = 0;
      if (isEmpty(object)) {
        count = 0;
      } else {
        if (type == "footer" && config.mobiletheme != "BP_theme8") {
          if (object[index].recordtype == "rows" && object[index].isshowadd == "1") {
            count++;
          }
        } else if (type == "footer" && config.mobiletheme == "BP_theme8") {
          for (var i in object) {
            if (object[i].recordtype == "rows" && object[i].isshowadd == "1") {
              count++;
            }
          }
        } else {
          for (var i in object) {
            if (object[i].recordtype == "rows" && object[i].isshowadd == "0" && object[i].isshowmultiple == "1") {
              count++;
            }
          }
        }
      }
      return count;
    };
  })
  .filter("objLength", function () {
    return function (object) {
      var count = 0;
      if (isEmpty(object)) {
        count = 0;
      } else {
        for (var i in object) {
          count++;
        }
      }
      return count;
    };
  })
  .filter("formatNumberToString", function () {
    return function (number, type) {
      if (type == "bigdecimal" || type == "decimal") {
        if (isEmpty(number)) {
          return "";
        } else if (isNaN(parseFloat(number))) {
          return number;
        } else {
          if (number == "0") {
            return 0;
          } else {
            return parseFloat(number)
              .toFixed(2)
              .replace(/./g, function (c, i, a) {
                return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
              });
          }
        }
      } else if (type == "number") {
        if (isEmpty(number)) {
          return "";
        } else if (isNaN(parseInt(number))) {
          return number;
        } else {
          return parseInt(number)
            .toFixed(0)
            .replace(/./g, function (c, i, a) {
              return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            });
        }
      } else {
        return number;
      }
    };
  })
  .filter("formatNumberToInt", function () {
    return function (number) {
      if (number != undefined) {
        return parseInt(number)
          .toFixed(0)
          .replace(/./g, function (c, i, a) {
            return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
          });
      }
    };
  })
  .filter("totalPrice", function () {
    return function (data, key1, key2) {
      if (angular.isUndefined(data) && angular.isUndefined(key1) && angular.isUndefined(key2)) return 0;

      var sum = 0;
      angular.forEach(data, function (v, k) {
        sum = sum + parseInt(v[key1]) * parseInt(v[key2]);
      });
      return sum;
    };
  })
  .filter("totalQty", function () {
    return function (data, key) {
      if (angular.isUndefined(data) && angular.isUndefined(key)) return 0;
      var sum = 0;

      angular.forEach(data, function (v, k) {
        var a = v[key];
        if (a != "" && a != null) {
          sum = sum + parseFloat(a);
        }
      });
      return sum;
    };
  })
  .filter("guessImageMimeMenu", function ($rootScope) {
    return function (data, newimg) {
      if (!isEmpty(data) && isBase64(data)) {
        data = data.replace("jpeg♠", "").replace("gif♠", "").replace("png♠", "");
        if (data.replace("jpeg♠", "").charAt(0) == "/") {
          return "data:image/jpg;base64," + data.replace("jpeg♠", "");
        } else if (data.replace("gif♠", "").charAt(0) == "R") {
          return "data:image/gif;base64," + data.replace("gif♠", "");
        } else if (data.replace("svg♠", "").charAt(0) == "R") {
          return "data:image/gif;base64," + data.replace("svg♠", "");
        } else if (data.replace("png♠", "").charAt(0) == "i") {
          return "data:image/png;base64," + data.replace("png♠", "");
        }
      } else {
        if (!isEmpty(data)) {
          if (!isEmpty($rootScope.imagePathJava)) {
            var dd = { sessionId: $rootScope.sessionid, command: "getPhysicalFile", parameters: { physicalPath: data } };
            return (image = $rootScope.imagePathJava + "runGetFile?pJsonString=" + JSON.stringify(dd));
          } else {
            return $rootScope.imagePath + "" + data;
          }
        }
        if (newimg) {
          return newimg;
        } else {
          return "img/no-image-box.png";
        }
      }
    };
  })
  .filter("guessImageMime", function ($rootScope) {
    return function (data, localImg, item) {
      var image = "";
      if (!isEmpty(data) && data.lastIndexOf("♠") != -1 && isBase64(data.substr(data.lastIndexOf("♠") + 1, data.length))) {
        var mimeType = data.substr(0, data.lastIndexOf("♠"));
        if (!isEmpty(item) && !isEmpty(item["filethumbnail"])) {
          mimeType = "filethumbnail";
        }
        switch (mimeType) {
          case "filethumbnail":
            image = "data:" + getToMimeType(item["filethumbnail"].substr(0, data.lastIndexOf("♠"))) + ";base64," + item["filethumbnail"].substr(item["filethumbnail"].lastIndexOf("♠") + 1, item["filethumbnail"].length);
            break;
          case "pdf":
            image = "img/icons/icon_pdf.png";
            break;
          case "xlsx":
            image = "img/icons/icon_excel.png";
            break;
          case "docx":
            image = "img/icons/icon_word.png";
            break;
          case "doc":
            image = "img/icons/icon_word.png";
            break;
          case "pptx":
            image = "img/icons/icon_ppt.png";
            break;
          default:
            image = "data:" + getToMimeType(mimeType) + ";base64," + data.substr(data.lastIndexOf("♠") + 1, data.length);
        }
        return image;
      } else {
        return $rootScope.imagePath + "" + data;
      }
    };
  })
  .filter("checkProcessTab1", function () {
    return function (array, str, indexx, indexy) {
      var end = "";
      angular.forEach(str.split("."), function (ind, index) {
        if (index == 0) {
          end = ind;
        } else {
          end = end + "." + ind;
        }
        if (eval("array." + end) != "undefined") {
          var adas = eval("array." + end);
          if (typeof adas == "object") {
            if (index == 0) {
              str = str.replace(ind, ind + "[" + indexx + "]");
              end = end + "[" + indexx + "]";
            }
            if (index == 1 && indexy != null) {
              str = str.replace(ind, ind + "[" + indexy + "]");
              end = end + "[" + indexy + "]";
            }
          }
        }
      });
      return eval("array." + str);
    };
  })
  .filter("bindPath", function () {
    return function (array, str, indexx, indexy, indexz) {
      var end = "";
      angular.forEach(str.split("."), function (ind, index) {
        if (index == 0) {
          end = ind;
        } else {
          end = end + "." + ind;
        }
        var adas = "";
        try {
          adas = eval("array." + end);
          if (typeof adas == "object") {
            if (index == 0) {
              str = str.replace(ind, ind + "[" + indexx + "]");
              end = end + "[" + indexx + "]";
            }
            if (index == 1) {
              str = str.replace(ind, ind + "[" + indexy + "]");
              end = end + "[" + indexy + "]";
            }
            if (index == 2) {
              str = str.replace(ind, ind + "[" + indexz + "]");
              end = end + "[" + indexz + "]";
            }
          }
        } catch (ex) {
          adas = "";
        }
      });
      var retturn = "";
      try {
        retturn = eval("array." + str);
      } catch (ex) {
        retturn = "";
      }
      return retturn;
    };
  })
  .filter("startFromRepeat", function () {
    return function (input, start) {
      if (input) {
        start = +start;
        return input.slice(start);
      }
      return [];
    };
  })
  .filter("DateFormat", function ($filter) {
    return function (array, config) {
      var returnVal = null;
      try {
        if (!isEmpty(array) && !isEmpty(config)) {
          var input = eval("array." + config.paramrealpath.toLowerCase());
          if (!isEmpty(input)) {
            if (config.datatype == "datetime") {
              var _date1 = $filter("date")(new Date(input), "yyyy-MM-dd HH:mm:ss");
              returnVal = _date1.toUpperCase();
            } else if (config.datatype == "date") {
              var _date2 = $filter("date")(new Date(input), "yyyy-MM-dd");
              returnVal = _date2.toUpperCase();
            } else if (config.datatype == "time") {
              if (isEmpty(input) || input.length < 9) {
                input = "1999/01/01 " + input;
              }
              var _date3 = $filter("date")(new Date(input.replace(/-/g, "/")), "HH:mm");
              if (_date3 == "NaN:NaN") {
                var newd = new Date();
                _date3 = "00:00";
              }
              eval("array." + config.paramrealpath.toLowerCase() + '="' + _date3.toUpperCase() + '"');
              returnVal = _date3.toUpperCase();
            }
          }
        }
      } catch (ex) {}
      return returnVal;
    };
  })
  .filter("formatField", function ($filter) {
    return function (value, type) {
      if (type == "bigdecimal" || type == "decimal") {
        if (isEmpty(value)) {
          return 0;
        } else {
          return parseFloat(value)
            .toFixed(2)
            .replace(/./g, function (c, i, a) {
              return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            });
        }
      } else if (type == "number") {
        if (isEmpty(value)) {
          return 0;
        } else {
          return parseInt(value)
            .toFixed(0)
            .replace(/./g, function (c, i, a) {
              return i && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
            });
        }
      } else if (type == "decimal_to_time") {
        if (isEmpty(value)) {
          return 0;
        } else {
          return bpNumberToTime(value);
        }
      } else if (type == "datetime") {
        var _date1 = $filter("date")(new Date(value), "yyyy-MM-dd HH:mm:ss");
        return _date1.toUpperCase();
      } else if (type == "date") {
        var _date2 = $filter("date")(new Date(value), "yyyy-MM-dd");
        return _date2.toUpperCase();
      } else if (type == "time") {
        if (isEmpty(value) || value.length < 4) {
          return "";
        } else {
          var _date3 = $filter("date")(new Date("1999/01/01 " + value), "HH:mm");
          if (_date3 == "NaN:NaN") {
            var newd = new Date();
            _date3 = $filter("date")(new Date(newd), "HH:mm");
          }
          return _date3.toUpperCase();
        }
      } else {
        return value;
      }
    };
  })
  .filter("filterbtnhide", function ($rootScope) {
    return function (array, index, DrillDown, rowItem) {
      var pusd = [];
      if (!isEmpty(DrillDown) && !isEmpty(array)) {
        angular.forEach(array, function (buttons) {
          if (typeof buttons.RowFieldName == "undefined" || eval("typeof $rootScope.ItemDtlData." + buttons.RowFieldName.toLowerCase() + "[" + index + "]." + buttons.fieldpath + "hideShow") == "undefined" || eval("$rootScope.ItemDtlData." + buttons.RowFieldName.toLowerCase() + "[" + index + "]." + buttons.fieldpath + "hideShow") != "hide") {
            angular.forEach(DrillDown, function (item, ind) {
              if (!isEmpty(item.criteria) && item.maingrouplinkparam == buttons.paramrealpath) {
                var res = checkdrillCriteria(item, rowItem);
                if (res) {
                  pusd.push(buttons);
                }
              } else if (item.maingrouplinkparam == buttons.paramrealpath) {
                pusd.push(buttons);
              }
            });
          }
        });
      } else {
        if (!isEmpty(array)) {
          angular.forEach(array, function (buttons) {
            try {
              if (typeof buttons.RowFieldName == "undefined" || eval("typeof $rootScope.ItemDtlData." + buttons.RowFieldName.toLowerCase() + "[" + index + "]." + buttons.fieldpath + "hideShow") == "undefined" || eval("$rootScope.ItemDtlData." + buttons.RowFieldName.toLowerCase() + "[" + index + "]." + buttons.fieldpath + "hideShow") != "hide") {
                pusd.push(buttons);
              }
            } catch (ex) {}
          });
        }
      }
      return pusd;
    };
  })
  .filter("DataViewDtlBtn", function () {
    return function (btn) {
      if (btn) {
        if (btn.batchnumber == "" || btn.metadatacode == "") {
          if (isEmpty(btn.meta_dm_transfer_process_mobile) || btn.actiontype == "insert") {
            return "header";
          } else {
            return "dtl";
          }
          //if (!isEmpty(btn.ordernum) && btn.ordernum < 100) {
          //    return 'dtl';
          //}
          //else if (!isEmpty(btn.batchnumber) && btn.batchnumber < 100) {
          //    return 'dtl';
          //}
          //else {
          //    return 'header';
          //}
        } else {
          return false;
        }
      }
    };
  })
  .filter("randomcolor", function () {
    return function (str) {
      if (str && !isObject(str)) {
        str = str.slice(0, 2);
      } else {
        str = "aa";
      }
      //  return "#" + ((1 << 24) * Math.random() | 0).toString(16);
      var hash = 0;
      var s = 80;
      var l = 40;
      for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      var h = hash % 360;
      return "hsl(" + h + ", " + s + "%, " + l + "%)";
    };
  })
  .filter("DataViewDtlBtnCheck", function () {
    return function (array) {
      var checkHeader = false;
      angular.forEach(array, function (btn) {
        if (isEmpty(btn.meta_dm_transfer_process_mobile)) {
          checkHeader = true;
        }
      });
      return checkHeader;
    };
  })
  .filter("combotype", function () {
    return function (path, array) {
      var type = true;
      var choosetype = "";
      if (!isEmpty(path)) {
        if (path.lastIndexOf(".") > 0) {
          var checkpath = path.substr(0, path.lastIndexOf("."));
          angular.forEach(array, function (item) {
            if (item.paramrealpath == checkpath) {
              type = item.datatype.toLowerCase();
              choosetype = item.choosetype;
            }
          });
        }
        if ((type == "group" || type == "rows") && choosetype != "single") {
          type = false;
        }
      }
      return type;
    };
  })
  //======================================== Layouts ======================
  .filter("getLayoutCards", function () {
    return function (array) {
      var cards = [];
      var charts = [];
      var lists = [];
      angular.forEach(array, function (item) {
        if (item.type == "card") {
          cards.push(item);
        }
        if (item.type == "chart") {
          charts.push(item);
        }
        if (item.type == "list") {
          lists.push(item);
        }
      });
      return { card: cards, list: lists, dash: charts };
    };
  })
  //======================================== show Label Value Check ======================
  .filter("getChartDatas", function () {
    return function (items, array) {
      var chartArray = [];
      angular.forEach(array, function (item) {
        if (item.paramrealpath.toLowerCase() == "chart1" || item.paramrealpath.toLowerCase() == "chart2" || item.paramrealpath.toLowerCase() == "chart3") {
          chartArray.push(item);
        }
      });
      return chartArray;
    };
  })
  .filter("showlabel", function () {
    return function (item, array) {
      if (!isEmpty(item) && item.isshow == "1") {
        try {
          var path = angular.copy(item.paramrealpath.toLowerCase());
          var v = item.paramrealpath.match(/\[(.*?)\]/g);
          angular.forEach(v, function (item) {
            path = path.replace(item, "");
          });
          if (eval("(typeof array." + path + "hideShow)") != undefined) {
            var value = eval("array." + path + "hideShow");
            var valueheader = eval("array." + path.substr(0, path.indexOf(".")).toLowerCase() + "hideShow");
            return value != "hide" && (valueheader != "hide" || valueheader == "hideShow");
          } else {
            return true;
          }
        } catch (ex) {
          return true;
        }
      } else {
        return false;
      }
    };
  })
  //.filter('showlabelRows', function () {
  //    return function (array) {
  //        var showarray = [];
  //        angular.forEach(array, function (item) {
  //            if (!isEmpty(item)) {
  //                try {
  //                    if (eval('(typeof array.' + item.paramrealpath.toLowerCase() + 'hideShow)') != undefined) {
  //                        var value = eval('array.' + item.paramrealpath.toLowerCase() + 'hideShow');
  //                        var valueheader = eval('array.' + item.paramrealpath.substr(0, item.paramrealpath.indexOf('.')).toLowerCase() + 'hideShow');
  //                        if ((value != 'hide' && (valueheader != 'hide' || valueheader == 'hideShow'))) {
  //                            showarray.push(item);
  //                        }
  //                    }
  //                    else {
  //                        showarray.push(item);
  //                    }
  //                }
  //                catch (ex) {
  //                    showarray.push(item);
  //                }
  //            }
  //            else {
  //                return false;
  //            }
  //        })
  //    }
  //})
  //row length sum column Withs
  .filter("setrowwidth", function () {
    return function (input) {
      if (input) {
        var arr = input.split(".").map(Number);
        var tot = 0;
        angular.forEach(arr, function (item) {
          tot = tot + item / 10;
        });
        if (tot > 50) {
          return tot + 1 + "vh";
        } else {
          return "";
        }
      } else return "";
    };
  })
  .filter("setFielCount", function () {
    return function (value) {
      var width = "";
      if (isEmpty(value)) {
        return (width = "{'clear':'both'}");
      } else {
        width = "{'width':'" + 100 / value + "%','float':'left'}";
      }
      return width;
    };
  })
  .filter("setcolumsize", function () {
    return function (item) {
      var width = "";
      if (!isEmpty(item)) {
        var wid = item / 10;
        width = "{'min-width':'" + wid + "%','max-width':'" + wid + "%'}";
      }

      return width;
    };
  })
  .filter("getProcessheaderHeight", function () {
    return function (item) {
      try {
        var processHeader = document.getElementById("processHeader").offsetHeight;
        var tabheight = 0;
        if ($("#headerTabTemplate1").length) {
          tabheight = document.getElementById("headerTabTemplate1").offsetHeight;
        }
        if ($("#footercomment").length) {
          tabheight += document.getElementById("footercomment").offsetHeight + 16;
        }

        return "calc(100vh - " + processHeader + "px - 66px - " + tabheight + "px);";
      } catch (ex) {}
    };
  })
  .filter("setcolumncs", function () {
    return function (item) {
      var style = "";
      var wid = "";
      if (!isEmpty(item.columnwidth)) {
        wid = item.columnwidth / 10;
      }
      style = "{'color':'" + item.textcolor + "','transform':'" + item.texttransform + "','font-weight':'" + item.textweight + "','min-width':'" + wid + "vh','max-width':'" + wid + "vh'}";
      return style;
    };
  })
  .filter("isdisable", function ($state, $rootScope) {
    return function (item, array, newpath) {
      if (!isEmpty(item)) {
        try {
          var path = item.paramrealpath.toLowerCase().replace(/\[(.*?)\]/g, "");
          if (!isEmpty(newpath)) {
            path = newpath;
          }
          if ($state.current.name == "appCombo") {
            path = $rootScope.selectRowsMenuRoot.paramrealpath.toLowerCase() + "." + path;
          }
          var value = eval("array." + path + "disable");
          if (value == "disable") {
            return true;
          } else {
            return false;
          }
        } catch (ex) {
          return false;
        }
      }
    };
  })
  .filter("dateRange", function () {
    return function (items, fromDate, fildStart, fildend) {
      var filtered = [];
      angular.forEach(items, function (item) {
        var from_date = Date.parse(item[fildStart]);
        var to_date = Date.parse(item[fildend]);
        if (Date.parse(fromDate) >= from_date && Date.parse(fromDate) <= to_date) {
          filtered.push(item);
        }
      });
      return filtered;
    };
  })
  .filter("processDtlLength", function () {
    return function (array) {
      var count = 0;
      angular.forEach(array, function (item) {
        if (item.isshow == 1) {
          var pathLength = item.paramrealpath.split(".");
          if (pathLength.length == 1) {
            count++;
          }
        }
      });
      return count;
    };
  })
  .filter("disableAutoSort", function () {
    return function (array) {
      if (array) return Object.keys(array);
      else return null;
    };
  })
  .filter("groupByCust", function ($filter) {
    return function (array, kye) {
      angular.forEach(array, function (item, index) {
        item.origIndex = index;
      });
      var dd = $filter("groupBy")(array, kye);
      return dd;
    };
  })

  .filter("reverseOrder", function () {
    return function (items) {
      console.log("items", items);
      return items.slice().reverse();
    };
  })
  .filter("refreshRep", function ($rootScope) {
    return function (items, value) {
      return items;
    };
  })
  .filter("getDataViewDataSub", function ($rootScope) {
    return function (items, value) {
      return items;
    };
  })
  .filter("getTemplateDataViewSubStr", function ($rootScope, $filter) {
    return function (items, config, type) {
      if (type == "process" && !isEmpty(items) && !isEmpty(items.paramrealpath)) {
        $rootScope.DataViewConfigSub = $filter("getDataViewConfig")(items, 0, $rootScope.ProcessLabelValue);
        $rootScope.DataViewDataSub = $rootScope.ItemDtlData[items.paramrealpath.toLowerCase()];
        $rootScope.DataViewDataRowStyle = $rootScope.ItemDtlData[items.paramrealpath.toLowerCase() + "style"];
        return getTemplateStr(items.dtltheme);
      } else if (items && !isEmpty(config) && !isEmpty(config.Style)) {
        $rootScope.DataViewConfigSub = config;
        $rootScope.DataViewDataSub = items;

        return getTemplateStr(config.Style.mobiletheme);
      } else {
        return null;
      }
    };
  })
  //.filter('getTemplateDataViewSubStr', function ($rootScope, $filter) {
  //    return function (array, config,type) {
  //        if (array) {
  //            $rootScope.DataViewConfigSub = config;
  //            $rootScope.DataViewDataSub = array;
  //            return getTemplateStr(config.Style.mobiletheme);
  //        }
  //        else {
  //            return null;
  //        }
  //    };
  //})
  .filter("getTemplatesub", function () {
    return function (num) {
      if (!isEmpty(num)) {
        switch (num) {
          //case '1':
          case "1":
            return "views/templates/templateDV/dvTemplate1.html";
          case "2":
          case "DV_theme2":
            return "views/templates/templateDV/dvTemplate2.html";
          case "3":
          case "DV_theme3":
            return "views/templates/templateDV/dvTemplate3_checkbox.html";
          case "4":
          case "DV_theme4":
            return "views/templates/templateDV/dvTemplate4.html";
          case "5":
          case "DV_theme5":
            return "views/templates/templateDV/dvTemplate5_profile.html";
          case "6":
          case "DV_theme6":
            return "views/templates/templateDV/dvTemplate6_Card.html";
          case "7":
          case "DV_theme7":
            return "views/templates/templateDV/dvTemplate7_cardDtl.html";
          case "8":
          case "DV_theme8":
            return "views/templates/templateDV/dvTemplate8_header.html";
          case "map":
            return "views/templates/map/map.html";
          case "9":
          case "DV_theme9":
            return "views/templates/templateDV/dvTemplate9_cardRowOnepage.html";
          case "10":
          case "DV_theme10":
            return "views/templates/templateDV/dvTemplate10_menu.html";
          case "11":
          case "DV_theme11":
            return "views/templates/templateDV/dvTemplate11.html";
          case "12":
          case "DV_theme14":
            return "views/templates/templateDV/dvTemplate14_chat.html";
          //         package
          case "PC_theme1":
            return "views/templates/templatePack/wsTimeSheet.html";
          //business process
          case "BP_theme1":
            return "views/templates/templateProcess/theme1_Item.html";
          case "BP_theme2":
            return "views/templates/templateProcess/theme2_Card.html";
          case "BP_theme3":
            return "views/templates/templateProcess/theme3.html";
          case "BP_theme4":
            return "views/templates/templateProcess/theme4_Keyboard.html";
          case "BP_theme5":
            return "views/templates/templateProcess/theme5_list.html";
          case "BP_theme6":
            return "views/templates/templateProcess/theme6_profile.html";
          case "BP_theme7":
            return "views/templates/templateProcess/theme7_slideView.html";
          //calendar
          case "calendar":
            return "views/templates/templateCalendar/CalenTemplate1.html";
          //WS Tab
        }
      }
    };
  })
  .filter("getTemplatesubRow", function () {
    return function (num) {
      if (!isEmpty(num)) {
        switch (num) {
          //business process
          case "1":
          case "BP_theme1":
            return "views/templates/templateProcess/theme1_Item.html";
          case "2":
          case "BP_theme2":
            return "views/templates/templateProcessSub/theme2sub.html";
          case "3":
          case "BP_theme3":
            return "views/templates/templateProcessSub/theme3sub.html";
          case "4":
          case "BP_theme4":
            return "views/templates/templateProcessSub/theme4_Keyboard.html";
          case "5":
          case "BP_theme5":
            return "views/templates/templateProcess/theme5_list.html";
          case "6":
          case "BP_theme6":
            return "views/templates/templateProcess/theme6_profile.html";
          case "7":
          case "BP_theme7":
            return "views/templates/templateProcess/theme7_slideView.html";
          case "8":
          case "BP_theme8":
            return "views/templates/templateProcesssub/theme8_onepagesub.html";
          //calendar
          case "calendar":
            return "views/templates/templateCalendar/CalenTemplate1.html";
          default:
            return "views/templates/templateProcessSub/theme3sub.html";
          //WS Tab
        }
      }
    };
  })
  .filter("getTemplateDirector", function () {
    return function (num) {
      if (!isEmpty(num)) {
        switch (num) {
          //business process
          case "1":
            return '<template1dv value="menudtl"></template1dv>';
          case "2":
            return '<template2dv value="menudtl"></template2dv>';
          case "3":
            return '<template3dv value="menudtl"></template3dv>';
          case "4":
            return '<template4dv value="menudtl"></template4dv>';
          case "5":
            return '<template5dv value="menudtl"></template5dv>';
          case "6":
            return '<template6dv value="menudtl"></template6dv>';
          case "7":
            return '<template7dv value="menudtl"></template7dv>';
          case "8":
            return '<template8dv value="menudtl"></template8dv>';
        }
      }
    };
  })

  .filter("getDataViewConfig", function ($filter, $rootScope) {
    return function (field, indexItem, array, datas) {
      if (!isEmpty(field)) {
        var DataViewConfig = {};
        DataViewConfig.ProcessDtlBtns = [];
        DataViewConfig.ShowImg = [];
        DataViewConfig.ShowColumn = [];
        DataViewConfig.ShowColumnFirst = [];
        DataViewConfig.ShowButton = [];
        DataViewConfig.isshowdelete = field.isshowdelete;
        DataViewConfig.Style = { showcheckbox: "true" };
        var fields = $filter("getRows")(array, field);

        angular.forEach(fields, function (item, index) {
          var path = item.paramrealpath;
          item.fieldpath = path.replace(field.paramrealpath + ".", "");
          try {
            //var pathArray = item.paramrealpath.toLowerCase().split('.');
            if (item.recordtype != "rows" && item.recordtype != "row") {
              if (item.datatype != "file" && item.datatype != "base64" && item.datatype != "button") {
                DataViewConfig.ShowColumnFirst.push(item);
              }
              if (item.datatype == "button" && (eval("typeof $rootScope.ItemDtlData." + item.paramrealpath.toLowerCase() + "hideShow") == "undefined" || eval("$rootScope.ItemDtlData." + item.paramrealpath.toLowerCase() + "hideShow") != "hide")) {
                item.processname = item.labelname;
                DataViewConfig.ProcessDtlBtns.push(item);
                DataViewConfig.ShowButton.push(item);
              } else if (item.datatype == "file" || item.datatype == "base64") {
                DataViewConfig.ShowImg.push(item);
              } else if (eval("typeof $rootScope.ItemDtlData." + item.paramrealpath.toLowerCase() + "hideShow") == "undefined" || eval("$rootScope.ItemDtlData." + item.paramrealpath.toLowerCase() + "hideShow") != "hide") {
                DataViewConfig.ShowColumn.push(item);
              }
              //else if (pathArray.length == 2) {
              //    var dtlArr = $rootScope.ItemDtlData[pathArray[0]];
              //    angular.forEach(dtlArr, function (dtlItem) {
              //        if (dtlItem[pathArray[1] + 'hideShow'] == 'show') {
              //            DataViewConfig.ShowColumn.push(item);
              //        }
              //    })
              //}
            }
          } catch (ex) {}
        });
        try {
          DataViewConfig.Style.groupfield = eval("$rootScope.ItemDtlData." + fields[0].RowFieldName.toLowerCase() + ".groupfield.toLowerCase()");
          DataViewConfig.Style.groupfieldexpand = eval("$rootScope.ItemDtlData." + fields[0].RowFieldName.toLowerCase() + ".groupfieldexpand.toLowerCase()");
        } catch (ex) {}
        return DataViewConfig;
      }
    };
  })
  .filter("getDataViewConfigInProcess", function () {
    return function (array, field, itemData) {
      var ShowImg = [];
      var ShowColumn = [];
      var ShowButton = [];
      angular.forEach(array, function (item) {
        if (!isEmpty(item.paramrealpath) && item.isshow == 1) {
          var long = item.paramrealpath.split(".");
          if (long.length > 1 && long[0].toLowerCase() == field.paramrealpath.toLowerCase() && field.recordtype.toLowerCase() == "rows") {
            item.RowFieldName = long[0].toLowerCase();
            item.fieldpath = item.paramrealpath;
            if (item.datatype == "file" || item.datatype == "base64") {
              item.fieldpath = item.fieldpath.toLowerCase().replace(item.RowFieldName + ".", "");
              ShowImg.push(item);
            } else if (item.datatype == "button") {
              item.fieldpath = item.fieldpath.toLowerCase().replace(item.RowFieldName + ".", "");
              ShowButton.push(item);
            } else if (item.isshow) {
              if (item.lookuptype == "combo" || item.lookuptype == "popup") {
                item.fieldpath = item.fieldpath + "combo.name";
              }
              item.fieldpath = item.fieldpath.toLowerCase().replace(item.RowFieldName + ".", "");
              try {
                if (eval("typeof itemData." + item.paramrealpath.toLowerCase() + 'hideShow!= "undefined"')) {
                  var value = eval("itemData." + item.paramrealpath.toLowerCase() + "hideShow");
                  var valueheader = eval("itemData." + item.paramrealpath.substr(0, item.paramrealpath.indexOf(".")).toLowerCase() + "hideShow");
                  if (value != "hide" && (valueheader != "hide" || valueheader == "hideShow")) {
                    ShowColumn.push(item);
                  }
                } else {
                  ShowColumn.push(item);
                }
              } catch (ex) {
                ShowColumn.push(item);
              }
            }
          }
        }
      });
      return { ShowImg: ShowImg, ShowColumn: ShowColumn, ShowButton: ShowButton };
    };
  })
  .filter("getDataViewData", function () {
    function getDVData(field, array) {
      if (isObject(field) && isObject(array)) {
        return eval("array." + field.paramrealpath.toLowerCase());
      }
    }
    getDVData.$stateful = true;

    return getDVData;
  })

  .filter("getChartPie", function () {
    return function (items, value) {
      var options = {
        allLabels: [
          {
            y: "40%",
            align: "center",
            size: 14,
            text: "65%",
            color: "#000",
          },
          {
            y: "50%",
            align: "center",
            size: 12,
            text: "TOTAL",
            color: "#7884a2",
          },
        ],
        //"data":,
        title: "title hello",
        theme: "black",
        type: "pie",
        addClassNames: true,
        legend: {
          enabled: true,
          position: "right",
          valueAlign: "left",
          align: "center",
          markerType: "circle",
        },
        data: [
          {
            country: "18-25",
            litres: 37,
            color: "#ed6baf",
          },
          {
            country: "26-34",
            litres: 12,
            color: "#584378",
          },
        ],
        colors: ["#cc4748", "#fdd400", "#84b761", "#67b7dc", "#cd82ad", "#2f4074", "#448e4d", "#b7b83f", "#b9783f", "#b93e3d", "#913167"],
        titleField: "country",
        valueField: "litres",
        labelRadius: 5,
        radius: "30%",
        innerRadius: "68%",
        startDuration: 0,
        labelText: "[[title]] ([[percents]]%)",
        sequencedAnimation: true,
        labelsEnabled: false,
      };
      return options;
    };
  })
  //=====================================factory========================
  .factory("MobileQr", function ($q) {
    return {
      barcodeScanner: function () {
        var defer = $q.defer();
        cordova.plugins.barcodeScanner.scan(
          function (result) {
            defer.resolve(result);
          },
          function (error) {
            defer.resolve(null);
          }
        );
        return defer.promise;
      },
    };
  })
  .factory("HelpFn", function ($q) {
    return {
      checkToImgPath: function (path) {
        var defer = $q.defer();
        var img = new Image();
        img.onload = function () {
          defer.resolve(true);
        };
        img.onerror = function () {
          defer.resolve(false);
        };
        img.src = path;
        return defer.promise;
      },
    };
  })
  .directive("formatInput", function ($filter, $browser) {
    return {
      restrict: "AE",
      require: "ngModel",
      link: function ($scope, $element, $attrs, ngModelCtrl) {
        var type = "number";
        var listener = function () {
          var value = $element.val().replace(/,/g, "");
          $element.val($filter("formatNumberToString")(value, type));
        };
        ngModelCtrl.$parsers.push(function (viewValue) {
          return viewValue;
        });
        ngModelCtrl.$render = function () {
          $element.val($filter("formatNumberToString")(ngModelCtrl.$viewValue, type));
        };

        $element.bind("change", listener);
      },
    };
  })
  .directive("nextFocusElem", function () {
    return {
      restrict: "A",
      link: function ($scope, selem, attrs) {
        selem.bind("keydown", function (e) {
          var code = e.keyCode || e.which;
          if (code === 13) {
            e.preventDefault();
            var pageElems = document.querySelectorAll("input, select, textarea"),
              elem = e.srcElement || e.target,
              focusNext = false,
              len = pageElems.length;
            for (var i = 0; i < len; i++) {
              var pe = pageElems[i];
              if (focusNext) {
                if (pe.style.display !== "none" && !pe.classList.contains("ng-hide") && !pe.disabled) {
                  pe.focus();
                  break;
                }
              } else if (pe === elem) {
                // cordova.plugins.Keyboard.close();
                focusNext = true;
              }
            }
          }
        });
      },
    };
  });
