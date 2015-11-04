
Meteor.subscribe('getCompany');

Template.CompanyDetail.helpers({
  companyValue: function() {
    var docId = Session.get('docId') || "";
    var company =  Company.findOne({docId: docId});
    return company;
  }
});

Template.usercenter.helpers({
  "useremail": function() {
    if(Meteor.user() && Meteor.user().emails) {
      return Meteor.user().emails[0].address;
    }
  }
});

Template.usercheck.helpers({
  "useremail": function() {
    if(Meteor.user() && Meteor.user().emails) {
      return Meteor.user().emails[0].address;
    }
  }
});


Template.CompanyDetail.events({
  "click .template": function(event) {
    var docId = Session.get('docId')  || "";
    var uuid = Meteor.uuid();
    if(docId && uuid) {
      var options = {
        docId: docId,
        uuid: uuid
      }
      Meteor.call("GenerateTemplate", options, function(err, result) {
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


