const express = require('express');
const LRU = require('lru-cache');
const catModel = require('../models/categories.model');
const router = express.Router();

router.get('', (req, res) => {
    const cats = [];

    res.locals.lcCats.forEach(cat => {
        if (cat['ChuyenMucCon'] === null) {
            cats.push([cat]);
        } else {
            for (let i = 0; i < cats.length; ++i) {
                if (cats[i][0]['id'] === cat['ChuyenMucCon']) {
                    cats[i].push(cat);
                    break;
                }
            }
        }
    });

    res.render('home', {
        cats
    })
});

module.exports = router;