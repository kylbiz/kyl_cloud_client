var requestUrl = kylServiceRequestUrl();

/**
 * 生成企业登记信息文档
 * @param {object} options [description]
 */

Meteor.methods({
  "GenerateTemplate": function(options) {
    log('GenerateTemplate called');

    if(!options || !options.docId || !options.uuid) {
      var err = "err: docId should not be null"; 
      log("GenerateTemplate err: docId should not be null")
    } else {
      // basic company information 
      var docId = options.docId;
      var currentCompany = Company.findOne({docId: docId});

      if(!currentCompany) {
        log("GenerateTemplate: not found doc: " + docId);
      } else {
        
        var registration = RegUtil.handleRegistration(currentCompany);
        var companyZone = registration.company.companyZone;
        var registrationOptions = {
          registration: registration,
          uuid: options.uuid
        }

        switch(companyZone) {
          case '虹口':
            RegUtil.HandleHKTemplate(registrationOptions);
            break;
          case '浦东':
            RegUtil.HandlePDTemplate(registrationOptions);
          break;
          default:
            RegUtil.HandleHKTemplate(registrationOptions);
            break;            
        }
      } 
    }      
  }
})

