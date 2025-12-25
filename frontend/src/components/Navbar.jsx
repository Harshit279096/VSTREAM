import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, LogOut, User, LayoutDashboard, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav style={{ background: 'var(--glass-bg)', borderBottom: '1px solid var(--glass-border)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
                        <Video size={20} color="var(--bg-dark)" />
                    </div>
                    VSTREAM
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/dashboard" style={{ color: 'var(--text-main)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>

                    {user.role === 'Admin' && (
                        <Link to="/admin" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                            <Shield size={18} /> Admin
                        </Link>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--glass-border)' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.role} @ {user.tenantName || 'Org'}</div>
                        </div>
                        <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
