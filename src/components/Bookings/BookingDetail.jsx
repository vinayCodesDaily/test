import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../api/endpoints/bookings';
import Loading from '../Common/Loading';

export const BookingDetail = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchBookingData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            
            const bookingRes = await bookingsAPI.getById(id);
            if (bookingRes.data.success) {
                setBooking(bookingRes.data.data);
                
                const invoiceRes = await bookingsAPI.getInvoice(id);
                if (invoiceRes.data.success) {
                    setInvoice(invoiceRes.data.data);
                }
            } else {
                setError(bookingRes.data.message || 'Failed to retrieve booking information');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error occurred pulling booking data.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBookingData();
    }, [fetchBookingData]);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this booking reservation?')) {
            try {
                const res = await bookingsAPI.cancel(id);
                if (res.data.success) {
                    alert('Booking cancelled successfully');
                    fetchBookingData();
                } else {
                    alert(res.data.message || 'Cancellation failed');
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    const handlePayment = async () => {
        try {
            const res = await bookingsAPI.processPayment(id, {
                payment_method: 'card',
                card_last_four: '4242'
            });
            if (res.data.success) {
                alert('Payment simulated successfully! Booking status updated.');
                fetchBookingData();
            } else {
                alert(res.data.message || 'Payment simulation failed');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting payment');
        }
    };

    if (loading) return <Loading message="Loading booking details..." />;
    if (error) return (
        <div style={{ padding: '40px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="alert alert-danger" style={{ marginBottom: '20px' }}>❌ {error}</div>
            <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">Back to Dashboard</button>
        </div>
    );
    if (!booking) return null;

    return (
        <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', marginBottom: '12px' }}>
                        ⬅️ Back to Dashboard
                    </button>
                    <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Manage Booking #{booking.id}</h1>
                    <p>Ordered for <strong>{booking.package_name}</strong> on {booking.travel_date}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {booking.status === 'pending' && (
                        <button onClick={handleCancel} className="btn btn-danger">
                            Cancel Booking ✕
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }}>
                
                {/* Details Card */}
                <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Reservation Specs</h2>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>BOOKING STATUS</span>
                            <div style={{ marginTop: '4px' }}>
                                {booking.status === 'confirmed' ? (
                                    <span className="badge badge-success">✓ Confirmed</span>
                                ) : booking.status === 'cancelled' ? (
                                    <span className="badge badge-danger">✕ Cancelled</span>
                                ) : (
                                    <span className="badge badge-warning">⏳ Pending Approval</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PAYMENT STATUS</span>
                            <div style={{ marginTop: '4px' }}>
                                {booking.payment_status === 'paid' ? (
                                    <span className="badge badge-success">Paid</span>
                                ) : (
                                    <span className="badge badge-pending">Unpaid</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Travelers</span>
                            <span style={{ fontWeight: '600' }}>{booking.number_of_travelers} Person(s)</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Selected Hotel</span>
                            <span style={{ fontWeight: '600' }}>{booking.hotel_tier}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Add-on Flight</span>
                            <span style={{ fontWeight: '600' }}>{booking.flight_details}</span>
                        </div>
                        {booking.special_requests && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px 0' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Special Requests</span>
                                <p style={{ backgroundColor: 'var(--bg-app)', padding: '10px', borderRadius: '8px', fontSize: '14px', border: '1px dashed var(--border-color)' }}>
                                    {booking.special_requests}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Invoice Receipt Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="card" style={{ padding: '32px', backgroundColor: 'var(--bg-sidebar)', border: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Receipt Invoice</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', alignSelf: 'center' }}>{invoice?.invoice_no || 'INV-TEMP'}</span>
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Base Price Subtotal</span>
                                <span>₹{booking.total_price?.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>GST Tax (5%)</span>
                                <span>₹{invoice?.tax_amount?.toLocaleString() || (booking.total_price * 0.05).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px dashed var(--border-color)', borderBottom: '2px dashed var(--border-color)', fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                                <span>Grand Total Cost</span>
                                <span style={{ color: 'var(--primary)' }}>₹{invoice?.grand_total?.toLocaleString() || (booking.total_price * 1.05).toLocaleString()}</span>
                            </div>
                        </div>

                        {booking.payment_status !== 'paid' && booking.status !== 'cancelled' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%' }}>
                                    💳 Pay Bill & Confirm Now
                                </button>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Demo gateway payment will automatically approve reservation slot.
                                </span>
                            </div>
                        ) : booking.payment_status === 'paid' ? (
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '10px', fontWeight: '700' }}>
                                ✓ Bill Fully Settled & Approved
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '10px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '10px', fontWeight: '700' }}>
                                Booking Cancelled / Revoked
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BookingDetail;
