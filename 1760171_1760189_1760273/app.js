const express = require("express");
require("express-async-errors");
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static("public"));

require('./middlewares/session.mdw')(app);
require("./middlewares/view.mdw")(app);
require("./middlewares/locals.mdw")(app);

// home page
app.use("/", require("./routes/home.route"));
// admin route
app.use("/admin", require("./routes/admin.route"));
// reporter route
app.use("/reporter", require("./routes/reporter.route"));
//account route
app.use("/account",require("./routes/account.route"));

app.get('/category/:id', (req, res) => {
  console.log(req.params.id);
});

const POST = 3000;
app.listen(POST, function () {
  console.log(`Server is running on PORT: ${POST}`);
});
