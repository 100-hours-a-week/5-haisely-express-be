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
const makeNewBoard = (user, postTitle, postContent, attachFilePath) => {
    // return {
    //     "post_title": postTitle,
    //     "post_content": postContent,
    //     "user_id": user.user_id,  
    //     "nickname": user.nickname, 
    //     "created_at": getTimeNow(),
    //     "updated_at": getTimeNow(),
    //     "comment_count": "0",
    //     "hits": "1",
    //     "file_path": attachFilePath  || null,
    //     "profile_image_path": user.profile_image ||"/images/default.png" 
    // };
}

const saveNewBoard = (newBoard) => {
    // let boardData = loadData(boardDataPath);
    // let keyData = loadData(keyDataPath);
    // const postId = keyData.board_id + 1;
    // newBoard.post_id = postId;  // set post_id
    // boardData.boards.push(newBoard);  // push new board
    // saveData(boardData, boardDataPath);
    // keyData.board_id += 1;
    // saveData(keyData, keyDataPath);
    // return postId;
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
    saveNewBoard,
    patchBoardContent,
    deleteBoardById
};