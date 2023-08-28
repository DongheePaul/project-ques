'use strict';
const express = require('express');
const router = express.Router();
const database = require('../model/database');

// 게시글 목록
router.get('/', async function (req, res, next) {
    try {
        const query = 'SELECT * FROM post';
        const posts = await database.execute(query);
        res.render('post_list', { posts: posts }); 
    } catch (error) {
        console.error("loading posts error : ", error);
        next(error);    
    }
});

//게시글 제목 검색
router.get('/search_title', async function (req, res, next) {
    const searchKeyword = req.query.keyword; 
    try {
        const query = 'SELECT * FROM post WHERE title LIKE ?';
        const params = [`%${searchKeyword}%`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error("Error searching posts:", error);
        next(error);
    }
})

//게시글 내용 검색
router.get('/search_content', async function (req, res, next) {
    const searchKeyword = req.query.keyword; 
    try {
        const query = 'SELECT * FROM post WHERE content LIKE ?';
        const params = [`%${searchKeyword}%`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error("Error searching posts:", error);
        next(error);
    }
})

//게시글 기간 검색
router.get('/search_time', async function (req, res, next) {
    const { start_date, end_date, start_time, end_time } = req.query;
    try {
        const query = 'SELECT * FROM post WHERE created_at between ? and ?';
        const params = [`${start_date} ${start_time}`, `${end_date} ${end_time}`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error("Error searching posts using time period:", error);
        next(error);
    }
})

//게시글 작성 페이지 렌더.
router.get('/write', function (req, res, next) {
    res.render('post_write');
});

//게시글 작성 요청
router.post('/write', async function (req, res, next) {
    const title = req.body.title;
    const content = req.body.content;
    const sql = `INSERT INTO post (title, content) VALUES (?, ?)`;
    const params = [title, content];
    const result = await database.execute(sql, params);
    console.log(result);
    res.redirect('/');
});

//게시글 단일 조회 API
router.get('/:post_id', async function (req, res, next) {
    const { post_id } = req.params;
    try {
        const sql = 'SELECT * FROM post WHERE id = ?';
        const params = [post_id];
        const result = await database.execute(sql, params);
        res.json(result);
    } catch (error) {
        console.error("Error while single post searching:", error);
        next(error);
    }
})

router.delete('/:post_id', async function (req, res, next) {
    try {
        const { post_id } = req.params;
        const sql = `DELETE FROM post WHERE id = ?`;
        const params = [post_id];
        await database.execute(sql, params);
        res.json({message : "Post deletion successful"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while deleting the post' });
    }
})

module.exports = router;
