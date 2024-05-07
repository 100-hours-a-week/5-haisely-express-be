// CHECKLIST
// [ ] 쿠키 세션 구현
// [ ] status 찍고 다니기

const {loadData, saveData, makeRes, getTimeNow} = require ('./controllerUtils.js');

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

/* Controller */
const login = (req, res) => {
    const requestData = req.body;
    if(!requestData.email){res.status(400).json(makeRes(400, "invalid_user_email", null)); return;} // invalid email
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_user_password", null)); return;} // invalid password
    let user = findUserByEmail(requestData.email);
    if(!user){res.status(401).json(makeRes(401, "user_not_found_for_email", null)); return;} // no user
    if(user.password !== requestData.password){res.status(401).json(makeRes(401, "incorrect_password", null)); return;} // incorrect password
    delete user.password;
    // need to give cookie
    token = "I am not cookie";
    user.auth_token = token;
    res.status(200).json(makeRes(200, "login_success", {"user" : user}));
}

const signUp = (req, res) => {
    const requestData = req.body;
    if(!requestData.email){res.status(400).json(makeRes(400, "invalid_email", null)); return;} // invalid email
    if(!requestData.nickname){res.status(400).json(makeRes(400, "invalid_nickname", null)); return;} // invalid nickname
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_password", null)); return;} // invalid password
    if(findUserByEmail(requestData.email)){res.status(400).json(makeRes(400, "used_email", null)); return;} // used email
    if(findUserByNickname(requestData.nickname)){res.status(400).json(makeRes(400, "used_nickname", null)); return;} // used nickname
    const newUser = makeNewUser(requestData.email, requestData.password, requestData.nickname, requestData.profileImagePath);
    const userId = saveNewUser(newUser);
    res.status(201).json(makeRes(201, "register_success", {"user_id":userId}));
}

const logout = (req, res) => {
    // need to add session control code
    res.redirect('/login').res(200).json(makeRes(200, null, null));
}

const getUserById = (req, res) => {
    const userId = req.params.id;
    let user = findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    delete user.password;
    res.status(200).json(makeRes(200, null, {"user" : user}));
}

const patchUser = (req, res) => {
    const requestData = req.body;
    const userId = req.params.id;
    if(!requestData.nickname){res.status(400).json(makeRes(400, "invalid_nickname", null)); return;} // invalid nickname
    let user = findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    user.nickname = requestData.nickname;
    user.profile_image = requestData.profileImage || "/images/default.png";
    patchUserContent(user);
    res.status(200).json(makeRes(200, "update_user_data_success", null));
}

const patchPassword = (req, res) => {
    const requestData = req.body;
    const userId = req.params.id;
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_password", null)); return;} // invalid password
    let user = findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    user.password = requestData.password;
    patchUserContent(user);
    res.status(200).json(makeRes(200, "update_user_password_success", null));
}

const deleteUser = (req, res) => {
    const userData = loadData(userDataPath);
    const userId = req.params.id;
    const userIndex = userData["users"].findIndex(user => user.user_id === parseInt(userId));
    const removedItem = userData["users"].splice(userIndex, 1);
    saveData(userData, userDataPath);

    // post 삭제, comment 삭제
    let boardData = loadData(boardDataPath);
    let commentData = loadData(commentDataPath);
    const boards = boardData["boards"].filter(item => item.user_id === parseInt(userId));

    // 게시글에 연관된 댓글 삭제
    boards.forEach(board => {
        let boardId = board.post_id;
        // console.log("board_id : ", boardId);
        const boardIndex = boardData["boards"].findIndex(item => item.post_id === board.post_id);
        // console.log("board_index : ", boardIndex);

        boardData["boards"].splice(boardIndex, 1);

        const comments = commentData["comments"].filter(item => item.post_id === parseInt(boardId));
        // 게시글에 연관된 댓글 삭제
        comments.forEach(comment => {
            // console.log("1) comment_id : ", comment.comment_id);
        const commentIndex = commentData["comments"].findIndex(item => item.comment_id === comment.comment_id);
        commentData["comments"].splice(commentIndex, 1);
        });
    });

    const comments = commentData["comments"].filter(item => item.user_id === parseInt(userId));
    // 게시글에 연관된 댓글 삭제
    comments.forEach(comment => {
        // console.log("2) comment_id : ", comment.comment_id);
        const commentIndex = commentData["comments"].findIndex(item => item.comment_id === comment.comment_id);
        commentData["comments"].splice(commentIndex, 1);
    });

    saveData(boardData, boardDataPath);
    saveData(commentData, commentDataPath);

    jsonData = {
        "status" : 200, "message" : "delete_user_data_success", "data" : null
    }
    res.json(jsonData);
}

const authCheck = (req, res) => {
    // need to add session control code
    res.status(200).json(makeRes(200, null, null));
}

const emailCheck = (req, res) => {
    const {email} = req.query;
    const user = findUserByEmail(email);
    if (user){res.status(400).json(makeRes(400, "already_exist_email", null)); return;}  // already used email
    res.status(200).json(makeRes(200, "available_email", null));
}

const nicknameCheck =  (req, res) => {
    const {nickname} = req.query;
    const user = findUserByNickname(nickname);
    if (user){res.status(400).json(makeRes(400, "already_exist_nickname", null)); return;}  // already used nickname
    res.status(200).json(makeRes(200, "available_nickname", null));
}

module.exports ={
    login,
    signUp,
    logout,
    getUserById,
    patchUser,
    patchPassword,
    deleteUser,
    authCheck,
    emailCheck,
    nicknameCheck
}