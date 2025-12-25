import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Video, Shield, Settings, Trash2, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [stats, setStats] = useState({ users: 0, videos: 0, tenants: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        // In a real app, we'd have an admin-only stats endpoint
        // For this demo, we'll mock some admin data
        setStats({
            users: 124,
            videos: 450,
            tenants: 12
        });

        setRecentUsers([
            { id: 1, name: 'Alice Smith', email: 'alice@tenant1.com', role: 'Editor', tenant: 'Tenant Alpha' },
            { id: 2, name: 'Bob Johnson', email: 'bob@tenant2.com', role: 'Viewer', tenant: 'Tenant Beta' },
            { id: 3, name: 'Charlie Brown', email: 'charlie@admin.com', role: 'Admin', tenant: 'System' }
        ]);
    }, []);

    if (user.role !== 'Admin') {
        return <div className="glass-card" style={{ textAlign: 'center', padding: '5rem' }}>Access Denied. Admins Only.</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1>System Administration</h1>
                <p style={{ color: 'var(--text-muted)' }}>Universal control over users, organizations, and global settings</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)', padding: '1rem', borderRadius: '12px' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Users</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.users}</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(203, 163, 92, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                        <Video size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Videos</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.videos}</div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '12px' }}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Active Orgs</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.tenants}</div>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Recent User Management</h3>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem' }}>Export Audit Log</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <th style={{ padding: '1rem 1.5rem' }}>NAME</th>
                            <th style={{ padding: '1rem 1.5rem' }}>ROLE</th>
                            <th style={{ padding: '1rem 1.5rem' }}>ORGANIZATION</th>
                            <th style={{ padding: '1rem 1.5rem' }}>STATUS</th>
                            <th style={{ padding: '1rem 1.5rem' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentUsers.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>{u.role}</span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{u.tenant}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className="badge badge-safe">Active</span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)' }}><Settings size={14} /></button>
                                        <button className="btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
