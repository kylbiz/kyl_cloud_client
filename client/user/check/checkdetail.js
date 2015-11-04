Meteor.subscribe('checkInfo');

Template.checkDetail.helpers({
  checkValue: function() {
    var docId = Session.get('docId') || "";
    var check =  NameCheck.findOne({docId: docId});
    return check;
  }
});


Template.checkDetail.events({
  "click .template": function(event) {
    var docId = Session.get('docId')  || "";
    var uuid = Meteor.uuid();
    if(docId && uuid) {
      var options = {
        docId: docId,
        uuid: uuid
      }
      Meteor.call("HandleNameCheck", options, function(err, result) {
        if(err) {
          console.log("generate template error", err);
        } else {
          console.log("generate template succeed");
        }
      })
      Router.go("/template?uuid=" + uuid)
    }
  }
})