'use strict';
const express = require('express');
const router = express.Router();
const database = require('../model/database');

//게시글 목록
router.get('/', async function (req, res, next) {
    res.render('post_list'); 
});

//게시글 작성 페이지 렌더.
router.get('/write', function (req, res, next) {
    res.render('post_write');
});

router.post('/write', async function (req, res, next) {
    const title = req.body.title;
    const content = req.body.content;
    const sql = `INSERT INTO post (title, content) VALUES (?, ?)`;
    const params = [title, content];
    const result = await database.execute(sql, params);
    console.log(result);
    res.redirect('/');
});

module.exports = router;
