const {makeRes} = require ('./controllerUtils.js');
const Boards = require('../models/Boards.js');
const Comments = require('../models/Comments.js');

const authenticateMiddleware = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json(makeRes(401, "required_authorization", null));
    }
    next(); 
};

const authorizeBoardMiddleware = (req, res, next) => {
    const boardId = req.params.id;
    const board = Boards.findBoardById(boardId);
    if (board.user_id !== req.session.user.user_id) {
        return res.status(403).json(makeRes(403, "required_permission", null));
    }
    next();
}

const authorizeCommentMiddleware = (req, res, next) => {
    const commentId = req.params.commentId;
    const comment = Comments.findCommentsByCommentId(commentId);
    if (comment.user_id !== req.session.user.user_id) {
        return res.status(403).json(makeRes(403, "required_permission", null));
    }
    next();
}

module.exports = {
    authenticateMiddleware,
    authorizeBoardMiddleware,
    authorizeCommentMiddleware
}
