const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String
    },
    status: {
        type: String,
        enum: ['Uploading', 'Processing', 'Safe', 'Flagged', 'Error'],
        default: 'Uploading'
    },
    processingProgress: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number
    },
    size: {
        type: Number
    },
    mimetype: {
        type: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
