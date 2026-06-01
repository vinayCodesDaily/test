import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packagesAPI } from '../../api/endpoints/packages';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';
import PackageInquiry from './PackageInquiry';

export const PackageDetail = () => {
    const { id } = useParams();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showBooking, setShowBooking] = useState(false);

    const { isManager, isSuperAdmin, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const fetchPackageDetails = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await packagesAPI.getById(id);
            if (res.data.success) {
                setPkg(res.data.data);
            } else {
                setError(res.data.message || 'Failed to retrieve package information');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error connecting to package API.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPackageDetails();
    }, [fetchPackageDetails]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this package?')) {
            try {
                const res = await packagesAPI.delete(id);
                if (res.data.success) {
                    alert('Package deleted successfully');
                    navigate('/packages');
                } else {
                    alert(res.data.message || 'Failed to delete package');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting package');
            }
        }
    };

    if (loading) return <Loading message="Loading package details..." />;
    if (error) return (
        <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="alert alert-danger" style={{ marginBottom: '20px' }}>❌ {error}</div>
            <button onClick={() => navigate('/packages')} className="btn btn-secondary">Back to Packages</button>
        </div>
    );
    if (!pkg) return null;

    return (
        <div style={{ padding: '40px 24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <button onClick={() => navigate('/packages')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', marginBottom: '16px' }}>
                        ⬅️ Back to List
                    </button>
                    <h1 style={{ fontSize: '38px', marginBottom: '8px' }}>{pkg.name}</h1>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-info">{pkg.duration_days} Days</span>
                        {((pkg.destination || pkg.destinations?.[0])) && (
                            <span className="badge badge-pending" style={{ color: 'var(--primary)', backgroundColor: 'var(--primary-glow)' }}>
                                📍 {(pkg.destination?.name || pkg.destinations?.[0]?.name)}
                            </span>
                        )}
                        {pkg.trip_types?.map(tt => (
                            <span key={tt.id} className="badge" style={{ background: 'var(--primary-glow)', color: 'var(--primary)' }}>{tt.icon} {tt.name}</span>
                        ))}
                    </div>
                </div>

                {(isManager() || isSuperAdmin()) && (
                    <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                        <button onClick={() => navigate(`/packages/${id}/edit`)} className="btn btn-secondary">
                            ⚙️ Edit Package
                        </button>
                        <button onClick={handleDelete} className="btn btn-danger">
                            🗑️ Delete
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>

                {/* Left column: Image & Itinerary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ borderRadius: '16px', overflow: 'hidden', height: '380px', border: '1px solid var(--border-color)' }}>
                        <img
                            src={pkg.image_url || pkg.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80'}
                            alt={pkg.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <div>
                        <h2 style={{ fontSize: '22px', marginBottom: '16px' }}>Overview & Details</h2>
                        <p style={{ fontSize: '16px', color: 'var(--text-main)' }}>{pkg.description}</p>
                    </div>

                    {pkg.itinerary && pkg.itinerary.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>🗺️ Complete Itinerary Schedule</h2>
                            <div className="timeline">
                                {pkg.itinerary.map(item => (
                                    <div key={item.day || item.id} className="timeline-item">
                                        <div className="timeline-header">
                                            <span className="badge badge-info" style={{ fontWeight: '700' }}>Day {item.day}</span>
                                            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>{item.title}</h3>
                                        </div>
                                        <p style={{ paddingLeft: '12px' }}>{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column: Booking Widget / Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '32px', border: '1px solid var(--primary-hover)', boxShadow: 'var(--shadow-primary)' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>PRICE PER PERSON</span>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary)', margin: '8px 0 16px', fontFamily: 'var(--heading)' }}>
                            ₹{Number(pkg.base_price).toLocaleString()}
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
                            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-main)' }}>Package Inclusions:</h4>
                            <ul style={{ paddingLeft: '20px', fontSize: '14px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <li>🏨 Star Hotel Accommodation Accommodation</li>
                                <li>🚗 Sightseeing Transfers</li>
                                <li>🥞 Daily Breakfast Buffer</li>
                                <li>👨🏻‍💼 Guided City Excursions</li>
                            </ul>
                        </div>

                        {!showBooking ? (
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) navigate('/login');
                                    else setShowBooking(true);
                                }}
                                className="btn btn-primary"
                                style={{ width: '100%', height: '48px' }}
                            >
                                {isAuthenticated ? '📩 Enquire About This Package' : 'Login to Enquire'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowBooking(false)}
                                className="btn btn-secondary"
                                style={{ width: '100%' }}
                            >
                                Cancel Enquiry
                            </button>
                        )}
                    </div>

                    {showBooking && isAuthenticated && (
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>📩 Package Enquiry</h3>
                            <PackageInquiry pkg={pkg} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PackageDetail;
