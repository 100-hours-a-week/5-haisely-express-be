// express 모듈을 불러옵니다.
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

// express 애플리케이션을 생성합니다.
const app = express();
// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000'], 
    credentials: true  
}));
app.use(
    session({
        secret: 'yourSecretKey',
        saveUninitialized: true,
        resave: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 쿠키 유효 시간 (예: 1일)
            secure: false 
        },
    }),
);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json(makeRes(500, "internal_server_error", null));
});

// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3001;

const boardRouter = require('./routes/boards');
app.use('/boards', boardRouter)

const uploadRouter = require('./routes/uploadImg');
app.use('/uploadImg', uploadRouter)

const userRouter = require('./routes/users');
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});