var requestUrl = kylServiceRequestUrl();

/**
 * 生成企业登记信息文档
 * @param {object} options [description]
 */

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
          var registration = RegUtil.handleRegistration(currentCompany);
          var companyZone = registration.company.companyZone;
          var registrationOptions = {
            registration: registration,
            uuid: options.uuid
          }

          switch(companyZone) {
            case '虹口':
              RegUtil.HandleHKTemplate(registrationOptions, function(err, result) {
                callback(err, result);
              });
              break;
            case '浦东':
              HandlePDTemplate(registrationOptions, function(err, result) {
                callback(err, result);
              })
            break;
            default:
              RegUtil.HandleHKTemplate(registrationOptions, function(err, result) {
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

