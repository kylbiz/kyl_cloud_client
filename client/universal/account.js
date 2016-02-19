Template.signin.events({
  "click .submit": function(event) {
    var userName = $("#userName").val() || "";
    var userPassword = $("#userPassword").val() || "";

    if (userName && typeof(userPassword) === 'string' && userPassword.length >= 6) {
      Meteor.loginWithPassword(userName, userPassword, function(err) {
        if (err) {
          $("[id=loginError]").html("登录失败,请再次登录!");
          $("[id=loginError]").show();
        } else {
          Router.go("/")
        }
      })
    } else {
      $("[id=loginError]").html("用户名或密码不正确!");
      $("[id=loginError]").show();
    }
  }
});

//------------------------------------------------------------

Template.signin.events({
  "focus input": function(event) {
    $("#loginError").hide();
  }
});

Template.signup.events({
  "focus input": function(event) {
    $("#signupError").hide();
    $("#signupSuccess").hide();
  }
});



//------------------------------------------------------------
Template.signup.events({
  "click .signup": function(event) {
    console.log('signup')
    var userName = $("#userName").val() || "";
    var password = $("#password").val() || "";
    var password_re = $("#password_re").val() || "";
    if (userName && password && password_re && password.length >= 6 && password === password_re) {
      var options = {
        username: userName,
        password: password,
        profile: {
          host: 'KYLSMALLCLOUDS'
        }
      };
      Accounts.createUser(options, function(err) {
        if (err) {
          $("[id=signupError]").html(" 注册失败，请再次注册!");
          $("[id=signupError]").show();
        } else {
          Meteor.loginWithPassword(userName, password, function(err) {
            if (err) {
              $("[id=signupSuccess]").html("注册成功，请登录!");
              $("[id=signupSuccess]").show();
            } else {
              Router.go('/');
            }
          });
        }
      })
    } else {
      if (!userName) {
        $("[id=signupError]").html("请输入用户名!");
        $("[id=signupError]").show();
      } else if (password.length < 6) {
        $("[id=signupError]").html("密码长度至少为6位!");
        $("[id=signupError]").show();
      } else if (password !== password_re) {
        $("[id=signupError]").html("两次密码不一致，请确认!");
        $("[id=signupError]").show();
      } else {
        $("[id=signupError]").html("输入信息有误，请确认!");
        $("[id=signupError]").show();
      }
    }
  }
})


//------------------------------------------------------------
Template.layout.events({
  "click .signout": function(event) {
    Meteor.logout(function(err) {
      if (err) {
        alert("退出登录失败！")
      } else {
        Router.go("/sign-in");
      }
    });
  }
})

//------------------------------------------------------------