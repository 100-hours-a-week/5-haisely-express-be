// CHECKLIST
// [x] 쿠키 세션 구현
// [ ] sql로 쿠키 세션 구현

const {makeRes} = require ('./controllerUtils.js');
const {findUserByEmail, findUserById, findUserByNickname, saveNewUser, patchUserContent, patchUserPassword, deleteUserById} = require('../models/Users.js')

/* Controller */
const login = (req, res) => {
    const requestData = req.body;
    if(!requestData.email){res.status(400).json(makeRes(400, "invalid_user_email", null)); return;} // invalid email
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_user_password", null)); return;} // invalid password
    let user = findUserByEmail(requestData.email);
    if(!user){res.status(401).json(makeRes(401, "user_not_found_for_email", null)); return;} // no user
    if(user.password !== requestData.password){res.status(401).json(makeRes(401, "incorrect_password", null)); return;} // incorrect password
    delete user.password;
    req.session.user = user;
    user.auth_token = req.sessionID;
    res.status(200).json(makeRes(200, "login_success", {"user" : user}));
}

const signUp = async (req, res) => {
    const requestData = req.body;
    if(!requestData.email){res.status(400).json(makeRes(400, "invalid_email", null)); return;} // invalid email
    if(!requestData.nickname){res.status(400).json(makeRes(400, "invalid_nickname", null)); return;} // invalid nickname
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_password", null)); return;} // invalid password
    if(await findUserByEmail(requestData.email)){res.status(400).json(makeRes(400, "used_email", null)); return;} // used email
    if(await findUserByNickname(requestData.nickname)){res.status(400).json(makeRes(400, "used_nickname", null)); return;} // used nickname
    // const newUser = makeNewUser(requestData.email, requestData.password, requestData.nickname, requestData.profileImagePath);
    const userId = await saveNewUser(requestData.email, requestData.password, requestData.nickname, requestData.profileImagePath);
    res.status(201).json(makeRes(201, "register_success", {"user_id":userId}));
}

const logout = (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json(makeRes(500, "로그아웃 중 문제가 발생했습니다.", null));
        }

        return res.status(200).json(makeRes(200, null, null));
    });
}

const getUserById = async (req, res) => {
    // const userId = req.session.user.user_id;
    const userId =1;
    console.log(userId);
    let user = await findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    delete user.password;
    res.status(200).json(makeRes(200, null, {"user" : user}));
}

const patchUser = async (req, res) => {
    const requestData = req.body;
    // const userId = req.session.user.user_id;
    const userId = 1;
    if(!requestData.nickname){res.status(400).json(makeRes(400, "invalid_nickname", null)); return;} // invalid nickname
    let user = await findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    patchUserContent(userId, requestData.nickname, user.profile_image);
    res.status(200).json(makeRes(200, "update_user_data_success", null));
}

const patchPassword = async (req, res) => {
    const requestData = req.body;
    // const userId = req.session.user.user_id;
    const userId = 1;
    if(!requestData.password){res.status(400).json(makeRes(400, "invalid_password", null)); return;} // invalid password
    let user = await findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    await patchUserPassword(userId,requestData.password);
    res.status(200).json(makeRes(200, "update_user_password_success", null));
}

const deleteUser = async (req, res) => {
    // const userId = req.session.user.user_id;
    const userId = 2;
    let user = await findUserById(userId);
    if(!user) {res.status(404).json(makeRes(404, "not_found_user", null)); return;}  // user not found
    await deleteUserById(userId);
    res.status(200).json(makeRes(204,"delete_user_success", null));
}

const authCheck = (req, res) => {
    // need to add session control code
    res.status(200).json(makeRes(200, null, null));
}

const emailCheck = async (req, res) => {
    const {email} = req.query;
    const user = await findUserByEmail(email);
    if (user){res.status(400).json(makeRes(400, "already_exist_email", null)); return;}  // already used email
    res.status(200).json(makeRes(200, "available_email", null));
}

const nicknameCheck = async (req, res) => {
    const {nickname} = req.query;
    const user = await findUserByNickname(nickname);
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