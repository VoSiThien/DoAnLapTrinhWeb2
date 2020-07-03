module.exports = function (req, res, next){
    if(req.session.RoleID != 3){
        return res.render('NotReporter');
    }
    next();
}