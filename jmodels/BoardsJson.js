/* Utils */
const findBoardById = (id) => {
    const boardData = loadData(boardDataPath);
    return boardData["boards"].find(board => board.post_id === parseInt(id));
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