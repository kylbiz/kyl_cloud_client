Meteor.subscribe('getCompany');

Template.CompanyDetail.helpers({
  companyValue: function() {
    var docId = Session.get('docId') || "";
    var company = Company.findOne({
      docId: docId
    });
    return company;
  }
});

Template.companyUpdate.helpers({
  holdernum: function() {
    var docId = Session.get('docId') || "";
    var company = Company.findOne({
      docId: docId
    });

    if (company && company.hasOwnProperty("holders") && company.holders.length > 1) {
      return 1;
    } else {
      return 0;
    }
  },
  "templatezone": function() {
    var docId = Session.get('docId') || "";
    var company = NameCheck.findOne({
      docId: docId
    });
    var templatezone = "hk";
    if (company && company.hasOwnProperty("company")) {
      var zone = company.company.companyZone || "hk";
      switch (zone) {
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


Template.usercenter.helpers({
  "username": function() {
    var user = Meteor.user();
    if (user && user.hasOwnProperty("username")) {
      return Meteor.user().username
    } else if (user && user.hasOwnProperty("emails")) {
      return user.emails[0].address;
    } else {
      return Meteor.userId();
    }
  }
});

Template.usercheck.helpers({
  "username": function() {
    var user = Meteor.user();
    if (user && user.hasOwnProperty("username")) {
      return Meteor.user().username
    } else if (user && user.hasOwnProperty("emails")) {
      return user.emails[0].address;
    } else {
      return Meteor.userId();
    }
  }
});


Template.CompanyDetail.events({
  "click .template": function(event) {
    var docId = Session.get('docId') || "";
    var uuid = Meteor.uuid();
    var type = "registration";
    var zone = $(event.currentTarget).attr("data-zone") || "hk";
    var holdernum = $(event.currentTarget).attr("data-holdernum") || 0;
    if (docId && uuid) {
      var options = {
        docId: docId,
        uuid: uuid
      }
      Meteor.call("GenerateTemplate", options, function(err, result) {
        if (err) {
          console.log("generate template error", err);
        } else {
          console.log("generate template succeed");
        }
      })
      Router.go("/template?uuid=" + uuid + '&type=registration&zone=' + zone + '&holdernum=' + holdernum);
    }
  }
})