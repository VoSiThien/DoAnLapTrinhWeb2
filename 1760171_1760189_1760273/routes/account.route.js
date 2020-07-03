const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model')
router.get('/login', res, async function (req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});

router.post('/login', async function (req, res) {
    const rows = await userModel.selectByUserName(req.body.username, req.body.password);
    if (rows.length == 0) {
        return res.render('vwAccount/login', {
            layout: false,
            error: 'Invalid username or password.'
        })

    }
    else {
        req.session.isAuthenticated = true;
        req.session.user = rows;
        req.session.userID = rows[0].UserID;
        req.session.RoleID = rows[0].RoleID;
        res.redirect('/account/profile')
    }
})

router.get('/register', res, async function (req, res) {
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

router.get('/logout', async function (req, res) {
    req.session.isAuthenticated = null;
    req.session.user = null;
    req.session.userID = null;
    req.session.RoleID = null;
    res.redirect('/');
});

restrict = require('../middleware/isAuthenticated.mdw')
router.get('/profile', restrict, async function (req, res) {
    var list = await registerModel.allbyUser(req.session.userID);
    res.render('vwAccount/profile', { List: list });
});



router.post('/profile', restrict, upload.single('urlImage'), async function (req, res) {
    var list = await registerModel.allbyUser(req.session.userID);
    res.render('vwAccount/profile', { List: list });
});
module.exports = router;