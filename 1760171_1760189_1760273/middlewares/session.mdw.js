const session = require('express-session');

module.exports = function(app){
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));
    
}