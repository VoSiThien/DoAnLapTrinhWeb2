const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model')


//------------------------------------------------LOGIN------------------------------------------------------
restrict = require('../middlewares/isNotAuthenticated.mdw')

router.get('/login', restrict, async function (req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});
router.post('/login', async function (req, res) {
    const rows = await accountModel.loadUser(req.body.username, req.body.password);
    if (rows.length == 0) {
        return res.render('vwAccount/login', {
            layout: false,
            error: 'Invalid username or password.'
        })

    }
    else {
        req.session.isAuthenticated = true;
        req.session.user = rows;
        res.redirect('/account/profile');
    }
})

router.get('/logout', async function (req, res) {
    req.session.isAuthenticated = null;
    req.session.user = null;
      res.redirect('/');
});

//----------------------------------------------Register-----------------------------------------------------
router.get('/register', async function (req, res) {
    res.render('vwAccount/register');
});

router.post('/register', async function (req, res) {
    const entityAccount = {
        TenTaiKhoan: req.body.username,
        MatKhau: req.body.password,
        HoTen: req.body.fullname,
        ButDanh: null,
        email: req.body.email,
        NgaySinh: req.body.DOB,
        VaiTroID: 4,
        ChuyenMucQuanLy: null
    }
    await accountModel.add(entityAccount);
    res.render('vwAccount/login');
});

//-------------------------------------------Profile------------------------------------------------------------
restrict = require('../middlewares/isAuthenticated.mdw')
router.get('/profile', restrict, async function (req, res) {
    res.render('vwAccount/profile');
});



router.post('/profile', restrict, async function (req, res) {
    //var list = await registerModel.allbyUser(req.session.userID);
    res.render('vwAccount/profile', { List: list });
});
module.exports = router;