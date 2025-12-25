const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { processVideo } = require('../services/videoService');

exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const { title, description } = req.body;

        const video = await Video.create({
            title,
            description,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            ownerId: req.user._id,
            tenantId: req.user.tenantId,
            status: 'Uploading',
            processingProgress: 0
        });

        // Trigger background processing
        const io = req.app.get('socketio');
        processVideo(video, io);

        res.status(201).json(video);
    } catch (error) {
        console.error('SERVER ERROR DURING UPLOAD:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getVideos = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = { tenantId: req.user.tenantId };

        if (status) query.status = status;
        if (search) query.title = { $regex: search, $options: 'i' };

        const videos = await Video.find(query).sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).send('Video not found');

        // Check if user belongs to same tenant
        if (video.tenantId.toString() !== req.user.tenantId.toString()) {
            return res.status(403).send('Unauthorized');
        }

        const videoPath = path.resolve(video.path);
        if (!fs.existsSync(videoPath)) {
            console.error(`Streaming Error: File not found at ${videoPath}`);
            return res.status(404).send('File not found on disk');
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;
        const contentType = video.mimetype || 'video/mp4';

        console.log(`Streaming Request: ${video.title} (${contentType}), Range: ${range}`);

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize) {
                res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                return;
            }

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': contentType,
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('CRITICAL STREAMING ERROR:', error);
        res.status(500).send(error.message);
    }
};
