function displayPaginationButtons(sel, page, data) {
  $(sel).each((index, el) => {
    $(el).text(data["_pagi"][index]["value"]);
    $(el).removeClass("pagi-active");

    if (+data["_pagi"][index]["value"] === page) {
      $(el).addClass("pagi-active");
    }

    if (+data["_pagi"][index]["value"] !== -1) {
      $(el).css("display", "block");
    } else {
      $(el).css("display", "none");
    }
  });
}

function getHtmlComments(data) {
  return data["_comments"]
    .map((val) => {
      var fDate = formatDate(val["NgayBinhLuan"]);

      var row = `
              <div class="flex-wr-sb-s p-t-15 p-b-15 how-bor2">
                <div class="cl8 w-100">
                  <a href="javascript:;" class="f1-s-4 cl8 hov-cl10 trans-03">
                    <i class="fa fa-user-circle-o fa-lg" aria-hidden="true"></i> ${val["HoTen"]}
                  </a>
                  <span class="f1-s-3 m-rl-3">-</span>
                  <span class="f1-s-3">
                    <i class="fa fa-calendar fa-lg" aria-hidden="true"></i> ${fDate}
                  </span>
                </div>
                <p class="f1-s-1 cl6 p-t-13">${val["NoiDung"]}</p>
              </div>`;

      return row;
    })
    .join("");
}

$(document).ready(function () {
  $("#btn-send-msg").on("click", function () {
    var [msgContent, id] = [$("#msg").val(), $("#article-id").val()];
    $("#msg").val("");

    if (msgContent !== ''){
      $.post(
        "/article-post-comment",
        { NoiDung: msgContent, BaiVietID: id },
        function (data) {
          $("#head-quantity").text(data["_quantity"]);
          $("#tail-quantity").text(`(${data["_quantity"]})`);
          displayPaginationButtons("#comments-area button", 1, data);
          var html = getHtmlComments(data);
          $("#users-comments").empty();
          $("#users-comments").append(html);
        }
      );
    }
  });

  $("#comments-area button").on("click", function () {
    const page = +$(this).html();

    if (!$(this).hasClass("pagi-active")) {
      $.getJSON(`/article?id=${$("#articleID").val()}&page=${page}`, (data) => {
        displayPaginationButtons("#comments-area button", page, data);

        var html = getHtmlComments(data);

        $("#users-comments").empty();
        $("#users-comments").append(html);
      });
    }
  });
});
