const express = require('express');
const fs = require('fs');

const router = express.Router();

const boardDataPath = 'public/data/boards.json';
const commentDataPath = 'public/data/comments.json';
const keyDataPath = 'public/data/keys.json';

const loadData = (dataFilePath) => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

const saveData = (data, filePath) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data saved successfully');
    } catch (err) {
        console.error('Error saving file:', err);
    }
}



// 게시글 목록 조회
router.get('/', (req, res) => {
    const boardData = loadData(boardDataPath);
    const { offset, limit } = req.query;
    jsonData = {
        "status" : 200, "message" : null, "data" : boardData
    }
    res.json(jsonData);
});

// 게시글 상세 조회
router.get('/:id', (req, res) => {
    const boardData = loadData(boardDataPath);
    const boardId = req.params.id;
    const board = boardData["boards"].find(board => board.post_id === parseInt(boardId));
    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board}
    }
    res.json(jsonData);
});

// 게시글 추가 "/"
router.post("/", (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle || !requestData.postContent){
        console.log(requestData.postContent,requestData.postTitle);
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    let boardData = loadData(boardDataPath);
    let keyData = loadData(keyDataPath);

    // user 정보 처리 추가 필요

    postId = keyData.board_id + 1;
    keyData.board_id += 1;
    saveData(keyData, keyDataPath);

    const now = new Date();
    const localTimeString = now.toLocaleString();

    const newData = {
        "post_id": postId,
        "post_title": requestData.postTitle,
        "post_content": requestData.postContent,
        "file_id": null,
        "user_id": 1,  // 수정
        "nickname": "테스트",  // 수정
        "created_at": localTimeString,
        "updated_at": localTimeString,
        "deleted_at": null,
        "like": "0",
        "comment_count": "0",
        "hits": "1",
        "file_path": requestData.attachFilePath  || null,
        "profile_image_path": "/image/default.jpg"  // 수정
    };

    boardData.boards.push(newData);
    saveData(boardData, boardDataPath);

    jsonData = {
        "status" : 201, "message" : "write_post_success", "data" : {"post_id" : newData.post_id}
    }
    res.json(jsonData);
});


// 게시글 수정 "/:id"
router.patch("/:id", (req, res) =>{

});


// 게시글 삭제 "/:id"
router.delete("/:id", (req, res) =>{

});


// 댓글 목록 조회 "/:id/comments"
router.get("/:id/comments", (req, res) =>{
    const boardData = loadData(boardDataPath);
    const commentData = loadData(commentDataPath);


});

// 댓글 추가 "/:id/comments"
router.post("/:id/comments", (req, res) =>{

});


// 댓글 수정 "/{post_id}/comments/{comment_id}"
router.patch("/:postId/comments/:commentId", (req, res) =>{

});


// 댓글 삭제 "/{post_id}/comments/{comment_id}"
router.delete("/:postId/comments/:commentId", (req, res) =>{

});



module.exports = router;