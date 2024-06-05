const userDataPath = 'public/data/users.json';
const keyDataPath = 'public/data/keys.json';
const boardDataPath = 'public/data/boards.json';
const commentDataPath = 'public/data/comments.json';

/* Utils */
const findUserByEmail = (email) => {
    const userData = loadData(userDataPath);
    return userData["users"].find(user => user.email === email);
}

const findUserById = (id) => {
    const userData = loadData(userDataPath);
    return userData["users"].find(user => user.user_id === parseInt(id));
}

const findUserByNickname = (nickname) => {
    const userData = loadData(userDataPath);
    return userData["users"].find(user => user.nickname === nickname);
}

const makeNewUser = (email, password, nickname, profileImagePath) => {
    return {
        "email": email,
        "nickname": nickname,
        "password": password,
        "profile_image": profileImagePath || "/images/default.png",
        "created_at": getTimeNow(),
        "updated_at": getTimeNow()
    }
}

const saveNewUser = (newUser) => {
    let userData = loadData(userDataPath);
    let keyData = loadData(keyDataPath);
    const userId = keyData.user_id + 1;
    newUser.user_id = userId;  // set user_id
    userData.users.push(newUser);  // push new user
    saveData(userData, userDataPath);
    keyData.user_id += 1;
    saveData(keyData, keyDataPath);
    return userId;
}

const patchUserContent = (user) => {
    const userData = loadData(userDataPath);
    const userIndex = userData["users"].findIndex(u => u.user_id === user.user_id);
    user.updated_at = getTimeNow();
    userData["users"][userIndex] = user;
    saveData(userData, userDataPath);
}

const deleteUserById = (id) => {
    const userData = loadData(userDataPath);
    const userIndex = userData["users"].findIndex(u => u.user_id === parseInt(id));
    const removedItem = userData["users"].splice(userIndex, 1);
    saveData(userData, userDataPath);
    // delete boards written by user
    let boardData = loadData(boardDataPath);
    const boards = boardData["boards"].filter(b => b.user_id === parseInt(id));
    boards.forEach(board => deleteBoardById(board.board_id));
}
