import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../api/endpoints/bookings';
import Loading from '../Common/Loading';

export const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const res = await bookingsAPI.getAll();
            if (res.data.success) {
                setBookings(res.data.data);
            } else {
                setError(res.data.message || 'Failed to retrieve bookings.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred querying bookings directory.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookings();
    }, [fetchBookings]);

    const getStatusBadge = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return <span className="badge badge-success">✓ Confirmed</span>;
            case 'cancelled':
                return <span className="badge badge-danger">✕ Cancelled</span>;
            case 'pending':
            default:
                return <span className="badge badge-warning">⏳ Pending</span>;
        }
    };

    const getPaymentBadge = (status) => {
        return status?.toLowerCase() === 'paid' 
            ? <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: '11px' }}>Paid</span>
            : <span className="badge badge-pending" style={{ padding: '2px 8px', fontSize: '11px' }}>Unpaid</span>;
    };

    if (loading) return <Loading message="Retrieving booking directories..." />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '24px' }}>Travel Booking Orders</h2>
                <button onClick={fetchBookings} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                    🔄 Refresh List
                </button>
            </div>

            {error && <div className="alert alert-danger">❌ {error}</div>}

            {bookings.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
                    <h3 style={{ fontSize: '18px' }}>No bookings ordered yet</h3>
                    <p style={{ margin: '8px 0 16px' }}>You haven't scheduled any vacation tours yet. Explore packages and create one!</p>
                    <button onClick={() => navigate('/packages')} className="btn btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
                        Browse Tour Packages
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Package Title</th>
                                <th>Departure Date</th>
                                <th>Guests</th>
                                <th>Total Cost</th>
                                <th>Payment</th>
                                <th>Booking Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: '700' }}>#{b.id}</td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{b.package_name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tier: {b.hotel_tier}</div>
                                    </td>
                                    <td>{b.travel_date}</td>
                                    <td>{b.number_of_travelers}</td>
                                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                        ₹{b.total_price?.toLocaleString()}
                                    </td>
                                    <td>{getPaymentBadge(b.payment_status)}</td>
                                    <td>{getStatusBadge(b.status)}</td>
                                    <td>
                                        <button 
                                            onClick={() => navigate(`/bookings/${b.id}`)} 
                                            className="btn btn-secondary" 
                                            style={{ padding: '6px 12px', fontSize: '13px' }}
                                        >
                                            Manage ⚙️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingList;
