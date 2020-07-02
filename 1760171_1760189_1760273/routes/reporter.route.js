const express = require('express');
const router = express.Router();

router.get('/post', (req, res) => {
    res.render('vwReporter/post');
});

module.exports = router;