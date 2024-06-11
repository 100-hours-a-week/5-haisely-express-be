
// TODO
// [ ] 인증 인가 다시 적어두기


const boardController = require('../controllers/boardController');
const commentController = require('../controllers/commentController');
const {authenticateMiddleware, authorizeBoardMiddleware, authorizeCommentMiddleware} = require('../controllers/AuthUtils');

const express = require('express');

const router = express.Router();

// 게시글 목록 조회
// router.get('/',  authenticateMiddleware, boardController.getBoards);
router.get('/',  boardController.getBoards);

// 게시글 상세 조회 + 댓글 목록 조회
// router.get('/:id', authenticateMiddleware, boardController.getBoardDetail);
router.get('/:id', boardController.getBoardDetail);

// 게시글 추가 "/"
// router.post("/", authenticateMiddleware, boardController.postBoard);
router.post("/", boardController.postBoard);

// 게시글 수정 "/:id"
// router.patch("/:id", authenticateMiddleware, authorizeBoardMiddleware, boardController.patchBoard);
router.patch("/:id", boardController.patchBoard);

// 게시글 삭제 "/:id"
// router.delete("/:id", authenticateMiddleware, authorizeBoardMiddleware, boardController.deleteBoard);
router.delete("/:id", boardController.deleteBoard);


// 댓글 추가 "/:id/comments"
// router.post("/:id/comments", authenticateMiddleware, commentController.postComment);
router.post("/:id/comments", commentController.postComment);

// 댓글 수정 "/{post_id}/comments/{comment_id}" *
router.patch("/:postId/comments/:commentId", authenticateMiddleware, authorizeCommentMiddleware, commentController.patchComment);

// 댓글 삭제 "/{post_id}/comments/{comment_id}" *
router.delete("/:postId/comments/:commentId", authenticateMiddleware, authorizeCommentMiddleware, commentController.deleteComment);

module.exports = router;