// CHECKLIST
// [ ] 인증 인가

const {loadData, saveData, makeRes, getTimeNow} = require ('./controllerUtils.js');

const boardDataPath = 'public/data/boards.json';
const commentDataPath = 'public/data/comments.json';
const keyDataPath = 'public/data/keys.json';

/* Utils */
const findCommentsByCommentId = (id) => {
    const commentData = loadData(commentDataPath);
    return commentData["comments"].find(comment => comment.comment_id === parseInt(id));
}

const findCommentsByPostId = (id) => {
    const commentData = loadData(commentDataPath);
    return commentData["comments"].filter(item => item.post_id === parseInt(id));
}

const makeNewComment = (user, postId, content) => {
    return {
        "comment_content": content,
        "post_id": parseInt(postId),
        "user_id": user.user_id,  
        "nickname": user.nickname,
        "created_at": getTimeNow(),
        "updated_at": getTimeNow(),
        "profile_image_path": user.profile_image_path || "/images/default.png"
    }
}

const saveNewComment = (newComment) => {
    let commentData = loadData(commentDataPath);
    let keyData = loadData(keyDataPath);
    const commentId = keyData.comment_id + 1;
    newComment.comment_id = commentId; // set comment_id
    commentData.comments.push(newComment); // push new comment
    saveData(commentData, commentDataPath); 
    keyData.comment_id += 1;
    saveData(keyData, keyDataPath);
    return commentId;
}

const patchCommentContent = (comment, content) => {
    const commentData = loadData(commentDataPath);
    const commentIndex = commentData["comments"].findIndex(c => c.comment_id === comment.comment_id);
    comment.comment_content = content;
    comment.updated_at = getTimeNow();
    commentData["comments"][commentIndex] = comment;
    saveData(commentData, commentDataPath);
}

const deleteCommentById = (id) => {
    const commentData = loadData(commentDataPath);
    const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(id));
    commentData["comments"].splice(commentIndex, 1);
    saveData(commentData, commentDataPath);
}

const deleteCommentsByPostId = (id) => {
    let commentData = loadData(commentDataPath);
    // delete comments in post
    const comments = commentData["comments"].filter(item => item.post_id === parseInt(id));
    comments.forEach(comment => {deleteCommentById(comment.comment_id);});
}


/* Controller */
const postComment = (req, res) =>{
    const requestData = req.body;
    const postId = req.params.id;
    if(!requestData.commentContent){res.status(400).json(makeRes(400, "invalid_comment_content", null)); return;} // invalid content
    const boardData = loadData(boardDataPath);
    const board = boardData["boards"].find(board => board.post_id === parseInt(postId));
    if (!board) {res.status(404).json(makeRes(404, "cannot_found_post", null)); return;}  // board not found
    const user = req.session.user
    const newComment = makeNewComment(user, postId,requestData.commentContent);
    const commentId = saveNewComment(newComment);
    res.status(201).json(makeRes(201, "write_comment_success", {"comment_id" : commentId}));
}

const patchComment = (req, res) =>{
    const requestData = req.body;
    const commentId = req.params.commentId;
    if(!requestData.commentContent){res.status(400).json(makeRes(400, "invalid_comment_content", null)); return;} // invalid content
    const comment = findCommentsByCommentId(commentId);
    if(!comment) {res.status(404).json(makeRes(404, "cannot_found_comment", null)); return;}  // comment not found
    patchCommentContent(comment, requestData.commentContent);
    res.status(200).json(makeRes(200, "update_comment_success", {"comment_id" : commentId}));
}

const deleteComment = (req, res) =>{
    const commentId = req.params.commentId;
    const comment = findCommentsByCommentId(commentId);
    if (!comment) {res.status(404).json(makeRes(404, "cannot_found_comment", null)); return;}  // comment not found
    deleteCommentById(commentId);
    res.status(200).json(makeRes(204, "delete_post_success", null));
}

module.exports = {
    postComment,
    patchComment,
    deleteComment,
    findCommentsByPostId,
    deleteCommentsByPostId
}