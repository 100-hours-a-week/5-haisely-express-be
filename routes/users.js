const express = require('express');
const userController = require('../controllers/userController');
const {authenticateMiddleware} = require('../controllers/AuthenticationUtils');

const router = express.Router();

// 로그인
router.post('/login', userController.login);

// 회원가입
router.post('/signup', userController.signUp);

// 로그아웃
router.post('/logout', authenticateMiddleware, userController.logout);

// 회원 정보 조회
router.get('/:id', authenticateMiddleware, userController.getUserById);

// 회원 정보 수정
router.patch('/:id', authenticateMiddleware, userController.patchUser);

// 비밀번호 변경
router.patch('/:id/password', authenticateMiddleware, userController.patchPassword);

// 회원 정보 삭제
router.delete('/:id', authenticateMiddleware, userController.deleteUser);

// 로그인 상태 확인
router.get('/auth/check', authenticateMiddleware, userController.authCheck);

// 이메일 중복 체크
router.get('/email/check', userController.emailCheck);

// 닉네임 중복 체크
router.get('/nickname/check', userController.nicknameCheck);

module.exports = router;