Meteor.methods({
  "deleteCompany": function(options) {
    if(!options || !options.userId || !options.docId) {
      console.log("delete company failed for options not completely", options);
    } else {
      var userId = options.userId;
      var docId = options.docId;
      Company.remove({userId: userId, docId: docId}, function(err) {
        if(err) {
          console.log("delete company docId: " + docId + " error", err);
        } else  {
          console.log("delete company docId: " + docId + " succeed");
        }
      })
    }
  }
});

Meteor.methods({
  "deleteCheck": function(options) {
    if(!options || !options.userId || !options.docId) {
      console.log("delete check failed for options not completely", options);
    } else {
      var userId = options.userId;
      var docId = options.docId;
      NameCheck.remove({userId: userId, docId: docId}, function(err) {
        if(err) {
          console.log("delete check docId: " + docId + " error", err);
        } else  {
          console.log("delete check docId: " + docId + " succeed");
        }
      })
    }
  }
})
