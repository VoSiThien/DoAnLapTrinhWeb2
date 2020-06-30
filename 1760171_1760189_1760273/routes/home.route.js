const express = require('express');
const LRU = require('lru-cache');
const catModel = require('../models/categories.model');
const router = express.Router();

router.get('/', async function (req, res) {
    const newLocal = 'vwadmin/admin';
    res.render(newLocal);
});

module.exports = router;