const UploadImgController = require("../controllers/uploadImgController"); 
const {authenticateMiddleware} = require('../controllers/AuthUtils');

const express = require('express');
const router = express.Router();

router.use(UploadImgController.uploadMiddleware);

router.post('/', authenticateMiddleware, UploadImgController.getImgUrl);

module.exports = router;
