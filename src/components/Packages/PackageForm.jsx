import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { packagesAPI } from '../../api/endpoints/packages';
import Loading from '../Common/Loading';

export const PackageForm = () => {
    const { id } = useParams(); // present if edit mode
    const isEditMode = !!id;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [destinationsList, setDestinationsList] = useState([]);
    const [tripTypesList, setTripTypesList] = useState([]);

    // Form inputs
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [durationDays, setDurationDays] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedDestinations, setSelectedDestinations] = useState([]);
    const [selectedTripTypes, setSelectedTripTypes] = useState([]);
    const [itinerary, setItinerary] = useState([]);

    const fetchDestinations = useCallback(async () => {
        try {
            const res = await packagesAPI.getDestinations();
            if (res.data.success) {
                setDestinationsList(res.data.data);
            }
        } catch (err) {
            console.error('Failed to load destinations:', err);
        }
    }, []);

    const fetchTripTypes = useCallback(async () => {
        try {
            const res = await packagesAPI.getTripTypes();
            if (res.data.success) {
                setTripTypesList(res.data.data.trip_types || []);
            }
        } catch (err) {
            console.error('Failed to load trip types:', err);
        }
    }, []);

    const fetchPackageData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await packagesAPI.getById(id);
            if (res.data.success) {
                const pkg = res.data.data;
                setName(pkg.name || '');
                setDescription(pkg.description || '');
                setBasePrice(pkg.base_price || '');
                setDurationDays(pkg.duration_days || '');
                setImageUrl(pkg.image_url || '');
                setSelectedDestinations(pkg.destinations?.map(d => d.id) || []);
                setSelectedTripTypes(pkg.trip_types?.map(tt => tt.id) || []);
                setItinerary(pkg.itinerary || []);
            } else {
                setError(res.data.message || 'Failed to load package details');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching package data.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDestinations();
        fetchTripTypes();
        if (isEditMode) {
            fetchPackageData();
        }
    }, [fetchDestinations, fetchPackageData, fetchTripTypes, isEditMode]);

    const handleDestinationToggle = (destId) => {
        if (selectedDestinations.includes(destId)) {
            setSelectedDestinations(selectedDestinations.filter(d => d !== destId));
        } else {
            setSelectedDestinations([...selectedDestinations, destId]);
        }
    };

    const handleItineraryChange = (index, field, value) => {
        const nextItinerary = [...itinerary];
        nextItinerary[index][field] = value;
        setItinerary(nextItinerary);
    };

    const handleAddItineraryDay = () => {
        setItinerary([
            ...itinerary,
            { day: itinerary.length + 1, title: '', description: '' }
        ]);
    };

    const handleRemoveItineraryDay = (index) => {
        const nextItinerary = itinerary.filter((_, idx) => idx !== index);
        // reassign day numbers
        const updatedItinerary = nextItinerary.map((item, idx) => ({
            ...item,
            day: idx + 1
        }));
        setItinerary(updatedItinerary);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const selectedDestsData = destinationsList.filter(d => selectedDestinations.includes(d.id));
        const selectedTripTypesData = tripTypesList.filter(tt => selectedTripTypes.includes(tt.id));

        const packageData = {
            name,
            description,
            base_price: parseInt(basePrice),
            duration_days: parseInt(durationDays),
            image_url: imageUrl,
            destinations: selectedDestsData,
            trip_types: selectedTripTypesData,
            itinerary
        };

        try {
            let res;
            if (isEditMode) {
                res = await packagesAPI.update(id, packageData);
            } else {
                res = await packagesAPI.create(packageData);
            }

            if (res.data.success) {
                alert(isEditMode ? 'Package updated successfully!' : 'Package created successfully!');
                navigate(`/packages/${res.data.data.id || id}`);
            } else {
                setError(res.data.message || 'Action failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred calling package endpoints.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <Loading message="Loading package form..." />;

    return (
        <div style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', marginBottom: '16px' }}>
                ⬅️ Cancel & Go Back
            </button>

            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{isEditMode ? '⚙️ Edit Tour Package' : '➕ Create New Tour Package'}</h1>
            <p style={{ marginBottom: '24px' }}>Fill in the details below to publish or update package schedules.</p>

            {error && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>❌ {error}</div>}

            <form onSubmit={handleSubmit} className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div className="form-group">
                    <label className="form-label">Package Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Goa Holiday Escapade"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description / Summary</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide details about flight, hotel, and location experiences..."
                        rows="4"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Base Cost (₹)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="e.g. 15000"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Duration (Days)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={durationDays}
                            onChange={(e) => setDurationDays(e.target.value)}
                            placeholder="e.g. 5"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Cover Image URL</label>
                    <input
                        type="url"
                        className="form-control"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/images/beach.png"
                    />
                </div>

                {/* Destinations checklist */}
                <div className="form-group">
                    <label className="form-label">Select Cover Destinations</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                        {destinationsList.map(d => (
                            <button
                                key={d.id}
                                type="button"
                                className={`btn ${selectedDestinations.includes(d.id) ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => handleDestinationToggle(d.id)}
                                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '20px', boxShadow: 'none' }}
                            >
                                {selectedDestinations.includes(d.id) ? `✓ ${d.name}` : `+ ${d.name}`}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Select Trip Type(s)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                        {tripTypesList.map(tt => (
                            <button
                                key={tt.id}
                                type="button"
                                className={`btn ${selectedTripTypes.includes(tt.id) ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => {
                                    if (selectedTripTypes.includes(tt.id)) {
                                        setSelectedTripTypes(selectedTripTypes.filter(id => id !== tt.id));
                                    } else {
                                        setSelectedTripTypes([...selectedTripTypes, tt.id]);
                                    }
                                }}
                                style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '20px', boxShadow: 'none' }}
                            >
                                {selectedTripTypes.includes(tt.id) ? `✓ ${tt.name}` : `+ ${tt.name}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Itinerary planner */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>🗺️ Itinerary Planner</h3>
                        <button type="button" onClick={handleAddItineraryDay} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                            ＋ Add Day Schedule
                        </button>
                    </div>

                    {itinerary.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '14px' }}>No itinerary days added. Add a day schedule to map travel sights.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {itinerary.map((item, index) => (
                                <div key={index} className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-app)', borderStyle: 'dashed' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span className="badge badge-info" style={{ fontWeight: '700' }}>Day {item.day}</span>
                                        <button type="button" onClick={() => handleRemoveItineraryDay(index)} className="btn btn-danger" style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}>
                                            Delete Day
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder="Day title (e.g. Arrival & Beach Walk)"
                                            className="form-control"
                                            value={item.title || ''}
                                            onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                            required
                                        />
                                        <textarea
                                            placeholder="Activity description..."
                                            className="form-control"
                                            value={item.description || ''}
                                            onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                            rows="2"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: '48px', marginTop: '20px' }}>
                    {loading ? 'Submitting Form Details...' : isEditMode ? 'Update Package Details' : 'Publish Tour Package'}
                </button>
            </form>
        </div>
    );
};

export default PackageForm;
