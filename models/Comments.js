const db = require('../secret/database');

const conn = db.init();


/* Utils */
function queryDatabase(sql, params) {
    return new Promise((resolve, reject) => {
        conn.query(sql, params, function(err, rows, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

/* Utils */
const findCommentsByCommentId = (id) => {
    const commentData = loadData(commentDataPath);
    return commentData["comments"].find(comment => comment.comment_id === parseInt(id));
}

const findCommentsByBoardId = async (id) => {
    var sql = 'SELECT * from comments WHERE board_id=?';
    var params = [id];
    try {
        const result = await queryDatabase(sql, params);
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
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


module.exports = {
    findCommentsByCommentId,
    findCommentsByBoardId,
    saveNewComment,
    patchCommentContent,
    deleteCommentById
};