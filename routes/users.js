// CHECKLIST
// [ ] JWT -> 쿠키/세션식으로 바꾸기
// [ ] status 찍고 다니기

const express = require('express');
const fs = require('fs');

const cookieConfig = {
    httpOnly: true, 
    maxAge: 1000000,
    signed: true 
};

const router = express.Router();

const secretKey = process.env.SECRET_KEY;

const userDataPath = 'public/data/users.json';
const keyDataPath = 'public/data/keys.json';
const blacklist = new Set();

function verifyToken(req, res, next) {
    const cookieHeader = req.headers['cookie'];

    if (typeof cookieHeader !== 'undefined') {
        // 쿠키 확인
    } else {
        res.redirect('/login');
    }

    // return {"userId" : 1, "nickname":}
}

const loadData = (dataFilePath) => {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return null;
    }
}

const saveData = (data, filePath) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log('Data saved successfully');
    } catch (err) {
        console.error('Error saving file:', err);
    }
}

// 로그인
router.post('/login',  (req, res) => {
    if(!requestData.email || !requestData.password||!requestData.nickname){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }
    const userData = loadData(userDataPath);
    const user = userData["users"].find(user => user.email === requestData.email);
    if (user.password !== requestData.password){
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }
    // 쿠키 주는 코드로 수정하기
    token = "I am not cookie";

    data = {
        "userId": user.userId,
        "email": user.email,
        "nickname": user.nickname,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
        "deleted_at": user.deleted_at,
        "auth_token": token
    }

    jsonData = {
        "status" : 200, "message" : "login_success", "data" : {"user" : data}
    }
    res.json(jsonData);
});

// 회원가입
router.post('/signup', (req, res) => {
    const requestData = req.body;
    if(!requestData.email || !requestData.password || !requestData.nickname){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }
    let userData = loadData(userDataPath);
    let keyData = loadData(keyDataPath);

    userId = keyData.user_id + 1;

    const now = new Date();
    const localTimeString = now.toLocaleString();

    newUser = {
        "userId": userId,
        "email": requestData.email,
        "nickname": requestData.nickname,
        "password": requestData.password,
        "profile_image": requestData.profileImagePath || "/images/default.png",
        "created_at": localTimeString,
        "updated_at": localTimeString
    }

    userData.users.push(newUser);
    saveData(userData, userDataPath);

    keyData.user_id += 1;
    saveData(keyData, keyDataPath);

    jsonData = {
        "status" : 200, "message" : "register_success", "data" : null
    }
    res.json(jsonData);
});

// 로그아웃
router.post('/logout', (req, res) => {
    // const userData = loadData(userDataPath);
    // 로그아웃 처리
    jsonData = {
        "status" : 200, "message" : null, "data" : null
    }
    
    // 로그아웃 후 로그인 페이지로 리디렉션
    res.redirect('/login');
    
    // 로그아웃 응답
    res.json(jsonData);
});



// 유저 정보 조회
router.get('/:id', (req, res) => {
    const userData = loadData(userDataPath);
    const userId = req.params.id;
    let user = userData["users"].find(user => user.userId === parseInt(userId));

    delete user.password;

    jsonData = {
        "status" : 200, "message" : null, "data" : {"user" : user}
    }
    res.json(jsonData);
});

// 회원 정보 수정
router.patch('/:id', (req, res) => {
    const requestData = req.body;
    if(!requestData.nickname){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    const userData = loadData(userDataPath);
    const userId = req.params.id;
    const userIndex = userData["users"].findIndex(user => user.userId === parseInt(userId));
    
    const now = new Date();
    const localTimeString = now.toLocaleString();

    userData["users"][userIndex].nickname = requestData.nickname;
    userData["users"][userIndex].profile_image = requestData.profileImage || "/images/default.png";
    userData["users"][userIndex].updated_at = localTimeString;

    saveData(userData, userDataPath);

    jsonData = {
        "status" : 200, "message" : "update_user_data_success", "data" : null
    }
    res.json(jsonData);
});

// 비밀번호 변경
router.patch('/:id/password', (req, res) => {
    const requestData = req.body;
    if(!requestData.password){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    const userData = loadData(userDataPath);
    const userId = req.params.id;
    const userIndex = userData["users"].findIndex(user => user.userId === parseInt(userId));
    
    const now = new Date();
    const localTimeString = now.toLocaleString();

    userData["users"][userIndex].password = requestData.password;
    userData["users"][userIndex].updated_at = localTimeString;

    saveData(userData, userDataPath);

    jsonData = {
        "status" : 200, "message" : "update_user_password_success", "data" : null
    }
    res.json(jsonData);
});

// 회원 정보 삭제
router.delete('/:id', (req, res) => {
    const userData = loadData(userDataPath);
    const userId = req.params.id;
    const userIndex = userData["users"].findIndex(user => user.user_id === parseInt(userId));
    const removedItem = userData["users"].splice(userIndex, 1);
    saveData(userData, userDataPath);
    jsonData = {
        "status" : 200, "message" : "delete_user_data_success", "data" : null
    }
    res.json(jsonData);
});

// 로그인 상태 확인
router.get('/auth/check', (req, res) => {
    // 쿠키가 유효하다면, 세션 정보 넘겨주기
    const userData = loadData(userDataPath);
    const userId = req.params.id.find(user => user.userId === parseInt(userId));

    const userJson =  {
        "user_id": user.userId,
        "email" : user.email,
        "nickname" : user.nickname,
        "profile_image": user.profileImage,
        "auth_token": "I am not cookie",
        "auth_status" : True
    }

    jsonData = {
        "status" : 200, "message" : null, "data" : {"user":userJson}
    }
    res.json(jsonData);
});

// 이메일 중복 체크
router.get('/email/check', (req, res) => {
    const userData = loadData(userDataPath);
    const {email} = req.query;
    const user = userData["users"].find(user => user.email === email);
    if (user !== undefined){
        jsonData = {
            "status" : 400, "message" : "already_exist_email", "data" :null
        }
        res.json(jsonData);
        return;
    }
    console.log(user);
    jsonData = {
        "status" : 200, "message" : "available_email", "data" : null
    }
    res.json(jsonData);
});

// 닉네임 중복 체크
router.get('/nickname/check', (req, res) => {
    const userData = loadData(userDataPath);
    const {nickname} = req.query;
    const user = userData["users"].find(user => user.nickname === nickname);
    if (user !== undefined){
        jsonData = {
            "status" : 400, "message" : "already_exist_nickname", "data" :null
        }
        res.json(jsonData);
        return;
    }
    console.log(user);
    jsonData = {
        "status" : 200, "message" : "available_nickname", "data" : null
    }
    res.json(jsonData);
});


module.exports = router;