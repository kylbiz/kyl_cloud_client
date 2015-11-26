var querystring = Meteor.npmRequire('querystring')
var requestUrl = 'http://114.80.9.19:8801/docgen/';

function log(info) {
  var len = arguments.length;
  console.log('------------------------------------')
  for(var i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
};

function isInteger(value) {
  return typeof value === "number" && isFinite(value) && Math.floor(value) === value;  
}


function handleProportion(numerator, denominator) {
  var num = numerator * 100 / denominator;
  if(isInteger(num)){
    return num + '%';
  }else {
    return num.toFixed(2) + '%';
  }
}

/**
 * @param  {Object} an object to handle
 * @param  {Array}  a lists of proprities that obj will have  
 * @return {Object} obj with all kinds of proprities
 */
function fillObject(obj, properties) {
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


function handleRegistration(registration) {
  if(!registration.hasOwnProperty('company')) {
    var company = {};  
  } else {
    var company = registration.company;
  }
  var companyArray = ['companyZone', 'companyName', 'companyType', 'companyId', 'companyTel', 'companyZipcode', 'moneyAmount', 'businessScope', 'businessPeriod']
  registration.company = fillObject(company, companyArray);
  registration.company.companyZone = registration.company.companyZone || "虹口";
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
  registration.legalPerson = fillObject(legalPerson, legalPersonArray);

  // chairman 董事
  if(registration.hasOwnProperty('chairman')) {
    var chairman = registration.chairman;
  } else {
    var chairman = {};
  };        
  var chairmanArray = ['chairmanName', 'chairmanType', 'chairmanIDType', 'chairmanID', "chairmanPhone"];
  registration.chairman = fillObject(chairman, chairmanArray);

  // supervisor 监事
  if(registration.hasOwnProperty('supervisor')) {
    var supervisor = registration.supervisor;
  } else {
    var supervisor = {};
  }; 
  var supervisorArray = ['supervisorName', 'supervisorType', 'supervisorIDType', 'supervisorID'] 
  registration.supervisor = fillObject(supervisor, supervisorArray);
  // manager 经理
  if(registration.hasOwnProperty('manager')) {
    var manager = registration.manager;
  } else {
    var manager = {};
  };         
  var managerArray = ['managerName', 'managerType', 'managerIDType', 'managerID'];
  registration.manager = fillObject(manager, managerArray);
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
    currentHolder = fillObject(holder, holderArray);
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
  registration.contractor = fillObject(contractor, contractorArray);

  //financialStaff 财务联络人
  if(registration.hasOwnProperty('financialStaff')) {
    var financialStaff = registration.financialStaff;
  } else {
    var financialStaff = {};
  };   

  var financialStaffArray = ['financialStaffName', 'financialStallTel', 'financialStaffPhone', 'financialStaffEmail', 'financialStaffIDType', 'financialStaffID'];
  registration.financialStaff = fillObject(financialStaff, financialStaffArray);

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



Meteor.methods({
  "GenerateTemplate": function(options) {
    console.log('GenerateTemplate called');
    function HandleTemplate(callback) {
      if(!options || !options.docId || !options.uuid) {
        var err = "err: docId should not be null"; 
        log("err: docId should not be null")
        callback(err, null);
      } else {
        // basic company information 
        var docId = options.docId;
        var currentCompany = Company.findOne({docId: docId});
        if(currentCompany) {
          var registration = handleRegistration(currentCompany);
          var companyZone = registration.company.companyZone;
          var registrationOptions = {
            registration: registration,
            uuid: options.uuid
          }

          switch(companyZone) {
            case '虹口':
              HandleHKTemplate(registrationOptions, function(err, result) {
                callback(err, result);
              });
              break;
            case '浦东':
              HandlePDTemplate(registrationOptions, function(err, result) {
                callback(err, result);
              })
            break;
            default:
              HandleHKTemplate(registrationOptions, function(err, result) {
                callback(err, result);
              });
              break;            
          }
        } 
      }      
    }
    var handleTemplate = Async.wrap(HandleTemplate);
    var response = new handleTemplate();
    return response;
  }
})






function HandleHKTemplate(registrationOptions, callback) {
  var registration = registrationOptions.registration;
  var uuid = registrationOptions.uuid;
  var files = [
    {id: 'K0211090101', name: '预先核名[单人]'},
    {id: 'K0211090102', name: '预先核名[多人]'},
    {id: 'K0211090201', name: '股东会决议[单人]'},
    {id: 'K0211090202', name: '股东会决议[多人]'},  
    {id: 'K0211090301', name: '公司章程[单人]'},
    {id: 'K0211090302', name: '公司章程[多人]'},
    {id: 'K0211090401', name: '房屋租赁合同'},
    {id: 'K0211090501', name: '指定代表或共同代理人授权书'},
    {id: 'K0211090601', name: '公司登记（备案）申请书'},
    {id: 'K0211090701', name: '广告企业告知承诺书'},
    {id: 'K0211090801', name: '小型微型企业认定申请表'},
    {id: 'K0211090901', name: '上海市组织机构代码申请表'},
    {id: 'K02110901001', name: '情况说明'}
  ]

  var company = registration.company;
  var companyZone = company.companyZone;
  var companyName = company.companyName;
  var companyType = company.companyType;
  var companyId = company.companyId;
  var companyTel = company.companyTel;
  var companyZipcode = company.companyZipcode;
  var companyId = company.companyId;
  var moneyAmount = company.moneyAmount;
  var businessScope = company.businessScope;
  var businessPeriod = company.businessPeriod;

  var addressFlag = registration.addressFlag;
  var companyAddress = registration.companyAddress;
  var productionAddress = registration.productionAddress;

  var legalPerson = registration.legalPerson;
  var legalPersonName = legalPerson.legalPersonName;
  var legalPersonTel = legalPerson.legalPersonTel;
  var legalPersonPhone = legalPerson.legalPersonPhone;
  var legalPersonEmail = legalPerson.legalPersonEmail;
  var legalPersonIDType = legalPerson.legalPersonIDType;
  var legalPersonID = legalPerson.legalPersonID;

  var chairman = registration.chairman;
  var chairmanName = chairman.chairmanName;
  var chairmanType = chairman.chairmanType;
  var chairmanIDType = chairman.chairmanIDType;
  var chairmanID = chairman.chairmanID;
  var chairmanPhone = chairman.chairmanPhone;

  var supervisor = registration.supervisor;
  var supervisorName = supervisor.supervisorName;
  var supervisorType = supervisor.supervisorType;
  var supervisorIDType = supervisor.supervisorIDType;
  var supervisorID = supervisor.supervisorID;

  var manager = registration.manager;
  var managerName = manager.managerName;
  var managerType = manager.managerType;
  var managerIDType = manager.managerIDType;
  var managerID = manager.managerID;


  var contractor = registration.contractor;
  var contractorName = contractor.contractorName;
  var contractorTel = contractor.contractorTel;
  var contractorPhone = contractor.contractorPhone;
  var contractorEmail = contractor.contractorEmail;
  var contractorIDType = contractor.contractorIDType;
  var contractorID = contractor.contractorID;

  var financialStaff = registration.financialStaff;
  var financialStaffName = financialStaff.financialStaffName;
  var financialStallTel = financialStaff.financialStallTel;
  var financialStaffPhone = financialStaff.financialStaffPhone;
  var financialStaffEmail = financialStaff.financialStaffEmail;
  var financialStaffIDType = financialStaff.financialStaffIDType;
  var financialStaffID = financialStaff.financialStaffID;

  var authorizationFlag = registration.authorizationFlag;
  var createTime = registration.createTime;
  var year = createTime.getFullYear();
  var month = createTime.getMonth() + 1;
  var day = '28';
  var investDate = (year + 10) + '年' + month + '月' + day + '日';
  var mettingDate = year + '年' + month + '月' + day + '日';


  
  var regulationFileName = '';
  var holderFileName = '';
  var registrationFileName = '';

  var holders = registration.holders;
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
    investDateOutput.push(investDate);
  })

  
  if(holderLength <= 1) {
    console.log("单人")
    regulationFileName = 'K0211090301';
    holderFileName = 'K0211090201';
    registrationFileName = 'K0211090601';

    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: companyName,
      companyAddress: companyAddress,
      productionAddress: productionAddress,
      businessScope: businessScope,
      moneyAmount: moneyAmount,
      holderName: holderName[0],
      investDate: investDateOutput[0],
      investType: investType[0],
      investMoney: investMoneyAmount[0]
    }

  } else {
    console.log('多人')
    regulationFileName = 'K0211090302';
    holderFileName = 'K0211090202';
    registrationFileName = 'K0211090602'; 
    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: companyName,
      companyAddress: companyAddress,
      productionAddress: productionAddress,
      businessScope: businessScope,
      moneyAmount: moneyAmount,
      holderName: holderName,
      investDate: investDateOutput,
      investType: investType,
      investMoney: investMoneyAmount
    }
  }  
  var requests = [];
  requests.push(regulations);

  var shareholder = {
    fileName : holderFileName,
    cnLabel : '股东会决议',
    mettingDate: mettingDate,
    companyName : companyName,
    chairmanName: chairmanName,
    managerName: managerName,
    supervisorName:supervisorName,
    supervisorID: supervisorID
  }
  requests.push(shareholder)


  var leasing = {
    fileName: 'K0211090401',
    cnLabel: '房屋租赁合同',
    companyName: companyName,
    companyAddress: companyAddress     
  }
  requests.push(leasing);


  // 公司备案申请书

  var registrationBook = {
    fileName: registrationFileName,
    cnLabel : '公司登记（备案）申请书',    
    companyName: companyName,
    companyZone: companyZone,
    companyType: companyType,
    companyId: companyId,
    companyTel: companyTel,
    companyZipcode: companyZipcode,
    businessScope: businessScope,
    businessPeriod: businessPeriod,

    companyAddress: companyAddress,
    productionAddress: productionAddress,

    legalPersonName: legalPersonName,
    legalPersonTel: legalPersonTel,
    legalPersonPhone: legalPersonPhone,
    legalPersonEmail: legalPersonEmail,
    legalPersonIDType: legalPersonIDType,
    legalPersonID: legalPersonID,

    chairmanName: chairmanName,
    chairmanType: chairmanType,
    chairmanIDType: chairmanIDType,
    chairmanID: chairmanID,
    chairmanPhone: chairmanPhone,

    supervisorName: supervisorName,
    supervisorType: supervisorType,
    supervisorIDType: supervisorIDType,
    supervisorID: supervisorID,

    managerName: managerName,
    managerType: managerType,
    managerIDType: managerIDType,
    managerID: managerID,

    holderName: holderName,
    holderIDType: holderIDType,
    holderID: holderID,
    investType: investType,
    investDate: investDateOutput,
    money: investMoneyAmount,
    share: investShare,
    moneyAmount: moneyAmount,

    contractorName: contractorName,
    contractorTel: contractorTel,
    contractorPhone: contractorPhone,
    contractorEmail: contractorEmail,
    contractorIDType: contractorIDType,
    contractorID: contractorID,

    financialStaffName: financialStaffName,
    financialStallTel: financialStallTel,
    financialStaffPhone: financialStaffPhone,
    financialStaffEmail: financialStaffEmail,
    financialStaffIDType: financialStaffIDType,
    financialStaffID: financialStaffID
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


    requests.forEach(function(request) {
      var fileName = request.fileName;
      var cnLabel = request.cnLabel;
      var randomStr = uuid;
      delete request.fileName;
      delete request.cnLabel;
      fileData = JSON.stringify(request);

      var params = {
        fileName: fileName,
        cnLabel: cnLabel,
        randomStr: randomStr,
        fileData: fileData
      }


      log(params)

      HTTP.call('POST',requestUrl, {
        params: params
      }, function(err, result) {
        if(!err && querystring.parse(result.content).result === 'success') {
          var handleFlag = 'true';          
          var resultString = querystring.parse(result.content).resultString;

          log('resultString: ', resultString);

          HandleResults.insert({
            uuid: uuid,
            handleFlag: handleFlag,
            wordURI: requestUrl+ 'output/' + resultString + '.doc',
            pdfURI: requestUrl+ 'output/' + resultString + '.pdf',
            fileName: fileName,
            cnLabel: cnLabel,
            createDate: new Date()
          }, function(err) {
            if(err) {
              log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db error', err);
              callback(err, null);
            } else {
              log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db succeed!');
              callback(null, null);
            }
          })
        } else {
          log(cnLabel + ' [ ' + fileName + ' ] ' + 'handle error,try again.', err);
          callback(err, null);
        } 
      })
    })

}


function HandlePDTemplate(registrationOptions, callback) {
  var registration = registrationOptions.registration;
  var uuid = registrationOptions.uuid;
  var files = [
    {id: 'K0211020101', name: '预先核名[单人]'},
    {id: 'K0211020102', name: '预先核名[多人]'},
    {id: 'K0211020201', name: '股东会决议[单人]'},
    {id: 'K0211020202', name: '股东会决议[多人]'},  
    {id: 'K0211020301', name: '公司章程[单人]'},
    {id: 'K0211020302', name: '公司章程[多人]'},
    {id: 'K0211020401', name: '房屋租赁合同'},
    {id: 'K0211020501', name: '指定代表或共同代理人授权书'},
    {id: 'K0211020601', name: '公司登记（备案）申请书'},
    {id: 'K0211020701', name: '广告企业告知承诺书'},
    {id: 'K0211020801', name: '小型微型企业认定申请表'},
    {id: 'K0211020901', name: '上海市组织机构代码申请表'},
    {id: 'K02110201001', name: '情况说明'}
  ]

  var company = registration.company;
  var companyZone = company.companyZone;
  var companyName = company.companyName;
  var companyType = company.companyType;
  var companyId = company.companyId;
  var companyTel = company.companyTel;
  var companyZipcode = company.companyZipcode;
  var companyId = company.companyId;
  var moneyAmount = company.moneyAmount;
  var businessScope = company.businessScope;
  var businessPeriod = company.businessPeriod;

  var addressFlag = registration.addressFlag;
  var companyAddress = registration.companyAddress;
  var productionAddress = registration.productionAddress;

  var legalPerson = registration.legalPerson;
  var legalPersonName = legalPerson.legalPersonName;
  var legalPersonTel = legalPerson.legalPersonTel;
  var legalPersonPhone = legalPerson.legalPersonPhone;
  var legalPersonEmail = legalPerson.legalPersonEmail;
  var legalPersonIDType = legalPerson.legalPersonIDType;
  var legalPersonID = legalPerson.legalPersonID;

  var chairman = registration.chairman;
  var chairmanName = chairman.chairmanName;
  var chairmanType = chairman.chairmanType;
  var chairmanIDType = chairman.chairmanIDType;
  var chairmanID = chairman.chairmanID;
  var chairmanPhone = chairman.chairmanPhone;

  var supervisor = registration.supervisor;
  var supervisorName = supervisor.supervisorName;
  var supervisorType = supervisor.supervisorType;
  var supervisorIDType = supervisor.supervisorIDType;
  var supervisorID = supervisor.supervisorID;

  var manager = registration.manager;
  var managerName = manager.managerName;
  var managerType = manager.managerType;
  var managerIDType = manager.managerIDType;
  var managerID = manager.managerID;


  var contractor = registration.contractor;
  var contractorName = contractor.contractorName;
  var contractorTel = contractor.contractorTel;
  var contractorPhone = contractor.contractorPhone;
  var contractorEmail = contractor.contractorEmail;
  var contractorIDType = contractor.contractorIDType;
  var contractorID = contractor.contractorID;

  var financialStaff = registration.financialStaff;
  var financialStaffName = financialStaff.financialStaffName;
  var financialStallTel = financialStaff.financialStallTel;
  var financialStaffPhone = financialStaff.financialStaffPhone;
  var financialStaffEmail = financialStaff.financialStaffEmail;
  var financialStaffIDType = financialStaff.financialStaffIDType;
  var financialStaffID = financialStaff.financialStaffID;

  var authorizationFlag = registration.authorizationFlag;
  var createTime = registration.createTime;
  var year = createTime.getFullYear();
  var month = createTime.getMonth() + 1;
  var day = '28';
  var investDate = (year + 10) + '年' + month + '月' + day + '日';
  var mettingDate = year + '年' + month + '月' + day + '日';


  
  var regulationFileName = '';
  var holderFileName = '';
  var registrationFileName = '';

  var holders = registration.holders;
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
    investDateOutput.push(investDate);
  })

  
  if(holderLength <= 1) {
    console.log("单人")
    regulationFileName = 'K0211020301';
    holderFileName = 'K0211020201';
    registrationFileName = 'K0211020601';

    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: companyName,
      companyAddress: companyAddress,
      productionAddress: productionAddress,
      businessScope: businessScope,
      moneyAmount: moneyAmount,
      holderName: holderName[0],
      investDate: investDateOutput[0],
      investType: investType[0],
      investMoney: investMoneyAmount[0]
    }

  } else {
    console.log('多人')
    regulationFileName = 'K0211020302';
    holderFileName = 'K0211020202';
    registrationFileName = 'K0211020602'; 
    var regulations = {
      fileName: regulationFileName,
      cnLabel : '公司章程',
      companyName: companyName,
      companyAddress: companyAddress,
      productionAddress: productionAddress,
      businessScope: businessScope,
      moneyAmount: moneyAmount,
      holderName: holderName,
      holderNames: holderName.join('、'),
      share: investShare,
      investDate: investDateOutput,
      investType: investType,
      investMoney: investMoneyAmount
    }
  }  
  var requests = [];
  requests.push(regulations);

  var shareholder = {
    fileName : holderFileName,
    cnLabel : '股东会决议',
    mettingDate: mettingDate,
    companyName : companyName,
    chairmanName: chairmanName,
    supervisorName:supervisorName,
    managerName: managerName,
    holderNumber: holderLength,
    supervisorID: supervisorID
  }
  requests.push(shareholder)


  var leasing = {
    fileName: 'K0211020401',
    cnLabel: '房屋租赁合同',
    companyName: companyName,
    companyAddress: companyAddress     
  }
  requests.push(leasing);


  // 公司备案申请书

  var registrationBook = {
    fileName: registrationFileName,
    cnLabel : '公司登记（备案）申请书',    
    companyName: companyName,
    companyZone: companyZone,
    companyType: companyType,
    companyId: companyId,
    companyTel: companyTel,
    companyZipcode: companyZipcode,
    businessScope: businessScope,
    businessPeriod: businessPeriod,

    companyAddress: companyAddress,
    productionAddress: productionAddress,

    legalPersonName: legalPersonName,
    legalPersonTel: legalPersonTel,
    legalPersonPhone: legalPersonPhone,
    legalPersonEmail: legalPersonEmail,
    legalPersonIDType: legalPersonIDType,
    legalPersonID: legalPersonID,

    chairmanName: chairmanName,
    chairmanType: chairmanType,
    chairmanIDType: chairmanIDType,
    chairmanID: chairmanID,

    supervisorName: supervisorName,
    supervisorType: supervisorType,
    supervisorIDType: supervisorIDType,
    supervisorID: supervisorID,

    managerName: managerName,
    managerType: managerType,
    managerIDType: managerIDType,
    managerID: managerID,

    holderName: holderName,
    holderIDType: holderIDType,
    holderID: holderID,
    investType: investType,
    investDate: investDateOutput,
    money: investMoneyAmount,
    share: investShare,
    moneyAmount: moneyAmount,

    contractorName: contractorName,
    contractorTel: contractorTel,
    contractorPhone: contractorPhone,
    contractorEmail: contractorEmail,
    contractorIDType: contractorIDType,
    contractorID: contractorID,

    financialStaffName: financialStaffName,
    financialStallTel: financialStallTel,
    financialStaffPhone: financialStaffPhone,
    financialStaffEmail: financialStaffEmail,
    financialStaffIDType: financialStaffIDType,
    financialStaffID: financialStaffID
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
      companyName: companyName,
      companyAddress: companyAddress,
      legalPersonName: legalPersonName,
      legalPersonPhone: legalPersonPhone,
      companyType: companyType,
      zipcode: companyZipcode    
    }
    requests.push(cogeneration);

    requests.forEach(function(request) {
      var fileName = request.fileName;
      var cnLabel = request.cnLabel;
      var randomStr = uuid;
      delete request.fileName;
      delete request.cnLabel;
      fileData = JSON.stringify(request);

      var params = {
        fileName: fileName,
        cnLabel: cnLabel,
        randomStr: randomStr,
        fileData: fileData
      }


      log(params)

      HTTP.call('POST',requestUrl, {
        params: params
      }, function(err, result) {
        if(!err && querystring.parse(result.content).result === 'success') {
          var handleFlag = 'true';          
          var resultString = querystring.parse(result.content).resultString;

          log('resultString: ', resultString);

          HandleResults.insert({
            uuid: uuid,
            handleFlag: handleFlag,
            wordURI: requestUrl+ 'output/' + resultString + '.doc',
            pdfURI: requestUrl+ 'output/' + resultString + '.pdf',
            fileName: fileName,
            cnLabel: cnLabel,
            createDate: new Date()
          }, function(err) {
            if(err) {
              log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db error', err);
              callback(err, null);
            } else {
              log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db succeed!');
              callback(null, null);
            }
          })
        } else {
          log(cnLabel + ' [ ' + fileName + ' ] ' + 'handle error,try again.', err);
          callback(null, null);
        } 
      })
    })

}

