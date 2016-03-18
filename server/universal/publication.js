Meteor.publish('checkInfo', function(userId) {
  return NameCheck.find({userId: userId});
})

Meteor.publish('getCompany', function(userId) {
  return Company.find({"productType": "registration", userId: userId});
})

Meteor.publish("templateInfo", function(uuid) {
  console.log("templateInfo subscribed, uuid:  " + uuid)
  return [
   HandleResults.find({uuid: uuid}),
    DocNum.find({})
  ]
})