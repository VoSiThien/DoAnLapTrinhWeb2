const express = require("express");
require("express-async-errors");
// const exphbs = require('express-handlebars');

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static("public"));

require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);

// home page
app.use("/", require("./routes/home.route"));


const POST = 3000;
app.listen(POST, function () {
  console.log(`Server is running on PORT: ${POST}`);
});
