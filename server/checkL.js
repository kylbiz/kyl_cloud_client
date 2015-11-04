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



Meteor.methods ({
  HandleNameCheckL: function(options) {
    var zone = company.zone;
    var companyName = company.companyName;
    var alternativeName = [];
    var registeredCapital = 0;
    var tempAlternativeName = company.alternativeName;
    tempAlternativeName.forEach(function(alternative) {
      alternativeName.push(alternative.name);
    })
    
    var companyAddress = company.companyAddress;
    var businessScope = company.businessScope;
    var investors = company.investors;
    var singleInvestor = company.singleInvestor;
    var multiInvestors = company.multiInvestors;
    var investorsName = [];
    var investorsId = [];
    if(investors === '一人' && singleInvestor) {
      investorsName.push(singleInvestor.name);       
      investorsId.push(singleInvestor.id);
      registeredCapital = singleInvestor.money;
    }

    if(investors === '多人' && multiInvestors) {
      multiInvestors.forEach(function(investor) {
        investorsName.push(investor.name);
        investorsId.push(investor.id);
        registeredCapital += investor.money;
      })               
    }

    var agent = company.agent;
    var agentName = '';
    var agentId = '';
    var agentPhone = '';
    var authorizationTermStart = '';
    var authorizationTermEnd = '';
    if(agent) {
      agentName = agent.name;
      agentId = agent.id;
      agentPhone = agent.phone;
    var authorizationTerm = company.authorizationTerm;
    var tempStart = authorizationTerm.startDate;
    var tempEnd = authorizationTerm.endDate;
    authorizationTermStart = moment(tempStart).year() + '年' 
      + (moment(tempStart).month()+1) + '月' 
      + moment(tempStart).date() + '日';

    authorizationTermEnd = moment(tempEnd).year() + '年' 
      + (moment(tempEnd).month() + 1) + '月' 
      + moment(tempEnd).date() + '日';     
    }
    var requests = [];
    switch(zone) {
      case '109': 
        var companyAddress = company.companyAddress || '上海市虹口区长阳路 235 号';
        var check = {
          fileName: 'K021' + zone + '0101',
          cnLabel: '企业名称预先核准申请书',
          companyName: companyName,
          alternativeName: alternativeName,
          companyAddress: companyAddress,
          registeredCapital:registeredCapital,
          businessScope: businessScope,
          investorsName: investorsName,
          investorsId: investorsId,
          agentName: agentName || ' ',
          agentId: agentId || ' ',
          agentPhone: agentPhone || ' ',
          authorizationTermStart: authorizationTermStart || ' ',
          authorizationTermEnd: authorizationTermEnd || ' '
        };
        requests.push(check);
        break;
      case '102':
        var companyAddress = company.companyAddress || '上海市浦东新区绿科路 90 号';      
        var check = {
          fileName: 'K021' + zone + '0101',
          cnLabel: '企业名称预先核准申请书',
          companyName: companyName,
          alternativeName: alternativeName,
          companyAddress: companyAddress,
          registeredCapital:registeredCapital,
          businessScope: businessScope,
          investorsName: investorsName,
          investorsId: investorsId,
          agentName: agentName || ' ',
          agentId: agentId || ' ',
          agentPhone: agentPhone || ' ',
          authorizationTermStart: authorizationTermStart || ' ',
          authorizationTermEnd: authorizationTermEnd || ' '
        };
        requests.push(check);

        if(agent) {
          var certification = {
            fileName: 'K021' + zone + '0102',
            cnLabel: '委托人代理证明',
            investorsName: investorsName.join('、')
          };
          requests.push(certification);

          var authorizationPaper = {
            fileName: 'K021' + zone + '0103',
            cnLabel: '委托书',
            investorsName: investorsName.join('、')
          }
          requests.push(authorizationPaper);
        }

        break;
      default: 
        var check = {
          fileName: 'K021' + zone + '0101',
          cnLabel: '企业名称预先核准申请书',
          companyName: companyName,
          alternativeName: alternativeName,
          companyAddress: companyAddress,
          registeredCapital:registeredCapital,
          businessScope: businessScope,
          investorsName: investorsName,
          investorsId: investorsId,
          agentName: agentName || ' ',
          agentId: agentId || ' ',
          agentPhone: agentPhone || ' ',
          authorizationTermStart: authorizationTermStart || ' ',
          authorizationTermEnd: authorizationTermEnd || ' '
        };
        requests.push(check);
        break;      
    }


    requests.forEach(function(request) {
      var fileName = request.fileName;
      var cnLabel = request.cnLabel;
      var randomStr = uuid;
      delete request.fileName;
      delete request.cnLabel;
      fileData = JSON.stringify(request);

      var params = {
        fileName: fileName,
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
})