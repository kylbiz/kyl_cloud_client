Template.menu.onRendered(function() {
  $("ul.pricing_table li").click(function() {
    var href = $(this).find("a").attr("href");
    Router.go(href);
  });
});