import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const result = await register({ name, email, password, password_confirmation: confirmPassword });

        if (result.success) {
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } else {
            setError(result.error || 'Registration failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-form-container">
                <div className="auth-form-box">
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Create Account</h1>
                        <p>Sign up to start planning your dream vacation today.</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>🎉 {success}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                className="form-control"
                                required
                            />
                        </div>

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

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '12px' }}>
                        <p style={{ fontSize: '14px' }}>
                            Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Login here</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="auth-banner">
                <div>
                    <h2 className="auth-banner-title">Adventure Awaits.</h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', maxWidth: '480px' }}>
                        Join VoyageWay to discover amazing guided tours, custom-crafted itineraries, and instant bookings with support from expert consultants.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
