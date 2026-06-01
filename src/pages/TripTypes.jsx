import React from 'react';
import { Link } from 'react-router-dom';

import { packagesAPI } from '../api/endpoints/packages';
import Loading from '../components/Common/Loading';

export const TripTypes = () => {
    const [tripTypes, setTripTypes] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTripTypes = async () => {
            try {
                const res = await packagesAPI.getTripTypes();
                if (res.data.success) {
                    setTripTypes(res.data.data.trip_types);
                }
            } catch (err) {
                console.error("Failed to fetch trip types:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTripTypes();
    }, []);
    return(
        <div className="trip-types-page">
            <div className="hero-section" style={{ padding: '80px 32px', background: 'radial-gradient(circle at top right, var(--secondary-glow), transparent 40%), radial-gradient(circle at bottom left, var(--primary-glow), transparent 40%)' }}>
                <h1 className="hero-title" style={{ fontSize: '48px', marginBottom: '16px' }}>Curated Trip Types</h1>
                <p className="hero-subtitle">Whether you're seeking romance, adrenaline, or a peaceful family getaway, we have the perfect itinerary crafted just for you.</p>
            </div>
            
            <div style={{ padding: '60px 32px', maxWidth: '1280px', margin: '0 auto' }}>
                {loading ? <Loading message="Loading trip types..." /> : (
                <div className="grid-cols-3">
                    {tripTypes.map(type => (
                        <div key={type.id} className="card" style={{ padding: '32px', borderTop: '4px solid var(--primary)', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px', background: 'var(--primary-glow)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                {type.icon}
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{type.name}</h3>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px', flex: 1 }}>{type.description}</p>
                            <Link to={`/packages?trip_type_id=${type.id}`} className="btn btn-link" style={{ fontWeight: '600' }}>
                                Explore {type.name} →
                            </Link>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default TripTypes;
