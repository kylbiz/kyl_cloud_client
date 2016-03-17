/**
 * 小白云后端服务地址
 * @return {string} 服务地址
 */
kylServiceRequestUrl = function() {
  return "http://120.55.166.196:8080/word/MyServlet";
}

// ------------------------------------------------
/**
 * 打印函数
 * @param  {array} info array or parameteors
 */
log = function(info) {
  var len = arguments.length;
  console.log('--------------------------------')
  for(var i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
}

// ------------------------------------------------
/**
 * 工具类
 * @type {Object}
 */
Util = {};
// ------------------------------------------------
/**
 * 对象属性初始化
 * @param  {object} obj        初始化的对象
 * @param  {array} properties 传入对象属性列表
 * @return {object}            初始化后的对象
 */
Util.fillObject = function(obj, properties) {
  currentObj = {};
  properties.forEach(function(propertity) {
    if(!obj.hasOwnProperty(propertity)) {
      currentObj[propertity] = " ";
    } else {
      currentObj[propertity] = obj[propertity];
    } 
  });
  return currentObj;
}


// ------------------------------------------------
/**
 * 初始化核名对象
 * @param  {json} check 已存在核名脆响
 * @return {json}       初始化后的和名对象
 */
Util.handleCheck = function(check) {
  if(!check.hasOwnProperty('company')) {
    var company = {};  
  } else {
    var company = check.company;
  }  
  var companyArray = ['companyZone', 'companyName', 'companyType', 'businessScope'];
  if(company.hasOwnProperty('moneyAmount')) {
    var moneyAmount = company.moneyAmount;
  } else {
    var moneyAmount = 0;
  }

  if(company.hasOwnProperty('alternativeName')) {
    var alternativeName = company.alternativeName;
  } else {
    var alternativeName = [];
  }

  check.company = Util.fillObject(company, companyArray);
  check.company.alternativeName = alternativeName;
  check.company.companyZone = check.company.companyZone || "虹口";
  check.company.moneyAmount = moneyAmount;

  if(!check.hasOwnProperty('addressFlag')) {
    check.addressFlag = '开业啦提供地址';
  }
  if(!check.hasOwnProperty('companyAddress')) {
    check.companyAddress = " ";
  } 

  // holders 股东
  if(check.hasOwnProperty('holders')) {
    var holders = check.holders;
  } else {
    var holders = [];
  };      
  var holdersA = [];
  holders.forEach(function(holder) {
    var currentHolder = {};
    var holderArray = ['holderName', 'holderID'];
    currentHolder = Util.fillObject(holder, holderArray);
    holdersA.push(currentHolder);
  })
  check.holders = holdersA;

  return check;
}


// ------------------------------------------------
/**
 * 请求 生成文档服务,请求得到结果存在数据库中   
 * @param  {object} options
 */
Util.getTemplateService = function(options) {
  if(!options 
    || !options.hasOwnProperty("cnLabel")
    || !options.hasOwnProperty("fileName")
    || !options.hasOwnProperty("randomStr")
    || !options.hasOwnProperty("fileData")) {
    log("getTemplateService: options illegal.", options);
  } else {
    log("getTemplateService: start generate document [" +cnLabel +"].");
    
    var logStr = ""; // 打印字符串变量
    var randomStr = options.randomStr;
    var fileName = options.fileName;
    var cnLabel = options.cnLabel;
    var handleFlag = 'true';          
    var fileData = options.fileData || {};

    var params = {
      fileName: fileName,
      cnLabel: cnLabel,
      randomStr: randomStr,
      fileData: fileData
    }
    var queryParams = {
      key: JSON.stringify(params)
    }

    var requestUrl = kylServiceRequestUrl();

    HTTP.call("POST",requestUrl, {
      params: queryParams
    }, function(err, result) {
      if(err
        || !result
        || result.statusCode !== 200) {
        logStr = 'getTemplateService: ' 
          + cnLabel 
          + ' [ ' + fileName + ' ] ' 
          + 'handle error,try again.';
        log(logStr, err)        
      } else {
        var resultString = result.content;

        HandleResults.insert({
          uuid: randomStr,
          handleFlag: handleFlag,
          wordURI: resultString,
          fileName: fileName,
          cnLabel: cnLabel,
          createDate: new Date()
        }, function(err) {
          if(err) {
            logStr = "getTemplateService: " 
              + cnLabel 
              + ' [ ' + fileName + ' ] ' 
              + 'save handle results to db error';
            log(logStr, err);
          } else {
            logStr = "getTemplateService: "
              + cnLabel 
              + ' [ ' + fileName + ' ] ' 
              + 'save handle results to db succeed!'
            log(logStr);
          }
        })
      }
    })  
  }
}


// ------------------------------------------------