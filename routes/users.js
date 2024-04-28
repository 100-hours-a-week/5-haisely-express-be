
const express = require('express');
const fs = require('fs');

const router = express.Router();

const userDataPath = 'public/data/users.json';


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
router.post('/login', (req, res) => {
    const userData = loadData(userDataPath);

    jsonData = {
        "status" : 200, "message" : null, "data" : {"board" : board, "comments":comments}
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