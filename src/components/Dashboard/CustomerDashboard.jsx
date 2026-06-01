import { useState, useEffect, useCallback } from 'react';
import BookingList from '../Bookings/BookingList';
import { cmsAPI } from '../../api/endpoints/cms';
import { inquiriesAPI } from '../../api/endpoints/inquiries';

export const CustomerDashboard = ({ currentTab }) => {
    // Lead state
    const [inquiryMsg, setInquiryMsg] = useState('');
    const [myInquiries, setMyInquiries] = useState([]);
    const [leadSuccess, setLeadSuccess] = useState('');
    const [leadLoading, setLeadLoading] = useState(false);

    // Review state
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState('');
    const [revSuccess, setRevSuccess] = useState('');
    const [revLoading, setRevLoading] = useState(false);

    const loadMyInquiries = useCallback(async () => {
        try {
            const res = await inquiriesAPI.getAll();
            if (res.data.success) {
                setMyInquiries(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to load inquiries:', err);
            setMyInquiries([]);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadMyInquiries();
    }, [currentTab, loadMyInquiries]);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setLeadLoading(true);
        setLeadSuccess('');

        try {
            const res = await inquiriesAPI.submit({
                name: 'Rahul Sharma (Customer)', // current logged user name
                email: 'customer@travel.com',
                message: inquiryMsg
            });

            if (res.data.success) {
                setLeadSuccess('Inquiry submitted successfully! A support consultant will contact you.');
                setInquiryMsg('');
                loadMyInquiries();
            }
        } catch {
            alert('Failed to submit inquiry lead');
        } finally {
            setLeadLoading(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setRevLoading(true);
        setRevSuccess('');

        try {
            const res = await cmsAPI.submitTestimonial({
                name: 'Rahul Sharma',
                rating: rating,
                feedback: feedback
            });

            if (res.data.success) {
                setRevSuccess('Your review has been submitted for approval. Thank you!');
                setFeedback('');
                setRating(5);
            }
        } catch {
            alert('Failed to submit review');
        } finally {
            setRevLoading(false);
        }
    };

    if (currentTab === 'bookings') {
        return (
            <div className="dashboard-container">
                <BookingList />
            </div>
        );
    }

    if (currentTab === 'inquiries') {
        return (
            <div className="dashboard-container" style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '32px' }}>
                {/* Submit new inquiry */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>💬 Custom Travel Inquiry</h3>
                    <p style={{ fontSize: '13px', marginBottom: '16px' }}>Need adjustments to hotel tiers or looking for custom itineraries? Leave your message here.</p>

                    {leadSuccess && <div className="alert alert-success" style={{ marginBottom: '16px' }}>🎉 {leadSuccess}</div>}

                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Tell us about your dream destination details</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="e.g. Planning a trip to Leh Ladakh with a group of 6 people. Need flight bookings and family hotels. Budget is flexible..."
                                value={inquiryMsg}
                                onChange={(e) => setInquiryMsg(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" disabled={leadLoading} className="btn btn-primary">
                            {leadLoading ? 'Submitting lead specs...' : 'Send Inquiry Request'}
                        </button>
                    </form>
                </div>

                {/* List of my inquiries */}
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>📜 Inquiry History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {myInquiries.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No questions submitted yet.</p>
                        ) : (
                            myInquiries.map(i => (
                                <div key={i.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '14px' }}>Query ID #{i.id}</span>
                                        <span className={`badge ${i.status === 'resolved' ? 'badge-success' : i.status === 'in_progress' ? 'badge-info' : 'badge-pending'}`}>
                                            {i.status}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: 'var(--text-main)', marginBottom: '4px' }}>"{i.message}"</p>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned to: {i.assigned_name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (currentTab === 'testimonials') {
        return (
            <div className="dashboard-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Write a Review</h2>
                    <p style={{ marginBottom: '24px' }}>Share your travel experiences with other platform users.</p>

                    {revSuccess && <div className="alert alert-success" style={{ marginBottom: '16px' }}>🎉 {revSuccess}</div>}

                    <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Review Rating (1-5 Stars)</label>
                            <select
                                className="form-control"
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                            >
                                <option value="5">★★★★★ (5 - Excellent)</option>
                                <option value="4">★★★★☆ (4 - Very Good)</option>
                                <option value="3">★★★☆☆ (3 - Good)</option>
                                <option value="2">★★☆☆☆ (2 - Average)</option>
                                <option value="1">★☆☆☆☆ (1 - Poor)</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Feedback Review Message</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Describe your vacation accommodation, hotel booking or consultant help..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={revLoading} className="btn btn-primary" style={{ height: '44px' }}>
                            {revLoading ? 'Submitting testimonial...' : 'Post Testimonial'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};

export default CustomerDashboard;
