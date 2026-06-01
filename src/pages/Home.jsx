import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cmsAPI } from '../api/endpoints/cms';
import { packagesAPI } from '../api/endpoints/packages';
import Loading from '../components/Common/Loading';

// ─────────────────────────────────────────────────────────────────────────────
// Static content extracted & enriched from the previous website's data
// ─────────────────────────────────────────────────────────────────────────────

// We will fetch featured packages from the backend.

const SEASONAL_TRIPS = [
    {
        month: 'Jun – Aug', label: 'Monsoon Magic', name: 'Coorg & Wayanad',
        img: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=600&q=80',
        price: '₹18,999', badge: '🌧️ Monsoon',
        desc: 'Lush green valleys, misty coffee estates and roaring waterfalls.',
    },
    {
        month: 'Sep – Nov', label: 'Autumn Escapes', name: 'Rajasthan Desert',
        img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
        price: '₹24,999', badge: '🏜️ Autumn',
        desc: 'Golden dunes, regal palaces and vibrant folk culture of the Thar.',
    },
    {
        month: 'Dec – Feb', label: 'Winter Wonders', name: 'Himachal Snow Trek',
        img: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=600&q=80',
        price: '₹32,999', badge: '❄️ Winter',
        desc: 'Snowcapped peaks, frozen lakes and thrilling alpine trails.',
    },
    {
        month: 'Mar – May', label: 'Spring Bloom', name: 'Kashmir Valley',
        img: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=600&q=80',
        price: '₹27,499', badge: '🌸 Spring',
        desc: 'Blooming tulip gardens, Dal Lake boat rides and crisp mountain air.',
    },
];

const GALLERY = [
    { src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', alt: 'Goa Beach', span: 'wide' },
    { src: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=400&q=80', alt: 'Leh Ladakh' },
    { src: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80', alt: 'Kerala Backwaters' },
    { src: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80', alt: 'Rajasthan Dunes' },
    { src: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&w=800&q=80', alt: 'Coorg Monsoon', span: 'wide' },
    { src: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=400&q=80', alt: 'Kashmir Valley' },
];

// Default blogs (from previous site mock data) — used as fallback when API is empty
const DEFAULT_BLOGS = [
    {
        id: 1,
        title: 'Top 5 Hidden Gems in Kashmir You Must Visit',
        summary: 'Beyond Srinagar and Gulmarg lie untouched valleys that will steal your heart. Discover Gurez, Lolab, and more.',
        image_url: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=600&q=80',
        published_at: 'May 15, 2026',
        author: 'Saniya Mir',
        tag: 'Offbeat Travel',
    },
    {
        id: 2,
        title: "A Local's Guide to Goa Beyond Beaches",
        summary: 'Explore spice plantations, Portuguese heritage homes, and gorgeous waterfalls in the Western Ghats.',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        published_at: 'May 22, 2026',
        author: "Joy D'Souza",
        tag: 'Culture',
    },
    {
        id: 3,
        title: 'A Beginner\'s Complete Guide to Leh–Ladakh',
        summary: 'Everything you need — permits, altitude sickness tips, best routes and when to go — for your first high-altitude adventure.',
        image_url: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=600&q=80',
        published_at: 'Jan 5, 2025',
        author: 'Sneha Patel',
        tag: 'Trekking',
    },
];

// Default testimonials (from previous site mock data)
const DEFAULT_TESTIMONIALS = [
    {
        id: 1, name: 'Suresh Raina', rating: 5,
        feedback: 'Our family tour to Kashmir was organized flawlessly. The houseboat stay and the vehicle provided were top-notch. Highly recommended!',
    },
    {
        id: 2, name: 'Meera Nair', rating: 5,
        feedback: 'The Kerala Backwaters package was an absolute dream. Everything from Munnar tea plantations to the Alleppey houseboat was well-curated.',
    },
    {
        id: 3, name: 'Anjali Desai', rating: 5,
        feedback: 'We booked a honeymoon package to Kashmir and it was beyond perfect. The team handled every detail. VoyageWay is absolutely world-class!',
    },
    {
        id: 4, name: 'Vikram Malhotra', rating: 4,
        feedback: 'Organized a corporate retreat for 25 people to Goa. Seamless coordination from booking to return. Will definitely book again.',
    },
];

const POPULAR_DESTINATIONS = [
    { name: 'Srinagar', img: 'https://images.unsplash.com/photo-1566837497312-7be4743b5a03?auto=format&fit=crop&w=300&q=80', desc: 'Heavenly Dal Lake', count: '12 Tours' },
    { name: 'Kerala', img: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=300&q=80', desc: 'Serene Backwaters', count: '9 Tours' },
    { name: 'Goa', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80', desc: 'Sunny Sandy Beaches', count: '15 Tours' },
    { name: 'Leh Ladakh', img: 'https://images.unsplash.com/photo-1544161513-0179fe746fd5?auto=format&fit=crop&w=300&q=80', desc: 'High Altitude Roads', count: '8 Tours' },
];

const TEAM = [
    { name: 'Priya Patel', role: 'Co-founder & CEO', emoji: '👩‍✈️' },
    { name: 'Arjun Mehta', role: 'Head of Operations', emoji: '🧑‍💼' },
    { name: 'Sneha Patel', role: 'Lead Travel Consultant', emoji: '👩‍🌏' },
    { name: 'Amit Kumar', role: 'Senior Consultant', emoji: '🧑‍💻' },
];

// ─────────────────────────────────────────────────────────────────────────────

export const Home = () => {
    const navigate = useNavigate();
    const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
    const [blogs, setBlogs] = useState(DEFAULT_BLOGS);
    const [featuredPackages, setFeaturedPackages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Contact form
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMsg, setContactMsg] = useState('');
    const [contactSuccess, setContactSuccess] = useState('');

    const fetchCMSData = useCallback(async () => {
        try {
            setLoading(true);
            const [testRes, blogRes, pkgRes] = await Promise.all([
                cmsAPI.getTestimonials(),
                cmsAPI.getBlogs(),
                packagesAPI.getAll({ per_page: 4 }), // Fetch top 4 packages
            ]);
            if (testRes.data.success && testRes.data.data.length > 0) setTestimonials(testRes.data.data);
            if (blogRes.data.success && blogRes.data.data.length > 0) setBlogs(blogRes.data.data);
            if (pkgRes.data.success && pkgRes.data.data.length > 0) setFeaturedPackages(pkgRes.data.data);
        } catch {
            // silently keep defaults
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCMSData(); }, [fetchCMSData]);

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await cmsAPI.submitContact({ name: contactName, email: contactEmail, message: contactMsg });
            if (res.data.success) {
                setContactSuccess('Thank you! Your message has been received.');
                setContactName(''); setContactEmail(''); setContactMsg('');
            }
        } catch {
            alert('Failed to send contact message.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', paddingBottom: '80px' }}>

            {/* ── HERO ── */}
            <header className="hero-section">
                <div style={{
                    position: 'absolute', top: '-50%', right: '-20%', width: '600px', height: '600px',
                    borderRadius: '50%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
                    zIndex: 0, pointerEvents: 'none'
                }} />
                <h1 className="hero-title">Plan Your Next Unforgettable Journey</h1>
                <p className="hero-subtitle">
                    Expert-curated tours, premium hotels, custom itineraries — backed by 24/7 travel support
                    and trusted by 12,000+ happy travelers across India.
                </p>
                <div style={{ display: 'flex', gap: '16px', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/packages')} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                        ✈️ Explore Tour Packages
                    </button>
                    <a href="#contact" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px' }}>
                        💬 Send an Inquiry
                    </a>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', marginTop: '40px', zIndex: 1 }}>
                    {[
                        { val: '4.8★', label: 'Customer Rating', color: 'var(--primary)' },
                        { val: '12k+', label: 'Happy Travelers', color: 'var(--secondary)' },
                        { val: '200+', label: 'Destinations', color: 'var(--primary)' },
                        { val: '24/7', label: 'Travel Support', color: 'var(--secondary)' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                            border: '1px solid var(--glass-border)', padding: '16px 28px',
                            borderRadius: '16px', boxShadow: 'var(--shadow-sm)', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: s.color, fontFamily: 'var(--heading)' }}>{s.val}</div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* ── POPULAR DESTINATIONS ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Popular Travel Destinations</h2>
                    <p>Unlock absolute beauty at hand-crafted travel spots.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                    {POPULAR_DESTINATIONS.map((d, i) => (
                        <div key={i} className="card" style={{ overflow: 'hidden', height: '280px', position: 'relative', cursor: 'pointer' }}
                            onClick={() => navigate('/destinations')}>
                            <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)', color: 'white'
                            }}>
                                <h4 style={{ color: 'white', fontSize: '18px', fontWeight: '700' }}>{d.name}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>{d.desc}</span>
                                    <span style={{
                                        background: 'var(--primary)', color: 'white', fontSize: '10px',
                                        fontWeight: '700', padding: '3px 8px', borderRadius: '20px'
                                    }}>{d.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURED PACKAGES ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px',
                        background: 'var(--primary-glow)', color: 'var(--primary)',
                        fontSize: '13px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px'
                    }}>🎒 TOUR PACKAGES</span>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Our Signature Packages</h2>
                    <p>Handcrafted itineraries for every traveler — from first-timers to seasoned explorers.</p>
                </div>
                <div className="grid-cols-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {featuredPackages.map((pkg) => (
                        <div key={pkg.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/packages/${pkg.id}`)}>
                            <div className="card-img-wrapper" style={{ height: '200px' }}>
                                <img src={pkg.image_url || pkg.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80'} alt={pkg.name} className="card-img" />
                            </div>
                            <div className="card-body">
                                <h3 className="card-title">{pkg.name}</h3>
                                <p style={{ fontSize: '13px' }}>{pkg.description}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                    {pkg.trip_types?.map((tt, i) => (
                                        <span key={i} style={{
                                            fontSize: '11px', fontWeight: '600', padding: '3px 10px',
                                            borderRadius: '20px', background: 'var(--primary-glow)', color: 'var(--primary)'
                                        }}>{tt.icon} {tt.name}</span>
                                    ))}
                                </div>
                                <div className="card-meta">
                                    <div>
                                        <div className="card-price">₹{Number(pkg.base_price).toLocaleString()}</div>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per person · {pkg.duration_days} days</span>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px', boxShadow: 'none' }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button onClick={() => navigate('/packages')} className="btn btn-secondary" style={{ padding: '12px 32px', fontSize: '15px' }}>
                        View All Packages →
                    </button>
                </div>
            </section>

            {/* ── SEASONAL TRIPS ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px',
                        background: 'var(--secondary-glow)', color: 'var(--secondary)',
                        fontSize: '13px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px'
                    }}>🗓️ SEASONAL PICKS</span>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Recommended Trips by Season</h2>
                    <p>Curated escapes perfectly timed for the best experience, month by month.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
                    {SEASONAL_TRIPS.map((trip, i) => (
                        <div key={i} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src={trip.img} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <span style={{
                                    position: 'absolute', top: '14px', left: '14px',
                                    background: 'var(--glass-bg)', backdropFilter: 'blur(8px)',
                                    border: '1px solid var(--glass-border)', padding: '5px 12px',
                                    borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: 'var(--primary)'
                                }}>{trip.badge}</span>
                                <span style={{
                                    position: 'absolute', top: '14px', right: '14px',
                                    background: 'rgba(0,0,0,0.6)', padding: '5px 10px',
                                    borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.9)'
                                }}>{trip.month}</span>
                            </div>
                            <div className="card-body">
                                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{trip.label}</span>
                                <h3 style={{ fontSize: '20px', margin: '4px 0 0' }}>{trip.name}</h3>
                                <p style={{ fontSize: '13px', lineHeight: '1.5' }}>{trip.desc}</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', fontFamily: 'var(--heading)' }}>{trip.price}</span>
                                    <button onClick={() => navigate('/packages')} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px', boxShadow: 'none' }}>
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── GALLERY ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px',
                        background: 'var(--primary-glow)', color: 'var(--primary)',
                        fontSize: '13px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px'
                    }}>📸 GALLERY</span>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>Captured Moments</h2>
                    <p>A glimpse into the beautiful worlds waiting for you.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '220px', gap: '16px' }}>
                    {GALLERY.map((img, i) => (
                        <div key={i} style={{
                            borderRadius: '16px', overflow: 'hidden', position: 'relative',
                            gridColumn: img.span === 'wide' ? 'span 2' : 'span 1', cursor: 'pointer'
                        }} className="gallery-item">
                            <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                                display: 'flex', alignItems: 'flex-end', padding: '16px',
                                opacity: 0, transition: 'opacity 0.3s ease'
                            }} className="gallery-overlay">
                                <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>{img.alt}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>What Our Travelers Say</h2>
                    <p>Verified reviews from our happy customers around India.</p>
                </div>
                {loading ? <Loading message="Fetching traveler stories..." /> : (
                    <div className="reviews-grid">
                        {testimonials.map((t, i) => (
                            <div key={t.id ?? i} className="review-card">
                                <div className="review-rating">
                                    {Array.from({ length: t.rating }).map((_, idx) => <span key={idx}>★</span>)}
                                </div>
                                <p style={{ fontStyle: 'italic', fontSize: '14px', lineHeight: '1.6' }}>"{t.feedback}"</p>
                                <div className="review-author">
                                    <div className="review-avatar">{t.name[0]}</div>
                                    <span style={{ fontWeight: '700', fontSize: '14px' }}>{t.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── BLOGS ── */}
            <section id="blogs" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <span style={{
                        display: 'inline-block', padding: '6px 20px', borderRadius: '20px',
                        background: 'var(--primary-glow)', color: 'var(--primary)',
                        fontSize: '13px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px'
                    }}>✍️ TRAVEL JOURNAL</span>
                    <h2 style={{ fontSize: '36px', marginBottom: '8px' }}>From the Travel Blogs</h2>
                    <p>Guides, logs, and tips from our local travel experts.</p>
                </div>
                {loading ? <Loading message="Opening logs..." /> : (
                    <div className="grid-cols-3">
                        {blogs.map((b, i) => (
                            <div key={b.id ?? i} className="card" style={{ cursor: 'pointer' }}>
                                <div className="card-img-wrapper" style={{ height: '200px' }}>
                                    <img src={b.image_url} alt={b.title} className="card-img" />
                                    {b.tag && <span className="card-badge">{b.tag}</span>}
                                </div>
                                <div className="card-body">
                                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{b.published_at}</span>
                                    <h3 style={{ fontSize: '18px', margin: '4px 0 4px' }}>{b.title}</h3>
                                    <p style={{ fontSize: '13px', flex: 1 }}>{b.summary}</p>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>By {b.author}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Read Post ➜</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <button onClick={() => navigate('/blogs')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
                        Explore Blogs →
                    </button>
                </div>
            </section>

            {/* ── ABOUT US ── */}
            <section id="about" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div style={{
                    borderRadius: '24px', overflow: 'hidden',
                    background: 'linear-gradient(135deg, var(--primary-glow), var(--secondary-glow))',
                    border: '1px solid var(--border-color)', padding: '60px 40px'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <span style={{
                            display: 'inline-block', padding: '6px 20px', borderRadius: '20px',
                            background: 'var(--primary-glow)', color: 'var(--primary)',
                            fontSize: '13px', fontWeight: '700', marginBottom: '16px', letterSpacing: '0.5px'
                        }}>🌍 ABOUT US</span>
                        <h2 style={{ fontSize: '40px', marginBottom: '16px' }}>We Are VoyageWay</h2>
                        <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '16px', lineHeight: '1.7' }}>
                            Founded in 2018, VoyageWay is a premium travel platform connecting passionate explorers
                            with the world's most extraordinary destinations. Our expert consultants — including
                            <strong> Priya, Sneha and Amit</strong> — design personalised journeys crafted around
                            your interests, budget, and travel style.
                        </p>
                    </div>

                    {/* Values */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                        {[
                            { icon: '🌐', title: 'Global Reach', desc: 'Partnerships with 500+ hotels, airlines and local guides across 60+ countries.' },
                            { icon: '🛡️', title: 'Trusted & Safe', desc: 'Fully insured packages, 24/7 emergency support and verified accommodations.' },
                            { icon: '✨', title: 'Tailored Experiences', desc: 'Every itinerary is custom-crafted to match your unique travel dreams.' },
                            { icon: '💚', title: 'Eco-Conscious', desc: 'We partner with sustainable operators to protect the destinations we love.' },
                        ].map((v, i) => (
                            <div key={i} className="about-value-card" style={{
                                background: 'var(--bg-card)', borderRadius: '16px', padding: '28px',
                                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{v.icon}</div>
                                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>{v.title}</h4>
                                <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Team */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '28px', marginBottom: '8px' }}>Meet Our Team</h3>
                        <p>The passionate people behind your perfect trip.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {TEAM.map((m, i) => (
                            <div key={i} style={{
                                background: 'var(--bg-card)', borderRadius: '16px', padding: '28px 36px',
                                border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)',
                                textAlign: 'center', minWidth: '180px', transition: 'transform 0.3s ease'
                            }} className="about-value-card">
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{m.emoji}</div>
                                <h4 style={{ fontSize: '17px', marginBottom: '4px' }}>{m.name}</h4>
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{m.role}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '28px' }}>
                        <button onClick={() => navigate('/about')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
                            Explore About →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── CONTACT ── */}
            <section id="contact" style={{ maxWidth: '700px', margin: '0 auto', width: '100%', padding: '0 24px' }}>
                <div className="card" style={{ padding: '40px' }}>
                    <h2 style={{ fontSize: '28px', marginBottom: '8px', textAlign: 'center' }}>Send Us a Message</h2>
                    <p style={{ textAlign: 'center', marginBottom: '24px' }}>
                        Have queries about custom vacation trips? Drop your details below and we'll get back to you within 24 hours.
                    </p>
                    {contactSuccess && <div className="alert alert-success" style={{ marginBottom: '16px' }}>🎉 {contactSuccess}</div>}
                    <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-control" placeholder="e.g. Anjali Desai" value={contactName} onChange={e => setContactName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-control" placeholder="anjali@example.com" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Message / Inquiry Details</label>
                            <textarea className="form-control" rows="4" placeholder="e.g. Looking to book a honeymoon tour to Kashmir in mid-July for 2 people..." value={contactMsg} onChange={e => setContactMsg(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ height: '48px' }}>Send Message ✉️</button>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default Home;
