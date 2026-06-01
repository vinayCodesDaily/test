import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--bg-card)',
            borderTop: '1px solid var(--border-color)',
            padding: '60px 24px 24px',
            marginTop: 'auto'
        }}>
            <div style={{
                maxWidth: '1200px', margin: '0 auto',
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--border-color)'
            }}>

                {/* Brand */}
                <div>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '16px' }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
                            <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 1 0-3-3L13 8 4.8 6.2a1 1 0 0 0-1.2 1.2L6 10l-3.5 3.5a1 1 0 0 0 0 1.4l.7.7a1 1 0 0 0 1.4 0L8 12l2.2 2.2-1.8 7.2a1 1 0 0 0 1.2 1.2L15 21l3.5 3.5a1 1 0 0 0 1.4 0l.7-.7a1 1 0 0 0 0-1.4L17 19z"/>
                        </svg>
                        <span style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--heading)', color: 'var(--text-main)' }}>VoyageWay</span>
                    </Link>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px' }}>
                        Your ultimate travel partner since 2018. Expert-curated tours, 12,000+ happy travelers,
                        and 24/7 itinerary support — all in one place.
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                            <a key={i} href="#" style={{
                                fontSize: '18px', width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '10px', background: 'var(--border-color)',
                                textDecoration: 'none', transition: 'background 0.2s'
                            }}>{icon}</a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: '700' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { label: 'Home', to: '/' },
                            { label: 'Packages', to: '/packages' },
                            { label: 'Destinations', to: '/destinations' },
                            { label: 'Trip Types', to: '/trip-types' },
                            { label: 'About Us', href: '/#about' },
                            { label: 'Travel Blogs', href: '/#blogs' },
                        ].map((link, i) => (
                            <li key={i}>
                                {link.to ? (
                                    <Link to={link.to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                                        → {link.label}
                                    </Link>
                                ) : (
                                    <a href={link.href} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                                        → {link.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Popular Tours */}
                <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: '700' }}>Popular Tours</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            'Kashmir Paradise Tour',
                            'Goa Coastal Escapade',
                            'Kerala Backwaters & Hills',
                            'Leh Ladakh Highway',
                            'Rajasthan Desert Safari',
                        ].map((tour, i) => (
                            <li key={i}>
                                <Link to="/packages" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}>
                                    → {tour}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '20px', color: 'var(--text-main)', fontWeight: '700' }}>Contact Us</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <span>📍</span>
                            <span>VoyageWay Travel Pvt. Ltd.<br />42 Marina Tower, Marine Lines,<br />Mumbai, MH 400002</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <span>📞</span>
                            <span>+91 98765 43210</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <span>✉️</span>
                            <span>hello@voyageway.com</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px' }}>
                            <span>🕘</span>
                            <span>Mon–Sat, 9:00 AM – 7:00 PM</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div style={{
                maxWidth: '1200px', margin: '0 auto', paddingTop: '24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '12px'
            }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    &copy; {new Date().getFullYear()} VoyageWay Travel Pvt. Ltd. All rights reserved.
                </span>
                <div style={{ display: 'flex', gap: '20px' }}>
                    {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((item, i) => (
                        <a key={i} href="#" style={{ color: 'var(--text-muted)', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s' }}>
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
