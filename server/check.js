var querystring = Meteor.npmRequire('querystring')
var requestUrl = 'http://192.168.0.100/docgen/';

function log(info) {
  var len = arguments.length;
  console.log('--------------------------------')
  for(var i = 0; i < len; i++) {
    console.log(arguments[i]);
  }
}

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


function  handleCheck(check) {
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

  check.company = fillObject(company, companyArray);
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
    currentHolder = fillObject(holder, holderArray);
    holdersA.push(currentHolder);
  })
  check.holders = holdersA;

  return check;
}




Meteor.methods({
  HandleNameCheck: function(options) {
    log("HandleNameCheck called");
    if(!options || !options.docId || !options.uuid) {
      log("name check options not completely", options);
    } else {
      var docId = options.docId;

      var currentCheck = NameCheck.findOne({docId: docId});
      if(currentCheck) {
        var nameCheck = handleCheck(currentCheck);
        var companyZone = nameCheck.company.companyZone;
        console.log('+++++++++', nameCheck, companyZone)
        var checkOptions = {
          check: nameCheck,
          uuid: options.uuid
        };

        switch(companyZone) {
          case '虹口':
            HandleHKCheck(checkOptions);
            break;
          case '浦东':
            console.log('then HandlePDCheck')
            HandlePDCheck(checkOptions);
          break;
          default:
            HandleHKCheck(checkOptions);
            break;  
        }
      } 
    }
  }
})


function HandleHKCheck(checkOptions) {
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
  log(requests)

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = checkOptions.uuid;
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
          uuid: checkOptions.uuid,
          handleFlag: handleFlag,
          wordURI: requestUrl+ 'output/' + resultString + '.doc',
          pdfURI: requestUrl+ 'output/' + resultString + '.pdf',
          fileName: fileName,
          cnLabel: cnLabel,
          createDate: new Date()
        }, function(err) {
          if(err) {
            log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db error', err);
          } else {
            log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db succeed!');
          }
        })
      } else {
        log(cnLabel + ' [ ' + fileName + ' ] ' + 'handle error,try again.', err)
      } 
    })
  })
};

function HandlePDCheck(checkOptions) {
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

  requests.forEach(function(request) {
    var fileName = request.fileName;
    var cnLabel = request.cnLabel;
    var randomStr = checkOptions.uuid;
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
          uuid: checkOptions.uuid,
          handleFlag: handleFlag,
          wordURI: requestUrl+ 'output/' + resultString + '.doc',
          pdfURI: requestUrl+ 'output/' + resultString + '.pdf',
          fileName: fileName,
          cnLabel: cnLabel,
          createDate: new Date()
        }, function(err) {
          if(err) {
            log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db error', err);
          } else {
            log(cnLabel + ' [ ' + fileName + ' ] ' + 'save handle results to db succeed!');
          }
        })
      } else {
        log(cnLabel + ' [ ' + fileName + ' ] ' + 'handle error,try again.', err)
      } 
    })
  })
}


























