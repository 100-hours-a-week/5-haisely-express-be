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
    let sql = 'select * from comments\
    WHERE comment_id=? and deleted_at is NULL;';
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
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

const patchCommentContent = async (id, content) => {
    let sql = 'update comments set content = ? where comment_id = ?;';
    let params = [content, id];
    try {
        const result = await queryDatabase(sql, params);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const deleteCommentById = async (id) => {
    let sql = 'UPDATE comments c set c.deleted_at = CURRENT_TIMESTAMP WHERE c.comment_id = ?;'
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}


module.exports = {
    findCommentsByCommentId,
    findCommentsByBoardId,
    saveNewComment,
    patchCommentContent,
    deleteCommentById
};