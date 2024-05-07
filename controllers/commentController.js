// CHECKLIST
// [ ] 요청에 사용자 확인 과정 필요
// [x] 댓글 삭제도 해야함

const {loadData, saveData} = require ('./controllerUtils.js');

const boardDataPath = 'public/data/boards.json';
const commentDataPath = 'public/data/comments.json';
const keyDataPath = 'public/data/keys.json';

/* Utils */
const findCommentsByPostId = (id) => {
    const commentData = loadData(commentDataPath);
    return commentData["comments"].filter(item => item.post_id === parseInt(id));
}

const deleteCommentsByPostId = (id) => {
    let commentData = loadData(commentDataPath);
    // delete comments in post
    const comments = commentData["comments"].filter(item => item.post_id === parseInt(id));
    comments.forEach(comment => {
        const commentIndex = commentData["comments"].findIndex(item => item.comment_id === comment.comment_id);
        commentData["comments"].splice(commentIndex, 1);
    });
    saveData(commentData, commentDataPath);
}


/* Controller */
const postComment = (req, res) =>{
    const requestData = req.body;
    const boardId = req.params.id;
    if(!requestData.commentContent){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    let commentData = loadData(commentDataPath);
    let keyData = loadData(keyDataPath);

    // user 정보 처리 추가 필요

    commentId = keyData.comment_id + 1;

    const now = new Date();
    const localTimeString = now.toLocaleString();

    const newData =  {
        "comment_id": commentId,
        "comment_content": requestData.commentContent,
        "post_id": parseInt(boardId),
        "user_id": 1,  // 수정
        "nickname": "테스트",  // 수정
        "created_at": localTimeString,
        "updated_at": localTimeString,
        "deleted_at": null,
        "file_id": 1,
        "profile_image_path": "/images/default.png"  // 수정
    }
    commentData.comments.push(newData);
    saveData(commentData, commentDataPath);

    keyData.comment_id += 1;
    saveData(keyData, keyDataPath);
    jsonData = {
        "status" : 201, "message" : "write_comment_success", "data" : null
    }
    res.json(jsonData);
}

const patchComment = (req, res) =>{
    const requestData = req.body;
    if(!requestData.commentContent){
        console.log("데이터 미포함 요청");
        jsonData = {
            "status" : 400, "message" : "invalid", "data" :null
        }
        res.json(jsonData);
        return;
    }

    const commentData = loadData(commentDataPath);
    const commentId = req.params.commentId;
    const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(commentId));

    const now = new Date();
    const localTimeString = now.toLocaleString();

    commentData["comments"][commentIndex].comment_content = requestData.commentContent;
    commentData["comments"][commentIndex].updated_at = localTimeString;

    saveData(commentData, commentDataPath);
    jsonData = {
        "status" : 200, "message" : "update_post_success", "data" :  null
    }
    res.json(jsonData);

}

const deleteComment = (req, res) =>{
    const commentData = loadData(commentDataPath);
    const commentId = req.params.commentId;
    const commentIndex = commentData["comments"].findIndex(comment => comment.comment_id === parseInt(commentId));
    const removedItem = commentData["comments"].splice(commentIndex, 1);
    saveData(commentData, commentDataPath);
    jsonData = {
        "status" : 200, "message" : "delete_post_success", "data" : null
    }
    res.json(jsonData);
}

module.exports = {
    postComment,
    patchComment,
    deleteComment,
    findCommentsByPostId,
    deleteCommentsByPostId
}