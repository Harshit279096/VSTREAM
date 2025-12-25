import React from 'react';
import { Play, FileText, Info, Shield, ShieldAlert, Cpu, Loader2 } from 'lucide-react';

const VideoCard = ({ video, onClick }) => {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Safe': return <span className="badge badge-safe"><Shield size={12} style={{ marginRight: '4px' }} /> Safe</span>;
            case 'Flagged': return <span className="badge badge-flagged"><ShieldAlert size={12} style={{ marginRight: '4px' }} /> Flagged</span>;
            case 'Processing': return <span className="badge badge-processing"><Cpu size={12} style={{ marginRight: '4px' }} /> Processing ({video.processingProgress}%)</span>;
            default: return <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>{status}</span>;
        }
    };

    return (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease', position: 'relative' }}
            onClick={() => video.status === 'Safe' ? onClick(video) : null}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>

            <div style={{ height: '180px', background: `url(${video.thumbnail || 'https://via.placeholder.com/800x450?text=Processing...'}) center/cover no-repeat`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}></div>
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 2 }}>
                    {getStatusBadge(video.status)}
                </div>
                {video.status === 'Safe' ? (
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 0 15px rgba(203,163,92,0.5)' }}>
                        <Play size={20} color="var(--bg-dark)" fill="var(--bg-dark)" />
                    </div>
                ) : (
                    <div style={{ zIndex: 2 }}>
                        {video.status === 'Processing' ? <Loader2 className="animate-spin" size={30} color="var(--primary)" /> : <ShieldAlert size={40} color="var(--error)" />}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', height: '40px', overflow: 'hidden', marginBottom: '1rem' }}>{video.description || 'No description provided'}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <FileText size={12} /> {(video.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {video.status === 'Flagged' && (
                <div style={{ background: 'var(--error)', padding: '0.5rem', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                    CONTENT RESTRICTED
                </div>
            )}
        </div>
    );
};

export default VideoCard;
