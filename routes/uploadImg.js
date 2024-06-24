const UploadImgController = require("../controllers/uploadImgController"); 

const express = require('express');
const router = express.Router();

router.use(UploadImgController.uploadMiddleware);

router.post('/', UploadImgController.getImgUrl);

module.exports = router;
