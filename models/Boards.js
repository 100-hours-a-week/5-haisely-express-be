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
const getAllBoards = async() => {
    var sql = 'select b.board_id, u.nickname writer, i2.file_url profile_image, b.title, b.content, i.file_url board_image, b.created_at, b.updated_at, b.deleted_at, h.hit from boards b \
    left join board_hits h on b.board_id = h.board_id\
    left join images i on b.image_id = i.image_id\
    left join users u on b.user_id = u.user_id\
    left join images i2 on u.image_id = i2.image_id\
    where b.deleted_at is NULL;\
    ';
    try {
        const result = await queryDatabase(sql);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const findBoardById = async (id) => {
    var sql = 'select * from boards\
    WHERE board_id=? and deleted_at is NULL;\
    ';
    var params = [id];
    try {
        const result = await queryDatabase(sql, params);
        console.log(result);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const findBoardDetailById = async (id) => {
    var sql = 'select b.board_id, u.nickname writer, i2.file_url profile_image, b.title, b.content, i.file_url board_image, b.created_at, b.updated_at, b.deleted_at, h.hit from boards b \
    left join board_hits h on b.board_id = h.board_id\
    left join images i on b.image_id = i.image_id\
    left join users u on b.user_id = u.user_id\
    left join images i2 on u.image_id = i2.image_id\
    WHERE b.board_id=? and b.deleted_at is NULL;\
    ';
    var params = [id];
    try {
        const result = await queryDatabase(sql, params);
        console.log(result);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}
const makeNewBoard = async (user, boardTitle, boardContent, attachFilePath) => {
    const startTransaction = "START TRANSACTION;";
    const insertImage = "INSERT INTO images (file_url) VALUES (?);";
    const insertBoardWithImage = "INSERT INTO boards (user_id, image_id, title, content) VALUES (?, LAST_INSERT_ID(), ?, ?);";
    const insertBoard = "INSERT INTO boards (user_id, title, content) VALUES (?, ?, ?);";
    const commitTransaction = "COMMIT;";

    try {
        await queryDatabase(startTransaction);

        if (attachFilePath != null){
            await queryDatabase(insertImage, [attachFilePath]);
            await queryDatabase(insertBoardWithImage, [user.user_id, boardTitle, boardContent]);
        } else {
            await queryDatabase(insertBoard, [user.user_id, boardTitle, boardContent]);
        }

        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }
}


const patchBoardContent = async(boardId, title, content, attachFilePath) => {
    const startTransaction = "START TRANSACTION;";
    const updateImage = "INSERT INTO images (file_url) VALUES (?);";
    const updateBoardWithImage = "UPDATE boards set title = ?, content = ?, image_id = LAST_INSERT_ID() WHERE board_id = ?;";
    const updateBoard = "UPDATE boards set title = ?, content = ?, image_id = ? WHERE board_id = ?;";
    const commitTransaction = "COMMIT;";

    try {
        await queryDatabase(startTransaction);

        if (attachFilePath != null){
            await queryDatabase(updateImage, [attachFilePath]);
            await queryDatabase(updateBoardWithImage, [title, content, boardId]);
        } else {
            await queryDatabase(updateBoard, [title, content, null, boardId]);
        }

        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }


}

const deleteBoardById = async (id) => {
    const startTransaction = "START TRANSACTION;";
    const deleteBoard = "UPDATE boards b set b.deleted_at = CURRENT_TIMESTAMP WHERE b.board_id = ?;";
    const deleteComment = "UPDATE comments c set c.deleted_at = CURRENT_TIMESTAMP WHERE c.board_id = ?;";
    const commitTransaction = "COMMIT;";
    var params = [id];

    try {
        await queryDatabase(startTransaction);
        await queryDatabase(deleteBoard, params);
        await queryDatabase(deleteComment, params);
        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }
}

module.exports = {
    getAllBoards,
    findBoardById,
    findBoardDetailById,
    makeNewBoard,
    patchBoardContent,
    deleteBoardById
};