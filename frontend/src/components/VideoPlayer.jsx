import React, { useRef, useEffect, useState } from 'react';
import { X, Maximize, Play, Pause, Volume2, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const VideoPlayer = ({ video, onClose }) => {
    const { token } = useAuth();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [video]);

    const togglePlay = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', zIndex: 10 }}>
                <X size={24} />
            </button>

            <div className="glass-card" style={{ padding: '0', width: '90%', maxWidth: '1000px', aspectSatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                <video
                    ref={videoRef}
                    style={{ width: '100%', display: 'block' }}
                    onTimeUpdate={handleTimeUpdate}
                    src={`${API_URL}/api/videos/stream/${video._id}?token=${token}`}
                    crossOrigin="anonymous"
                    preload="auto"
                />

                {/* Custom Controls Layer */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', cursor: 'pointer', position: 'relative' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', width: `${(currentTime / duration) * 100}%`, borderRadius: '2px' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <button onClick={togglePlay} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>
                                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                            </button>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                            <Volume2 size={20} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <Settings size={20} />
                            <Maximize size={20} onClick={() => videoRef.current.requestFullscreen()} style={{ cursor: 'pointer' }} />
                        </div>
                    </div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg-card)' }}>
                    <h2 style={{ marginBottom: '0.5rem' }}>{video.title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{video.description}</p>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
