'use strict';
const express = require('express');
const router = express.Router();

//게시글 작성 페이지 렌더.
router.get('/write', function (req, res, next) {
    res.render('post_write');
});

module.exports = router;
