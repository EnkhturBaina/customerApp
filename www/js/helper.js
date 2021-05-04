function getHeaderAndContentValues(array, field) {
  var fieldValue = [];
  var fieldValueEnd = [];
  angular.forEach(array, function (v) {
    if (!isEmpty(v[field]) && v.isinput === 1) {
      fieldValue.push(v);
    } else if (v.isinput === 1) {
      fieldValueEnd.push(v);
    }
  });
  var row = { header: fieldValue, content: fieldValueEnd };
  return row;
}
function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}
function isBase64(str) {
  try {
    return btoa(atob(str)) == str;
  } catch (err) {
    return false;
  }
}
function isURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
}
function numberToTime(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  return h + ":" + m;
}
function getinputType(type) {
  type = type.toLowerCase();
  if (type == "number" || type == "bigdecimal" || type == "decimal") {
    return "tel";
  } else {
    return "text";
  }
}
function getImgPath(data, newimg) {
  if (!isEmpty(data) && data.lastIndexOf("♠") != -1 && isBase64(data.substr(data.lastIndexOf("♠") + 1, data.length))) {
    var mimeType = data.substr(0, data.lastIndexOf("♠"));
    return "data:" + getToMimeType(mimeType) + ";base64," + data.substr(data.lastIndexOf("♠") + 1, data.length);
    //data = data.replace("jpeg♠", "").replace("gif♠", "").replace("png♠", "");
    //if (data.replace("jpeg♠", "").charAt(0) == '/') {
    //    return "data:image/jpg;base64," + data.replace("jpeg♠", "");
    //} else if (data.replace("gif♠", "").charAt(0) == 'R') {
    //    return "data:image/gif;base64," + data.replace("gif♠", "");
    //} else if (data.replace("png♠", "").charAt(0) == 'i') {
    //    return "data:image/png;base64," + data.replace("png♠", "");
    //}
  } else {
    if (!isEmpty(data)) {
      return GolobalImagePath + "" + data;
    }
    if (newimg) {
      return newimg;
    } else {
      return "img/no-image-box.png";
    }
  }
}
function isObject(object) {
  if (object !== null && typeof object === "object" && Object.keys(object).length > 0) {
    return true;
  } else {
    return false;
  }
}
function getSort(arr, prop, asc) {
  arr = arr.sort(function (a, b) {
    if (asc) {
      return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0;
    } else {
      return b[prop] > a[prop] ? 1 : b[prop] < a[prop] ? -1 : 0;
    }
  });
  return arr;
}
String.prototype.replaceAll = function (str1, str2, ignore) {
  return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), ignore ? "gi" : "g"), typeof str2 === "string" ? str2.replace(/\$/g, "$$$$") : str2);
};
function getContentHeader(array, field) {
  var fieldValue = [];
  var fieldValueEnd = [];
  angular.forEach(array, function (v) {
    if (!isEmpty(v[field]) && v.isinput === 1 && v.isshow === 1) {
      fieldValue.push(v);
    } else if (v.isinput === 1 && v.isshow === 1) {
      fieldValueEnd.push(v);
    }
  });
  var row = { header: fieldValue, content: fieldValueEnd };
  return row;
}
function getFunctioninString(name, str) {
  var functionName = "function " + name;
  var index = str.indexOf(functionName);
  var functionBody = "";
  if (index != -1) {
    index += functionName.length;
    functionBody = functionName;

    var charArray = str.split("");
    var isFoundOpenBracket = 0;
    var bracketCount = 0;
    for (i = index; i < charArray.length; i++) {
      var char = charArray[i];
      functionBody += char;

      if (char == "{") {
        isFoundOpenBracket = 1;
        bracketCount += 1;
      } else if (char == "}") {
        bracketCount -= 1;
      }
      if (isFoundOpenBracket == 1 && bracketCount == 0) {
        break;
      }
    }
    return functionBody;
  }
  return null;
}
function getVariableinString(str) {
  var strar = str.match(/var [^;]*/g);
  for (index in strar) {
    str = str.replaceAll(strar[index] + ";", "");
  }
  if (!isEmpty(strar)) strar = strar.toString().replaceAll(",", ";");
  else strar = null;

  return { variable: strar, strVal: str };
}
String.prototype.getNameMatch = function (regexp) {
  var matches = [];
  this.replace(regexp, function () {
    var arr = [].slice.call(arguments, 0);
    arr.splice(-2);
    var name = arr[1];
    if (name.indexOf("(") > -1) {
      name = name.substr(0, name.indexOf("("));
    }
    matches.push(name);
  });
  return matches.length ? matches : null;
};
function getFunctionsToString(str) {
  if (!isEmpty(str)) {
    var funtionNames = str.getNameMatch(/function[\s\n]+(\S+)[\s\n]*\(/gi);
    var returnVal = "";
    if (!isEmpty(funtionNames)) {
      for (ind in funtionNames) {
        var func = getFunctioninString(funtionNames[ind], str);
        returnVal += "" + func;
      }
    }
    return returnVal;
  } else return "";
}
function reqiuestJsonFormat(url, json) {
  if (url && json) {
    var type = url.substr(url.lastIndexOf("/") + 1, url.length);
    if (type == "runJson") return JSON.stringify(json);
    else return ecomZ(json);
  } else return null;
}
function checkDVCriteria(json) {
  if (!isEmpty(json)) {
    for (key in json) {
      var obj = json[key];
      if (isEmpty(obj) || (isEmpty(obj[0].operand) && obj[0].operator != "IS NULL")) {
        delete json[key];
      }
    }
    return json;
  } else {
    return json;
  }
}

function getstringtonumber(string) {
  var regex = /[0-9.]/g;
  var stringArray = string.toString().match(regex);
  var number = 0;
  if (!isEmpty(stringArray)) {
    number = parseFloat(stringArray.toString().replace(/,/g, ""));
    if (number == NaN) number = 0;
  }

  return number;
}
// get Number
function gettimestamp() {
  return Math.round(new Date().getTime() / 1000);
}
function getrand(min, max) {
  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getstr_shuffle(str) {
  str += "";
  var newStr = "";
  var rand;
  var i = str.length;
  while (i) {
    rand = Math.floor(Math.random() * i);
    newStr += str.charAt(rand);
    str = str.substring(0, rand) + str.substr(rand + 1);
    i--;
  }

  return newStr;
}
function getUID() {
  var dd = gettimestamp() * getrand();
  return gettimestamp() + getstr_shuffle(getstr_shuffle(dd.toString().substr(0, 6)));
}
// ============================================== file =========================================
function getFileContentAsBase64(path, callback) {
  window.resolveLocalFileSystemURL(path, gotFile, fail);

  function fail(e) {
    callback(path, "");
  }

  function gotFile(fileEntry) {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var fileConf = fileExtentionConvert(file);
        var base64 = this.result;
        if (!isEmpty(base64) && !isEmpty(file.type)) {
          base64 = fileConf.type + "♠" + base64.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
        }
        fileEntry.size = fileConf.size;
        fileEntry.type = fileConf.type;
        if (fileEntry.nativeURL.startsWith("content://")) {
          window.FilePath.resolveNativePath(fileEntry.nativeURL, function (local) {
            fileEntry.nativeURL = local;
            callback(base64, fileEntry);
          });
        } else {
          callback(base64, fileEntry);
        }
      };
      reader.readAsDataURL(file);
    });
  }
}

//async function getFileContentArryaBase64(array, config) {
//    const promises = [];

//    angular.forEach(array, function (x) {
//        var prom = await getfileAsBaseAsync(x, config)
//        promises.push(prom);
//    });

//    return promises;
//}
function getfileAsBaseAsync(json, config) {
  return new Promise(function (resolve) {
    var path = eval("json." + config.paramrealpath.split(".")[1].toLowerCase());
    if (!isEmpty(path) && !isBase64(path)) {
      window.resolveLocalFileSystemURL(path, gotFile, fail);
      function fail(e) {
        resolve(json);
      }
      function gotFile(fileEntry) {
        fileEntry.file(function (file) {
          var reader = new FileReader();
          reader.onloadend = function (e) {
            var fileConf = fileExtentionConvert(file);
            var base64 = this.result;
            if (!isEmpty(base64) && !isEmpty(file.type)) {
              base64 = fileConf.type + "♠" + base64.replace(/data:([A-Za-z0-9_.\\/\-;:]+)base64,/g, "");
            }
            fileEntry.size = fileConf.size;
            fileEntry.type = fileConf.type;
            eval("json." + config.paramrealpath.split(".")[1].toLowerCase() + "='" + base64 + "'");
            resolve(json);
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      resolve(json);
    }
  });
}

function fileExtentionConvert(file, base64) {
  //define('CONFIG_FILE_EXT','png,gif,jpeg,pjpeg,jpg,x-png,bmp,doc,docx,xls,xlsx,pdf,ppt,pptx');
  //application/vnd.openxmlformats-officedocument.wordprocessingml.document(.docx)
  //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet(.xlsx)
  //application/vnd.openxmlformats-officedocument.presentationml.presentation(.pptx)
  if (file.type) {
    file.type = convertToMimeType(file.type);
    //file.type.replace('image/', '')
    //.replace('application/', '')
    //.replace('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx')
    //.replace('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx')
    //.replace('application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx');
  }
  return file;
}
function convertToMimeType(mime) {
  var mime_map = {
    "video/3gpp2": "3g2",
    "video/3gp": "3gp",
    "video/3gpp": "3gp",
    "application/x-compressed": "7zip",
    "audio/x-acc": "aac",
    "audio/ac3": "ac3",
    "application/postscript": "ai",
    "audio/x-aiff": "aif",
    "audio/aiff": "aif",
    "audio/x-au": "au",
    "video/x-msvideo": "avi",
    "video/msvideo": "avi",
    "video/avi": "avi",
    "application/x-troff-msvideo": "avi",
    "application/macbinary": "bin",
    "application/mac-binary": "bin",
    "application/x-binary": "bin",
    "application/x-macbinary": "bin",
    "image/bmp": "bmp",
    "image/x-bmp": "bmp",
    "image/x-bitmap": "bmp",
    "image/x-xbitmap": "bmp",
    "image/x-win-bitmap": "bmp",
    "image/x-windows-bmp": "bmp",
    "image/ms-bmp": "bmp",
    "image/x-ms-bmp": "bmp",
    "application/bmp": "bmp",
    "application/x-bmp": "bmp",
    "application/x-win-bitmap": "bmp",
    "application/cdr": "cdr",
    "application/coreldraw": "cdr",
    "application/x-cdr": "cdr",
    "application/x-coreldraw": "cdr",
    "image/cdr": "cdr",
    "image/x-cdr": "cdr",
    "zz-application/zz-winassoc-cdr": "cdr",
    "application/mac-compactpro": "cpt",
    "application/pkix-crl": "crl",
    "application/pkcs-crl": "crl",
    "application/x-x509-ca-cert": "crt",
    "application/pkix-cert": "crt",
    "text/css": "css",
    "text/x-comma-separated-values": "csv",
    "text/comma-separated-values": "csv",
    "application/vnd.msexcel": "csv",
    "application/x-director": "dcr",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/x-dvi": "dvi",
    "message/rfc822": "eml",
    "application/x-msdownload": "exe",
    "video/x-f4v": "f4v",
    "audio/x-flac": "flac",
    "video/x-flv": "flv",
    "image/gif": "gif",
    "application/gpg-keys": "gpg",
    "application/x-gtar": "gtar",
    "application/x-gzip": "gzip",
    "application/mac-binhex40": "hqx",
    "application/mac-binhex": "hqx",
    "application/x-binhex40": "hqx",
    "application/x-mac-binhex40": "hqx",
    "text/html": "html",
    "image/x-icon": "ico",
    "image/x-ico": "ico",
    "image/vnd.microsoft.icon": "ico",
    "text/calendar": "ics",
    "application/java-archive": "jar",
    "application/x-java-application": "jar",
    "application/x-jar": "jar",
    "image/jp2": "jp2",
    "video/mj2": "jp2",
    "image/jpx": "jp2",
    "image/jpm": "jp2",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
    "image/pjpeg": "jpeg",
    "application/x-javascript": "js",
    "application/json": "json",
    "text/json": "json",
    "application/vnd.google-earth.kml+xml": "kml",
    "application/vnd.google-earth.kmz": "kmz",
    "text/x-log": "log",
    "audio/x-m4a": "m4a",
    "application/vnd.mpegurl": "m4u",
    "audio/midi": "mid",
    "application/vnd.mif": "mif",
    "video/quicktime": "mov",
    "video/x-sgi-movie": "movie",
    "audio/mpeg": "mp3",
    "audio/mpg": "mp3",
    "audio/mpeg3": "mp3",
    "audio/mp3": "mp3",
    "video/mp4": "mp4",
    "video/mpeg": "mpeg",
    "application/oda": "oda",
    "audio/ogg": "ogg",
    "video/ogg": "ogg",
    "application/ogg": "ogg",
    "application/x-pkcs10": "p10",
    "application/pkcs10": "p10",
    "application/x-pkcs12": "p12",
    "application/x-pkcs7-signature": "p7a",
    "application/pkcs7-mime": "p7c",
    "application/x-pkcs7-mime": "p7c",
    "application/x-pkcs7-certreqresp": "p7r",
    "application/pkcs7-signature": "p7s",
    "application/pdf": "pdf",
    "application/octet-stream": "pdf",
    "application/x-x509-user-cert": "pem",
    "application/x-pem-file": "pem",
    "application/pgp": "pgp",
    "application/x-httpd-php": "php",
    "application/php": "php",
    "application/x-php": "php",
    "text/php": "php",
    "text/x-php": "php",
    "application/x-httpd-php-source": "php",
    "image/png": "png",
    "image/x-png": "png",
    "application/powerpoint": "ppt",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.ms-office": "ppt",
    "application/msword": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/x-photoshop": "psd",
    "image/vnd.adobe.photoshop": "psd",
    "audio/x-realaudio": "ra",
    "audio/x-pn-realaudio": "ram",
    "application/x-rar": "rar",
    "application/rar": "rar",
    "application/x-rar-compressed": "rar",
    "audio/x-pn-realaudio-plugin": "rpm",
    "application/x-pkcs7": "rsa",
    "text/rtf": "rtf",
    "text/richtext": "rtx",
    "video/vnd.rn-realvideo": "rv",
    "application/x-stuffit": "sit",
    "application/smil": "smil",
    "text/srt": "srt",
    "image/svg+xml": "svg",
    "application/x-shockwave-flash": "swf",
    "application/x-tar": "tar",
    "application/x-gzip-compressed": "tgz",
    "image/tiff": "tiff",
    "text/plain": "txt",
    "text/x-vcard": "vcf",
    "application/videolan": "vlc",
    "text/vtt": "vtt",
    "audio/x-wav": "wav",
    "audio/wave": "wav",
    "audio/wav": "wav",
    "application/wbxml": "wbxml",
    "video/webm": "webm",
    "audio/x-ms-wma": "wma",
    "application/wmlc": "wmlc",
    "video/x-ms-wmv": "wmv",
    "video/x-ms-asf": "wmv",
    "application/xhtml+xml": "xhtml",
    "application/excel": "xl",
    "application/msexcel": "xls",
    "application/x-msexcel": "xls",
    "application/x-ms-excel": "xls",
    "application/x-excel": "xls",
    "application/x-dos_ms_excel": "xls",
    "application/xls": "xls",
    "application/x-xls": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xlsx",
    "application/xml": "xml",
    "text/xml": "xml",
    "text/xsl": "xsl",
    "application/xspf+xml": "xspf",
    "application/x-compress": "z",
    "application/x-zip": "zip",
    "application/zip": "zip",
    "application/x-zip-compressed": "zip",
    "application/s-compressed": "zip",
    "multipart/x-zip": "zip",
    "text/x-scriptzsh": "zsh",
  };
  return mime_map[mime];
}
function getToMimeType(mime) {
  var mime_map = {
    "3g2": "video/3gpp2",
    "3gp": "video/3gp",
    "3gp": "video/3gpp",
    "7zip": "application/x-compressed",
    aac: "audio/x-acc",
    ac3: "audio/ac3",
    ai: "application/postscript",
    aif: "audio/x-aiff",
    aif: "audio/aiff",
    au: "audio/x-au",
    avi: "video/x-msvideo",
    avi: "video/msvideo",
    avi: "video/avi",
    avi: "application/x-troff-msvideo",
    bin: "application/macbinary",
    bin: "application/mac-binary",
    bin: "application/x-binary",
    bin: "application/x-macbinary",
    bmp: "image/bmp",
    bmp: "image/x-bmp",
    bmp: "image/x-bitmap",
    bmp: "image/x-xbitmap",
    bmp: "image/x-win-bitmap",
    bmp: "image/x-windows-bmp",
    bmp: "image/ms-bmp",
    bmp: "image/x-ms-bmp",
    bmp: "application/bmp",
    bmp: "application/x-bmp",
    bmp: "application/x-win-bitmap",
    cdr: "application/cdr",
    cdr: "application/coreldraw",
    cdr: "application/x-cdr",
    cdr: "application/x-coreldraw",
    cdr: "image/cdr",
    cdr: "image/x-cdr",
    cdr: "zz-application/zz-winassoc-cdr",
    cpt: "application/mac-compactpro",
    crl: "application/pkix-crl",
    crl: "application/pkcs-crl",
    crt: "application/x-x509-ca-cert",
    crt: "application/pkix-cert",
    css: "text/css",
    csv: "text/x-comma-separated-values",
    csv: "text/comma-separated-values",
    csv: "application/vnd.msexcel",
    dcr: "application/x-director",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    dvi: "application/x-dvi",
    eml: "message/rfc822",
    exe: "application/x-msdownload",
    f4v: "video/x-f4v",
    flac: "audio/x-flac",
    flv: "video/x-flv",
    gif: "image/gif",
    gpg: "application/gpg-keys",
    gtar: "application/x-gtar",
    gzip: "application/x-gzip",
    hqx: "application/mac-binhex40",
    hqx: "application/mac-binhex",
    hqx: "application/x-binhex40",
    hqx: "application/x-mac-binhex40",
    html: "text/html",
    ico: "image/x-icon",
    ico: "image/x-ico",
    ico: "image/vnd.microsoft.icon",
    ics: "text/calendar",
    jar: "application/java-archive",
    jar: "application/x-java-application",
    jar: "application/x-jar",
    jp2: "image/jp2",
    jp2: "video/mj2",
    jp2: "image/jpx",
    jp2: "image/jpm",
    jpg: "image/jpg",
    jpeg: "image/jpeg",
    jpeg: "image/pjpeg",
    js: "application/x-javascript",
    json: "application/json",
    json: "text/json",
    kml: "application/vnd.google-earth.kml+xml",
    kmz: "application/vnd.google-earth.kmz",
    log: "text/x-log",
    m4a: "audio/x-m4a",
    m4u: "application/vnd.mpegurl",
    mid: "audio/midi",
    mif: "application/vnd.mif",
    mov: "video/quicktime",
    movie: "video/x-sgi-movie",
    mp3: "audio/mpeg",
    mp3: "audio/mpg",
    mp3: "audio/mpeg3",
    mp3: "audio/mp3",
    mp4: "video/mp4",
    mpeg: "video/mpeg",
    oda: "application/oda",
    ogg: "audio/ogg",
    ogg: "video/ogg",
    ogg: "application/ogg",
    p10: "application/x-pkcs10",
    p10: "application/pkcs10",
    p12: "application/x-pkcs12",
    p7a: "application/x-pkcs7-signature",
    p7c: "application/pkcs7-mime",
    p7c: "application/x-pkcs7-mime",
    p7r: "application/x-pkcs7-certreqresp",
    p7s: "application/pkcs7-signature",
    pdf: "application/pdf",
    pem: "application/x-x509-user-cert",
    pem: "application/x-pem-file",
    pgp: "application/pgp",
    php: "application/x-httpd-php",
    php: "application/php",
    php: "application/x-php",
    php: "text/php",
    php: "text/x-php",
    php: "application/x-httpd-php-source",
    png: "image/png",
    ppt: "application/powerpoint",
    ppt: "application/vnd.ms-powerpoint",
    ppt: "application/vnd.ms-office",
    ppt: "application/msword",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    psd: "application/x-photoshop",
    psd: "image/vnd.adobe.photoshop",
    ra: "audio/x-realaudio",
    ram: "audio/x-pn-realaudio",
    rar: "application/x-rar",
    rar: "application/rar",
    rar: "application/x-rar-compressed",
    rpm: "audio/x-pn-realaudio-plugin",
    rsa: "application/x-pkcs7",
    rtf: "text/rtf",
    rtx: "text/richtext",
    rv: "video/vnd.rn-realvideo",
    sit: "application/x-stuffit",
    smil: "application/smil",
    srt: "text/srt",
    svg: "image/svg+xml",
    swf: "application/x-shockwave-flash",
    tar: "application/x-tar",
    tgz: "application/x-gzip-compressed",
    tiff: "image/tiff",
    txt: "text/plain",
    vcf: "text/x-vcard",
    vlc: "application/videolan",
    vtt: "text/vtt",
    wav: "audio/x-wav",
    wav: "audio/wave",
    wav: "audio/wav",
    wbxml: "application/wbxml",
    webm: "video/webm",
    wma: "audio/x-ms-wma",
    wmlc: "application/wmlc",
    wmv: "video/x-ms-wmv",
    wmv: "video/x-ms-asf",
    xhtml: "application/xhtml+xml",
    xl: "application/excel",
    xls: "application/msexcel",
    xls: "application/x-msexcel",
    xls: "application/x-ms-excel",
    xls: "application/x-excel",
    xls: "application/x-dos_ms_excel",
    xls: "application/xls",
    xls: "application/x-xls",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xlsx: "application/vnd.ms-excel",
    xml: "application/xml",
    xml: "text/xml",
    xsl: "text/xsl",
    xspf: "application/xspf+xml",
    z: "application/x-compress",
    zip: "application/x-zip",
    zip: "application/zip",
    zip: "application/x-zip-compressed",
    zip: "application/s-compressed",
    zip: "multipart/x-zip",
    zsh: "text/x-scriptzsh",
  };
  return mime_map[mime];
}
function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
}
function savebase64AsPDF(folderpath, filename, content, contentType, callBack) {
  // Convert the base64 string in a Blob
  var DataBlob = b64toBlob(content, contentType);
  window.resolveLocalFileSystemURL(folderpath, function (dir) {
    dir.getFile(filename, { create: true }, function (file) {
      file.createWriter(
        function (fileWriter) {
          fileWriter.write(DataBlob);
          var finalPath = folderpath + filename;
          callBack(finalPath);
          // window.open(finalPath, "_system", "location=yes");
        },
        function () {
          callBack("");
        }
      );
    });
  });
}
//============ DATE =========================
function datediff(type, fromDate, toDate) {
  if (fromDate !== "" && toDate !== "") {
    if (type === "day") {
      if (fromDate == "sysdate") {
        var dateFrom = Date.parse(new Date());
      } else {
        var dateFrom = Date.parse(fromDate);
      }
      if (toDate == "sysdate") {
        var dateTo = Date.parse(new Date());
      } else {
        var dateTo = Date.parse(toDate);
      }

      var difference = dateFrom - dateTo;
      var datediff = Math.floor(difference / 86400);

      return datediff;
    } else if (type === "month") {
      if (fromDate == "sysdate") {
        var dateFrom = Date.parse(new Date());
      } else {
        var dateFrom = Date.parse(fromDate);
      }
      if (toDate == "sysdate") {
        var dateTo = Date.parse(new Date());
      } else {
        var dateTo = Date.parse(toDate);
      }

      var fromYear = new Date(dateFrom).getFullYear;
      var fromMonth = new Date(dateFrom).getMonth;
      var toYear = new Date(dateTo).getFullYear;
      var toMonth = new Date(dateTo).getMonth;

      if (fromYear == toYear && fromMonth == toMonth) {
        return 0;
      } else if (fromYear == toYear) {
        return fromMonth - toMonth + 1;
      } else {
        return 12 - toMonth + 1 + fromMonth;
      }
    } else if (type === "year") {
      if (fromDate == "sysdate") {
        var dateFrom = Date.parse(new Date());
      } else {
        var dateFrom = Date.parse(fromDate);
      }
      if (toDate == "sysdate") {
        var dateTo = Date.parse(new Date());
      } else {
        var dateTo = Date.parse(toDate);
      }

      var difference = dateFrom - dateTo;
      var datediff = Math.floor(difference / 31536000);

      return datediff;
    } else if (type === "hourminute") {
      if (fromDate == "sysdate") {
        var dateFrom = new Date(date("Y/m/d H:i:s")).getTime();
      } else {
        var dateFrom = new Date("1999/01/01 " + fromDate + ":00").getTime();
      }

      if (toDate == "sysdate") {
        var dateTo = new Date().getTime();
      } else {
        var dateTo = new Date("1999/01/01 " + toDate + ":00").getTime();
      }

      var hourDiff = dateTo - dateFrom; //in ms
      var minDiff = hourDiff / 60 / 1000; //in minutes
      var hDiff = hourDiff / 3600 / 1000; //in hours
      var humanReadable = {};
      humanReadable.hours = Math.floor(hDiff);
      humanReadable.minutes = minDiff - 60 * humanReadable.hours;

      return humanReadable;
    }
  }
  return null;
}
function DateFormat(array, config) {
  var returnVal = null;
  if (!isEmpty(array)) {
    var input = array[config.paramrealpath.toLowerCase()];
    if (!isEmpty(input)) {
      if (config.datatype == "datetime") {
        var _date1 = $filter("date")(new Date(input), "yyyy-MM-dd HH:mm:ss");
        returnVal = _date1.toUpperCase();
      } else if (config.datatype == "date") {
        var _date2 = $filter("date")(new Date(input), "yyyy-MM-dd");
        returnVal = _date2.toUpperCase();
      } else if (config.datatype == "time") {
        var _date3 = $filter("date")(new Date(input), "HH:mm");
        returnVal = _date3.toUpperCase();
      }
    }
  }
  return returnVal;
}
function getDateToday() {
  return {
    start: formatDate(new Date()),
    end: formatDate(new Date()),
  };
}
function getDateWeek(customeDate) {
  var d = new Date();
  if (!isEmpty(customeDate)) {
    d = new Date(customeDate);
  }
  var day = d.getDay();
  var weekStart = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
  var weekEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
  return {
    start: formatDate(weekStart),
    end: formatDate(weekEnd),
  };
}
function getDateMonth(customeDate) {
  var d = new Date();
  if (!isEmpty(customeDate)) {
    d = new Date(customeDate);
  }
  var monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
  var monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return {
    start: formatDate(monthStart),
    end: formatDate(monthEnd),
  };
}
function getThisYear(customeDate) {
  var d = new Date();
  if (!isEmpty(customeDate)) {
    d = new Date(customeDate);
  }
  var monthStart = new Date(d.getFullYear(), 0, 1);
  var monthEnd = d;
  return {
    start: formatDate(monthStart),
    end: formatDate(monthEnd),
  };
}
function bpNumberToTime(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  return h + ":" + m;
}
function dateFormatter(format, val) {
  if (val !== "" && val !== null && val !== "null" && val !== undefined && val !== "undefined") {
    if (val === "footer") {
      return "";
    }
    var timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    var match = timeRegex.test(val);
    if (match) {
      return val;
    }
    return datephp(format, strtotimephp(val));
  }
  return "";
}
function datephp(format, timestamp) {
  //        note: Uses global: php_js to store the default timezone
  //        note: Although the function potentially allows timezone info (see notes), it currently does not set
  //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
  //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
  //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
  //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
  //   returns 1: '09:09:40 m is month'
  //   example 2: date('F j, Y, g:i a', 1062462400);
  //   returns 2: 'September 2, 2003, 2:26 am'
  //   example 3: date('Y W o', 1062462400);
  //   returns 3: '2003 36 2003'
  //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
  //   example 4: (x+'').length == 10 // 2009 01 09
  //   returns 4: true
  //   example 5: date('W', 1104534000);
  //   returns 5: '53'
  //   example 6: date('B t', 1104534000);
  //   returns 6: '999 31'
  //   example 7: date('W U', 1293750000.82); // 2010-12-31
  //   returns 7: '52 1293750000'
  //   example 8: date('W', 1293836400); // 2011-01-01
  //   returns 8: '52'
  //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
  //   returns 9: '52 2011-01-02'

  var that = this;
  var jsdate, f;
  // Keep this here (works, but for code commented-out below for file size reasons)
  // var tal= [];
  var txt_words = ["Sun", "Mon", "Tues", "Wednes", "Thurs", "Fri", "Satur", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // trailing backslash -> (dropped)
  // a backslash followed by any character (including backslash) -> the character
  // empty string -> empty string
  var formatChr = /\\?(.?)/gi;
  var formatChrCb = function (t, s) {
    return f[t] ? f[t]() : s;
  };
  var _pad = function (n, c) {
    n = String(n);
    while (n.length < c) {
      n = "0" + n;
    }
    return n;
  };
  f = {
    // Day
    d: function () {
      // Day of month w/leading 0; 01..31
      return _pad(f.j(), 2);
    },
    D: function () {
      // Shorthand day name; Mon...Sun
      return f.l().slice(0, 3);
    },
    j: function () {
      // Day of month; 1..31
      return jsdate.getDate();
    },
    l: function () {
      // Full day name; Monday...Sunday
      return txt_words[f.w()] + "day";
    },
    N: function () {
      // ISO-8601 day of week; 1[Mon]..7[Sun]
      return f.w() || 7;
    },
    S: function () {
      // Ordinal suffix for day of month; st, nd, rd, th
      var j = f.j();
      var i = j % 10;
      if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
        i = 0;
      }
      return ["st", "nd", "rd"][i - 1] || "th";
    },
    w: function () {
      // Day of week; 0[Sun]..6[Sat]
      return jsdate.getDay();
    },
    z: function () {
      // Day of year; 0..365
      var a = new Date(f.Y(), f.n() - 1, f.j());
      var b = new Date(f.Y(), 0, 1);
      return Math.round((a - b) / 864e5);
    },

    // Week
    W: function () {
      // ISO-8601 week number
      var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
      var b = new Date(a.getFullYear(), 0, 4);
      return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
    },

    // Month
    F: function () {
      // Full month name; January...December
      return txt_words[6 + f.n()];
    },
    m: function () {
      // Month w/leading 0; 01...12
      return _pad(f.n(), 2);
    },
    M: function () {
      // Shorthand month name; Jan...Dec
      return f.F().slice(0, 3);
    },
    n: function () {
      // Month; 1...12
      return jsdate.getMonth() + 1;
    },
    t: function () {
      // Days in month; 28...31
      return new Date(f.Y(), f.n(), 0).getDate();
    },

    // Year
    L: function () {
      // Is leap year?; 0 or 1
      var j = f.Y();
      return ((j % 4 === 0) & (j % 100 !== 0)) | (j % 400 === 0);
    },
    o: function () {
      // ISO-8601 year
      var n = f.n();
      var W = f.W();
      var Y = f.Y();
      return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
    },
    Y: function () {
      // Full year; e.g. 1980...2010
      return jsdate.getFullYear();
    },
    y: function () {
      // Last two digits of year; 00...99
      return f.Y().toString().slice(-2);
    },

    // Time
    a: function () {
      // am or pm
      return jsdate.getHours() > 11 ? "pm" : "am";
    },
    A: function () {
      // AM or PM
      return f.a().toUpperCase();
    },
    B: function () {
      // Swatch Internet time; 000..999
      var H = jsdate.getUTCHours() * 36e2;
      // Hours
      var i = jsdate.getUTCMinutes() * 60;
      // Minutes
      // Seconds
      var s = jsdate.getUTCSeconds();
      return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
    },
    g: function () {
      // 12-Hours; 1..12
      return f.G() % 12 || 12;
    },
    G: function () {
      // 24-Hours; 0..23
      return jsdate.getHours();
    },
    h: function () {
      // 12-Hours w/leading 0; 01..12
      return _pad(f.g(), 2);
    },
    H: function () {
      // 24-Hours w/leading 0; 00..23
      return _pad(f.G(), 2);
    },
    i: function () {
      // Minutes w/leading 0; 00..59
      return _pad(jsdate.getMinutes(), 2);
    },
    s: function () {
      // Seconds w/leading 0; 00..59
      return _pad(jsdate.getSeconds(), 2);
    },
    u: function () {
      // Microseconds; 000000-999000
      return _pad(jsdate.getMilliseconds() * 1000, 6);
    },

    // Timezone
    e: function () {
      // Timezone identifier; e.g. Atlantic/Azores, ...
      // The following works, but requires inclusion of the very large
      // timezone_abbreviations_list() function.
      /*              return that.date_default_timezone_get();
       */
      throw "Not supported (see source code of date() for timezone on how to add support)";
    },
    I: function () {
      // DST observed?; 0 or 1
      // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
      // If they are not equal, then DST is observed.
      var a = new Date(f.Y(), 0);
      // Jan 1
      var c = Date.UTC(f.Y(), 0);
      // Jan 1 UTC
      var b = new Date(f.Y(), 6);
      // Jul 1
      // Jul 1 UTC
      var d = Date.UTC(f.Y(), 6);
      return a - c !== b - d ? 1 : 0;
    },
    O: function () {
      // Difference to GMT in hour format; e.g. +0200
      var tzo = jsdate.getTimezoneOffset();
      var a = Math.abs(tzo);
      return (tzo > 0 ? "-" : "+") + _pad(Math.floor(a / 60) * 100 + (a % 60), 4);
    },
    P: function () {
      // Difference to GMT w/colon; e.g. +02:00
      var O = f.O();
      return O.substr(0, 3) + ":" + O.substr(3, 2);
    },
    T: function () {
      // Timezone abbreviation; e.g. EST, MDT, ...
      // The following works, but requires inclusion of the very
      // large timezone_abbreviations_list() function.
      /*              var abbr, i, os, _default;
            if (!tal.length) {
              tal = that.timezone_abbreviations_list();
            }
            if (that.php_js && that.php_js.default_timezone) {
              _default = that.php_js.default_timezone;
              for (abbr in tal) {
                for (i = 0; i < tal[abbr].length; i++) {
                  if (tal[abbr][i].timezone_id === _default) {
                    return abbr.toUpperCase();
                  }
                }
              }
            }
            for (abbr in tal) {
              for (i = 0; i < tal[abbr].length; i++) {
                os = -jsdate.getTimezoneOffset() * 60;
                if (tal[abbr][i].offset === os) {
                  return abbr.toUpperCase();
                }
              }
            }
            */
      return "UTC";
    },
    Z: function () {
      // Timezone offset in seconds (-43200...50400)
      return -jsdate.getTimezoneOffset() * 60;
    },

    // Full Date/Time
    c: function () {
      // ISO-8601 date.
      return "Y-m-d\\TH:i:sP".replace(formatChr, formatChrCb);
    },
    r: function () {
      // RFC 2822
      return "D, d M Y H:i:s O".replace(formatChr, formatChrCb);
    },
    U: function () {
      // Seconds since UNIX epoch
      return (jsdate / 1000) | 0;
    },
  };
  this.date = function (format, timestamp) {
    that = this;
    jsdate =
      timestamp === undefined
        ? new Date() // Not provided
        : timestamp instanceof Date
        ? new Date(timestamp) // JS Date()
        : new Date(timestamp * 1000); // UNIX timestamp (auto-convert to int)
    return format.replace(formatChr, formatChrCb);
  };
  return this.date(format, timestamp);
}
// Get Data View header Buttons
function getHeaderBtns(arrya) {
  var btns = [];
  angular.forEach(arrya, function (btn) {
    if (isEmpty(btn.meta_dm_transfer_process_mobile)) {
      btns.push(btn);
    }
  });
  return btns;
}
function getTotalValueJson(data, key) {
  if (angular.isUndefined(data) && angular.isUndefined(key)) return 0;
  var sum = 0;

  angular.forEach(data, function (v, k) {
    var a = v[key];
    if (a != "" && a != null) {
      sum = sum + parseFloat(a);
    }
  });
  return sum;
}
function base64_decode(data) {
  // qr төлбөр төлөх
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    dec = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += "";

  do {
    // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = (h1 << 18) | (h2 << 12) | (h3 << 6) | h4;

    o1 = (bits >> 16) & 0xff;
    o2 = (bits >> 8) & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join("");

  return decodeURIComponent(escape(dec.replace(/\0+$/, "")));
}
function checkDVCriteriaOffline(json) {
  if (!isEmpty(json)) {
    for (key in json) {
      var obj = json[key];
      if (isEmpty(obj) || obj[0].operand == "%%" || (isEmpty(obj[0].operand) && obj[0].operator != "IS NULL")) {
        delete json[key];
      }
    }
    return json;
  } else {
    return json;
  }
}
//======================================== set Defualt value rows Dtl ==========================
function checkRows(arr, path) {
  var config = "";
  angular.forEach(arr, function (row) {
    if (row.parampath.toLowerCase() == path.toLowerCase()) {
      config = row;
    }
  });
  return config;
}
function getobjectValues(obj) {
  var returnval = {};
  for (keyStr in obj) {
    if (isNaN(keyStr)) {
      if (typeof obj[keyStr] == "object") {
        obj[keyStr] = setRowsDefualtValue(obj[keyStr]);
      }
      returnval[keyStr] = obj[keyStr];
    }
  }
  return returnval;
}
function setRowsDefualtValue1(obj) {
  for (keyInts in obj) {
    var keyInt = keyInts;
    if (typeof obj[keyInt] == "object" && !isNaN(keyInt)) {
      var otherval = getobjectValues(obj);
      obj[keyInt].rowstatemobile = "true";
      var dd = obj[keyInt];
      for (keyss in otherval) {
        if (isObject(dd[keyss]) && isObject(otherval[keyss])) {
          dd[keyss] = mergeJsonObjs(dd[keyss], otherval[keyss]);
        } else if (!isObject(dd[keyss])) {
          dd[keyss] = otherval[keyss];
        }
      }
    } else if (typeof obj[keyInt] == "object") {
      obj[keyInt] = setRowsDefualtValue1(obj[keyInt]);
    }
  }
  return obj;
}
function setRowsDefualtValue(obj) {
  for (key in obj) {
    if (typeof obj[key] == "object") {
      setRowsDefualtValue1(obj[key]);
    }
  }
  return obj;
}
//======================================== Json Search value ===========================
function searchJsonValue(jsObj, fieldrow, fieldValue) {
  console.log(jsObj);
  return Object.keys(jsObj)
    .filter(function (x) {
      return jsObj[x][fieldrow].toLowerCase() == fieldValue;
    })
    .map(function (x) {
      return x;
    });
}
function searchJsonValueGet(jsObj, fieldrow, fieldValue) {
  return jsObj.filter(function (jsObj) {
    return jsObj[fieldrow].toLowerCase() == fieldValue.toLowerCase();
  });
}
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
function mergeJsonObjs(def, obj) {
  if (typeof obj == "undefined" || !isObject(obj)) {
    return def;
  } else if (typeof def == "undefined" || !isObject(def)) {
    return obj;
  }
  for (var i in obj) {
    if (obj[i] != null && isObject(obj[i])) {
      def[i] = mergeJsonObjs(def[i], obj[i]);
    } else {
      if (!isEmpty(obj[i])) {
        if (isObject(def[i])) {
          def[i] = mergeJsonObjs(def[i], obj[i]);
        } else {
          def[i] = obj[i];
        }
      }
    }
  }
  return def;
}
function checkJsonPath(obj, path) {
  var args = path.split(".");
  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
function checkJsonObjectPath(obj, path) {
  if (path) {
    var checkVar = path.split(".");
    for (val in checkVar) {
      var checkpath = checkVar[val];
      if (eval("obj." + checkpath + " == undefined") && val == 0) {
        obj[checkpath] = {};
      }
    }
  }
}
function checkSendJsonData(json, groupNames) {
  if (!isEmpty(groupNames) && json.error != "true") {
    try {
      angular.forEach(groupNames, function (group) {
        if (group.recordtype == "rows") {
          if (eval("typeof json." + group.paramrealpath.toLowerCase() + "!= 'undefined'") && eval("!isEmpty(json." + group.paramrealpath.toLowerCase() + ")")) {
            var dtl = eval("json." + group.paramrealpath.toLowerCase());
            angular.forEach(Object.keys(dtl), function (key) {
              if (isNaN(key)) {
                eval("delete dtl." + key);
              }
            });
          }
        }
      });
      return json;
    } catch (ex) {
      return json;
    }
  } else return json;
}
//======================================== Expressions ===========================
function convertToMessege(str) {
  var a = str.match(/message(.*?)\)/g);
  for (ind in a) {
    var b = a[ind].match(/(\((.*)+\))/g);
    var old = b[0];
    var newstr = b[0].replace("(", "").replace(")", "").split(",");
    var newstrnew = '("' + newstr[0].toString() + '","' + newstr[1].toString() + '")';
    str = str.replace(old, newstrnew);
  }
  return str;
}
function removeCommentsExpression(str) {
  var newstr = str.replace(/\/\*(.*?)\*\//g, "");
  return newstr;
}
function getFullExpressionArrayConvert(str) {
  var a = str.match(/\[(.*?)\(\)/g);
  for (var s in a) {
    var sa = a[s].match(/\]\.(.*?)\(\)/g);
    if (!isEmpty(sa)) {
      var functionName = sa[0].replace("]", "").replace("(", "").replace(")", "").replace(".", "");
      var relVariable = a[s].match(/\[(.*?)\]/g);
      for (index in relVariable) {
        if (relVariable[index].match(/,/g) !== undefined && relVariable[index].match(/,/g) !== null && relVariable[index].match(/,/g).length > 0) {
          var change = relVariable[index].replace("[", "").replace("]", "").replace(";", "").split(",");
          var ass = change.map(function (v) {
            var vs =
              "[" +
              v
                .replace("." + functionName, "")
                .replace("(", "")
                .replace(")", "")
                .trim() +
              "=]'" +
              functionName +
              "';";
            return vs;
          });
          str = str.replace(relVariable[index], ass.toString().replace(/,/g, ""));
        }
      }
    }
  }
  return str;
}
function checkvariable(str, json) {
  var oldstr = str;
  var headerVariable = "";
  var subVariable = "";
  var v = str.match(/\[(.*?)\]/g);
  angular.forEach(v, function (item) {
    if (item.split(".").length > 1) {
      item = item.split(".");
      for (var qe = item.length - 1; qe > 0; qe--) {
        var newvariable = "[" + item.slice(0, qe).toString().replace(/,/g, ".").replace("[", "") + "]={};";
        var checkPath = "[" + item[qe - 1].replace("[", "") + "]={};";
        // var jsonCheck = json.includes(checkPath.replace("[", "").replace("]={};", "").toLowerCase());
        var jsonCheck = checkJsonPath(JSON.parse(json), newvariable.replace("[", "").replace("]={};", "").toLowerCase());
        if (jsonCheck) {
          jsonCheck = json.includes(checkPath.replace("[", "").replace("]={};", "").toLowerCase() + '":{');
        }
        var funcCheck = oldstr.includes(newvariable);

        if (funcCheck === false && jsonCheck === false) {
          oldstr = newvariable + oldstr;
          if (qe === 0) {
            headerVariable = headerVariable + newvariable;
          } else {
            subVariable = subVariable + newvariable;
          }
        }
      }
    }
  });
  var subVariableArray = subVariable.split(";");
  subVariableArray.sort(function (a, b) {
    if (a && b) return a.split(".").length - b.split(".").length;
  });
  var newVariables = subVariableArray.toString().replace(/,/g, ";");
  return headerVariable + newVariables + str;
}
function ExpressionRunprocessConvert(str, arraName, LabelValueName) {
  var runs = str.match(/runprocessvalue(.*?)\)/g);
  if (str.match(/runprocessvalue(.*?)\)/g) !== undefined && runs !== null && runs.length > 0) {
    for (var s in runs) {
      var old = runs[s];
      var newVal = runs[s].replace("runprocessvalue", "ServerData.runprocessvalueAjax").replace(")", "," + arraName.substr(0, arraName.length - 1) + "," + LabelValueName + ")");
      str = str.replace(old, newVal.toString());
    }
  }

  var getpram = str.match(/getprocessparam(.*?)\)/g);
  if (str.match(/getprocessparam(.*?)\)/g) !== undefined && getpram !== null && getpram.length > 0) {
    for (var s2 in getpram) {
      var old2 = getpram[s2];
      var newVal2 = getpram[s2].replace("getprocessparam", "ServerData.getprocessparamAjax").replace(")", "," + arraName.substr(0, arraName.length - 1) + "," + LabelValueName + ")");
      str = str.replace(old2, newVal2.toString());
    }
  }

  var getpram1 = str.match(/rundefualtget(.*?)\)/g);
  if (str.match(/rundefualtget(.*?)\)/g) !== undefined && getpram1 !== null && getpram1.length > 0) {
    for (var s1 in getpram1) {
      var old1 = getpram1[s1];
      var newVal1 = getpram1[s1].replace("rundefualtget", "$scope.runDefualtGet");
      str = str.replace(old1, newVal1.toString());
    }
  }

  //var lookup = str.match(/getlookupfieldvalue(.*?)\)/g);
  //if (str.match(/getlookupfieldvalue(.*?)\)/g) !== undefined && lookup !== null && lookup.length > 0) {
  //    for (var s1 in lookup) {
  //        var old1 = lookup[s1];
  //        var newVal1 = lookup[s1].replace("getlookupfieldvalue", "$rootScope.getlookupfieldvalue");
  //        str = str.replace(old1, newVal1.toString())
  //    }
  //}

  return str;
}
function checkComboValue() {
  var row = {};
  row.id = comboValue[$scope.selectComboRow.valuefield.toLowerCase()];
  row.name = comboValue[$scope.selectComboRow.displayfield.toLowerCase()];
}
function convertToChangeEvent(strFn) {
  str = strFn.match(/.change(\(.*?)\}/g);
  if (!isEmpty(str)) {
    angular.forEach(str, function (event) {
      var variables = event.match(/\[(.*?)\]/g);
      for (var ind in variables) {
        variable = variables[ind];
        var old = variable;
        variableArray = variable.split(".");
        //if (variableArray.length > 2) {
        //    variable = variable.replace(variableArray[0], "$rootScope.modelRowsValueDetail");
        //}
        strFn = strFn.replace(old, variable);
      }
    });
  }
  return strFn;
}
function convertToControl(strFn) {
  var str = strFn.match(/.control(\(.*?)\)/g);
  var strLabel = strFn.match(/.label(\(.*?)\)/g);
  angular.forEach(str, function (event) {
    strFn = strFn.replace(event, event.replace(".control(", "style=").replace(")", ""));
  });
  angular.forEach(strLabel, function (label) {
    strFn = strFn.replace(label, label.replace(".label(", "stylelabel=").replace(")", ""));
  });
  return strFn;
}
function convertToCalcFunctions(str) {
  //preg_match_all('/sum\(\[(.*?)\]\)/i', $expressionToJs, $sumAggregate); // aggregate (sum)
  //preg_match_all('/avg\(\[(.*?)\]\)/i', $expressionToJs, $avgAggregate); // aggregate (avg)
  //preg_match_all('/min\(\[(.*?)\]\)/i', $expressionToJs, $minAggregate); // aggregate (min)
  //preg_match_all('/max\(\[(.*?)\]\)/i', $expressionToJs, $maxAggregate); // aggregate (max)
  //console.log(str);
  //console.log(str.match('/sum\(\[(.*?)\]\)/i'));
  var sums = str.match(/sum\(\[(.*?)\]\)/g);
  angular.forEach(sums, function (data) {
    var repVal = data.replaceAll("[", '"').replaceAll("]", '"');
    str = str.replaceAll(data, repVal);
  });
  var avg = str.match(/avg\(\[(.*?)\]\)/g);
  angular.forEach(avg, function (data) {
    var repVal = data.replaceAll("[", '"').replaceAll("]", '"');
    str = str.replaceAll(data, repVal);
  });
  return str;
}
function stringConvertToFunction(arraName, strfunctions, json, LabelValueName) {
  var functionName = "function=function()";
  strfunctions = getFullExpressionArrayConvert(strfunctions.toString().replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">"));
  var fun = convertToCalcFunctions(strfunctions.toLowerCase());
  fun = ExpressionRunprocessConvert(fun, arraName, LabelValueName);
  var lastStr = removeCommentsExpression(fun);
  lastStr = checkvariable(lastStr, json);
  var GGG = convertToChangeEvent(lastStr);
  GGG = convertToControl(GGG);
  var exper = convertToMessege(GGG).replaceAll("message(", "$rootScope.message(");
  var widthEvent = exper
    .replaceAll("parseint", "parseInt")
    .replaceAll("thisclickbutton('save')", "$scope.SaveBtn()")
    .replaceAll("$rootscope", "$rootScope")
    .replaceAll("close(this)", "$scope.backbutton()")
    .replaceAll("hideprocessdialog()", "")
    .replaceAll("[", arraName)
    .replaceAll(".delete()", functionName)
    .replaceAll(".change()", functionName)
    .replaceAll(".trigger(", "function(")
    .replaceAll(".run()", "function()")
    .replaceAll("subkpi.save()", "$rootScope.ItemDtlData.subkpifunction=function()")
    .replaceAll(".click()", functionName)
    .replaceAll("]", "")
    .replaceAll(".val()", "")
    .replaceAll(".show()", 'hideShow="show"')
    .replaceAll("='show'", 'hideShow="show"')
    .replaceAll("='hide'", 'hideShow="hide"')
    .replaceAll(".hide()", 'hideShow="hide"')
    .replaceAll(".disable()", 'disable="disable"')
    .replaceAll("='disable'", 'disable="disable"')
    .replaceAll(".enable()", 'disable="enable"')
    .replaceAll("='enable'", 'disable="enable"')
    .replaceAll(";;", ";")
    .replaceAll("getuserlocation", "$rootScope.getUserLocation");
  widthEvent = widthEvent.replaceAll("='required'", "isrequired='1'").replaceAll(".required()", "isrequired='1'").replaceAll("='nonrequired'", "isrequired='0'").replaceAll(".nonrequired()", "0").replaceAll("new date(", "new Date(").replaceAll("toisostring(", "toISOString(");
  return widthEvent.replaceAll("fillgroupbydv(", "$scope.fillGroupByDv(").replaceAll("calldataview(", "$scope.callDataViewExpression(").replaceAll("calllayout(", "$scope.callLayoutExpression(").replaceAll("callpopup(", "$scope.callPopup(").replaceAll("setlocal(", "localStorage.setItem(").replaceAll("getlocal(", "localStorage.getItem(").replaceAll("callprocess(", "$scope.callProcess(").replaceAll("callworkspace(", "$scope.callWorkSpaceExpression(");
}
//======================================== Expressions Kpi ===========================
function kpiExpressionConvert(arraName, str, convertExp) {
  var functionName = "function=function()";
  str = getFullExpressionArrayConvert(str.toString().replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">"));
  var newstr = removeCommentsExpression(str);
  newstr = checkvariable(newstr, convertExp);
  return newstr.replaceAll("[", arraName).replaceAll(".kpichange()", functionName).replaceAll("]", "");
}

//======================================== getStart And After Save===========================
function getSaveExprission(str, type) {
  var exprission = "";
  if (type == "startAfterSave") {
    str = str.toString();
    var subStrs = str.match("startAfterSave(.*)endAfterSave");
    if (!isEmpty(subStrs)) {
      exprission = subStrs[1];
    } else {
      exprission = "back";
    }
  } else {
    var Index = str.length;
    if (type == "endAfterSave") {
      if (!isEmpty(str.match("startAfterSave"))) {
        Index = str.match("startAfterSave");
      }
    }
    if (isObject(Index)) {
      Index = Index.index;
    }
    var subStrs = str.substr(0, Index).replace(type, "");
    exprission = subStrs.replaceAll("return", "$rootScope.returnBeforeSave=");
  }
  return exprission;
}
//======================================== PROCESS IUNPUT JSON CREATER ===========================
function renderKpiJson(kpiconf) {
  var kpiarray = [];
  angular.forEach(kpiconf.kpitemplate, function (template) {
    angular.forEach(template.kpitemplateindicator, function (indicator) {
      var row = {};
      row.roottemplateid = kpiconf.id;
      row.dimensionid = indicator.dimensionid;
      row.indicatorid = indicator.indicatorid;
      if (!isEmpty(indicator.kpitemplatedtlfact)) {
        row.templatedtlid = indicator.kpitemplatedtlfact[0].templatedtlid;
        angular.forEach(indicator.kpitemplatedtlfact, function (fact) {
          if (fact.parampath) {
            if (fact.showtype == "check" && fact.isrequired == "1" && fact.value == "0") {
              fact.value = "";
            }
            row[fact.parampath] = fact.value;
          }
        });
      }
      kpiarray.push(row);
    });
  });
  return kpiarray;
}
function createKpiJson(path, itemData) {
  if (isEmpty(path)) {
    if (!isEmpty(itemData.kpidmdtl) && !isEmpty(itemData.kpidmdtl.kpiConfig)) {
      var reqiured = {};
      reqiured = angular.copy(itemData.kpidmdtl);
      delete reqiured.config;
      itemData.kpidmdtl = renderKpiJson(itemData.kpidmdtl.kpiConfig);
      angular.forEach(Object.keys(itemData.kpidmdtl), function (key) {
        reqiured[key] = itemData.kpidmdtl[key];
      });
      itemData.kpidmdtl = reqiured;
    }
  } else if (!isEmpty(itemData[path])) {
    angular.forEach(itemData[path], function (value) {
      if (!isEmpty(value) && isObject(value)) {
        if (!isEmpty(value.kpidmdtl) && !isEmpty(value.kpidmdtl.kpiConfig)) {
          //var kpiarray = [];
          var kpicon = value.kpidmdtl.kpiConfig;
          value.kpidmdtl = renderKpiJson(value.kpidmdtl.kpiConfig);
          //angular.forEach(kpicon.kpitemplate, function (template) {
          //    var row = {};
          //    row.roottemplateid = template.id;
          //    angular.forEach(template.kpitemplateindicator, function (indicator) {
          //        row.dimensionid = indicator.dimensionid;
          //        row.indicatorid = indicator.indicatorid;
          //        row.templatedtld = indicator[0].templatedtlid;
          //        angular.forEach(indicator.kpitemplatedtlfact, function (fact) {
          //            if (fact.parampath) {
          //                row[fact.parampath] = fact.value;
          //            }
          //        })
          //    })
          //    kpiarray.push(row);
          //})
        }
      }
    });
  }
  return itemData;
}
function checkKpiConfig(config, itemData) {
  var kpisConfig = [];
  angular.forEach(config, function (item) {
    if (item.paramname.toLowerCase() == "kpidmdtl") {
      kpisConfig.push(item);
    }
  });
  if (kpisConfig.length > 0) {
    angular.forEach(kpisConfig, function (item) {
      var path = item.paramrealpath.toLowerCase();
      var pathArray = path.split(".");
      if (pathArray.length > 1) {
        itemData = createKpiJson(path.substr(0, path.lastIndexOf(".")), itemData);
      } else {
        itemData = createKpiJson(null, itemData);
      }
    });
  }
  return itemData;
}

function createProcessInputJson(config, getrow, ItemData, groupNames) {
  var json = {};
  try {
    ItemData = checkKpiConfig(config, ItemData);
    angular.forEach(config, function (row) {
      var path = row[getrow];
      item = path.split(".");
      var itempath = "ItemData";
      var jsonpath = "json";
      var jsonRow = true;
      var rowsLength = 0;
      var checkObject = false;
      angular.forEach(item, function (val, index) {
        val = val.toLowerCase();
        if (item.length > 1 && index == 0) {
          var groupcheck = searchJsonValue(config, "paramrealpath", val);
          if (!isEmpty(groupcheck)) {
            if (config[groupcheck[0]].datatype == "group") {
              var configPath = config[groupcheck[0]].paramrealpath.toLowerCase();
              if (!isEmpty(ItemData[configPath])) {
                rowsLength = Object.keys(ItemData[configPath]).length;
                var dd = itempath + "." + configPath + "[0]";
                if (!isEmpty(dd) && eval("typeof " + dd + "== 'object'")) {
                  checkObject = true;
                  itempath = itempath + "." + configPath + "[0]";
                  jsonpath = jsonpath + "." + configPath + "[0]";
                } else {
                  checkObject = false;
                  itempath = itempath + "." + configPath;
                  jsonpath = jsonpath + "." + configPath;
                }
              } else {
                jsonRow = false;
              }
            }
          }
        } else {
          if (index == item.length - 1 && rowsLength > 0 && checkObject) {
            for (var i = 0; i < rowsLength; i++) {
              var iont = i;
              if (i !== 0) {
                iont = iont - 1;
                itempath = itempath.replace("[" + iont + "]", "[" + i + "]");
                jsonpath = jsonpath.replace("[" + iont + "]", "[" + i + "]");
              } else {
                itempath = itempath.replace("[" + iont + "]", "[" + i + "]") + "." + val;
                jsonpath = jsonpath.replace("[" + iont + "]", "[" + i + "]") + "." + val;
              }
              json = createJson(itempath, jsonpath, jsonRow, config, getrow, ItemData, row, json);
              if (json == "error") {
                throw new Error('{"required":"' + row.labelname + '"}');
                //return { 'error': 'true', 'msg': row.labelname + "талбарын утга хоосон байна" };
                //break;
              }
            }
          } else {
            itempath = itempath + "." + val;
            jsonpath = jsonpath + "." + val;
            json = createJson(itempath, jsonpath, jsonRow, config, getrow, ItemData, row, json);
            if (json == "error") {
              throw new Error('{"required":"' + row.labelname + '"}');
            }
          }
        }
      });
    });
  } catch (err) {
    if (isJsonString(err.message)) {
      json = { error: "true", msg: JSON.parse(err.message).required + " талбарын утга хоосон байна" };
    }
  }
  return checkSendJsonData(json, groupNames);
}
function createJson(itempath, jsonpath, jsonRow, config, getrow, ItemData, row, json) {
  try {
    if (jsonRow) {
      if (checkIsRequired(row, itempath, ItemData)) {
        var checkVar = jsonpath.substr(0, jsonpath.lastIndexOf("."));
        if (row.datatype == "time" && eval(itempath.substr(0, itempath.lastIndexOf("."))) && eval(itempath)) {
          var timeValue = eval(itempath);
          if (!isEmpty(timeValue)) {
            if (timeValue.length == 5) {
              var ss = itempath + " = '1999-01-01 " + timeValue + ":00'";
              eval(ss);
            }
          }
        }
        if (row.datatype == "datetime" && eval(itempath.substr(0, itempath.lastIndexOf("."))) && eval(itempath)) {
          var timeValue = eval(itempath);
          if (!isEmpty(timeValue)) {
            if (timeValue.length == 16) {
              var ss = itempath + " ='" + timeValue + ":00'";
              eval(ss);
            }
          }
        }
        //if ((row.datatype == "base64" || row.datatype == 'file') && eval(itempath.substr(0, itempath.lastIndexOf("."))) && eval(itempath)) {
        //    var filePath = eval(itempath);
        //    if (!isEmpty(filePath) && isObject(filePath)) {
        //        if (!isEmpty(filePath) && isObject(filePath)) {
        //            var ss = itempath + " ='" + filePath.basedata + "'"
        //            eval(ss)
        //        }
        //        //    if (timeValue.length == 16) {
        //        //        var ss = itempath + " ='" + timeValue + ":00'"
        //        //        eval(ss)
        //        //    }
        //    }
        //}
        try {
          if (row.datatype != "group" && eval("typeof " + itempath.substr(0, itempath.lastIndexOf(".")) + '!= "undefined"') && eval("typeof " + itempath + '!= "undefined"') && eval("typeof " + itempath + '!= "object"')) {
            if (eval(checkVar.replace(checkVar.match(/\[(.*?)\]/g), "")) == undefined) {
              eval(checkVar.replace(checkVar.match(/\[(.*?)\]/g), "") + "={}");
            }
            if (eval(checkVar) == undefined) {
              eval(jsonpath.substr(0, jsonpath.lastIndexOf(".")) + "={}");
            }
            eval("if(" + itempath + "){" + jsonpath + "=" + itempath + ".toString()}");
          } else if (row.datatype != "group" && eval(itempath.substr(0, itempath.lastIndexOf(".")).replace("[0]", "")) != undefined && eval(itempath.replace("[0]", "")) != undefined) {
            if (eval(checkVar.replace(checkVar.match(/\[(.*?)\]/g), "")) == undefined) {
              eval(checkVar.replace(checkVar.match(/\[(.*?)\]/g), "") + "={}");
            }
            if (eval(checkVar) == undefined) {
              eval(jsonpath.substr(0, jsonpath.lastIndexOf(".")) + "={}");
            }
            eval(jsonpath.replace("[0]", "") + "=" + itempath.replace("[0]", ""));
          } else if (row.datatype == "group" && eval(itempath.substr(0, itempath.lastIndexOf("."))) !== undefined) {
            if (eval(itempath + "combo") !== undefined) {
              eval(jsonpath + "=" + itempath + "combo");
            } else if (itempath.split(".").length > 2) {
              eval(jsonpath + "=" + itempath);
            }
          }
        } catch (ex) {
          return json;
        }
      } else {
        json = "error";
      }
    }
    return json;
  } catch (ex) {
    return json;
  }
}
function checkIsRequired(row, itempath, ItemData) {
  var pathValue = null;
  if (row.isrequired == "1" || eval("ItemData." + row.paramrealpath.toLowerCase() + "isrequired") == "1") {
    eval("pathValue =" + itempath);
    if (row.datatype == "boolean" && (isEmpty(pathValue) || pathValue == "0")) {
      return false;
    } else if (isEmpty(pathValue) || pathValue == "undefined" || (typeof pathValue == "object" && pathValue.length == undefined)) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}
//======================================== defualt Value  Set ===========================
function checkdrillCriteria(value, item) {
  if (!isEmpty(value) && !isEmpty(value.criteria)) {
    eval("var" + " " + Object.keys(item).toString());
    for (var a = 0; a < Object.keys(item).length; a++) {
      eval(Object.keys(item)[a] + "=item." + Object.keys(item)[a] + ".toString()");
    }
    var criteria = value.criteria.split("#");
    var a = false;
    try {
      var asd = criteria[0].match(/\'.*?'/g);
      var newsss = criteria[0].toLowerCase();
      for (ddd in asd) {
        newsss = newsss.replace(asd[ddd].toLowerCase(), asd[ddd]);
      }
      a = eval(newsss);
    } catch (ex) {}
    return a;
  } else {
    return true;
  }
}
function setgendefualtvalue(item, user) {
  try {
    if (item.datatype === "coordinate") {
      return "$scope.ItemDtlData." + item.paramrealpath.toLowerCase() + "='Gmap-Coordinate'";
    } else {
      return "$scope.ItemDtlData." + item.paramrealpath.toLowerCase() + "='" + setDefaultValue(item.defaultvalue, user) + "'";
    }
  } catch (ex) {
    if (ex.name === "TypeError") {
      var err = item.paramrealpath.toLowerCase().split(".");
      var newVar = "";
      for (var qe = 0; qe < err.length - 1; qe++) {
        newVar = newVar + err[qe].toString();
        if (item.datatype === "coordinate") {
          return "$scope.ItemDtlData." + newVar + "={};$scope.ItemDtlData." + item.paramrealpath.toLowerCase() + "='Gmap-Coordinate'";
        } else {
          return "$scope.ItemDtlData." + newVar + "={};$scope.ItemDtlData." + item.paramrealpath.toLowerCase() + "='" + setDefaultValue(item.defaultvalue, user) + "'";
        }
      }
    }
  }
}
function setDefaultValue(valueStr, loginUserInfo) {
  var mat = valueStr.match(/\[(.*?)\]/g);
  var value = valueStr.replace(mat, "");

  if (value === "") {
    return null;
  }
  var copeDefualtValue = angular.copy(value);
  var lowerValue = value.trim().toLowerCase();
  if (lowerValue === "sysdate") {
    if (!isEmpty(mat)) {
      var month = mat[0].replace("[", "").replace("]", "");
      sysdate = strtotime(month, new Date());
      return formatDate(sysdate);
    } else {
      return formatDate(new Date());
    }
  } else if (lowerValue === "sysdatetime") {
    return getFormatDateAndTime(new Date());
  } else if (lowerValue === "sysyear") {
    return new Date().getFullYear();
  } else if (lowerValue === "sysmonth") {
    return new Date().getMonth() + 1;
  } else if (lowerValue === "sysday") {
    return new Date().getDay;
  } else if (lowerValue === "sysyearstart") {
    return formatDate(new Date().getFullYear() + "/01/01");
  } else if (lowerValue === "sysyearend") {
    return formatDate(new Date().getFullYear() + "/12/31");
  } else if (lowerValue === "sysmonthstart") {
    var thisMonth = new Date().getMonth() + 1;
    if (!isEmpty(mat)) {
      var month = mat[0].replace("[", "").replace("]", "");
      sysdate = strtotime(month, formatDate(new Date().getFullYear() + "/" + thisMonth + "/" + "01"));
      return formatDate(sysdate);
    } else {
      return formatDate(new Date().getFullYear() + "/" + thisMonth + "/" + "01");
    }
  } else if (lowerValue === "sysmonthend") {
    var thisMonth = new Date().getMonth() + 1;
    return formatDate(new Date().getFullYear() + "/" + thisMonth + "/" + getDaysInMonth(new Date().getFullYear(), thisMonth));
  } else if (lowerValue === "sessionuserid") {
    return loginUserInfo.id;
  } else if (lowerValue === "sessionmembershipid") {
    return loginUserInfo.membershipid;
  } else if (lowerValue === "sessionuserkeyid") {
    return loginUserInfo.userkeys[0].id;
  } else if (lowerValue === "sessionemployeeid") {
    return loginUserInfo.employeeid;
  } else if (lowerValue === "sessionemployeekeyid") {
    return loginUserInfo.employeekeyid;
  } else if (lowerValue === "sessionpositionkeyid") {
    return 1;
  } else if (lowerValue === "sessiondepartmentid") {
    return loginUserInfo.departmentid;
  } else if (lowerValue === "sessionuserkeydepartmentid") {
    return loginUserInfo.userkeys[0].departmentid;
  } else {
    return copeDefualtValue;
  }
  //} else if (lowerValue === 'sessionpositionkeyid') {
  //    return Ue::sessionPositionKeyId();
  //} else if (lowerValue === 'sessiondepartmentid') {
  //    return Ue::sessionDepartmentId();
  //} else if (lowerValue === 'sessiondepartmentcode') {
  //    return Ue::sessionDepartmentCode();
  //} else if (lowerValue === 'sessionuserkeydepartmentid') {
  //    return Ue::sessionUserKeyDepartmentId();
  //} else if (lowerValue === 'sessionuserkeydepartmentcode') {
  //    return Ue::sessionUserKeyDepartmentCode();
  //} else if (lowerValue === 'sessionstoreid') {
  //    return Ue::sessionStoreId();
  //}

  //elseif($lowerValue === 'fiscalperiodstartdate') {
  //    return Ue::sessionFiscalPeriodStartDate();
  //} elseif($lowerValue === 'fiscalperiodenddate') {
  //    return Ue::sessionFiscalPeriodEndDate();
  //} elseif($lowerValue === 'fiscalperiodyearid') {
  //    return Ue::sessionFiscalPeriodYearId();
  //} elseif($lowerValue === 'fiscalperiodid') {
  //    return Ue::sessionFiscalPeriodId();
  //} elseif($lowerValue === 'fiscalperiodyear') {
  //    return date('Y', strtotime(Ue::sessionFiscalPeriodStartDate()));
  //} elseif($lowerValue === 'fiscalperiodprevmonthid') {
  //    return Ue::getFiscalPeriodPrevMonthId();
  //} elseif($lowerValue === 'currentfiscalperiodid') {
  //    return Ue::currentFiscalPeriodId();
  //} elseif($lowerValue === 'currentfiscalperiodstartdate') {
  //    return Ue::currentFiscalPeriodStartDate();
  //} elseif($lowerValue === 'currentfiscalperiodenddate') {
  //    return Ue::currentFiscalPeriodEndDate();
  //} elseif($lowerValue === 'ipaddress') {
  //    return get_client_ip();
  //} elseif(strpos($lowerValue, 'sysdate[') !== false) {
  //    preg_match('/sysdate\[(.*?)\]/', $lowerValue, $dateCriteria);
  //    if (!empty($dateCriteria)) {
  //        return Date::weekdayAfter('Y-m-d', Date::currentDate('Y-m-d'), $dateCriteria[1]);
  //    }
  //} elseif(strpos($lowerValue, 'sysdatetime[') !== false) {
  //    preg_match('/sysdatetime\[(.*?)\]/', $lowerValue, $dateCriteria);
  //    if (!empty($dateCriteria)) {
  //        return Date::weekdayAfter('Y-m-d H:i:s', Date::currentDate('Y-m-d H:i:s'), $dateCriteria[1]);
  //    }
  //} elseif(strpos($lowerValue, 'sysyear[') !== false) {
  //    preg_match('/sysyear\[(.*?)\]/', $lowerValue, $dateCriteria);
  //    if (!empty($dateCriteria)) {
  //        return Date::weekdayAfter('Y', Date::currentDate('Y'), $dateCriteria[1]);
  //    }
  //} elseif(strpos($lowerValue, 'sysmonth[') !== false) {
  //    preg_match('/sysmonth\[(.*?)\]/', $lowerValue, $dateCriteria);
  //    if (!empty($dateCriteria)) {
  //        return Date::weekdayAfter('m', Date::currentDate('m'), $dateCriteria[1]);
  //    }
  //} elseif(strpos($lowerValue, 'sysday[') !== false) {
  //    preg_match('/sysday\[(.*?)\]/', $lowerValue, $dateCriteria);
  //    if (!empty($dateCriteria)) {
  //        return Date::weekdayAfter('d', Date::currentDate('d'), $dateCriteria[1]);
  //    }
  //}
}
function strtotime(str, now) {
  //preg_replace('/data:([A-Za-z0-9_.\\/\-;:]+)base64,/s', '', $templateHTML);
  var i,
    match,
    s,
    strTmp = "",
    parse = "";
  strTmp = str.replace(/[A-Za-z]/g, "") + " " + str.replace(/[0-9-+]/g, "");
  strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, " "); // unecessary spaces
  strTmp = strTmp.replace(/[\t\r\n]/g, ""); // unecessary chars

  if (strTmp == "now") {
    return new Date().getTime();
  } else if (!isNaN((parse = Date.parse(strTmp)))) {
    return parse / 1000;
  } else if (now) {
    now = new Date(now);
  } else {
    now = new Date();
  }

  strTmp = strTmp.toLowerCase();

  var process = function (m) {
    var ago = m[2] && m[2] == "ago";
    var num = (num = m[0] == "last" ? -1 : 1) * (ago ? -1 : 1);

    switch (m[0]) {
      case "last":
      case "next":
        switch (m[1].substring(0, 3)) {
          case "year":
            now.setFullYear(now.getFullYear() + num);
            break;
          case "month":
            now.setMonth(now.getMonth() + num);
            break;
          case "week":
            now.setDate(now.getDate() + num * 7);
            break;
          case "day":
            now.setDate(now.getDate() + num);
            break;
          case "hourse":
            now.setHours(now.getHours() + num);
            break;
          case "min":
            now.setMinutes(now.getMinutes() + num);
            break;
          case "sec":
            now.setSeconds(now.getSeconds() + num);
            break;
          default:
            var day;
            if (typeof (day = __is_day[m[1].substring(0, 3)]) != "undefined") {
              var diff = day - now.getDay();
              if (diff == 0) {
                diff = 7 * num;
              } else if (diff > 0) {
                if (m[0] == "last") diff -= 7;
              } else {
                if (m[0] == "next") diff += 7;
              }

              now.setDate(now.getDate() + diff);
            }
        }

        break;

      default:
        if (/\d+/.test(m[0])) {
          num *= parseInt(m[0]);

          switch (m[1].substring(0, 3)) {
            case "yea":
              now.setFullYear(now.getFullYear() + num);
              break;
            case "mon":
              now.setMonth(now.getMonth() + num);
              break;
            case "wee":
              now.setDate(now.getDate() + num * 7);
              break;
            case "day":
              now.setDate(now.getDate() + num);
              break;
            case "hou":
              now.setHours(now.getHours() + num);
              break;
            case "min":
              now.setMinutes(now.getMinutes() + num);
              break;
            case "sec":
              now.setSeconds(now.getSeconds() + num);
              break;
          }
        } else {
          return false;
        }

        break;
    }

    return true;
  };

  var __is = {
    day: {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    },
    mon: {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    },
  };

  match = strTmp.match(/^(\d{2,4}-\d{2}-\d{2})(\s\d{1,2}:\d{1,2}(:\d{1,2})?)?$/);

  if (match != null) {
    if (!match[2]) {
      match[2] = "00:00:00";
    } else if (!match[3]) {
      match[2] += ":00";
    }

    s = match[1].split(/-/g);

    for (i in __is.mon) {
      if (__is.mon[i] == s[1] - 1) {
        s[1] = i;
      }
    }

    return strtotime(s[2] + " " + s[1] + " " + s[0] + " " + match[2]);
  }

  var regex = "([+-]?\\d+\\s" + "(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?" + "|sun.?|sunday|mon.?|monday|tue.?|tuesday|wed.?|wednesday" + "|thu.?|thursday|fri.?|friday|sat.?|saturday)" + "|(last|next)\\s" + "(years?|months?|weeks?|days?|hours?|min|minutes?|sec|seconds?" + "|sun.?|sunday|mon.?|monday|tue.?|tuesday|wed.?|wednesday" + "|thu.?|thursday|fri.?|friday|sat.?|saturday))" + "(\\sago)?";

  match = strTmp.match(new RegExp(regex, "g"));

  if (match == null) {
    return false;
  }

  for (i in match) {
    if (!process(match[i].split(" "))) {
      return false;
    }
  }

  return now;
}
function strtotimephp(text, now) {
  //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
  //   example 1: strtotime('+1 day', 1129633200);
  //   returns 1: 1129719600
  //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
  //   returns 2: 1130425202
  //   example 3: strtotime('last month', 1129633200);
  //   returns 3: 1127041200
  //   example 4: strtotime('2009-05-04 08:30:00 GMT');
  //   returns 4: 1241425800

  var parsed,
    match,
    today,
    year,
    date,
    days,
    ranges,
    len,
    times,
    regex,
    i,
    fail = false;

  if (!text) {
    return fail;
  }

  // Unecessary spaces
  text = text
    .replace(/^\s+|\s+$/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[\t\r\n]/g, "")
    .toLowerCase();

  // in contrast to php, js Date.parse function interprets:
  // dates given as yyyy-mm-dd as in timezone: UTC,
  // dates with "." or "-" as MDY instead of DMY
  // dates with two-digit years differently
  // etc...etc...
  // ...therefore we manually parse lots of common date formats
  match = text.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

  if (match && match[2] === match[4]) {
    if (match[1] > 1901) {
      switch (match[2]) {
        case "-": {
          // YYYY-M-D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case ".": {
          // YYYY.M.D is not parsed by strtotime()
          return fail;
        }
        case "/": {
          // YYYY/M/D
          if (match[3] > 12 || match[5] > 31) {
            return fail;
          }

          return new Date(match[1], parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else if (match[5] > 1901) {
      switch (match[2]) {
        case "-": {
          // D-M-YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case ".": {
          // D.M.YYYY
          if (match[3] > 12 || match[1] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case "/": {
          // M/D/YYYY
          if (match[1] > 12 || match[3] > 31) {
            return fail;
          }

          return new Date(match[5], parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
      }
    } else {
      switch (match[2]) {
        case "-": {
          // YY-M-D
          if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
            return fail;
          }

          year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
          return new Date(year, parseInt(match[3], 10) - 1, match[5], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case ".": {
          // D.M.YY or H.MM.SS
          if (match[5] >= 70) {
            // D.M.YY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
          if (match[5] < 60 && !match[6]) {
            // H.MM.SS
            if (match[1] > 23 || match[3] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
          }

          // invalid format, cannot be parsed
          return fail;
        }
        case "/": {
          // M/D/YY
          if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
            return fail;
          }

          year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
          return new Date(year, parseInt(match[1], 10) - 1, match[3], match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
        }
        case ":": {
          // HH:MM:SS
          if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
            return fail;
          }

          today = new Date();
          return new Date(today.getFullYear(), today.getMonth(), today.getDate(), match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
        }
      }
    }
  }

  // other formats and "now" should be parsed by Date.parse()
  if (text === "now") {
    return now === null || isNaN(now) ? (new Date().getTime() / 1000) | 0 : now | 0;
  }
  if (!isNaN((parsed = Date.parse(text)))) {
    return (parsed / 1000) | 0;
  }

  date = now ? new Date(now * 1000) : new Date();
  days = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  ranges = {
    yea: "FullYear",
    mon: "Month",
    day: "Date",
    hou: "Hours",
    min: "Minutes",
    sec: "Seconds",
  };

  function lastNext(type, range, modifier) {
    var diff,
      day = days[range];

    if (typeof day !== "undefined") {
      diff = day - date.getDay();

      if (diff === 0) {
        diff = 7 * modifier;
      } else if (diff > 0 && type === "last") {
        diff -= 7;
      } else if (diff < 0 && type === "next") {
        diff += 7;
      }

      date.setDate(date.getDate() + diff);
    }
  }

  function process(val) {
    var splt = val.split(" "), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
      type = splt[0],
      range = splt[1].substring(0, 3),
      typeIsNumber = /\d+/.test(type),
      ago = splt[2] === "ago",
      num = (type === "last" ? -1 : 1) * (ago ? -1 : 1);

    if (typeIsNumber) {
      num *= parseInt(type, 10);
    }

    if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
      return date["set" + ranges[range]](date["get" + ranges[range]]() + num);
    }

    if (range === "wee") {
      return date.setDate(date.getDate() + num * 7);
    }

    if (type === "next" || type === "last") {
      lastNext(type, range, num);
    } else if (!typeIsNumber) {
      return false;
    }

    return true;
  }

  times = "(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec" + "|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?" + "|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)";
  regex = "([+-]?\\d+\\s" + times + "|" + "(last|next)\\s" + times + ")(\\sago)?";

  match = text.match(new RegExp(regex, "gi"));
  if (!match) {
    return fail;
  }

  for (i = 0, len = match.length; i < len; i++) {
    if (!process(match[i])) {
      return fail;
    }
  }

  // ECMAScript 5 only
  // if (!match.every(process))
  //    return false;

  return date.getTime() / 1000;
}
//======================================== Get Template ===========================
function getTemplateDataView(themplate, other) {
  if (!isEmpty(themplate)) {
    switch (themplate) {
      //case '1':
      case "DV_theme1":
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
        return "views/templates/templateDV/dvTemplate9_cardRow.html";
      case "10":
      case "DV_theme10":
        return "views/templates/templateDV/dvTemplate10_menu.html";
      case "11":
      case "DV_theme11":
        return "views/templates/templateDV/dvTemplate11.html";
      case "12":
      case "DV_theme12":
        return "views/templates/templateDV/dvTemplate12.html";
      case "13":
      case "DV_theme13":
        return "views/templates/templateDV/dvTemplate13.html";
      case "14":
      case "DV_theme14":
        return "views/templates/templateDV/dvTemplate14_chat.html";
      case "15":
      case "DV_theme15":
        return "views/templates/templateDV/dvTemplate9_cardRowOnepage.html";

      // return 'views/templates/templateDV/dvTemplate12.html'

      //package
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
      case "BP_theme8":
        return "views/templates/templateProcess/theme8_onepage.html";
      case "BP_theme9":
        return "views/templates/templateProcess/theme9.html";
      case "BP_theme10":
        return "views/templates/templateProcess/theme10_headerDtl.html";
      //calendar
      case "calendar":
        return "views/templates/templateCalendar/CalenTemplate1.html"; //getCalendarTemplate(other);
      //WS Tab
      case "WS_theme1":
        return { them: "views/templates/templateTab/tabTemplate1.html", position: "has-subheader" };
      case "WS_theme2":
        return { them: "views/templates/templateTab/tabTemplate2-footer.html", position: "has-footer" };
      case "WS_theme3":
        return { them: "views/templates/templateTab/tabTemplate3.html", position: "has-subheader" };
      //layout

      case "layouttheme1":
        return "views/templates/templateLayout/layoutDefualt.html";
      //layout
      case "layouttheme2":
        return "views/templates/templateLayout/layoutTemplate1.html";
      //layout
      case "layouttheme3":
        return "views/templates/templateLayout/layoutTemplate2.html";
    }
  } else {
    return null;
  }
}

function getCalendarTemplate(themplate) {
  if (!isEmpty(themplate)) {
    switch (themplate) {
      case "1":
      case "DV_theme1":
        return "views/templates/templateDV/dvTemplate1.html";
      case "2":
      case "DV_theme2":
        return "views/templates/templateDV/dvTemplate2.html";
      default:
        return "views/templates/templateCalendar/CalenTemplate1.html";
        break;
    }
  } else {
    return "views/templates/templateCalendar/CalenTemplate1.html";
  }
}
////////
function getprinterData(iframe) {
  var sumSize = 3;
  var trs = iframe.getElementsByTagName("tr");
  for (var i = 0; i < trs.length; i++) {
    var fontSize = trs[i].style.fontSize;
    if (!isEmpty(fontSize)) {
      fontSize = parseInt(fontSize) + sumSize + "px";
      trs[i].style.fontSize = fontSize;
    }
  }
  var tds = iframe.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    var fontSize = tds[i].style.fontSize;
    if (!isEmpty(fontSize)) {
      fontSize = parseInt(fontSize) + sumSize + "px";
      tds[i].style.fontSize = fontSize;
    }
  }
  var tables = iframe.getElementsByTagName("table");
  for (var i = 0; i < tables.length; i++) {
    var fontSize = tables[i].style.fontSize;
    if (!isEmpty(fontSize)) {
      fontSize = parseInt(fontSize) + sumSize + "px";
      tables[i].style.fontSize = fontSize;
    }
  }
  var spans = iframe.getElementsByTagName("span");
  for (var i = 0; i < spans.length; i++) {
    var fontSize = spans[i].style.fontSize;
    if (!isEmpty(fontSize)) {
      fontSize = parseInt(fontSize) + sumSize + "px";
      spans[i].style.fontSize = fontSize;
    }
  }
  return iframe;
}

function getSystemMetaGroupId(pDirectUrl) {
  if (!isEmpty(pDirectUrl)) {
    try {
      var patternModelValue = "omid=[0-9]+";
      var systemMetaGroupId = null;
      var strmatch = pDirectUrl.match(patternModelValue);

      if (!isEmpty(strmatch)) {
        systemMetaGroupId = strmatch[0].split("=")[1];
      }
      if (isNull(systemMetaGroupId)) {
        patternModelValue = "dataview/[0-9]+";
        var matcherModelValue = pDirectUrl.match(patternModelValue);
        if (!isEmpty(matcherModelValue)) {
          systemMetaGroupId = matchedValue.split("/")[1];
        }
      }

      return systemMetaGroupId;
    } catch (ex) {
      return null;
    }
  } else {
    return null;
  }
}
function getTemplateStr(key) {
  var htmls = null;
  switch (key) {
    case "4":
    case "DV_theme4":
      htmls =
        '<style> #template4dv .btnExp { height: 26px; border-radius: 10px; background-color: transparent !important; border: 1px solid !important; min-height: 26px; line-height: 26px; font-size: 12px; color: #387ef5; top: 0; bottom: 0; margin-top: auto; margin-bottom: auto; } #template4dv .item { padding: 0; margin: 0; } #template4dv .item .item-content { padding-right: 80px; padding-top: 2%; padding-bottom: 2%; padding-left: 2% !important; background-color:transparent; } #template4dv .itemAvatarDiv { position: absolute; width: 60px; height: 100%; left: 0; top: 0; bottom: 0; } #template4dv .item-avatar .itemAvatarDiv .profileIcon { margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; width: 100%; height: 40px; border-radius: 50%; text-align: center; color: #fff; padding-top: 10px; margin-left: 10px; position: absolute; bottom: 0; top: 0; } #template4dv .item-avatar .itemAvatarDiv img { margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; height: 40px; width: 100%; height: 100%; border-radius: 50%; text-align: center; color: #fff; margin-left: 10px; position: absolute; bottom: 0; top: 0; }</style><div id="template4dv" style="height: 100%;" ng-controller="processCtrl"> <ion-item item="post" ng-repeat="item in DataViewDataSub" ng-init="dataindex=$index" ng-if="(item|isObject)" can-swipe="true" style="background-color:{{item.rowcolor}};"> <div class="listContent item-button-right" ng-if="!(item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]|isEmpty)" style="padding-right: 25px;" ng-class="{\'itemlist\':(DataViewConfigSub.ShowImg|isEmptyCust),\'item-avatar\':!(DataViewConfigSub.ShowImg|isEmptyCust)}"> <div class="itemAvatarDiv" ng-if="!(DataViewConfigSub.ShowImg|isEmptyCust)"> <img ng-if="item.checkedType!=\'true\' && !(item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty)" ng-src="{{item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|guessImageMime:\'img/avatar.jpg\':item}}" alt="Image" ng-click="viewFile(DataViewConfigSub.ShowImg[0],null,$index)"> </div> <h2 style="color:{{DataViewConfigSub.ShowColumn[0].textcolor}};font-weight:{{DataViewConfigSub.ShowColumn[0].textweight}};text-transform:{{DataViewConfigSub.ShowColumn[0].texttransform}};{{DataViewDataSub[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}}" ng-click="SelectDataViewItem(item,$index)" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]|trustedhtml"> </h2> <p style="color:{{DataViewConfigSub.ShowColumn[1].textcolor}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}}" ng-click="SelectDataViewItem(item,$index)" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[1]|trustedhtml"> </p> <p style="color:{{DataViewConfigSub.ShowColumn[2].textcolor}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};{{DataViewData[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}}" ng-click="SelectDataViewItem(item,$index)"> {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]}} </p> <button ng-repeat="btn in DataViewConfigSub.ShowButton|filterbtnhide:dataindex:DataViewConfigSub.DrillDown:item" ng-if="$index==0" class="button button-positive btnExp" style="border-radius:10px;" ng-click="selectDataViewListBtn(btn,item,dataindex)"> {{btn.labelname}} </button> </div> <ion-option-button ng-repeat="btn in DataViewConfigSub.ProcessDtlBtns track by $index|orderBy:\'ordernum\'" class="{{btn.buttonstyle}}" ng-if="btn.batchnumber == \'\'||btn.metadatacode == \'\'" ng-click="SelectDataViewItemBtn(btn,item)"> {{btn.processname}} </ion-option-button> <ion-option-button class="blue-steel" ng-click="selectDataViewWorkFlow(DataViewConfigSub.Config[0],item,\'content\',$index)" ng-show="DataViewConfigSub.GroupLink.isusewfmconfig==\'1\'"> Төлөв өөрчлөх </ion-option-button> <ion-option-button class="blue-steel" ng-click="$root.deleteRowsColumn($index,selectRowsMenu.paramrealpath.toLowerCase())" ng-show="selectRowsMenu.isshowdelete==\'1\' ||DataViewConfigSub.isshowdelete==\'1\'"> Устгах </ion-option-button> </ion-item></div>';
      break;
    case "11":
    case "DV_theme11":
      htmls =
        '<style> #template11dv .item-content { padding: 0; } #template11dv #contentFooterButtons { padding-top: 1%; border-top: 1px solid #bbb; text-align: center; font-family: WhitneyBook; font-weight: bolder; padding-bottom: 0; margin: 0; padding-left: 0; } #template11dv .full-image { height: 100%; object-fit: cover; border-radius: 10px; height: 50px; width:auto; } #template11dv .cardPadding { margin-top: 8px; } #template11dv .col-15 { padding-top: 2%; color: var(--text-color); font-size: 24px; text-align: center; padding-left: 4%; } #template11dv .col-33 { color: var(--text-color); font-size: 30px; text-align: center; position: relative; margin-top: auto; margin-bottom: auto; } #template11dv .col-33 input { text-align: center; font-size: 30px; color: var(--text-color); height: 24px; padding-top: 1%; } #template11dv #checkBoxLabel { font-size: 24px; color: var(--text-color); } #template11dv input[type=checkbox] { display: none; } #template11dv input[type=checkbox] + label:before { font-family: FontAwesome; display: inline-block; } #template11dv input[type=checkbox] + label:before { content: "\f096"; } #template11dv input[type=checkbox] + label:before { letter-spacing: 10px; } #template11dv input[type=checkbox]:checked + label:before { content: "\f046"; } #template11dv input[type=checkbox]:checked + label:before { letter-spacing: 5px; }</style><div id="template11dv" style="height: 100%;background-color: #fff;padding-top: 2%;"> <ion-list can-swipe="true"> <div id="content" ng-repeat="item in DataViewDataSub track by $index" ng-if="(item|isObject)" style="background-color:#fff;background-color:{{item.rowcolor}};margin-bottom: 2%;padding-bottom: 1%;padding-right: 2%;box-shadow: 0 1px 3px 0px #d4d4d4;padding-top: 3%; padding-bottom: 3%;{{DataViewDataRowStyle}}"> <div class="row" style="max-height: 16vh;padding:0px;"> <div class="col col-15" ng-click="SelectDataViewItem(item,$index)" ng-if="!(item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty)"> <img class="full-image" ng-src="{{item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|guessImageMime:\'img/avatar.jpg\'}}" on-error="img/avatar.jpg" alt="Image"> </div> <div class="col col" ng-click="SelectDataViewItem(item,$index,DataViewConfigSub.ShowColumn[0])" style="padding-top: 3%;padding-left: 5%;"> <p class="item-text-wrap" style="margin-bottom: 1%;font-size: 21px;color:{{DataViewConfigSub.ShowColumn[0].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[0].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[0].textweight}};{{DataViewData[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}};"> {{ item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]}} <span data-path="{{DataViewConfigSub.ShowColumn[1].fieldpath}}" class="item-note" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype ==\'description_auto\',\'statusName\':DataViewConfigSub.ShowColumn[1].fieldpath==\'wfmStatusName\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[1].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}};max-width: 60%;{{DataViewData[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[1]|trustedhtml"> </span> </p> <p data-path="{{DataViewConfigSub.ShowColumn[2].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[2].datatype ==\'description_auto\',\'clearWhiteSpace\':isEmptyCust(item[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()]),\'displayNone\':{{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]|isEmptyCust}} && {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|isEmptyCust}}} " style="color:{{DataViewConfigSub.ShowColumn[2].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};{{DataViewData[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}}"> {{ item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]}} <span data-path="{{DataViewConfigSub.ShowColumn[3].fieldpath}}" class="item-note" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[3].datatype ==\'description_auto\'}" style="{{DataViewData[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[3].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[3].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[3].textweight}};max-width: 60%;" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|trustedhtml"> </span> </p></div><div ng-if="!(DataViewConfigSub.ShowButton|isEmpty)" class="col col-20" style="margin-top: auto;margin-bottom: auto;"><button ng-repeat="btn in DataViewConfigSub.ShowButton" ng-if="$index==0" class="button button-positive btnExp" style="border-radius:10px;background-color: transparent !important;" ng-click="$root.selectDataViewListBtnDirecter(btn,item,dataindex)">{{btn.labelname}}<img ng-src="{{item[btn.fieldpath.toLowerCase()]|guessImageMime:\'\':item}}" style="width: 50px;margin-top: auto;display: block;"></button></div></div><div ng-if="!(item|setFieldValueDataView:DataViewConfigSub.ShowColumn[4]|isEmpty)" ng-click="selectRowMoreData(item)"> <p data-path="{{DataViewConfigSub.ShowColumn[4].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[4].datatype ==\'description_auto\',\'fullComment\':showRowDtl==item.id}" style="width: 96%;margin-left: 4%;max-height: 25px;overflow: hidden;line-height: 13px;font-size: 12px;color:{{DataViewConfigSub.ShowColumn[4].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[4].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[4].textweight}};{{DataViewData[DataViewConfigSub.ShowColumn[4].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfig.ShowColumn[4]|trustedhtml"> <span class="item-note" data-path="{{DataViewConfigSub.ShowColumn[5].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[5].datatype ==\'description_auto\'}" style="color:{{DataViewConfigSub.ShowColumn[5].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[5].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[5].textweight}}; max-width: 60%;{{DataViewData[DataViewConfigSub.ShowColumn[5].fieldpath.toLowerCase()+\'style\']}};" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[5]|trustedhtml"> </span> </p> </div> </div></ion-list ></div>';
      break;
    case "2":
    case "DV_theme2":
      htmls =
        '<style> #template2dv .item-content {padding: 0; background-color: #ebf2f0 !important; height: 100%; width: 100%; position: unset; } .listContent {height: 100%; border-radius: 10px; border-left: 4px solid #fff; margin-top: 2%; padding-top: 1%; padding-bottom: 1%; padding-left: 2%; padding-right: 2%; } #template2dv .item-content .itemlist {padding: 16px; padding-left: 12px; background-color: #fff; } #template2dv .item-avatar {min - height: 68px; padding-top: 8px; padding-bottom: 8px; padding-right: 16px; background-color: #fff; padding-left: 70px; display: grid; /*position: relative;*/ } .item-avatar .itemAvatarDiv {position: absolute; width: 68px; height: 100%; left: 0; top: 0; bottom: 0; display: grid; } .item-avatar .itemAvatarDiv .profileIcon {margin - bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; width: 100%; height: 40px; border-radius: 50%; text-align: center; color: #fff; padding-top: 10px; margin-left: 13px; } .item-avatar .itemAvatarDiv img {margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; height: 40px; width: 100%; height: 100%; border-radius: 50%; text-align: center; color: #fff; margin-left: 13px; } .calendarIcon {text - align: center; border-radius: 15px; height: 55px; padding-left: 2px; padding-right: 2px; padding-top: 0; padding-bottom: 0px; width: 55px; margin-left: auto; margin-right: auto; } .calendarIcon p {color: #fff; font-size: 10px; height: 20px; } .calendarIcon h2 {background - color: #fff; height: 31px; border-bottom-left-radius: 13px; border-bottom-right-radius: 13px; font-size: 18px; line-height: 30px; font-family: Roboto-Bold; } .fullWidth{max - width:100% !important; }</style> <div id="template2dv" style="padding-top:5%;" ng-controller="processCtrl"> <!--<ion-scroll direction="y" style="width:100%; height: 100%">--> <ion-list can-swipe="true"> <ion-item item="post" class="listContent card" ng-repeat="item in DataViewDataSub|orderBy:DataViewOrderBy|limitTo:$root.dataViewLimit" ng-if="item|isObject" can-swipe="true" ng-style="{\'border-left-color\':item.wfmstatuscolor}"> <div ng-click="SelectDataViewItem(item,$index,DataViewConfigSub.ShowColumn[0])" ng-class="{\'item-avatar\':(!{{DataViewConfigSub.ShowImg|isEmpty}} || DataViewConfigSub.ShowColumn[0].fieldpath.toLowercase()==\'calen\'),\'itemlist\':{{DataViewConfigSub.ShowImg|isEmpty}}}"> <div class="itemAvatarDiv" ng-if="!(DataViewConfigSub.ShowImg|isEmpty)"> <!--ng-if="!(DataViewConfigSub.ShowImg|isEmpty)"--> <img ng-if="!item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty" ng-src="{{item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|guessImageMime:\'img/avatar.jpg\'}}" alt="Image" ng-click="viewFile(DataViewConfigSub.ShowImg[0],null,$index)" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}}"> <div ng-if="item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty" style="margin-top:auto;margin-bottom:auto;"> <div ng-if="(item.month|isEmpty)" class="profileIcon" style="background-color:{{item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()]|randomcolor}}"> {{ item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()] | uppercase | slice:0:2}} </div> <div class="calendarIcon" style="background-color:{{item.color}}" ng-if="!(item.month|isEmpty)"> <p>{{ item.month }}</p> <h2 style="color:{{item.color}}">{{ item.day }}</h2> </div> </div> </div> <div style="margin-top:auto;margin-bottom:auto;"> <h2 ng-if="!(item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]|isEmpty)" style="font-family: Roboto-Bold;margin-bottom: 5%;color:{{DataViewConfigSub.ShowColumn[0].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[0].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[0].textweight}};text-align:{{DataViewConfigSub.ShowColumn[0].bodyalign}};font-size: 18px;{{DataViewDataSub[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]|trustedhtml"></h2> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype ==\'description_auto\',\'fullWidth\':(item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]|isEmpty)}" style="max-width: 55%;float:left;color:{{DataViewConfigSub.ShowColumn[1].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}}max-width: 70%;width: 100%;{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[1]|trustedhtml"> </p> <span class="item-note" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[2].datatype ==\'description_auto\'}" style="color:{{DataViewConfigSub.ShowColumn[2].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};max-width: 40%; width: 100%;text-align: right;overflow: hidden;{{DataViewDataSub[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]|trustedhtml"> </span> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[3].datatype ==\'description_auto\'}" style="clear: both;color:{{DataViewConfigSub.ShowColumn[3].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[3].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[3].textweight}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|trustedhtml"> <span class="item-note" style="color:{{DataViewConfigSub.ShowColumn[4].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[4].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[4].textweight}}; max-width: 60%;" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[4]|trustedhtml"> </span> </p> </div> </div> <ion-option-button ng-repeat="btn in DataViewConfigSub.ProcessDtlBtns|orderBy:\'ordernum\'" class="{{btn.buttonstyle}}" ng-if="(btn|DataViewDtlBtn)==\'dtl\'" ng-click="SelectDataViewItemBtn(btn,item)"> {{ btn.processname }} </ion-option-button> <ion-option-button class="blue-steel" ng-click="selectDataViewWorkFlow(DataViewConfigSub.Config[0],item,\'content\',$index)" ng-show="DataViewConfigSub.GroupLink.isusewfmconfig==\'1\'"> Төлөв өөрчлөх </ion-option-button> <ion-option-button class="blue-steel" ng-click="deleteRowsColumn($index,processTab.paramrealpath.toLowerCase())" ng-show="processTab.isshowdelete==\'1\'"> Устгах </ion-option-button> </ion-item> <ion-infinite-scroll ng-if="!$root.moreDataDV" icon="ion-loading-c" on-infinite="RefreshDataViewDataSub()"></ion-infinite-scroll> </ion-list> <!--</ion-scroll>--></div>';
      break;
    case "DV_theme5":
      htmls =
        '<style> #template5dv .item-content { padding: 0; height: 100%; width: 100%; } #template5dv .listContent { height: 100%; width: 100%; padding: 0; background-color: #fff; margin: 0; border-bottom: 1px solid #6666; } #template5dv .item-content .itemlist { padding: 16px; padding-left: 12px; border-left: 6px solid transparent; } #template5dv .item-avatar { min-height: 68px; padding-top: 12px; padding-bottom: 12px; padding-right: 16px; padding-left: 60px; display: grid; border-left: 6px solid transparent; } #template5dv .itemAvatarDiv { position: absolute; width: 60px; height: 100%; left: 0; top: 0; bottom: 0; } #template5dv .item-avatar .itemAvatarDiv .profileIcon { margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; width: 100%; height: 40px; border-radius: 50%; text-align: center; color: #fff; padding-top: 10px; margin-left: 10px; position: absolute; bottom: 0; top: 0; } #template5dv .item-avatar .itemAvatarDiv img { margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; height: 40px; width: 100%; height: 100%; border-radius: 50%; text-align: center; color: #fff; margin-left: 10px; position: absolute; bottom: 0; top: 0; } #template5dv .statusName { border-radius: 10px; padding: 3px; margin-top: -4px; z-index: 99; position: absolute; right: 5%; background-color: white; } #template5dv .itemIconRight { width: calc(100% - 10px) } #template5dv .clearWhiteSpace { white-space: normal; } .displayNone { display: none; }</style><div id="template5dv" style="height: 100%;background-color:#fff;"> <!--<ion-scroll direction="y" style="width:100%; height: 100%">--> <ion-list can-swipe="true"> <ion-item item="post" class="listContent item-icon-right" ng-repeat="item in $root.DataViewDataSub|orderBy:DataViewOrderBy|limitTo:$root.dataViewLimit track by $index;" ng-if="((item|isObject) && $root.DataViewDataSub|objectDataViewKey:$index)" can-swipe="true"> <div ng-class="{\'itemlist\':(DataViewConfigSub.ShowImg|isEmptyCust),\'item-avatar\':!(DataViewConfigSub.ShowImg|isEmptyCust)}" ng-style="{\'border- left - color\':item.wfmstatuscolor}" style="background-color:{{item.rowcolor}};"> <div class="itemAvatarDiv" ng-if="!(DataViewConfigSub.ShowImg|isEmptyCust)"> <img ng-if="item.checkedType!=\'true\' && !(item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty)" ng-src="{{item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|guessImageMime:\'img/ avatar.jpg\':item}}" alt="Image" ng-click="viewFile(DataViewConfigSub.ShowImg[0],null,$index)"> <div ng-if="(item.checkedType!=\'true\' || checktype==\'hide\') && (item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|isEmpty)"> <div class="profileIcon" style="background-color:{{item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()]|randomcolor}}"> {{item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()]| uppercase | slice:0:2}} </div> </div> </div> <div style="margin-top:auto;margin-bottom:auto;display: block;height: 100%;" ng-class="{\'itemIconRight\':(!(DataViewConfigSub.DrillDown|isEmpty) || (item.childrecordcount < 1))}" ng-click="SelectDataViewItem(item,$index,DataViewConfigSub.ShowColumn[0])"> <h2 data-path="{{DataViewConfigSub.ShowColumn[0].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[0].datatype ==\'description_auto\'}" style="color:{{DataViewConfigSub.ShowColumn[0].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[0].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[0].textweight}};font-size: 14px;{{DataViewDataSub[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}};margin-top: auto; margin-bottom: auto;"> {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[0]|limitTo: 23}} <span data-path="{{DataViewConfigSub.ShowColumn[1].fieldpath}}" class="item-note" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype ==\'description_auto\',\'statusName\':DataViewConfigSub.ShowColumn[1].fieldpath==\'wfmStatusName\'}" style="color:{{DataViewConfigSub.ShowColumn[1].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}};max-width: 60%;{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}}" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[1]|trustedhtml"> </span> </h2> <p data-path="{{DataViewConfigSub.ShowColumn[2].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[2].datatype ==\'description_auto\',\'clearWhiteSpace\':isEmptyCust(item[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()]),\'displayNone\':{{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]|isEmptyCust}} && {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|isEmptyCust}}} " style="color:{{DataViewConfigSub.ShowColumn[2].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};{{DataViewDataSub[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}}"> {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]}} <span data-path="{{DataViewConfigSub.ShowColumn[3].fieldpath}}" class="item-note" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[3].datatype ==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[3].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[3].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[3].textweight}};max-width: 60%;" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|trustedhtml"> </span> </p> <p data-path="{{DataViewConfigSub.ShowColumn[4].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[4].datatype ==\'description_auto\',\'displayNone\':{{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[2]|isEmptyCust}} && {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[3]|isEmptyCust}}}" style="color:{{DataViewConfigSub.ShowColumn[4].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[4].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[4].textweight}};{{DataViewDataSub[DataViewConfigSub.ShowColumn[4].fieldpath.toLowerCase()+\'style\']}}"> {{item|setFieldValueDataView:DataViewConfigSub.ShowColumn[4]}} <span class="item-note" data-path="{{DataViewConfigSub.ShowColumn[5].fieldpath}}" ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[5].datatype ==\'description_auto\'}" style="color:{{DataViewConfigSub.ShowColumn[5].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[5].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[5].textweight}}; max-width: 60%;{{DataViewDataSub[DataViewConfigSub.ShowColumn[5].fieldpath.toLowerCase()+\'style\']}};" ng-bind-html="item|setFieldValueDataView:DataViewConfigSub.ShowColumn[5]|trustedhtml"> </span> </p> <i class="icon ion-chevron-right" style="right: 0;font-size: 24px;color: #aaa;width: 20px;" ng-if="(!(DataViewConfigSub.DrillDown|isEmpty) || (item.childrecordcount < 1))"></i> </div> </div> <ion-option-button ng-repeat="btn in DataViewConfigSub.ProcessDtlBtns|orderBy:\'ordernum\'" class="{{btn.buttonstyle}}" ng-if="(btn|DataViewDtlBtn)==\'dtl\'" ng-click="SelectDataViewItemBtn(btn,item)"> {{btn.processname}} <i ng-if="!(btn.iconname|isEmptyCust)" class="icon iconCustomer fa {{btn.iconname}}" style="margin-left: auto;margin-right: auto;"></i> </ion-option-button> <ion-option-button class="blue-steel" ng-click="selectDataViewWorkFlow(DataViewConfigSub.Config[0],item,\'content\',$index)" ng-show="DataViewConfigSub.GroupLink.isusewfmconfig==\'1\'"> Төлөв өөрчлөх </ion-option-button> <ion-option-button class="btn-green" ng-click="getBillData(item,DataViewConfigSub.GroupLink.metadmtemplatedtl)" ng-if="!(DataViewConfigSub.GroupLink.metadmtemplatedtl|isEmptyCust)"> Хэвлэх </ion-option-button> <ion-option-button class="blue-steel" ng-click="$root.deleteRowsColumn($index,selectRowsMenu.paramrealpath.toLowerCase())" ng-show="selectRowsMenu.isshowdelete==\'1\' ||DataViewConfigSub.isshowdelete==\'1\'"> Устгах </ion-option-button> <ion-option-button ng-if="!(item.pfnextstatuscolumnjson|isEmpty)" ng-repeat="btn in item.pfnextstatuscolumnjson.pfnextstatuscolumnjson" class="col col" ng-click="offlineWfnStatusChange(btn,item)" style="color:#fff;border-right: 2px solid #bdbdbd;font-size: 12px;text-align:center;background-color:{{btn.wfmstatuscolor}}"> <i class="fa {{btn.iconname}}" style="font-size:14px"></i> {{btn.wfmstatusname}} </ion-option-button> </ion-item> </ion-list> <ion-infinite-scroll ng-if="!$root.moreDataDV" icon="ion-loading-c" on-infinite="RefreshDataViewDataSub()"></ion-infinite-scroll> <!--</ion-scroll>--></div>';
      break;
    case "3":
    case "DV_theme3":
      htmls =
        '<style> #template3dv .item-content { padding: 3%; background-color: transparent; } #template3dv .item-content .col { padding: 0; margin-top: auto; margin-bottom: auto; } #template3dv #checkBoxLabel { font-size: 24px; } #template3dv .itemAvatarDiv { min-height: 30px; } #template3dv .itemAvatarDiv img { margin-bottom: auto; margin-top: auto; max-width: 40px; max-height: 40px; height: 40px; width: 100%; height: 100%; border-radius: 50%; text-align: center; color: #fff; position: absolute; bottom: 0; top: 0; } #template3dv input[type=checkbox] { display: none; } /* to hide the checkbox itself */ #template3dv input[type=checkbox] + label:before { font-family: FontAwesome; display: inline-block; } #template3dv input[type=checkbox] + label:before { content: "\f096"; } /* unchecked icon */ #template3dv input[type=checkbox] + label:before { letter-spacing: 10px; } /* space between checkbox and label */ #template3dv input[type=checkbox]:checked + label:before { content: "\f046"; } /* checked icon */ #template3dv input[type=checkbox]:checked + label:before { letter-spacing: 5px; } #template3dv .groupHeaderName { font-family: Roboto-Medium; color: var(--text-color); } #template3dv .badgenumber { float: right; padding-left: 5%; padding-right: 5%; color: #fff; border-radius: 10px; } #template3dv .checkboxLoader { margin-top: auto; margin-bottom: auto; font-size: x-large; } #template3dv .removeBorder { border: 0 !important; }</style><div id="template3dv"> <div class="item listContent" ng-repeat="key in $root.DataViewDataSub|groupByCust:DataViewConfigSub.Style.groupfield|disableAutoSort" ng-init="value=(DataViewDataSub|groupByCust:DataViewConfigSub.Style.groupfield)[key]" ng-if="!(key|isEmpty) || !(value|isEmpty)" ng-hide="(key|isEmpty) || (key==\'undefined\')" ng-class="{\'removeBorder\':($last==selectGroupName || DataViewConfigSub.Style.groupfieldexpand==\'true\')}"> <!-- <div class="item listContent" ng-repeat="(key, value) in DataViewDataSub|groupByCust:DataViewConfigSub.Style.groupfield " ng-if="!(key|isEmpty) || !(value|isEmpty)" ng-hide="(key|isEmpty) || (key==\'undefined\')" ng-class="{\'removeBorder\':($last==selectGroupName || DataViewConfigSub.Style.groupfieldexpand==\'true\')}">--> <!--ng-click="selectDataViewGroup(value)"--> <p class="groupHeaderName" ng-click="selectGroupNameFunction(key)">{{key}}<span class="badgenumber" style="background-color:{{value[0].wfmstatuscolor}};">{{value.length}}</span></p> <ion-item ng-repeat="item in value" id="dataViewItem{{item.id}}" ng-show="(selectGroupName==key || DataViewConfigSub.Style.groupfieldexpand==\'true\')" style="border: 0;border-bottom: 1px solid #ddd;margin:0;background-color:{{item.rowcolor}};"> <div class="row" style="padding:0;"> <div class="col col-10" ng-if="!(item.checkid|isEmpty)" ng-click="SelectDataViewItemBtnCheck(item,$index)" ng-hide="checkboxloader==$index"> <input id="{{\'check\'+item.id}}" type="checkbox" /> <label for="{{\'check\'+item.id}}" id="checkBoxLabel"></label> </div> <div class="col col-10 checkboxLoader" ng-show="checkboxloader==$index"> <i class="icon ion-loading-c"></i> </div> <div class="col col-20 itemAvatarDiv" ng-if="!(DataViewConfigSub.ShowImg|isEmptyCust)"> <img ng-src="{{item[DataViewConfigSub.ShowImg[0].fieldpath.toLowerCase()]|guessImageMime:\'img/avatar.jpg\':item}}" alt="Image" ng-click="viewFile(DataViewConfigSub.ShowImg[0],null,item.origIndex)"> </div> <!----> <div class="col col" ion-smooth-scroll="dataViewItem1574933392045" delegate-handle="ProcessRowsDtl" ng-click="$parent.SelectDataViewItem(item)"> <h2 ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[0].datatype==\'description_auto\'}" ng-if="!(item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()]|isEmpty)" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[0].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[0].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[0].textweight}};">{{item[DataViewConfigSub.ShowColumn[0].fieldpath.toLowerCase()]}}</h2> <div class="row" style="padding:0;"> <div class="col col" style="padding:0;" ng-style="{{DataViewConfigSub.ShowColumn[1].columnwidth|setcolumsize}}"> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[1].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}};text-align:{{DataViewConfigSub.ShowColumn[1].bodyalign}}"> {{item[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()]}} </p> </div> <div class="col col" style="padding:0;" ng-style="{{DataViewConfigSub.ShowColumn[2].columnwidth|setcolumsize}}"> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[2].datatype==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[2].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};text-align:{{DataViewConfigSub.ShowColumn[2].bodyalign}}"> {{item[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()]}} </p> </div> </div> <div class="row" style="padding:0;"> <div class="col col" style="padding:0;" ng-style="{{DataViewConfigSub.ShowColumn[3].columnwidth|setcolumsize}}"> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[3].datatype==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[3].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[3].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[3].textweight}};text-align:{{DataViewConfigSub.ShowColumn[3].bodyalign}}"> {{item[DataViewConfigSub.ShowColumn[3].fieldpath.toLowerCase()]}} </p> </div> <div class="col col" style="padding:0;" ng-style="{{DataViewConfigSub.ShowColumn[4].columnwidth|setcolumsize}}"> <p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[4].datatype==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[4].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[4].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[4].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[4].textweight}};text-align:{{DataViewConfigSub.ShowColumn[4].bodyalign}}"> {{item[DataViewConfigSub.ShowColumn[4].fieldpath.toLowerCase()]}} </p> </div> </div> <!--<p ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype==\'description_auto\'}" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[1].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[1].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[1].textweight}};"> {{item[DataViewConfigSub.ShowColumn[1].fieldpath.toLowerCase()]}} <span ng-class="{\'textwrap\':DataViewConfigSub.ShowColumn[1].datatype==\'description_auto\'}" class="item-note" style="{{DataViewDataSub[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()+\'style\']}};color:{{DataViewConfigSub.ShowColumn[2].textcolor}};text-transform:{{DataViewConfigSub.ShowColumn[2].texttransform}};font-weight:{{DataViewConfigSub.ShowColumn[2].textweight}};"> {{item[DataViewConfigSub.ShowColumn[2].fieldpath.toLowerCase()]}} </span> </p>--> </div> </div> <ion-option-button ng-repeat="btn in DataViewConfigSub.ProcessDtlBtns|orderBy:\'ordernum\'" class="{{btn.buttonstyle}}" ng-if="(btn|DataViewDtlBtn)==\'dtl\'" ng-click="SelectDataViewItemBtn(btn,item)"> {{btn.processname}} </ion-option-button> <ion-option-button class="blue-steel" ng-click="selectDataViewWorkFlow(DataViewConfigSub.Config[0],item,\'content\',$index)" ng-show="DataViewConfigSub.GroupLink.isusewfmconfig==\'1\'"> Төлөв өөрчлөх </ion-option-button> <ion-option-button class="blue-steel" ng-click="deleteRowsColumn($index,processTab.paramrealpath.toLowerCase())" ng-show="processTab.isshowdelete==\'1\'"> Устгах </ion-option-button> </ion-item> </div> <ion-infinite-scroll ng-if="!$root.moreDataDV" icon="ion-loading-c" on-infinite="RefreshDataViewDataSub()"></ion-infinite-scroll> </div>';
      break;
  }
  return htmls;
}
