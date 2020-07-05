const express = require('express');
const router = express.Router();
const accountModel = require('../models/account.model');
const moment = require('moment');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const categoriesModel = require('../models/categories.model');


//------------------------------------------------LOGIN------------------------------------------------------
restrict = require('../middlewares/isNotAuthenticated.mdw')

router.get('/login', restrict, async function (req, res) {
    res.render('vwAccount/login', {
        layout: false
    });
});
router.post('/login', async function (req, res) {
    const rows = await accountModel.loadUser(req.body.username);
    if (rows.length == 0) {
        return res.render('vwAccount/login', {
            layout: false,
            error: 'Invalid username or password.'
        })

    }
    else {
        const check = bcrypt.compareSync(req.body.password, rows[0].MatKhau);
        if(check == true){
            req.session.isAuthenticated = true;
            req.session.user = rows;
            res.redirect('/account/profile');
        }
        else{
            return res.render('vwAccount/login', {
                layout: false,
                error: 'Invalid username or password.'
            })
        }
        
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
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const NS = moment(req.body.DOB, 'YYYY/MM/DD').format('YYYY/MM/DD');
    const entityAccount = {
        TenTaiKhoan: req.body.username,
        MatKhau: hash,
        HoTen: req.body.fullname,
        ButDanh: null,
        email: req.body.email,
        NgaySinh: NS,
        VaiTroID: 4,
        ChuyenMucQuanLy: null
    }
    await accountModel.add(entityAccount);
    res.redirect('/account/login');
});

//-------------------------------------------Profile------------------------------------------------------------
restrict = require('../middlewares/isAuthenticated.mdw')
router.get('/profile', restrict, async function (req, res) {
    const rows = await categoriesModel.loadChuyenMucByID(res.locals.lcUser[0].ChuyenMucQuanLy);
    res.render('vwAccount/profile', {row: rows[0]});
});



router.post('/profile', restrict, async function (req, res) {
    //var list = await registerModel.allbyUser(req.session.userID);
    res.render('vwAccount/profile', { List: list });
});
module.exports = router;