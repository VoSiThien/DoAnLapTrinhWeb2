function snackbarToggle(msg) {
  var x = document.getElementById("snackbar");

  x.innerHTML = msg;
  x.className = "_show";

  setTimeout(function () {
    x.className = x.className.replace("_show", "");
  }, 3000);
}

function clearInputValue(inputs) {
  inputs.forEach(el => {
    $(el).val('');
  })
}

function formatDate(date) {
  var myDate = new Date(date);
  var day = myDate.getDate() < 10 ? `0${myDate.getDate()}` : `${myDate.getDate()}`;
  var month = myDate.getMonth() + 1 < 10 ? `0${myDate.getMonth() + 1}` : `${myDate.getMonth() + 1}`;

  return day + '/' + month;
}

$(document).ready(function () {
  $(document).on('click', '._article', function (e) {
    e.preventDefault();

    var href = $(this).attr('href');
    var id = +$(this).attr('href').match(/\d+$/);

    $.getJSON(`/reader-allow-access?id=${id}`, (data) => {
      if (+data === -1) snackbarToggle("📢 Bài viết này dành cho độc giả Premium, vui lòng đăng nhập để có thể xem bài viết!");
      else if (+data === 1) window.location.replace(href);
      else snackbarToggle("📢 Vui lòng đăng kí Premium để xem bài viết!");
    });
  });

  $("#search").on("input", function () {
    $("#match-list").removeClass("show");

    $.getJSON(`/search?key=${$("#search").val()}`, (data) => {
      if (data.length !== 0) {
        $("#match-list").addClass("show");
        $("#match-list").empty();

        data.forEach((val, index) => {
          const row = `<li class="my-dropdown-item"><a href="/article/${val["id"]}">${val["TieuDe"]}</a></li>`;

          if (index !== 0)
            $("#match-list").append('<hr style="padding: 0; margin: 0;">');
          $("#match-list").append(row);
        });
      }
    });
  });

  $("#button-go-top").click(function () {
    $(window).scrollTop(0);
  });

  $("#search").on("keypress", function (e) {
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

      $.getJSON(`/check-user-exist?email=${$("#email").val()}&username=${$("#username").val()}`, (data) => {
        if (data === 1) {
          $("#alert").html("Email này đã được đăng kí, vui lòng kiểm tra lại!");
          $("#alert").css("display", "block");
        }
        if(data === 2){
          $("#alert").html("Tên người dùng này đã được đăng kí, vui lòng kiểm tra lại!");
          $("#alert").css("display", "block");
        }
        if(data === 0){
          $("#alert").css("display", "none");
          $("#form-register").submit();
        }
      });
    }
  });

  $("#btn-login").on("click", (e) => {
    e.preventDefault();

    $.post(
      "/login-validate",
      { username: $("#_username").val(), password: $("#_password").val() },
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

  $('#anchor-signin').on('click', () => {
    clearInputValue(['#_email', '#_password']);
    $('#alert-login').css('display', 'none');
  });

  $('#anchor-signup').on('click', () => {
    clearInputValue(['#email', '#password', '#name', '#repassword']);
    $('#alert').css('display', 'none');
  });
});
