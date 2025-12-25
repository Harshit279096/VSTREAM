import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Editor',
        tenantName: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem 0' }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <UserPlus color="var(--bg-dark)" size={24} />
                    </div>
                    <h1>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join your organization</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required placeholder="John Doe" />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required placeholder="john@example.com" />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required placeholder="••••••••" />
                    </div>
                    <div className="input-group">
                        <label>Organization Name</label>
                        <input type="text" value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })} required placeholder="Acme Corp" />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option value="Editor">Editor (Upload + Manage)</option>
                            <option value="Viewer">Viewer (Read-only)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Register
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
