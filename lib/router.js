Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    };
    this.next();
  },
  name: 'menu'
});

Router.route('/sign-in', {
  name: 'signin'
});


Router.route('/sign-up', {
  name: 'signup'
});


Router.route('/sign-out', {
  name: 'signout'
});

Router.route('/user/registration', {
  name: 'usercenter',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    } else {
      this.next();
    }
  },
  subscriptions: function() {
    var userId = Meteor.userId();
    Session.set('userId', userId);
    return Meteor.subscribe("getCompany", userId);
  }
})

Router.route('/user/check', {
  name: 'usercheck',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    } else {
      var userId = Meteor.userId();
      Session.set('userId', userId);
      Meteor.subscribe("checkInfo", userId)
    }
    this.next();
  }
})

Router.route('/user/check/:docId', {
  name: 'CheckDetail',
  onBeforeAction: function() {
    if (!Meteor.user()) {
      Router.go('/sign-in');
    } else {
      var userId = Meteor.userId();
      Session.set('userId', userId);
      Meteor.subscribe("checkInfo", userId)
      var docId = this.params.docId;
      if (docId) {
        Session.set('docId', docId);
      }
    }
    this.next();
  }
})


Router.route('/user/registration/:docId', {
  name: 'CompanyDetail',
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    } else {
      var userId = Meteor.userId();
      Meteor.subscribe('getCompany', userId)
      Session.set('userId', userId);
      var docId = this.params.docId;
      if (docId) {
        Session.set('docId', docId);
      }
    }
    this.next();
  }
})


Router.route("/template", {
  name: "template",
  onBeforeAction: function() {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    } else {
      this.next();
    }
  },
  waitOn: function() {
    var uuid = this.params.query.uuid || "";
    var type = this.params.query.type || "check";
    var zone = this.params.query.zone || "hk";
    var holdernum = this.params.query.holdernum || "1";

    Session.set("uuid", uuid);
    Session.set("type", type);
    Session.set("zone", zone);
    Session.set("holdernum", holdernum);
    console.log(uuid)
    return this.subscribe('GetHandleResults', uuid);
  },
  data: function() {
    var uuid = this.params.query.uuid || "";
    var count = HandleResults.find({'uuid': uuid}).count();

    console.log(count)

    Session.set("count", count);
    return {
      count: count
    }
  }
})


Router.map(function() {
  self = this;
  this.route('/check', {
    onBeforeAction: function() {
      if (!Meteor.userId()) {
        Router.go('/sign-in');
      };
      this.next();
    },
    name: "checkTemplate"
  });
  this.route('/registration', {
      onBeforeAction: function() {
        if (!Meteor.userId()) {
          Router.go('/sign-in');
        };
        this.next();
      },
      name: 'companyTemplate'
    })
});