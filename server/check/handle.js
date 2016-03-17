/**
 * 核名文档生成
 * @param {json} options 核名参数，包含
 * docId: 所需核名的docId
 * uuid: 当前处理流水
 */
Meteor.methods({
  HandleNameCheck: function(options) {
    log("HandleNameCheck: Hi I am called");
    if(!options 
      || !options.docId 
      || !options.uuid) {
      log("HandleNameCheck: options illegal.", options);
    } else {
      var docId = options.docId;
      var currentCheck = NameCheck.findOne({docId: docId});

      if(currentCheck) {
        var nameCheck = Util.handleCheck(currentCheck);
        var companyZone = nameCheck.company.companyZone;
        var checkOptions = {
          check: nameCheck,
          uuid: options.uuid
        };

        switch(companyZone) {
          case '虹口':
            CheckUtil.HandleHKCheck(checkOptions);
            break;
          case '浦东':
            CheckUtil.HandlePDCheck(checkOptions);
          break;
          default:
            // 默认处理虹口核名
            CheckUtil.HandleHKCheck(checkOptions);
            break;  
        }
      } 
    }
  }
})

// ------------------------------------------------
/**
 * 删除当前公司
 * @field userId 当前userId
 * @field docId 当前文档Id
 */

Meteor.methods({
  "deleteCompany": function(options) {
    if(!options 
      || !options.userId 
      || options.userId !== Meteor.userId()
      || !options.docId) {
      console.log("deleteCompany: delete company failed for options not completely", options);
    } else {
      var userId = options.userId;
      var docId = options.docId;
      Company.remove({userId: userId, docId: docId}, function(err) {
        if(err) {
          console.log("deleteCompany: delete company docId: " + docId + " error", err);
        } else  {
          console.log("deleteCompany: delete company docId: " + docId + " succeed");
        }
      })
    }
  }
});

// ------------------------------------------------
/**
 * 删除当前核名
 * @field userId 当前用户 id
 * @field docId 当前文档的id
 */
Meteor.methods({
  "deleteCheck": function(options) {
    if(!options 
      || !options.userId 
      || options.userId !== Meteor.userId()
      || !options.docId) {
      console.log("deleteCheck: delete check failed for options not completely", options);
    } else {
      var userId = options.userId;
      var docId = options.docId;
      NameCheck.remove({userId: userId, docId: docId}, function(err) {
        if(err) {
          console.log("deleteCheck: delete check docId: " + docId + " error", err);
        } else  {
          console.log("deleteCheck: delete check docId: " + docId + " succeed");
        }
      })
    }
  }
})
