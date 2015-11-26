Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  onBeforeAction: function() {
    if(!Meteor.userId()) {
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
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    } else  {
      var userId = Meteor.userId();
      Session.set('userId', userId);
    }
    this.next();
  }
})

Router.route('/user/check', {
  name: 'usercheck', 
  onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    } else  {
      var userId = Meteor.userId();
      Session.set('userId', userId);
    }
    this.next();
  }  
})

Router.route('/user/check/:docId', {
  name: 'CheckDetail',
  onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    } else  {
      var userId = Meteor.userId();
      Session.set('userId', userId);
      var docId = this.params.docId;
      if(docId) {
        Session.set('docId', docId);
      }
    }
    this.next();
  }
})





Router.route('/user/registration/:docId', {
  name: 'CompanyDetail',
  onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    } else  {
      var userId = Meteor.userId();
      Session.set('userId', userId);
      var docId = this.params.docId;
      if(docId) {
        Session.set('docId', docId);
      }
    }
    this.next();
  }
})


Router.map(function(){
  self = this;
  //doc template handle path
  this.route('template', {
    name: 'template', 
    data: function() {
      Meteor.subscribe('GetHandleResults');
      var self = this;
      var uuid = self.params.query.uuid ||"";
      var type = self.params.query.type || "check";
      var zone = self.params.query.zone || "hk";
      var holdernum = self.params.query.holdernum || "1";
      Session.set("uuid", uuid);
      Session.set("type", type);
      Session.set("zone", zone);
      Session.set("holdernum", holdernum);
    }
  });
  //-----------------------------------


  this.route('/check', {
   onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    };
    this.next();
  },   
    name: "checkTemplate"
  });
  this.route('/registration', {
  onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    };
    this.next();
  },    
    name: 'companyTemplate'
  })
//-----------------------------------
});