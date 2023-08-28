'use strict';
const express = require('express');
const router = express.Router();

//게시글 작성 페이지 렌더.
router.get('/write', function (req, res, next) {
    res.render('post_write');
});

router.post('/write', function (req, res, next) {
    const title = req.body.title;
    const content = req.body.content;
    console.log(title)
    res.redirect('/');
});

module.exports = router;
