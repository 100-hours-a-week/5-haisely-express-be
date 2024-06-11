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
const findUserByEmail = async (email) => {
    let sql = 'SELECT * from users WHERE email=?';
    let params = [email];
    try {
        const result = await queryDatabase(sql, params);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const findUserById = async (id) => {
    let sql = 'SELECT * from users WHERE user_id=?';
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const findUserByNickname = async (nickname) => {
    let sql = 'SELECT * from users WHERE nickname=?';
    let params = [nickname];
    try {
        const result = await queryDatabase(sql, params);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const saveNewUser = async (email, password, nickname, profileImage) => {
    const startTransaction = "START TRANSACTION;";
    const insertImage = "INSERT INTO images (file_url) VALUES (?);";
    const insertUserWithImage = "INSERT INTO users (image_id, nickname, email, password) VALUES (LAST_INSERT_ID(), ?, ?, ?);";
    const insertUser = "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?);";
    const getLastInsertId = "SELECT LAST_INSERT_ID() AS user_id;";
    const commitTransaction = "COMMIT;";

    try {
        await queryDatabase(startTransaction);

        if (profileImage != null){
            await queryDatabase(insertImage, [profileImage]);
            await queryDatabase(insertUserWithImage, [nickname, email, password]);
        } else {
            await queryDatabase(insertUser, [nickname, email, password]);
        }
        const result = await queryDatabase(getLastInsertId);
        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');
        return result[0].user_id;

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }
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