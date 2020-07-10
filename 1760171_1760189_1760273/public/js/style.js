$(document).ready(function () {
  $("#search").on("input", function () {
    $("#match-list").removeClass("show");

    $.getJSON(`/search?key=${$("#search").val()}`, (data) => {
      if (data.length !== 0) {
        $("#match-list").addClass("show");
        $("#match-list").empty();

        data.forEach((val, index) => {
          const row = `<li class="my-dropdown-item"><a href="/article/${val["id"]}">${val["TieuDe"]}</a></li>`;

          if (index !== 0) $("#match-list").append('<hr style="padding: 0; margin: 0;">');
          $("#match-list").append(row);
        });
      }
    });
  });

  $("#button-go-top").click(function () {
    $(window).scrollTop(0);
  });

  $('#search').on('keypress', function (e) {
    if (e.which === 13) {
      $("#search-box").submit();
    }
  });

  $(".nav-link").on("click", function () {
    var href = $(this).attr("href");
    window.location.replace(href);
  });

  $("#btn-register").on("click", function (e) {
    var passwordMatch = $("#password").val() === $("#repassword").val();

    if (passwordMatch === false) {
      e.preventDefault();

      $("#alert").html("Mật khẩu đánh lại không khớp, vui lòng kiểm tra lại!");
      $("#alert").css("display", "block");
    } else {
      e.preventDefault();

      $.getJSON(`/check-user-exist?email=${$("#email").val()}`, (data) => {
        if (data.length !== 0) {
          $("#alert").html("Email này đã được đăng kí, vui lòng kiểm tra lại!");
          $("#alert").css("display", "block");
        } else {
          $("#alert").css("display", "none");
          alert("go here");
          $("#form-register").submit();
        }
      });
    }
  });

  $("#btn-login").on("click", (e) => {
    e.preventDefault();

    $.post(
      "/login-validate",
      { email: $("#_email").val(), password: $("#_password").val() },
      (data) => {
        if (!data) {
          $("#alert-login").html(
            "Đăng nhập không thành công, vui lòng kiểm tra lại!"
          );
          $("#alert-login").css("display", "block");
        } else {
          $("#form-login").submit();
        }
      }
    );
  });
});
