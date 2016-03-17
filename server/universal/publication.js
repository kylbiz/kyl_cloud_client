Meteor.publish('GetHandleResults', function(uuid) {
  return HandleResults.find({uuid: uuid});
})

Meteor.publish('checkInfo', function(userId) {
  return NameCheck.find({userId: userId});
})

Meteor.publish('getCompany', function(userId) {
  return Company.find({"productType": "registration", userId: userId});
})

Meteor.publish('getDocNum', function(userId) {
  return DocNum.find({userId: userId});
})

