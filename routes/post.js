'use strict';
const express = require('express');
const router = express.Router();
const database = require('../model/database');

// 게시글 목록 - 게시글 전체 조회
router.get('/', async function (req, res, next) {
    try {
        const query = 'SELECT * FROM post';
        const posts = await database.execute(query);
        res.render('post_list', { posts: posts }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while fetching all posts.' });  
    }
});

//게시글 제목 검색
router.get('/search_title', async function (req, res, next) {
    try {
        const searchKeyword = req.query.keyword; 
        const query = 'SELECT * FROM post WHERE title LIKE ?';
        const params = [`%${searchKeyword}%`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while searching post with title keyword' });
    }
})

//게시글 내용 검색
router.get('/search_content', async function (req, res, next) {
    try {
        const searchKeyword = req.query.keyword; 
        const query = 'SELECT * FROM post WHERE content LIKE ?';
        const params = [`%${searchKeyword}%`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while searching post with content keyword' });
    }
})

//게시글 기간 검색
router.get('/search_time', async function (req, res, next) {
    try {
        const { start_date, end_date, start_time, end_time } = req.query;
        const query = 'SELECT * FROM post WHERE created_at between ? and ?';
        const params = [`${start_date} ${start_time}`, `${end_date} ${end_time}`];
        const searchResults = await database.execute(query, params);
        res.render('post_search_list', { posts: searchResults }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while searching post with time period' });
    }
})

//게시글 작성 페이지 렌더.
router.get('/write', function (req, res, next) {
    res.render('post_write');
});

//게시글 작성 요청
router.post('/write', async function (req, res, next) {
    try {
        const title = req.body.title;
        const content = req.body.content;
        const sql = `INSERT INTO post (title, content) VALUES (?, ?)`;
        const params = [title, content];
        await database.execute(sql, params);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while create single post' });
    }
});

//게시글 단일 조회 API
router.get('/:post_id', async function (req, res, next) {
    try {
        const { post_id } = req.params;
        const sql = 'SELECT * FROM post WHERE id = ?';
        const params = [post_id];
        const result = await database.execute(sql, params);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error occurred while fetching single post' });
    }
})

//게시물 삭제
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
