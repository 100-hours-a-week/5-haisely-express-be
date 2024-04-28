
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const router = express.Router();

const secretKey = process.env.SECRET_KEY;

const userDataPath = 'public/data/users.json';
const blacklist = new Set();

// JWT 검증 미들웨어
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        jwt.verify(req.token, secretKey, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

// 블랙 리스트 미들웨어
function blacklistMiddleware(req, res, next) {
    if (blacklist.has(req.token)) {
        res.status(401).json({ message: 'Token has been blacklisted' });
    } else {
        next();
    }
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
    if(!requestData.email || !requestData.password){
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

    const userJson = {
        id: user.userId,
        nickname: user.nickname,
        profileImage : user.profile_image
    };

    // JWT 생성
    const token = jwt.sign(userJson, secretKey, { expiresIn: '1h' });

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
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 로그아웃


// 유저 정보 조회
router.get('/:id', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 회원 정보 수정
router.patch('/:id', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 비밀번호 변경
router.patch('/:id/password', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 회원 정보 삭제
router.delete('/:id', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 로그인 상태 확인하기
router.get('/auth/check', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 이메일 중복 체크
router.get('/email/check', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});

// 닉네임 중복 체크
router.get('/nickname/check', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
    }
    res.json(jsonData);
});


module.exports = router;