const db = require('../secret/database');

const conn = db.init();
//sql문을 하드코딩 하지 않고, ? 라는 치환자를 두어 코딩함
var sql = 'INSERT INTO topic (title, description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphittie'];//파라미터를 값들로 줌(배열로 생성)
conn.query(sql, params, function(err, rows, fields){// 쿼리문 두번째 인자로 파라미터로 전달함(값들을 치환시켜서 실행함. 보안과도 밀접한 관계가 있음(sql injection attack))
    if(err) console.log(err);
    console.log(rows.insertId);
});


/* Utils */
const findBoardById = (id) => {
    var sql = 'SELECT * from boards WHERE board_id=?';
    var params = [id]
    conn.query(sql, params, function(err, rows, fields){//두번째 인자에 배열로 된 값을 넣어줄 수 있다.
        if(err){
            console.log(err);
        } else {
            console.log(rows[i].title + " : " + rows[i].description);
        }
    });
      
    // const boardData = loadData(boardDataPath);
    // return boardData["boards"].find(board => board.post_id === parseInt(id));
}

const makeNewBoard = (user, postTitle, postContent, attachFilePath) => {
    return {
        "post_title": postTitle,
        "post_content": postContent,
        "user_id": user.user_id,  
        "nickname": user.nickname, 
        "created_at": getTimeNow(),
        "updated_at": getTimeNow(),
        "comment_count": "0",
        "hits": "1",
        "file_path": attachFilePath  || null,
        "profile_image_path": user.profile_image ||"/images/default.png" 
    };
}

const saveNewBoard = (newBoard) => {
    let boardData = loadData(boardDataPath);
    let keyData = loadData(keyDataPath);
    const postId = keyData.board_id + 1;
    newBoard.post_id = postId;  // set post_id
    boardData.boards.push(newBoard);  // push new board
    saveData(boardData, boardDataPath);
    keyData.board_id += 1;
    saveData(keyData, keyDataPath);
    return postId;
}

const patchBoardContent = (board, title, content, attachFilePath) => {
    const boardData = loadData(boardDataPath);
    const boardIndex = boardData["boards"].findIndex(b => b.post_id === parseInt(board.post_id));
    board.post_title = title;
    board.post_content = content;
    board.file_path = attachFilePath || null;
    board.updated_at = getTimeNow();
    boardData["boards"][boardIndex] = board;
    saveData(boardData, boardDataPath);
}

const deleteBoardById = (id) => {
    let boardData = loadData(boardDataPath);
    const boardIndex = boardData["boards"].findIndex(board => board.post_id === parseInt(id));
    boardData["boards"].splice(boardIndex, 1);
    saveData(boardData, boardDataPath);
    deleteCommentsByPostId(id);
}

module.exports = {
    getBoards,
    getBoardDetail,
    postBoard,
    patchBoard, 
    deleteBoard
};