const express = require("express");
require("express-async-errors");

require("./utils/passport-setup");

const app = express();

require("./middlewares/default-setup.mdw")(app);
require("./middlewares/session.mdw")(app);
require("./middlewares/passport.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);

// home page
app.use("/", require("./routes/home.route"));

// article page
app.use("/article", require("./routes/articles.route"));

// categories page
app.use("/category", require("./routes/categories.route"));

// tags page
app.use("/tag", require("./routes/tags.route"));

// accounts
app.use("/account", require("./routes/accounts.route"));

const POST = 3000;
app.listen(POST, function () {
  console.log(`Server is running on PORT: ${POST}`);
});
