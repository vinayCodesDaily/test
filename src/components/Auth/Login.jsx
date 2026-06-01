import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Login = () => {
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

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <div className="auth-form-box">
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome back</h1>
                        <p>Sign in to manage bookings, consult clients or plan tours.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
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
                            style={{ width: '100%', marginTop: '12px', height: '48px' }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <p style={{ fontSize: '14px' }}>
                            Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register here</Link>
                        </p>
                    </div>


                </div>
            </div>

            <div className="auth-banner">
                <div>
                    <h2 className="auth-banner-title">Collect Moments, Not Things.</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', maxWidth: '480px' }}>
                        VoyageWay allows you to craft itineraries, secure flights, book deluxe hotels, and organize unforgettable travel experiences from one clean workspace.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
