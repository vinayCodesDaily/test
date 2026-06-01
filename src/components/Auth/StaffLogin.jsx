import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const StaffLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error || 'Authentication failed. Please check credentials.');
        }
        
        setLoading(false);
    };

    const handleQuickLogin = async (roleType) => {
        let selectedEmail = 'admin@travel.com';
        if (roleType === 'manager') selectedEmail = 'manager@travel.com';
        else if (roleType === 'consultant') selectedEmail = 'consultant@travel.com';

        setEmail(selectedEmail);
        setPassword('password');
        setLoading(true);
        setError('');

        const result = await login(selectedEmail, 'password');
        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <div className="auth-form-box">
                    <div>
                        <span className="badge badge-danger" style={{ marginBottom: '12px' }}>Authorized Personnel Only</span>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Staff Portal</h1>
                        <p>Sign in with your corporate credentials to access the management dashboard.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="form-group">
                            <label className="form-label">Corporate Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@voyageway.com"
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="form-control"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '12px', height: '48px', background: 'var(--text-main)', color: 'var(--bg-app)' }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In to Portal'}
                        </button>
                    </form>

                    {/* Developer helper panel for Staff */}
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px dashed var(--border-color)',
                        backgroundColor: 'var(--bg-sidebar)'
                    }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                            ⚡ Dev Quick Roles (Staff)
                        </span>
                        <div className="auth-quick-roles">
                            <button type="button" onClick={() => handleQuickLogin('consultant')} className="quick-role-btn">💼 Consultant</button>
                            <button type="button" onClick={() => handleQuickLogin('manager')} className="quick-role-btn">📋 Manager</button>
                            <button type="button" onClick={() => handleQuickLogin('admin')} className="quick-role-btn">👑 Super Admin</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-banner" style={{
                background: 'linear-gradient(135deg, hsla(240, 80%, 15%, 0.9) 0%, hsla(260, 80%, 15%, 0.9) 100%), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div>
                    <h2 className="auth-banner-title">VoyageWay Operations Center</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', maxWidth: '480px' }}>
                        Manage platform analytics, monitor booking lifecycles, and assist travelers from our unified backend workspace.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaffLogin;
