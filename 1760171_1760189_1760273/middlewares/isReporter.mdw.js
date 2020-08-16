module.exports = function (req, res, next){
    if(!req.session.authUser || req.session.authUser.VaiTroID != 3){
        return res.render('notReporter');
    }
    next();
}