Meteor.publish('GetHandleResults', function() {
  return HandleResults.find({});
})

Meteor.publish('checkInfo', function() {
  return NameCheck.find({});
})

Meteor.publish('getCompany', function() {
  return Company.find({"productType": "registration"});
})

Meteor.publish('getDocNum', function() {
  return DocNum.find({});
})

