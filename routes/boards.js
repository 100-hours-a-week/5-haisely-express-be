// CHECKLIST
// [ ] 요청에 사용자 확인 과정 필요

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

// 게시글 상세 조회 + 댓글 목록 조회
router.get('/:id', (req, res) => {
    const boardData = loadData(boardDataPath);
    const boardId = req.params.id;
    const board = boardData["boards"].find(board => board.post_id === parseInt(boardId));
    
    const commentData = loadData(commentDataPath);
    const comments = commentData["comments"].filter(item => item.post_id === parseInt(boardId));

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 게시글 추가 "/"
router.post("/", (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle || !requestData.postContent){
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

    keyData.board_id += 1;
    saveData(keyData, keyDataPath);

    jsonData = {
        "status" : 201, "message" : "write_post_success", "data" : {"post_id" : newData.post_id}
    }
    res.json(jsonData);
});


// 게시글 수정 "/:id"
router.patch("/:id", (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle || !requestData.postContent){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    let boardData = loadData(boardDataPath);
    const boardId = req.params.id;
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(boardId));

    const now = new Date();
    const localTimeString = now.toLocaleString();

    boardData["boards"][boardIndex].post_title = requestData.postTitle;
    boardData["boards"][boardIndex].post_content = requestData.postContent;
    boardData["boards"][boardIndex].file_path = requestData.attachFilePath || null;
    boardData["boards"][boardIndex].updated_at = localTimeString;

    saveData(boardData, boardDataPath);
    jsonData = {
        "status" : 200, "message" : "update_post_success", "data" : {"post_id" : boardId}
    }
    res.json(jsonData);
});


// 게시글 삭제 "/:id"
router.delete("/:id", (req, res) =>{
    const boardData = loadData(boardDataPath);
    const boardId = req.params.id;
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(boardId));
    const removedItem = boardData["boards"].splice(boardIndex, 1);
    saveData(boardData, boardDataPath);
    jsonData = {
        "status" : 200, "message" : "delete_post_success", "data" : null
    }
    res.json(jsonData);

    // [ ] 댓글 삭제도 해야함
});


// 댓글 추가 "/:id/comments"
router.post("/:id/comments", (req, res) =>{
    const requestData = req.body;
    const boardId = req.params.id;
    if(!requestData.commentContent){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    let commentData = loadData(commentDataPath);
    let keyData = loadData(keyDataPath);

    // user 정보 처리 추가 필요

    commentId = keyData.comment_id + 1;

    const now = new Date();
    const localTimeString = now.toLocaleString();

    const newData =  {
        "comment_id": commentId,
        "comment_content": requestData.commentContent,
        "post_id": parseInt(boardId),
        "user_id": 1,  // 수정
        "nickname": "테스트",  // 수정
        "created_at": localTimeString,
        "updated_at": localTimeString,
        "deleted_at": null,
        "file_id": 1,
        "profile_image_path": "/images/default.png"  // 수정
    }
    commentData.comments.push(newData);
    saveData(commentData, commentDataPath);

    keyData.comment_id += 1;
    saveData(keyData, keyDataPath);
    jsonData = {
        "status" : 201, "message" : "write_comment_success", "data" : null
    }
    res.json(jsonData);
});


// 댓글 수정 "/{post_id}/comments/{comment_id}"
router.patch("/:postId/comments/:commentId", (req, res) =>{
    const requestData = req.body;
    if(!requestData.commentContent){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    const commentData = loadData(commentDataPath);
    const commentId = req.params.commentId;
    const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(commentId));

    const now = new Date();
    const localTimeString = now.toLocaleString();

    commentData["comments"][commentIndex].comment_content = requestData.commentContent;
    commentData["comments"][commentIndex].updated_at = localTimeString;

    saveData(commentData, commentDataPath);
    jsonData = {
        "status" : 200, "message" : "update_post_success", "data" :  null
    }
    res.json(jsonData);

});


// 댓글 삭제 "/{post_id}/comments/{comment_id}"
router.delete("/:postId/comments/:commentId", (req, res) =>{
    const commentData = loadData(commentDataPath);
    const commentId = req.params.commentId;
    const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(commentId));
    const removedItem = commentData["comments"].splice(commentIndex, 1);
    saveData(commentData, commentDataPath);
    jsonData = {
        "status" : 200, "message" : "delete_post_success", "data" : null
    }
    res.json(jsonData);
});



module.exports = router;