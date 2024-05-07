/*CHECKLIST
[ ] 인증 인가 구현하기
[ ] 상태코드 401, 403 추가하기
[ ] 모든 응답 에러에 500 적용하기 -> 어케하징
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

const makeNewBoard = (user, postTitle, postContent, attachFilePath) => {
    const now = new Date();
    const localTimeString = now.toLocaleString();
    // need to use user data
    return {
        "post_title": postTitle,
        "post_content": postContent,
        "file_id": null,
        "user_id": 1,  // 수정
        "nickname": "테스트",  // 수정
        "created_at": localTimeString,
        "updated_at": localTimeString,
        "deleted_at": null,
        "like": "0",
        "comment_count": "0",
        "hits": "1",
        "file_path": attachFilePath  || null,
        "profile_image_path": "/images/default.png"  // 수정
    };
}

const saveNewBoard = (newBoard) => {
    let boardData = loadData(boardDataPath);
    let keyData = loadData(keyDataPath);
    const postId = keyData.board_id + 1;
    newBoard.post_id = postId;  // set post_id
    boardData.boards.push(newBoard);  // push new board
    saveData(boardData, boardDataPath);
    keyData.board_id += 1;
    saveData(keyData, keyDataPath);
    return postId;
}

/* Controller */
const getBoards = (req, res) => {
    const boardData = loadData(boardDataPath);
    res.status(200).json(makeRes(200, null, boardData));
}

const getBoardDetail = (req, res) => {
    const boardId = req.params.id;
    const board = findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    const comments = findCommentsByPostId(boardId);
    res.status(200).json(makeRes(200, null, {"board" : board, "comments":comments}));
}

const postBoard = (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle){res.status(400).json(makeRes(400, "invalid_post_title", null)); return;} // invalid title
    if(!requestData.postContent){res.status(400).json(makeRes(400, "invalid_post_content", null)); return;} // invalid content
    // need to send user data
    const newPost = makeNewBoard(null, requestData.postTitle, requestData.postContent, requestData.attachFilePath);
    const postId = saveNewBoard(newPost);
    res.status(201).json(makeRes(201, "write_post_success", {"post_id" : postId}));
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