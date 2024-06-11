const db = require('../secret/database');

const conn = db.init();

/* Utils */
const findUserByEmail = (email) => {
    // var sql = 'SELECT * from users WHERE email=?';
    // var params = [email]
    // conn.query(sql, params, function(err, rows, fields){//두번째 인자에 배열로 된 값을 넣어줄 수 있다.
    //     if(err){
    //         console.log(err);
    //     } else {
    //         console.log(rows[i].title + " : " + rows[i].description);
    //     }
    // });
    // return rows;
}

const findUserById = (id) => {
    // const userData = loadData(userDataPath);
    // return userData["users"].find(user => user.user_id === parseInt(id));
}

const findUserByNickname = (nickname) => {
    // const userData = loadData(userDataPath);
    // return userData["users"].find(user => user.nickname === nickname);
}

const saveNewUser = (newUser) => {
    // let userData = loadData(userDataPath);
    // let keyData = loadData(keyDataPath);
    // const userId = keyData.user_id + 1;
    // newUser.user_id = userId;  // set user_id
    // userData.users.push(newUser);  // push new user
    // saveData(userData, userDataPath);
    // keyData.user_id += 1;
    // saveData(keyData, keyDataPath);
    // return userId;
}

const patchUserContent = (user) => {
    // const userData = loadData(userDataPath);
    // const userIndex = userData["users"].findIndex(u => u.user_id === user.user_id);
    // user.updated_at = getTimeNow();
    // userData["users"][userIndex] = user;
    // saveData(userData, userDataPath);
}

const deleteUserById = (id) => {
    // const userData = loadData(userDataPath);
    // const userIndex = userData["users"].findIndex(u => u.user_id === parseInt(id));
    // const removedItem = userData["users"].splice(userIndex, 1);
    // saveData(userData, userDataPath);
    // // delete boards written by user
    // let boardData = loadData(boardDataPath);
    // const boards = boardData["boards"].filter(b => b.user_id === parseInt(id));
    // boards.forEach(board => deleteBoardById(board.board_id));
}

module.exports = {
    findUserByEmail,
    findUserById,
    findUserByNickname,
    saveNewUser,
    patchUserContent,
    deleteUserById
};