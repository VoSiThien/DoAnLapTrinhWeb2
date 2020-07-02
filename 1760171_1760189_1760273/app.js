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
// admin route
app.use("/admin", require("./routes/admin.route"));
// reporter route
app.use("/reporter", require("./routes/reporter.route"));

app.get('/category/:id', (req, res) => {
  console.log(req.params.id);
});

const POST = 3000;
app.listen(POST, function () {
  console.log(`Server is running on PORT: ${POST}`);
});
