Meteor.subscribe("GetHandleResults");
Meteor.subscribe("getDocNum");
Template.template.helpers({
  "handleResults": function() {
    var uuid = Session.get("uuid") || "";
    var handleResults = HandleResults.find({
      'uuid': uuid
    });
    return handleResults;
  }
});

Template.template.helpers({
  "waittinggenerate": function() {
    var uuid = Session.get("uuid") || "";
    var count = HandleResults.find({
      'uuid': uuid
    }).count();
    return count <= 0;
  },
  "isgenerating": function() {
    var uuid = Session.get("uuid") || "";
    var allDocNum = Session.get("allDocNum") || 1;
    var count = HandleResults.find({
      'uuid': uuid
    }).count();
    return (count > 0 && count < allDocNum);
  },
  "finishgenerate": function() {
    var uuid = Session.get("uuid") || "";
    var allDocNum = Session.get("allDocNum") || 1;
    var count = HandleResults.find({
      'uuid': uuid
    }).count();
    return (count >= allDocNum);
  },
  "allDocNum": function() {
    var type = Session.get("type") || "check";
    var zone = Session.get("zone") || "zone";
    var holdernum = Session.get("holdernum") || 0;

    var docNum = DocNum.findOne({
      type: type,
      zone: zone,
      holdernum: holdernum
    });
    if (docNum) {
      Session.set("allDocNum", docNum.num);
      return docNum.num;
    } else {
      Session.set("allDocNum", 8);
      return 8;
    }
  },
  "generatedNum": function() {
    var uuid = Session.get("uuid") || "";
    var count = HandleResults.find({
      'uuid': uuid
    }).count();
    return count || 0;
  },
  "progress": function() {
    var uuid = Session.get("uuid") || "";
    var count = HandleResults.find({
      'uuid': uuid
    }).count();
    var allDocNum = Session.get("allDocNum") || 1;

    return ((count * 100) / allDocNum)  + "%"




  }
})