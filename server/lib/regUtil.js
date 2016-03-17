/**
 * RegUtil: 企业登记Util
 */

RegUtil = {};

// ------------------------------------------------
/**
 * 登记信息初始化
 * @param {json} registration 数据库中的registration结构
 * @return {json} 返回初始化registration
 * {label: '虹口-200082', value: '200082'}
 * {label: '浦东-201204', value: '201204'}
 */

RegUtil.handleRegistration = function(registration) {
  if(!registration.hasOwnProperty('company')) {
    var company = {};  
  } else {
    var company = registration.company;
  }
  var companyArray = ['companyZone', 'companyName', 'companyType', 'companyId', 'companyTel', 'companyZipcode', 'moneyAmount', 'businessScope', 'businessPeriod']
  registration.company = Util.fillObject(company, companyArray);
  registration.company.companyZone = registration.company.companyZone || "虹口";

  // 邮编
  registration.company.companyZipcode = '200082';
  switch(registration.company.companyZone) {
    case '虹口':
      registration.company.companyZipcode = '200082';
      break;
    case '浦东':
      registration.company.companyZipcode = '201204';
      break;
    default: 
      registration.company.companyZipcode = '200082';
      break;
  }

  // 注册资本
  registration.company.moneyAmount = registration.company.moneyAmount || 0 ;

  // addressFlag 是否需要提供地址
  if(!registration.hasOwnProperty('addressFlag')) {
     registration.addressFlag = '是';
  }

  // companyAddress 公司地址
  if(!registration.hasOwnProperty('companyAddress')) {
    registration.companyAddress = ' ';
  }

  // productionAddress 生产地址
  if(!registration.hasOwnProperty('productionAddress')) {
    registration.productionAddress = ' ';
  }

  if(registration.hasOwnProperty('legalPerson')) {
    var legalPerson = registration.legalPerson;
  } else {
    var legalPerson = {};
  };

  var legalPersonArray = ['legalPersonName', 'legalPersonTel', 'legalPersonPhone', 'legalPersonEmail', 'legalPersonIDType', 'legalPersonID'];
  registration.legalPerson = Util.fillObject(legalPerson, legalPersonArray);

  // chairman 董事
  if(registration.hasOwnProperty('chairman')) {
    var chairman = registration.chairman;
  } else {
    var chairman = {};
  };        
  var chairmanArray = ['chairmanName', 'chairmanType', 'chairmanIDType', 'chairmanID', "chairmanPhone"];
  registration.chairman = Util.fillObject(chairman, chairmanArray);

  // supervisor 监事
  if(registration.hasOwnProperty('supervisor')) {
    var supervisor = registration.supervisor;
  } else {
    var supervisor = {};
  }; 
  var supervisorArray = ['supervisorName', 'supervisorType', 'supervisorIDType', 'supervisorID'] 
  registration.supervisor = Util.fillObject(supervisor, supervisorArray);

  // manager 经理
  if(registration.hasOwnProperty('manager')) {
    var manager = registration.manager;
  } else {
    var manager = {};
  };         
  var managerArray = ['managerName', 'managerType', 'managerIDType', 'managerID'];

  registration.manager = Util.fillObject(manager, managerArray);
  if(registration.manager.managerName.trim() === '') {
    registration.manager.managerName = registration.legalPerson.legalPersonName;
    registration.manager.managerID = registration.legalPerson.legalPersonID;
  }

  // holders 股东
  if(registration.hasOwnProperty('holders')) {
    var holders = registration.holders;
  } else {
    var holders = [];
  };      
  var holdersA = [];

  holders.forEach(function(holder) {
    var currentHolder = {};
    var holderArray = ['holderName', 'holderIDType', 'holderID', 'investType'];
    currentHolder = Util.fillObject(holder, holderArray);
    currentHolder.investShare = holder.investShare || 0;
    currentHolder.investMoneyAmount = company.moneyAmount * currentHolder.investShare / 100|| 0;
    holdersA.push(currentHolder);
  })
  registration.holders = holdersA;

  //contractor 联络员
  if(registration.hasOwnProperty('contractor')) {
    var contractor = registration.contractor;
  } else {
    var contractor = {};
  };   
  var contractorArray = ['contractorName', 'contractorTel', 'contractorPhone', 'contractorEmail', 'contractorIDType', 'contractorID'];
  registration.contractor = Util.fillObject(contractor, contractorArray);

  //financialStaff 财务联络人
  if(registration.hasOwnProperty('financialStaff')) {
    var financialStaff = registration.financialStaff;
  } else {
    var financialStaff = {};
  };   

  var financialStaffArray = ['financialStaffName', 'financialStallTel', 'financialStaffPhone', 'financialStaffEmail', 'financialStaffIDType', 'financialStaffID'];
  registration.financialStaff = Util.fillObject(financialStaff, financialStaffArray);

  // authorizationFlag  是否需要开业啦代理

  if(!registration.hasOwnProperty('authorizationFlag')) {
    registration.authorizationFlag = '是';
  }
  // createTime 创建日期
  if(!registration.hasOwnProperty('createTime')) {
    registration.createTime = new Date();
  }
  return registration;  
}

// ------------------------------------------------
/**
 * 初始化登记信息
 * @param  {json} registrationOptions 登记信息registration 对象
 * @return {json}                     初始化后的registration对象
 */
RegUtil._templateInit = function(registrationOptions) {
  var _regObj = {};

  var registration = registrationOptions.registration;
  _regObj.uuid = registrationOptions.uuid;

  var company = registration.company;

  _regObj.companyZone = company.companyZone;
  _regObj.companyName = company.companyName;
  _regObj.companyType = company.companyType;
  _regObj.companyId = company.companyId;
  _regObj.companyTel = company.companyTel;
  _regObj.companyZipcode = company.companyZipcode;
  _regObj.moneyAmount = company.moneyAmount;
  _regObj.businessScope = company.businessScope;
  _regObj.businessPeriod = company.businessPeriod;

  _regObj.addressFlag = registration.addressFlag;
  _regObj.companyAddress = registration.companyAddress;
  _regObj.productionAddress = registration.productionAddress;

  var legalPerson = registration.legalPerson;

  _regObj.legalPersonName = legalPerson.legalPersonName;
  _regObj.legalPersonTel = legalPerson.legalPersonTel;
  _regObj.legalPersonPhone = legalPerson.legalPersonPhone;
  _regObj.legalPersonEmail = legalPerson.legalPersonEmail;
  _regObj.legalPersonIDType = legalPerson.legalPersonIDType;
  _regObj.legalPersonID = legalPerson.legalPersonID;

  var chairman = registration.chairman;

  _regObj.chairmanName = chairman.chairmanName;
  _regObj.chairmanType = chairman.chairmanType;
  _regObj.chairmanIDType = chairman.chairmanIDType;
  _regObj.chairmanID = chairman.chairmanID;
  _regObj.chairmanPhone = chairman.chairmanPhone;

  var supervisor = registration.supervisor;

  _regObj.supervisorName = supervisor.supervisorName;
  _regObj.supervisorType = supervisor.supervisorType;
  _regObj.supervisorIDType = supervisor.supervisorIDType;
  _regObj.supervisorID = supervisor.supervisorID;

  var manager = registration.manager;

  _regObj.managerName = manager.managerName;
  _regObj.managerType = manager.managerType;
  _regObj.managerIDType = manager.managerIDType;
  _regObj.managerID = manager.managerID;


  var contractor = registration.contractor;

  _regObj.contractorName = contractor.contractorName;
  _regObj.contractorTel = contractor.contractorTel;
  _regObj.contractorPhone = contractor.contractorPhone;
  _regObj.contractorEmail = contractor.contractorEmail;
  _regObj.contractorIDType = contractor.contractorIDType;
  _regObj.contractorID = contractor.contractorID;

  var financialStaff = registration.financialStaff;

  _regObj.financialStaffName = financialStaff.financialStaffName;
  _regObj.financialStallTel = financialStaff.financialStallTel;
  _regObj.financialStaffPhone = financialStaff.financialStaffPhone;
  _regObj.financialStaffEmail = financialStaff.financialStaffEmail;
  _regObj.financialStaffIDType = financialStaff.financialStaffIDType;
  _regObj.financialStaffID = financialStaff.financialStaffID;

  _regObj.authorizationFlag = registration.authorizationFlag;

  _regObj.createTime = registration.createTime;  

  var year = _regObj.createTime.getFullYear();
  var month = _regObj.createTime.getMonth() + 1;
  var day = '28';

  _regObj.investDate = (year + 10) + '年' + month + '月' + day + '日';
  _regObj.mettingDate = year + '年' + month + '月' + day + '日';

  _regObj.holders = registration.holders;

  return _regObj;
}

// ------------------------------------------------
/**
 * 初始化虹口备案请求列表
 * @param  {object} _regObj 备案信息结构
 * @return {object}         初始化后的备案结构信息
 */

// 虹口文档信息
//  var files = [
//   {id: 'K0211090101', name: '预先核名[单人]'},
//   {id: 'K0211090102', name: '预先核名[多人]'},
//   {id: 'K0211090201', name: '股东会决议[单人]'},
//   {id: 'K0211090202', name: '股东会决议[多人]'},  
//   {id: 'K0211090301', name: '公司章程[单人]'},
//   {id: 'K0211090302', name: '公司章程[多人]'},
//   {id: 'K0211090401', name: '房屋租赁合同'},
//   {id: 'K0211090501', name: '指定代表或共同代理人授权书'},
//   {id: 'K0211090601', name: '公司登记（备案）申请书'},
//   {id: 'K0211090701', name: '广告企业告知承诺书'},
//   {id: 'K0211090801', name: '小型微型企业认定申请表'},
//   {id: 'K0211090901', name: '上海市组织机构代码申请表'},
//   {id: 'K02110901001', name: '情况说明'}
// ]

RegUtil._hkRegLits = function(_regObj) {
  log("_hkRegLits: Hi I am called.");
  var regulationFileName = '';
  var holderFileName = '';
  var registrationFileName = '';

  var holders = _regObj.holders;
  var holderLength = holders.length;

  var holderName = [];
  var holderIDType = [];    
  var holderID = [];
  var investType = [];
  var investShare = [];
  var investMoneyAmount = [];
  var investDateOutput = [];

  holders.forEach(function(holder) {
    holderName.push(holder.holderName);
    holderIDType.push(holder.holderIDType);
    holderID.push(holder.holderID);
    investType.push(holder.investType);
    investShare.push(holder.investShare + "%");
    investMoneyAmount.push(holder.investMoneyAmount);
    investDateOutput.push(_regObj.investDate);
  })

  
  if(holderLength <= 1) {
    log("单人")
    regulationFileName = 'K0211090301';
    holderFileName = 'K0211090201';
    registrationFileName = 'K0211090601';

    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: _regObj.companyName,
      companyAddress: _regObj.companyAddress,
      productionAddress: _regObj.productionAddress,
      businessScope: _regObj.businessScope,
      moneyAmount: _regObj.moneyAmount,
      holderName: holderName[0],
      investDate: investDateOutput[0],
      investType: investType[0],
      investMoney: investMoneyAmount[0],
      registeredCapital: investMoneyAmount[0]
    }

  } else {
    log('多人')
    regulationFileName = 'K0211090302';
    holderFileName = 'K0211090202';
    registrationFileName = 'K0211090602'; 
    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: _regObj.companyName,
      companyAddress: _regObj.companyAddress,
      productionAddress: _regObj.productionAddress,
      businessScope: _regObj.businessScope,
      moneyAmount: _regObj.moneyAmount,
      holderName: holderName,
      investDate: investDateOutput,
      investType: investType,
      investMoney: investMoneyAmount,
      registeredCapital: investMoneyAmount
    }
  }  

  var requests = [];
  requests.push(regulations);

  var shareholder = {
    fileName : holderFileName,
    cnLabel : '股东会决议',
    mettingDate: _regObj.mettingDate,
    companyName : _regObj.companyName,
    chairmanName: _regObj.chairmanName,
    managerName: _regObj.managerName,
    supervisorName: _regObj.supervisorName,
    supervisorID: _regObj.supervisorID
  }
  requests.push(shareholder)


  var leasing = {
    fileName: 'K0211090401',
    cnLabel: '房屋租赁合同',
    companyName: _regObj.companyName,
    companyAddress: _regObj.companyAddress     
  }
  requests.push(leasing);

  // 公司备案申请书
  var registrationBook = {
    fileName: registrationFileName,
    cnLabel : '公司登记（备案）申请书',    
    companyName: _regObj.companyName,
    companyZone: _regObj.companyZone,
    companyType: _regObj.companyType,
    companyId: _regObj.companyId,
    companyTel: _regObj.companyTel,
    companyZipcode: _regObj.companyZipcode,
    businessScope: _regObj.businessScope,
    businessPeriod: _regObj.businessPeriod,

    companyAddress: _regObj.companyAddress,
    productionAddress: _regObj.productionAddress,

    legalPersonName: _regObj.legalPersonName,
    legalPersonTel: _regObj.legalPersonTel,
    legalPersonPhone: _regObj.legalPersonPhone,
    legalPersonEmail: _regObj.legalPersonEmail,
    legalPersonIDType: _regObj.legalPersonIDType,
    legalPersonID: _regObj.legalPersonID,

    chairmanName: _regObj.chairmanName,
    chairmanType: _regObj.chairmanType,
    chairmanIDType: _regObj.chairmanIDType,
    chairmanID: _regObj.chairmanID,
    chairmanPhone: _regObj.chairmanPhone,

    supervisorName: _regObj.supervisorName,
    supervisorType: _regObj.supervisorType,
    supervisorIDType: _regObj.supervisorIDType,
    supervisorID: _regObj.supervisorID,

    managerName: _regObj.managerName,
    managerType: _regObj.managerType,
    managerIDType: _regObj.managerIDType,
    managerID: _regObj.managerID,

    holderName: holderName,
    holderIDType: holderIDType,
    holderID: holderID,
    investType: investType,
    investDate: investDateOutput,
    money: investMoneyAmount,
    share: investShare,
    moneyAmount: _regObj.moneyAmount,

    contractorName: _regObj.contractorName,
    contractorTel: _regObj.contractorTel,
    contractorPhone: _regObj.contractorPhone,
    contractorEmail: _regObj.contractorEmail,
    contractorIDType: _regObj.contractorIDType,
    contractorID: _regObj.contractorID,

    financialStaffName: _regObj.financialStaffName,
    financialStallTel: _regObj.financialStallTel,
    financialStaffPhone: _regObj.financialStaffPhone,
    financialStaffEmail: _regObj.financialStaffEmail,
    financialStaffIDType: _regObj.financialStaffIDType,
    financialStaffID: _regObj.financialStaffID
  }

  requests.push(registrationBook);
  var commitment = {
    fileName: 'K0211090701',
    cnLabel : '广告企业告知承诺书'
  };

  requests.push(commitment);

  var appraise = {
    fileName: 'K0211090801',
    cnLabel : '小型微型企业认定申请表'
  };
  requests.push(appraise);

  var companyIdApplication = {
    fileName: 'K0211090901',
    cnLabel : '上海市组织机构代码申请表'
  };

  requests.push(companyIdApplication);

  var note = {
    fileName: 'K0211091001',
    cnLabel : '情况说明'
  };

  requests.push(note);

  return requests;
}





// ------------------------------------------------

/**
 * 初始化浦东备案请求列表
 * @param  {object} _regObj 备案信息结构
 * @return {object}         初始化后的备案结构信息
 */

// var files = [
//   {id: 'K0211020101', name: '预先核名[单人]'},
//   {id: 'K0211020102', name: '预先核名[多人]'},
//   {id: 'K0211020201', name: '股东会决议[单人]'},
//   {id: 'K0211020202', name: '股东会决议[多人]'},  
//   {id: 'K0211020301', name: '公司章程[单人]'},
//   {id: 'K0211020302', name: '公司章程[多人]'},
//   {id: 'K0211020401', name: '房屋租赁合同'},
//   {id: 'K0211020501', name: '指定代表或共同代理人授权书'},
//   {id: 'K0211020601', name: '公司登记（备案）申请书'},
//   {id: 'K0211020701', name: '广告企业告知承诺书'},
//   {id: 'K0211020801', name: '小型微型企业认定申请表'},
//   {id: 'K0211020901', name: '上海市组织机构代码申请表'},
//   {id: 'K02110201001', name: '情况说明'}
// ]

RegUtil._pdRegLits = function(_regObj) {
  log("_pdRegLits: Hi I am called.");
  var regulationFileName = '';
  var holderFileName = '';
  var registrationFileName = '';

  var holders = _regObj.holders;
  var holderLength = holders.length;

  var holderName = [];
  var holderIDType = [];    
  var holderID = [];
  var investType = [];
  var investShare = [];
  var investMoneyAmount = [];
  var investDateOutput = [];
  holders.forEach(function(holder) {
    holderName.push(holder.holderName);
    holderIDType.push(holder.holderIDType);
    holderID.push(holder.holderID);
    investType.push(holder.investType);
    investShare.push(holder.investShare + "%");
    investMoneyAmount.push(holder.investMoneyAmount);
    investDateOutput.push(_regObj.investDate);
  })

  
  if(holderLength <= 1) {
    console.log("单人")
    regulationFileName = 'K0211020301';
    holderFileName = 'K0211020201';
    registrationFileName = 'K0211020601';

    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: _regObj.companyName,
      companyAddress: _regObj.companyAddress,
      productionAddress: _regObj.productionAddress,
      businessScope: _regObj.businessScope,
      moneyAmount: _regObj.moneyAmount,
      holderName: holderName[0],
      investDate: investDateOutput[0],
      investType: investType[0],
      investMoney: investMoneyAmount[0],
      registeredCapital: investMoneyAmount[0]
    }

  } else {
    console.log('多人')
    regulationFileName = 'K0211020302';
    holderFileName = 'K0211020202';
    registrationFileName = 'K0211020602'; 
    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: _regObj.companyName,
      companyAddress: _regObj.companyAddress,
      productionAddress: _regObj.productionAddress,
      businessScope: _regObj.businessScope,
      moneyAmount: _regObj.moneyAmount,
      holderName: holderName,
      holderNames: holderName.join('、'),
      share: investShare,
      investDate: investDateOutput,
      investType: investType,
      investMoney: investMoneyAmount,
      registeredCapital: investMoneyAmount
    }
  }  
  var requests = [];
  requests.push(regulations);

  var shareholder = {
    fileName : holderFileName,
    cnLabel : '股东会决议',
    mettingDate: _regObj.mettingDate,
    companyName : _regObj.companyName,
    chairmanName: _regObj.chairmanName,
    supervisorName: _regObj.supervisorName,
    managerName: _regObj.managerName,
    holderNumber: holderLength,
    supervisorID: _regObj.supervisorID
  }
  requests.push(shareholder)


  var leasing = {
    fileName: 'K0211020401',
    cnLabel: '房屋租赁合同',
    companyName: _regObj.companyName,
    companyAddress: _regObj.companyAddress     
  }
  requests.push(leasing);

  // 公司备案申请书
  var registrationBook = {
    fileName: registrationFileName,
    cnLabel : '公司登记（备案）申请书',    
    companyName: _regObj.companyName,
    companyZone: _regObj.companyZone,
    companyType: _regObj.companyType,
    companyId: _regObj.companyId,
    companyTel: _regObj.companyTel,
    companyZipcode: _regObj.companyZipcode,
    businessScope: _regObj.businessScope,
    businessPeriod: _regObj.businessPeriod,

    companyAddress: _regObj.companyAddress,
    productionAddress: _regObj.productionAddress,

    legalPersonName: _regObj.legalPersonName,
    legalPersonTel: _regObj.legalPersonTel,
    legalPersonPhone: _regObj.legalPersonPhone,
    legalPersonEmail: _regObj.legalPersonEmail,
    legalPersonIDType: _regObj.legalPersonIDType,
    legalPersonID: _regObj.legalPersonID,

    chairmanName: _regObj.chairmanName,
    chairmanType: _regObj.chairmanType,
    chairmanIDType: _regObj.chairmanIDType,
    chairmanID: _regObj.chairmanID,

    supervisorName: _regObj.supervisorName,
    supervisorType: _regObj.supervisorType,
    supervisorIDType: _regObj.supervisorIDType,
    supervisorID: _regObj.supervisorID,

    managerName: _regObj.managerName,
    managerType: _regObj.managerType,
    managerIDType: _regObj.managerIDType,
    managerID: _regObj.managerID,

    holderName: holderName,
    holderIDType: holderIDType,
    holderID: holderID,
    investType: investType,
    investDate: investDateOutput,
    money: investMoneyAmount,
    share: investShare,
    moneyAmount: _regObj.moneyAmount,

    contractorName: _regObj.contractorName,
    contractorTel: _regObj.contractorTel,
    contractorPhone: _regObj.contractorPhone,
    contractorEmail: _regObj.contractorEmail,
    contractorIDType: _regObj.contractorIDType,
    contractorID: _regObj.contractorID,

    financialStaffName: _regObj.financialStaffName,
    financialStallTel: _regObj.financialStallTel,
    financialStaffPhone: _regObj.financialStaffPhone,
    financialStaffEmail: _regObj.financialStaffEmail,
    financialStaffIDType: _regObj.financialStaffIDType,
    financialStaffID: _regObj.financialStaffID
  }

  requests.push(registrationBook);


  var commitment = {
    fileName: 'K0211020701',
    cnLabel : '广告企业告知承诺书'
  };

  requests.push(commitment);

  var appraise = {
    fileName: 'K0211020801',
    cnLabel : '小型微型企业认定申请表'
  };
  requests.push(appraise);

  var companyIdApplication = {
    fileName: 'K0211020901',
    cnLabel : '上海市组织机构代码申请表'
  };

  requests.push(companyIdApplication);

  var cogeneration = {
    fileName: 'K0211021001',
    cnLabel : '联动登记申请单',
    companyName: _regObj.companyName,
    companyAddress: _regObj.companyAddress,
    legalPersonName: _regObj.legalPersonName,
    legalPersonPhone: _regObj.legalPersonPhone,
    companyType: _regObj.companyType,
    zipcode: _regObj.companyZipcode    
  }
  requests.push(cogeneration);

  return requests;
}

// ------------------------------------------------
/**
 * 虹口备案申请书生成服务
 * @param {object}   registrationOptions 备案申请结构体参数
 */
 RegUtil.HandleHKTemplate = function(registrationOptions) {
  log("HandleHKTemplate: Hi I am called.");
  
  var _regObj = RegUtil._templateInit(registrationOptions);
  
  var requests = RegUtil._hkRegLits(_regObj);

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = _regObj.uuid;
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
/**
 * 浦东备案申请书生成服务
 * @param {object}   registrationOptions 备案申请结构体参数
 */

RegUtil.HandlePDTemplate = function(registrationOptions, callback) {
  log("HandlePDTemplate: Hi I am called.");

  _regObj = RegUtil._templateInit(registrationOptions);

  var requests = RegUtil._pdRegLits(_regObj);

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = _regObj.uuid;
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