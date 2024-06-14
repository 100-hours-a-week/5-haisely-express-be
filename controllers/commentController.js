// CHECKLIST
// [x] 인증 인가

const {makeRes} = require ('./controllerUtils.js');
const {findCommentsByCommentId, saveNewComment, patchCommentContent, deleteCommentById} = require('../models/Comments.js')
const {findBoardById} = require('../models/Boards.js')

/* Controller */
const postComment = async (req, res) =>{
    const requestData = req.body;
    const boardId = req.params.id;
    if(!requestData.commentContent){res.status(400).json(makeRes(400, "invalid_comment_content", null)); return;} // invalid content
    const board = await findBoardById(boardId);
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    const user = req.session.user;
    const commentId = await saveNewComment(boardId, user, requestData.commentContent);
    res.status(201).json(makeRes(201, "write_comment_success", {"comment_id" : commentId}));
}

const patchComment = async (req, res) =>{
    const requestData = req.body;
    const commentId = req.params.commentId;
    if(!requestData.commentContent){res.status(400).json(makeRes(400, "invalid_comment_content", null)); return;} // invalid content
    const comment = await findCommentsByCommentId(commentId);
    if(!comment) {res.status(404).json(makeRes(404, "cannot_found_comment", null)); return;}  // comment not found
    await patchCommentContent(commentId, requestData.commentContent);
    res.status(200).json(makeRes(200, "update_comment_success", {"comment_id" : commentId}));
}

const deleteComment = async (req, res) =>{
    const commentId = req.params.commentId;
    const comment = await findCommentsByCommentId(commentId);
    if (!comment) {res.status(404).json(makeRes(404, "cannot_found_comment", null)); return;}  // comment not found
    await deleteCommentById(commentId);
    res.status(200).json(makeRes(204, "delete_post_success", null));
}

module.exports = {
    postComment,
    patchComment,
    deleteComment,
}