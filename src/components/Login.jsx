import React, { useState } from 'react';
import { Leaf, Lock, User } from 'lucide-react';

import logo from '../assets/logo.png';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await onLogin(username, password);
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please use admin / admin123');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)'
        }}>
            <div className="premium-card" style={{ width: '400px', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    background: 'white',
                    padding: '0.5rem',
                    overflow: 'hidden'
                }}>
                    <img src={logo} alt="Zefveda Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>Zefveda Billing</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Please sign in to access admin panel</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                placeholder="admin"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="form-input"
                                style={{ paddingLeft: '2.5rem' }}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="admin123"
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                        Enter Admin Portal
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Secured Ayurvedic Hospital System v1.0
                </p>
            </div>
        </div>
    );
};

export default Login;
