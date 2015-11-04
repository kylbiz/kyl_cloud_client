
Meteor.subscribe("GetHandleResults");
Template.template.helpers({
  "handleResults": function() {
      var uuid = Session.get("uuid") || "";
      var handleResults = HandleResults.find({'uuid': uuid});
      return handleResults;    
  }
})

