const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/') 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

const uploadMiddleware = upload.single('myFile');

const getImgUrl = (req, res) => {
    
    const filePath = req.file.path.replace('public', ''); // public 폴더 경로를 제거하고 상대적인 파일 경로 생성
    jsonData = {
        "status" : 201, "message" : "file_upload_success", "data" : {"file_path": filePath }
    }
    res.json(jsonData);
}

module.exports = {
    uploadMiddleware,
    getImgUrl
}