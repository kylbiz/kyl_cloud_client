
Meteor.subscribe('checkInfo');
 
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
  NameCheck: {
    before: {
      insert: function(doc) {
        if(Meteor.userId()) {
          var date = new Date();
          var docId = moment(date).format("YYYYMMDDHHmmssSSS") + randomNumber(4);
          doc.docId = docId;
          doc.userId = Meteor.userId();         
          return doc;
        } else {
          return false;
        }
      }
    },
    onSuccess: function(formType, result) {
      if(result) {
        Router.go('/user/check');
      }
    }
  }
})
