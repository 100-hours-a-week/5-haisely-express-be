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
    left join images i2 on u.image_id = i2.image_id;\
    ';
    params = []
    try {
        const result = await queryDatabase(sql, params);
        return result;
    } catch (err) {
        console.log(err);
        return null;
    }
}


const findBoardById = async (id) => {
    var sql = 'select b.board_id, u.nickname writer, i2.file_url profile_image, b.title, b.content, i.file_url board_image, b.created_at, b.updated_at, b.deleted_at, h.hit from boards b \
    left join board_hits h on b.board_id = h.board_id\
    left join images i on b.image_id = i.image_id\
    left join users u on b.user_id = u.user_id\
    left join images i2 on u.image_id = i2.image_id\
    WHERE b.board_id=?;\
    ';
    var params = [id];
    try {
        const result = await queryDatabase(sql, params);
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


const patchBoardContent = (board, title, content, attachFilePath) => {
    // const boardData = loadData(boardDataPath);
    // const boardIndex = boardData["boards"].findIndex(b => b.post_id === parseInt(board.post_id));
    // board.post_title = title;
    // board.post_content = content;
    // board.file_path = attachFilePath || null;
    // board.updated_at = getTimeNow();
    // boardData["boards"][boardIndex] = board;
    // saveData(boardData, boardDataPath);
}

const deleteBoardById = (id) => {
    // let boardData = loadData(boardDataPath);
    // const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(id));
    // boardData["boards"].splice(boardIndex, 1);
    // saveData(boardData, boardDataPath);
    // deleteCommentsByPostId(id);
}

module.exports = {
    getAllBoards,
    findBoardById,
    makeNewBoard,
    patchBoardContent,
    deleteBoardById
};