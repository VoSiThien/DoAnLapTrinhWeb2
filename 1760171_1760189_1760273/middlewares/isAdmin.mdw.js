module.exports = function (req, res, next){
    if(req.session.RoleID != 1){
        return res.render('NotAdmin');
    }
    next();
}