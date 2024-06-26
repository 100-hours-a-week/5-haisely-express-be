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
    let sql = 'SELECT * from users\
    WHERE email=? and deleted_at is NULL;';
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
    let sql = 'SELECT * from users\
    WHERE user_id=? and deleted_at is NULL;';
    let params = [id];
    try {
        const result = await queryDatabase(sql, params);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const findUserInfoById = async (id) => {
    let sql = 'select nickname, email, i.file_url profile_image from users u\
    left join images i on u.image_id = i.image_id\
    WHERE user_id=? and deleted_at is NULL;';
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
    let sql = 'SELECT * from users\
    WHERE nickname=? and deleted_at is NULL;';
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

const patchUserContent = async (userId, nickname, profileImage) => {
    const startTransaction = "START TRANSACTION;";
    const updateImage = "INSERT INTO images (file_url) VALUES (?);";
    const updateBoardWithImage = "UPDATE users u SET u.nickname = ?, u.image_id = LAST_INSERT_ID() WHERE u.user_id = ?;";
    const updateBoard = "UPDATE users u SET u.nickname = ?, u.image_id = ? WHERE u.user_id = ?;";
    const commitTransaction = "COMMIT;";
    
    try {
        await queryDatabase(startTransaction);

        if (profileImage != null){
            await queryDatabase(updateImage, [profileImage]);
            console.log(profileImage);
            await queryDatabase(updateBoardWithImage, [nickname, userId]);
        } else {
            await queryDatabase(updateBoard, [nickname, null, userId]);
        }

        await queryDatabase(commitTransaction);
        console.log('Transaction completed successfully');

    } catch (error) {
        await queryDatabase("ROLLBACK;");
        console.error('Transaction failed, rollback executed', error);
        return null;
    }
}

const patchUserPassword = async (userId, password) => {
    let sql = 'UPDATE users u SET u.password = ? WHERE u.user_id = ?;';

    let params = [password, userId];
    try {
        const result = await queryDatabase(sql, params);
        return result[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const deleteUserById = async (id) => {
    const startTransaction = "START TRANSACTION;";
    const deleteUser = "UPDATE users u set u.deleted_at = CURRENT_TIMESTAMP WHERE u.user_id = ?;";
    const deleteBoard = "UPDATE boards b set b.deleted_at = CURRENT_TIMESTAMP WHERE b.user_id = ? and b.deleted_at is NULL;";
    const deleteComment = "UPDATE comments c set c.deleted_at = CURRENT_TIMESTAMP WHERE c.user_id = ? and c.deleted_at is NULL ;";
    const commitTransaction = "COMMIT;";
    let params = [id];

    try {
        await queryDatabase(startTransaction);
        await queryDatabase(deleteUser, params);
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
    findUserByEmail,
    findUserById,
    findUserByNickname,
    saveNewUser,
    patchUserContent,
    patchUserPassword,
    deleteUserById,
    findUserInfoById
};