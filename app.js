// express 모듈을 불러옵니다.
const express = require('express');

// express 애플리케이션을 생성합니다.
const app = express();
// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static('public'));
// 웹 서버가 사용할 포트 번호를 정의합니다.
const port = 3001;

const boardRouter = require('./routes/boards');
app.use('/boards', boardRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});