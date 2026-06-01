import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { packagesAPI } from '../../api/endpoints/packages';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Common/Loading';

export const PackageList = () => {
    const [packages, setPackages] = useState([]);
    const [tripTypes, setTripTypes] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters State
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState('');
    const [destinationId, setDestinationId] = useState(searchParams.get('destination_id') || '');
    const [tripTypeId, setTripTypeId] = useState(searchParams.get('trip_type_id') || '');
    const [maxPrice, setMaxPrice] = useState('');
    const [maxDuration, setMaxDuration] = useState('');

    useEffect(() => {
        const destId = searchParams.get('destination_id');
        if (destId) setDestinationId(destId);

        const typeId = searchParams.get('trip_type_id');
        if (typeId) setTripTypeId(typeId);
    }, [searchParams]);

    const { isManager, isSuperAdmin } = useAuth();
    const navigate = useNavigate();

    const fetchTripTypes = useCallback(async () => {
        try {
            const res = await packagesAPI.getTripTypes();
            if (res.data.success) {
                setTripTypes(res.data.data.trip_types);
            }
        } catch (err) {
            console.error('Failed to load trip types:', err);
        }
    }, []);

    const fetchDestinations = useCallback(async () => {
        try {
            const res = await packagesAPI.getDestinations();
            if (res.data.success) {
                setDestinations(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load destinations:', err);
        }
    }, []);

    const fetchPackages = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await packagesAPI.getAll();
            if (res.data.success) {
                setPackages(res.data.data);
            } else {
                setError(res.data.message || 'Failed to retrieve packages');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred connecting to packages API.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDestinations();
        fetchTripTypes();
        fetchPackages();
    }, [fetchDestinations, fetchTripTypes, fetchPackages]);

    const handleCreateClick = () => {
        navigate('/packages/new');
    };

    // Client-side filtering for ultra-responsive search feel
    const filteredPackages = packages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(search.toLowerCase()) ||
            pkg.description.toLowerCase().includes(search.toLowerCase());
        const matchesDestination = !destinationId || pkg.destination_id === parseInt(destinationId) || pkg.destination?.id === parseInt(destinationId) || pkg.destinations?.some(d => d.id === parseInt(destinationId));
        const matchesTripType = !tripTypeId || pkg.trip_types?.some(tt => tt.id === parseInt(tripTypeId));
        const matchesPrice = !maxPrice || pkg.base_price <= parseInt(maxPrice);
        const matchesDuration = !maxDuration || pkg.duration_days <= parseInt(maxDuration);

        return matchesSearch && matchesDestination && matchesTripType && matchesPrice && matchesDuration;
    });

    return (
        <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '40px', marginBottom: '8px' }}>Explore Tour Packages</h1>
                    <p>Select from our professionally curated and fully inclusive travel schedules.</p>
                </div>
                {(isManager() || isSuperAdmin()) && (
                    <button onClick={handleCreateClick} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                        ➕ Create Tour Package
                    </button>
                )}
            </div>

            {/* Filter Bar */}
            <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-sidebar)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700' }}>🔎 Refine Package Search</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr',
                    gap: '16px'
                }}>
                    <input
                        type="text"
                        placeholder="Search key terms (e.g. Goa, Kashmir...)"
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select
                        className="form-control"
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                    >
                        <option value="">All Destinations</option>
                        {destinations.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        className="form-control"
                        value={tripTypeId}
                        onChange={(e) => setTripTypeId(e.target.value)}
                    >
                        <option value="">All Trip Types</option>
                        {tripTypes.map(tt => (
                            <option key={tt.id} value={tt.id}>{tt.name}</option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Max Budget (₹)"
                        className="form-control"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Max Duration (Days)"
                        className="form-control"
                        value={maxDuration}
                        onChange={(e) => setMaxDuration(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger">❌ {error}</div>}

            {loading ? (
                <Loading message="Scanning travel directory..." />
            ) : filteredPackages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏝️</div>
                    <h2>No Packages Found</h2>
                    <p style={{ maxWidth: '400px', margin: '8px auto 0' }}>We couldn't find any tour itineraries matching your search criteria. Try modifying your filters!</p>
                </div>
            ) : (
                <div className="grid-cols-3">
                    {filteredPackages.map(pkg => (
                        <div key={pkg.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/packages/${pkg.id}`)}>
                            <div className="card-img-wrapper">
                                <img
                                    src={pkg.image_url || pkg.images?.[0]?.image_path || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80'}
                                    alt={pkg.name}
                                    className="card-img"
                                />
                                <span className="card-badge">{pkg.duration_days} Days</span>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
                                    {pkg.destinations?.[0] && (
                                        <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 8px' }}>{pkg.destinations[0].name}</span>
                                    )}
                                    {pkg.trip_types?.map(tt => (
                                        <span key={tt.id} className="badge" style={{ fontSize: '10px', padding: '2px 8px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>{tt.name}</span>
                                    ))}
                                </div>
                                <h3 className="card-title">{pkg.name}</h3>
                                <p style={{
                                    fontSize: '14px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    height: '66px'
                                }}>
                                    {pkg.description}
                                </p>
                                <div className="card-meta">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>STARTING FROM</span>
                                        <span className="card-price">₹{Number(pkg.base_price).toLocaleString()}</span>
                                    </div>
                                    <span className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '13px' }}>View Details</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PackageList;
