const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const Video = require('../models/Video');

exports.processVideo = async (video, io) => {
    try {
        const tenantRoom = video.tenantId.toString();

        // Update status to Processing
        video.status = 'Processing';
        video.processingProgress = 0;
        await video.save();
        io.to(tenantRoom).emit('videoStatusUpdate', video);

        // Simulation of processing stages
        const stages = [
            { name: 'Analyzing metadata', progress: 20 },
            { name: 'Generating AI Thumbnail', progress: 40 },
            { name: 'Running sensitivity analysis', progress: 70 },
            { name: 'Finalizing', progress: 100 }
        ];

        for (const stage of stages) {
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (stage.name === 'Generating AI Thumbnail') {
                // Use Pollination.ai to generate a thumbnail based on title
                const prompt = encodeURIComponent(`Cinematic trailer still for ${video.title}, high resolution, dramatic lighting, professional cinematography`);
                const seed = Math.floor(Math.random() * 1000000);
                video.thumbnail = `https://pollinations.ai/p/${prompt}?width=800&height=450&seed=${seed}&model=flux&nologo=true`;
            }

            video.processingProgress = stage.progress;
            await video.save();
            io.to(tenantRoom).emit('videoProgress', {
                videoId: video._id,
                progress: stage.progress,
                stage: stage.name
            });
        }

        // Finalize state
        io.to(tenantRoom).emit('videoProgress', {
            videoId: video._id,
            progress: 100,
            stage: 'System scan complete'
        });

        // Simulated Sensitivity Analysis Result
        const isFlagged = video.title.toLowerCase().includes('flag') || video.title.toLowerCase().includes('sensitive');
        video.status = isFlagged ? 'Flagged' : 'Safe';

        // If flagged, change the thumbnail to an AI-generated warning
        if (isFlagged) {
            const warningPrompt = encodeURIComponent("Abstract digital art, caution symbol, restricted content, red and black aesthetics, glitch effect");
            video.thumbnail = `https://pollinations.ai/p/${warningPrompt}?width=800&height=450&seed=666&nologo=true`;
        }
        await video.save();
        io.to(tenantRoom).emit('videoStatusUpdate', video);

        console.log(`Video ${video._id} processed. Status: ${video.status}`);
    } catch (error) {
        console.error('Video processing error:', error);
        video.status = 'Error';
        await video.save();
        io.to(video.tenantId.toString()).emit('videoStatusUpdate', video);
    }
};
