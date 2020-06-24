const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.engine('hbs', exphbs({
    partialsDir: 'views/partials',
    defaultLayout: 'main.hbs',
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.get('/', function (req, res) {
    res.render('home');
});

app.use('/admin', require('./routes/admin.route'));

const POST = 3000;
app.listen(POST, function () {
    console.log(`http://localhost:${POST}`);
});