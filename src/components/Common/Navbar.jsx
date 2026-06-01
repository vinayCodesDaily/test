import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const scrollToSection = (id) => {
        setMobileOpen(false);
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                </svg>
                <span>
                    <img className="logo-img"
                        src="https://sgholidaysresorts.com/wp-content/uploads/2022/03/SGA-Trasparent-logo.webp"
                        alt="SGA Transparent logo"
                        width="80"
                        height="100"
                        loading="lazy"
                    />
                </span>
            </Link>

            {/* Hamburger */}
            <button
                className="nav-hamburger"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
            >
                <span /><span /><span />
            </button>

            <div className={`nav-links${mobileOpen ? ' nav-links--open' : ''}`}>
                <NavLink to="/" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                    Home
                </NavLink>
                <NavLink to="/packages" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Packages
                </NavLink>
                <NavLink to="/destinations" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Destinations
                </NavLink>
                <NavLink to="/trip-types" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    Trip Types
                </NavLink>
                <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500', fontSize: '15px' }} onClick={() => { setMobileOpen(false); navigate('/blogs'); }}>
                    Blogs
                </button>
                <button className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '500', fontSize: '15px' }} onClick={() => { setMobileOpen(false); navigate('/about'); }}>
                    About Us
                </button>

                {isAuthenticated ? (
                    <>
                        <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/profile" onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            Profile
                        </NavLink>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
                            <span className="badge badge-info" style={{ fontSize: '11px', fontWeight: '700' }}>
                                {user?.role?.name}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                                {user?.name?.split(' ')[0]}
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                            Login
                        </Link>
                        <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '14px', boxShadow: 'none' }}>
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
