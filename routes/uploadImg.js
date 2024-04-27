const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({
    dest: 'uploads/'
});

const uploadMiddleware = upload.single('myFile');

router.use(uploadMiddleware);

router.post('/', (req, res) => {
    console.log(req.file);
    res.status(200).send('uploaded');
});

module.exports = router;