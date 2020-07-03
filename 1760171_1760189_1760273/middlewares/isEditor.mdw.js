module.exports = function (req, res, next){
    if(req.session.RoleID != 2){
        return res.render('NotEditor');
    }
    next();
}