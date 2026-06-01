import React from 'react';
import { Link } from 'react-router-dom';

import { packagesAPI } from '../api/endpoints/packages';
import Loading from '../components/Common/Loading';

export const Destinations = () => {
    const [destinations, setDestinations] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await packagesAPI.getDestinations();
                if (res.data.success) {
                    setDestinations(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);
    return (
        <div className="destinations-page">
            <div className="hero-section" style={{ padding: '80px 32px' }}>
                <h1 className="hero-title" style={{ fontSize: '48px', marginBottom: '16px' }}>Explore Stunning Destinations</h1>
                <p className="hero-subtitle">From serene backwaters to snow-capped peaks, discover the perfect backdrop for your next unforgettable journey.</p>
            </div>

            <div style={{ padding: '60px 32px', maxWidth: '1280px', margin: '0 auto' }}>
                {loading ? <Loading message="Loading destinations..." /> : (
                    <div className="grid-cols-3">
                        {destinations.map(dest => (
                            <div key={dest.id} className="card destination-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-img-wrapper" style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                                    <img
                                        src={dest.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'}
                                        alt={dest.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '24px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                                        color: 'white'
                                    }}>
                                        <h3 style={{ fontSize: '24px', fontWeight: '700', margin: 0 }}>{dest.name}</h3>
                                    </div>
                                </div>
                                <div className="card-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', flex: 1 }}>{dest.description || 'Discover this beautiful destination with curated travel packages and local experiences.'}</p>
                                    <Link to={`/packages?destination_id=${dest.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                                        View Packages
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Destinations;
