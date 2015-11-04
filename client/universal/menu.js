  Meteor.startup(function () {
    AccountsEntry.config({
      homeRoute: '/',                    // mandatory - path to redirect to after sign-out
      dashboardRoute: '/',    // mandatory - path to redirect to after successful sign-in
      profileRoute: 'profile'
    });
  });


Template.menu.onRendered(function(){
    $("ul.pricing_table li").click(function(){
      var href=$(this).find("a").attr("href");
      Router.go(href);
    });
});