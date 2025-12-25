import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { API_URL, SOCKET_URL } from '../config';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('');
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (isOpen) {
            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);
            newSocket.emit('joinTenant', user.tenantId);

            newSocket.on('videoProgress', (data) => {
                setProgress(data.progress);
                setStage(data.stage);
            });

            newSocket.on('videoStatusUpdate', (data) => {
                if (data.status === 'Safe' || data.status === 'Flagged') {
                    setStage('Processing Complete!');
                    setProgress(100);
                }
            });

            return () => newSocket.disconnect();
        }
    }, [isOpen, user.tenantId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a video');

        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);

        setUploading(true);
        setStage('Uploading file...');

        try {
            await axios.post(`${API_URL}/api/videos/upload`, formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });
            toast.success('Upload complete! Processing started.');
            onUploadSuccess();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Upload failed');
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card" style={{ maxWidth: '500px', width: '100%', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={24} />
                </button>

                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Upload size={24} color="var(--primary)" /> Upload Video
                </h2>

                {!uploading ? (
                    <form onSubmit={handleUpload}>
                        <div className="input-group">
                            <label>Video File (MP4/MOV)</label>
                            <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} required />
                        </div>
                        <div className="input-group">
                            <label>Title</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Cool video title" />
                        </div>
                        <div className="input-group">
                            <label>Description</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" placeholder="What's this video about?"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Start Upload
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ marginBottom: '1.5rem', position: 'relative', height: '8px', background: 'var(--bg-dark)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>{progress}%</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {progress < 100 ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} color="var(--success)" />}
                            {stage}
                        </p>
                        {progress === 100 && (
                            <button onClick={onClose} className="btn btn-outline" style={{ marginTop: '2rem' }}>Close & View Library</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadModal;
