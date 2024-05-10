const boardController = require('../controllers/boardController');
const commentController = require('../controllers/commentController');
const {authenticateMiddleware} = require('../controllers/AuthenticationUtils');

const express = require('express');

const router = express.Router();

// 게시글 목록 조회
router.get('/',  authenticateMiddleware, boardController.getBoards);

// 게시글 상세 조회 + 댓글 목록 조회
router.get('/:id', boardController.getBoardDetail);

// 게시글 추가 "/"
router.post("/", boardController.postBoard);

// 게시글 수정 "/:id"
router.patch("/:id", boardController.patchBoard);

// 게시글 삭제 "/:id"
router.delete("/:id", boardController.deleteBoard);

// 댓글 추가 "/:id/comments"
router.post("/:id/comments", commentController.postComment);

// 댓글 수정 "/{post_id}/comments/{comment_id}" *
router.patch("/:postId/comments/:commentId", commentController.patchComment);

// 댓글 삭제 "/{post_id}/comments/{comment_id}" *
router.delete("/:postId/comments/:commentId", commentController.deleteComment);

module.exports = router;