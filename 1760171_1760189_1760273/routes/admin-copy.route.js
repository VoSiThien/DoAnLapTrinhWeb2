const express = require('express');
const adminmodel = require('../models/admin.model');
const moment = require('moment');

const router = express.Router();

router.get('/', async function (req, res) {
    const newLocal = 'vwadmin/admin';
    res.render(newLocal);
});

module.exports = router;