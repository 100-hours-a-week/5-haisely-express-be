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
const findCommentsByCommentId = async (id) => {
    // const commentData = loadData(commentDataPath);
    // return commentData["comments"].find(comment => comment.comment_id === parseInt(id));
    let sql = 'select * from comments\
    WHERE comment_id=? and deleted_at is NULL;';
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
        console.log(result);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }

}

const findCommentsByBoardId = async (id) => {
    let sql = 'SELECT * from comments\
    WHERE board_id=? and deleted_at is NULL;';
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const saveNewComment = async (boardId, user, content) => {
    const startTransaction = "START TRANSACTION;";
    let insertComment = 'INSERT INTO comments (board_id, user_id, content) VALUES (?, ?, ?);';
    const getLastInsertId = "SELECT LAST_INSERT_ID() AS comment_id;";
    const commitTransaction = "COMMIT;";

    try {
        await queryDatabase(startTransaction);
        await queryDatabase(insertComment, [boardId, user.user_id, content]);
        const result = await queryDatabase(getLastInsertId);
        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');
        return result[0].comment_id;

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }
}

const patchCommentContent = (comment, content) => {
    // const commentData = loadData(commentDataPath);
    // const commentIndex = commentData["comments"].findIndex(c => c.comment_id === comment.comment_id);
    // comment.comment_content = content;
    // comment.updated_at = getTimeNow();
    // commentData["comments"][commentIndex] = comment;
    // saveData(commentData, commentDataPath);
}

const deleteCommentById = (id) => {
    // const commentData = loadData(commentDataPath);
    // const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(id));
    // commentData["comments"].splice(commentIndex, 1);
    // saveData(commentData, commentDataPath);
}


module.exports = {
    findCommentsByCommentId,
    findCommentsByBoardId,
    saveNewComment,
    patchCommentContent,
    deleteCommentById
};