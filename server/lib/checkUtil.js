/**
 * 核名组件
 * @type {Object}
 */
CheckUtil = {};

// ------------------------------------------------
/**
 * 处理虹口核名参数的函数
 * @param  {json} checkOptions 包含 check 和uuid 两个参数
 * check 用户核名信息
 * uuid 本次核名的流水   
 */
CheckUtil._handleHKCheck = function(checkOptions) {
  log("_handleHKCheck: Hi I am called.")

  var check = checkOptions.check;
  var company = check.company;
  var companyZone = company.companyZone;
  var companyName = company.companyName;
  var companyType = company.companyType;
  var moneyAmount = company.moneyAmount;
  var businessScope = company.businessScope;
  var alternativeName = company.alternativeName;
  var currentAlternative = [];

  alternativeName.forEach(function(alName) {
    currentAlternative.push(alName.name);
  });

  var companyAddress = check.companyAddress;

  var holders = check.holders;
  var holderName = [];
  var holderID = [];

  holders.forEach(function(holder) {
    holderName.push(holder.holderName);
    holderID.push(holder.holderID)
  })  

  var requests = [];
  var checkBook = {
    fileName: 'K0211090101',
    cnLabel: '企业名称预先核准申请书',    
    companyName: companyName,
    alternativeName: currentAlternative,
    companyAddress: companyAddress,
    businessScope: businessScope,
    holderName: holderName,
    holderID: holderID,
    moneyAmount: moneyAmount
  };

  requests.push(checkBook);
  return requests;
}



// ------------------------------------------------
/**
 * 处理浦东核名参数的函数
 * @param  {json} checkOptions 包含 check 和uuid 两个参数
 * check 用户核名信息
 * uuid 本次核名的流水   
 */
CheckUtil._handlePDCheck = function(checkOptions) {
  log("_handlePDCheck: Hi I am called.")

  var check = checkOptions.check;
  var company = check.company;
  var companyZone = company.companyZone;
  var companyName = company.companyName;
  var companyType = company.companyType;
  var moneyAmount = company.moneyAmount;
  var businessScope = company.businessScope;
  var alternativeName = company.alternativeName;
  var currentAlternative = [];

  alternativeName.forEach(function(alName) {
    currentAlternative.push(alName.name);
  });

  var companyAddress = check.companyAddress;

  var holders = check.holders;
  var holderName = [];
  var holderID = [];

  holders.forEach(function(holder) {
    holderName.push(holder.holderName);
    holderID.push(holder.holderID)
  })  
  var requests = [];
  var checkBook = {
    fileName: 'K0211020101',
    cnLabel: '企业名称预先核准申请书',    
    companyName: companyName,
    alternativeName: currentAlternative,
    companyAddress: companyAddress,
    businessScope: businessScope,
    holderName: holderName,
    holderID: holderID,
    moneyAmount: moneyAmount
  };
  requests.push(checkBook);
  var certification = {
    fileName: 'K0211020102',
    cnLabel: '委托人代理证明',
    holderName: holderName.join('、')
  };
  requests.push(certification);

  var authorizationPaper = {
    fileName: 'K0211020103',
    cnLabel: '委托书',
    holderName: holderName.join('、')
  }
  requests.push(authorizationPaper);
  return requests;
}

// ------------------------------------------------
/**
 * 处理虹口核名
 * @param  {json} checkOptions 包含 check 和uuid 两个参数
 * check 用户核名信息
 * uuid 本次核名的流水   
 */
CheckUtil.HandleHKCheck = function(checkOptions) {
  log("HandleHKCheck: Hi I am called.")
  var requests = CheckUtil._handleHKCheck(checkOptions);

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = checkOptions.uuid;
    delete request.fileName;
    delete request.cnLabel;

    var paramsObj = {
      fileName: fileName,
      cnLabel: cnLabel,
      randomStr: randomStr,
      fileData: request
    };

    Util.getTemplateService(paramsObj);
  })
};

// ------------------------------------------------
/**
 * 处理浦东核名
 * @param  {json} checkOptions 包含 check 和uuid 两个参数
 * check 用户核名信息
 * uuid 本次核名的流水   
 */
CheckUtil.HandlePDCheck = function(checkOptions) {
  log("HandlePDCheck: Hi I am called.")
  var requests = CheckUtil._handlePDCheck(checkOptions);

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = checkOptions.uuid;
    delete request.fileName;
    delete request.cnLabel;

    var paramsObj = {
      fileName: fileName,
      cnLabel: cnLabel,
      randomStr: randomStr,
      fileData: request
    };

    Util.getTemplateService(paramsObj);

  })
}
// ------------------------------------------------

