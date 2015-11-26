Meteor.subscribe('checkInfo');

Template.checkDetail.helpers({
  checkValue: function() {
    var docId = Session.get('docId') || "";
    var check =  NameCheck.findOne({docId: docId});
    return check;
  },
  holdernum: function() {
    var docId = Session.get('docId') || "";
    var check =  NameCheck.findOne({docId: docId});

    if(check && check.hasOwnProperty("holders") && check.holders.length > 1) {
     return 1;
    } else {
      return 0;
    }
  },
  "templatezone": function() {
    var docId = Session.get('docId') || "";
    var check =  NameCheck.findOne({docId: docId});
    var templatezone = "hk"; 
    if(check && check.hasOwnProperty("company")) {
      var zone = check.company.companyZone || "hk";
      switch(zone) {
        case '虹口': 
          templatezone = "hk";
          break;
        case '浦东': 
          templatezone = "pd";
          break;
        default: 
          templatezone = "hk";
          break;
      }
    } 
    return templatezone;
  }
});


Template.checkDetail.events({
  "click .template": function(event) {
    var docId = Session.get('docId')  || "";
    var type = "check";
    var zone = $(event.currentTarget).attr("data-zone") || "hk";
    var holdernum = $(event.currentTarget).attr("data-holdernum") || 0;
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
      Router.go("/template?uuid=" + uuid + '&type=check&zone=' + zone + '&holdernum=' + holdernum);
    }
  }
})