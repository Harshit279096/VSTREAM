import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, RefreshCcw } from 'lucide-react';
import VideoCard from '../components/VideoCard';
import UploadModal from '../components/UploadModal';
import VideoPlayer from '../components/VideoPlayer';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const { user } = useAuth();

    const fetchVideos = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/videos`, {
                params: { status: filterStatus, search: searchTerm }
            });
            setVideos(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchVideos();

        // Listen for real-time status updates
        const socket = io(SOCKET_URL);
        socket.emit('joinTenant', user.tenantId);

        socket.on('videoStatusUpdate', (updatedVideo) => {
            setVideos(prev => {
                const index = prev.findIndex(v => v._id === updatedVideo._id);
                if (index !== -1) {
                    const newVideos = [...prev];
                    newVideos[index] = updatedVideo;
                    return newVideos;
                }
                return [updatedVideo, ...prev];
            });
        });

        return () => socket.disconnect();
    }, [filterStatus, searchTerm]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1>Video Library</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and stream your content safely</p>
                </div>
                {user.role !== 'Viewer' && (
                    <button onClick={() => setIsUploadOpen(true)} className="btn btn-primary">
                        <Plus size={20} /> Upload New
                    </button>
                )}
            </div>

            <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" placeholder="Search videos..." style={{ paddingLeft: '3rem' }}
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Filter size={18} color="var(--text-muted)" />
                    <select style={{ width: '150px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Safe">Safe</option>
                        <option value="Flagged">Flagged</option>
                        <option value="Processing">Processing</option>
                    </select>
                </div>
                <button onClick={fetchVideos} className="btn btn-outline" style={{ padding: '0.75rem' }}>
                    <RefreshCcw size={18} />
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading videos...</div>
            ) : videos.length > 0 ? (
                <div className="video-grid">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} onClick={(v) => setPlayingVideo(v)} />
                    ))}
                </div>
            ) : (
                <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <h3 style={{ color: 'var(--text-muted)' }}>No videos found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Start by uploading your first video</p>
                </div>
            )}

            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={fetchVideos} />
            {playingVideo && <VideoPlayer video={playingVideo} onClose={() => setPlayingVideo(null)} />}
        </div>
    );
};

export default Dashboard;
