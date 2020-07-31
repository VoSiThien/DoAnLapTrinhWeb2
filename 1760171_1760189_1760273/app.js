const PORT = require('./config/default.json').PORT;
const express = require("express");
require("express-async-errors");
const bodyParser = require('body-parser');

require("./utils/passport-setup");

const app = express();

require("./middlewares/default-setup.mdw")(app);
require("./middlewares/session.mdw")(app);
require("./middlewares/passport.mdw")(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

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

// admin route
app.use("/admin", require("./routes/admin.route"));
// reporter route
app.use("/reporter", require("./routes/reporter.route"));
//editor route
app.use('/editor', require("./routes/editor.route"))



// fake url
app.use((req, res) => {
  res.render('404', {layout: false});
});

// error handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).render('500', {layout: false});
});

app.listen(PORT, function () {
  console.log(`Server is running on PORT: ${PORT}`);
});
