Meteor.subscribe('getCompany')

function randomNumber(number) {
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  var str = "";
  for(var i = 0; i < number; i++) {
    pos = Math.round(Math.random() * (arr.length -1));
    str += arr[pos];
  }
  return str;
}


AutoForm.hooks({
  CompanyInsert: {
    before: {
      insert: function(doc) {
        LocalStore.set("companyInsertValue", doc);
        if(Meteor.userId()) {
          var date = new Date();
          var docId = moment(date).format("YYYYMMDDHHmmssSSS") + randomNumber(4);
          doc.docId = docId;
          doc.userId = Meteor.userId();
          return doc;
          // var holders = doc.holders;
          // var share = 0;
          // holders.forEach(function(holder) {
          //   share += holder.investShare;
          // });
          // if(share === 100) {
          //   return doc;
          // } else {
          //   alert("股东占股比总和不为100%")
          //   return false;            
          // }
        } else {
          return doc;
        }
      }
    },
    onSuccess: function(formType, result) {
      if(result) {
        LocalStore.set("companyInsertValue", {});
        alert("提交成功！")
        Router.go('/user/registration');
      }
    }
  }
})

Template.companyTemplate.helpers({
  "companyInsertValue": function() {
    return LocalStore.get("companyInsertValue") || {};
  }
})



