module.exports = function (req, res, next){
    if(!req.session.authUser ||req.session.authUser.VaiTroID != 1){
        return res.render('notAdmin');
    }
    next();
}