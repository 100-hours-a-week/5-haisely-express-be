const express = require('express');
const fs = require('fs');
const router = express.Router();

// JSON 파일 경로
const dataFilePath = 'public/data/boards.json';

// JSON 파일 로드
let boardData = JSON.parse(fs.readFileSync(dataFilePath));

// 게시글 목록 조회
router.get('/', (req, res) => {
    const { offset, limit } = req.query;
    jsonData = {
        "status" : 200, "message" : null, "data" : boardData
    }
    res.json(jsonData);
});

// 게시글 상세 조회
router.get('/:id', (req, res) => {
    const boardId = req.params.id;
    const board = boardData["boards"].find(board => board.post_id === parseInt(boardId));
    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board}
    }
    res.json(jsonData);
});



module.exports = router;