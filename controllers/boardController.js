/*CHECKLIST
[x] 인증 인가 구현하기
[x] 상태코드 401, 403 추가하기
[x] patch, delete 인가 구현하기
*/

const {loadData, saveData, makeRes, getTimeNow} = require ('./controllerUtils.js');
const {getAllBoards, findBoardById, makeNewBoard, patchBoardContent, deleteBoardById} = require('../models/Boards.js')
const {findCommentsByPostId, deleteCommentsByPostId} = require('../models/Comments.js')

const boardDataPath = 'public/data/boards.json';
const keyDataPath = 'public/data/keys.json';


/* Controller */
const getBoards = async (req, res) => {
    const boardData = await getAllBoards();
    res.status(200).json(makeRes(200, null, boardData));
}

const getBoardDetail = async (req, res) => {
    const boardId = req.params.id;
    const board = await findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    const comments = await findCommentsByPostId(boardId);
    console.log(comments);
    res.status(200).json(makeRes(200, null, {"board" : board, "comments":comments}));
}

const postBoard = (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle){res.status(400).json(makeRes(400, "invalid_post_title", null)); return;} // invalid title
    if(!requestData.postContent){res.status(400).json(makeRes(400, "invalid_post_content", null)); return;} // invalid content
    // const user = req.session.user
    const user = {user_id: 1}
    const postId = makeNewBoard(user, requestData.postTitle, requestData.postContent, requestData.attachFilePath);
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
    res.status(200).json(makeRes(204,"delete_post_success", null));
}

module.exports = {
    getBoards,
    getBoardDetail,
    postBoard,
    patchBoard, 
    deleteBoard,
    findBoardById,
    deleteBoardById
};