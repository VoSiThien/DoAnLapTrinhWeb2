module.exports = function (req, res, next){
    if(!req.session.authUser || req.session.authUser.VaiTroID != 2){
        return res.render('notEditor');
    }
    next();
}