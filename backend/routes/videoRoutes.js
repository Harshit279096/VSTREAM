const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, authorize } = require('../middleware/auth');
const { uploadVideo, getVideos, streamVideo } = require('../controllers/videoController');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.mp4' && ext !== '.mov' && ext !== '.avi') {
            return cb(new Error('Only videos are allowed'));
        }
        cb(null, true);
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

router.post('/upload', auth, authorize('Admin', 'Editor'), upload.single('video'), uploadVideo);
router.get('/', auth, getVideos);
router.get('/stream/:id', auth, streamVideo);

module.exports = router;
