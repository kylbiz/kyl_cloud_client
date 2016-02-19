NameCheck.allow({
  insert: function(userId, doc) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  }
});


Company.allow({
  insert: function(userId, doc) {
    if (userId) {
      return true;
    } else {
      return false;
    }
  },
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  }
})