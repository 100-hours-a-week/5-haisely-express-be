/*CHECKLIST
[ ] 인증 인가 구현하기
[ ] 상태코드 401, 403 추가하기
*/

const {loadData, saveData, makeRes} = require ('./controllerUtils.js');

const boardDataPath = 'public/data/boards.json';
const commentDataPath = 'public/data/comments.json';
const keyDataPath = 'public/data/keys.json';

/* utils */
const findBoardById = (id) => {
    const boardData = loadData(boardDataPath);
    return boardData["boards"].find(board => board.post_id === parseInt(id));
}

const findCommentsByPostId = (id) => {
    const commentData = loadData(commentDataPath);
    return commentData["comments"].filter(item => item.post_id === parseInt(id));
}

/* Controller */
const getBoards = (req, res) => {
    const boardData = loadData(boardDataPath);
    res.status(200).json(makeRes(200, null, boardData));
}

const getBoardDetail = (req, res) => {
    const boardId = req.params.id;
    const board = findBoardById(boardId);
    if (board === undefined) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}
    const comments = findCommentsByPostId(boardId);
    res.status(200).json(makeRes(200, null, {"board" : board, "comments":comments}));
}

const postBoard = (req, res) =>{
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
        "profile_image_path": "/images/default.png"  // 수정
    };

    boardData.boards.push(newData);
    saveData(boardData, boardDataPath);

    keyData.board_id += 1;
    saveData(keyData, keyDataPath);

    jsonData = {
        "status" : 201, "message" : "write_post_success", "data" : {"post_id" : newData.post_id}
    }
    res.json(jsonData);
}

const patchBoard = (req, res) =>{
    const requestData = req.body;
    console.log(req.body);
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
        "status" : 201, "message" : "update_post_success", "data" : {"post_id" : boardId}
    }
    res.json(jsonData);
}

const deleteBoard = (req, res) => {
    let boardData = loadData(boardDataPath);
    const boardId = req.params.id;
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(boardId));
    const removedItem = boardData["boards"].splice(boardIndex, 1);

    let commentData = loadData(commentDataPath);
    const comments = commentData["comments"].filter(item => item.post_id === parseInt(boardId));
    // 게시글에 연관된 댓글 삭제
    comments.forEach(comment => {
        const commentIndex = commentData["comments"].findIndex(item => item.comment_id === comment.comment_id);
        commentData["comments"].splice(commentIndex, 1);
    });
    saveData(boardData, boardDataPath);
    saveData(commentData, commentDataPath);

    jsonData = {
        "status" : 200, "message" : "delete_post_success", "data" : null
    }
    res.json(jsonData);
}

module.exports = {
    getBoards,
    getBoardDetail,
    postBoard,
    patchBoard, 
    deleteBoard
};