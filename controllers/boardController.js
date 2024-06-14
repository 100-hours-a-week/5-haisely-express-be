/*CHECKLIST
[x] 인증 인가 구현하기
[x] 상태코드 401, 403 추가하기
[x] patch, delete 인가 구현하기
*/

const {makeRes} = require ('./controllerUtils.js');
const {getAllBoards, findBoardById, findBoardDetailById, makeNewBoard, patchBoardContent, deleteBoardById} = require('../models/Boards.js')
const {findCommentsByBoardId} = require('../models/Comments.js')

/* Controller */
const getBoards = async (req, res) => {
    const boardData = await getAllBoards();
    res.status(200).json(makeRes(200, null, {'boards':boardData}));
}

const getBoardDetail = async (req, res) => {
    const boardId = req.params.id;
    const board = await findBoardDetailById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    const comments = await findCommentsByBoardId(boardId);
    console.log(comments);
    res.status(200).json(makeRes(200, null, {"board" : board, "comments":comments}));
}

const postBoard = async (req, res) =>{
    const requestData = req.body;
    if(!requestData.postTitle){res.status(400).json(makeRes(400, "invalid_post_title", null)); return;} // invalid title
    if(!requestData.postContent){res.status(400).json(makeRes(400, "invalid_post_content", null)); return;} // invalid content
    // const user = req.session.user
    const user = {user_id: 1}
    const boardId = await makeNewBoard(user, requestData.postTitle, requestData.postContent, requestData.attachFilePath);
    res.status(201).json(makeRes(201, "write_post_success", {"board_id" : boardId}));
}

const patchBoard = async (req, res) =>{
    const requestData = req.body;
    const boardId = req.params.id;
    if(!requestData.postTitle){res.status(400).json(makeRes(400, "invalid_post_title", null)); return;} // invalid title
    if(!requestData.postContent){res.status(400).json(makeRes(400, "invalid_post_content", null)); return;} // invalid content
    const board = await findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    await patchBoardContent(boardId, requestData.postTitle, requestData.postContent, requestData.attachFilePath);
    res.status(200).json(makeRes(200, "update_post_success", {"board_id" : boardId}));
}

const deleteBoard = async (req, res) => {
    const boardId = req.params.id;
    const board = await findBoardById(boardId);
    console.log(board)
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    await deleteBoardById(boardId);
    res.status(200).json(makeRes(204,"delete_post_success", null));
}

module.exports = {
    getBoards,
    getBoardDetail,
    postBoard,
    patchBoard, 
    deleteBoard
};