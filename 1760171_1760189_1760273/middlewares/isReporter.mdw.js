module.exports = function (req, res, next){
    if(!req.session.RoleID){
        return res.render('NotReporter');
    }
    next();
}