/*CHECKLIST
[ ] 인증 인가 구현하기
[ ] 상태코드 401, 403 추가하기
[ ] 모든 응답 에러에 500 적용하기 -> 어케하징
*/

const {loadData, saveData, makeRes, getTimeNow} = require ('./controllerUtils.js');
const CommentController = require('../controllers/commentController');

const boardDataPath = 'public/data/boards.json';
const keyDataPath = 'public/data/keys.json';

/* Utils */
const findBoardById = (id) => {
    const boardData = loadData(boardDataPath);
    return boardData["boards"].find(board => board.post_id === parseInt(id));
}

const makeNewBoard = (user, postTitle, postContent, attachFilePath) => {
    // need to use user data
    return {
        "post_title": postTitle,
        "post_content": postContent,
        "user_id": 1,  // 수정
        "nickname": "테스트",  // 수정
        "created_at": getTimeNow(),
        "updated_at": getTimeNow(),
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

const patchBoardContent = (board, title, content, attachFilePath) => {
    const boardData = loadData(boardDataPath);
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(board.post_id));
    board.post_title = title;
    board.post_content = content;
    board.file_path = attachFilePath || null;
    board.updated_at = getTimeNow();
    boardData["boards"][boardIndex] = board;
    saveData(boardData, boardDataPath);
}

const deleteBoardById = (id) => {
    let boardData = loadData(boardDataPath);
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(id));
    boardData["boards"].splice(boardIndex, 1);
    saveData(boardData, boardDataPath);
    CommentController.deleteCommentsByPostId(id);
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
    const comments = CommentController.findCommentsByPostId(boardId);
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
    const boardId = req.params.id;
    if(!requestData.postTitle){res.status(400).json(makeRes(400, "invalid_post_title", null)); return;} // invalid title
    if(!requestData.postContent){res.status(400).json(makeRes(400, "invalid_post_content", null)); return;} // invalid content
    const board = findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    patchBoardContent(board, requestData.postTitle, requestData.postContent, requestData.attachFilePath);
    res.status(200).json(makeRes(200, "update_post_success", {"post_id" : boardId}));
}

const deleteBoard = (req, res) => {
    const boardId = req.params.id;
    const board = findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    deleteBoardById(boardId);
    res.status(204).json(makeRes(200,"delete_post_success", null));
}

module.exports = {
    getBoards,
    getBoardDetail,
    postBoard,
    patchBoard, 
    deleteBoard
};