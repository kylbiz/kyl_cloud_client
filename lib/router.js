Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/test', {
  name: 'test'
})


Router.route('/', {
  onBeforeAction: function() {
    if(!Meteor.userId()) {
      Router.go('/sign-in');
    };
    this.next();
  },
  name: 'menu'
})


Router.route('/usercenter', {
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





Router.route('/user/company/:docId', {
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
      Session.set("uuid", uuid);
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
  this.route('/company', {
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