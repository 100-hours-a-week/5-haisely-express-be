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
const findBoardById = async (id) => {
    var sql = 'SELECT * from boards WHERE board_id=?';
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
    findBoardById,
    makeNewBoard,
    saveNewBoard,
    patchBoardContent,
    deleteBoardById
};