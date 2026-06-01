import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { packagesAPI } from '../../api/endpoints/packages';
import { bookingsAPI } from '../../api/endpoints/bookings';
import { inquiriesAPI } from '../../api/endpoints/inquiries';
import { cmsAPI } from '../../api/endpoints/cms';

export const ManagerDashboard = ({ currentTab }) => {
    const navigate = useNavigate();
    const [packages, setPackages] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [tripTypes, setTripTypes] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [aboutContent, setAboutContent] = useState(null);
    const [loading, setLoading] = useState(false);

    // CMS edit stats
    const [blogTitle, setBlogTitle] = useState('');
    const [blogSummary, setBlogSummary] = useState('');
    const [blogContent, setBlogContent] = useState('');
    // Local CMS form states
    const [destName, setDestName] = useState('');
    const [destImage, setDestImage] = useState('');
    const [destDesc, setDestDesc] = useState('');

    const [ttName, setTtName] = useState('');
    const [ttIcon, setTtIcon] = useState('');
    const [ttDesc, setTtDesc] = useState('');

    const [galleryImage, setGalleryImage] = useState('');
    const [galleryCaption, setGalleryCaption] = useState('');

    const [recMonth, setRecMonth] = useState('');
    const [recTitle, setRecTitle] = useState('');

    const [aboutText, setAboutText] = useState('');
    const [aboutAchievements, setAboutAchievements] = useState('');

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [pkgRes, bookRes, inquiryRes, reviewRes, destRes, ttRes, galRes, recRes, aboutRes] = await Promise.all([
                packagesAPI.getAll(),
                bookingsAPI.getAll(),
                inquiriesAPI.getAll(),
                cmsAPI.getTestimonials({ status: 'all' }),
                packagesAPI.getDestinations(),
                packagesAPI.getTripTypes(),
                cmsAPI.getGallery(),
                cmsAPI.getRecommendations(),
                cmsAPI.getAbout()
            ]);

            if (pkgRes.data.success) setPackages(pkgRes.data.data || []);
            if (bookRes.data.success) setBookings(bookRes.data.data || []);
            if (inquiryRes.data.success) setInquiries(inquiryRes.data.data || []);
            if (reviewRes.data.success) setTestimonials(reviewRes.data.data || []);
            if (destRes.data.success) setDestinations(destRes.data.data || []);
            if (ttRes.data.success) setTripTypes(ttRes.data.data?.trip_types || ttRes.data.data || []);
            if (galRes.data.success) setGallery(galRes.data.data || []);
            if (recRes.data.success) setRecommendations(recRes.data.data || []);
            if (aboutRes.data.success) setAboutContent(aboutRes.data.data || null);
        } catch (err) {
            console.error('Failed to load manager dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchDashboardData();
    }, [currentTab, fetchDashboardData]);

    // Booking approval actions
    const handleConfirmBooking = async (bookingId) => {
        try {
            await bookingsAPI.confirm(bookingId);
            await fetchDashboardData();
            alert(`Booking #${bookingId} confirmed successfully!`);
        } catch (err) {
            alert('Unable to confirm booking at this time.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm(`Are you sure you want to cancel booking #${bookingId}?`)) return;
        try {
            await bookingsAPI.cancel(bookingId);
            await fetchDashboardData();
            alert(`Booking #${bookingId} cancelled.`);
        } catch (err) {
            alert('Unable to cancel booking at this time.');
        }
    };

    // Inquiry assignment actions
    const handleAssignInquiry = async (inquiryId, consultantId) => {
        try {
            await inquiriesAPI.assignToConsultant(inquiryId, parseInt(consultantId, 10));
            await fetchDashboardData();
            alert('Lead assigned successfully!');
        } catch (err) {
            alert('Unable to assign lead at this time.');
        }
    };

    // Testimonials approval actions
    const handleApproveTestimonial = async (testimonialId) => {
        try {
            await cmsAPI.approveTestimonial(testimonialId);
            await fetchDashboardData();
            alert('Review approved successfully & published on landing page!');
        } catch (err) {
            alert('Unable to approve testimonial at this time.');
        }
    };

    // Blog additions
    const handleCreateBlog = async (e) => {
        e.preventDefault();
        try {
            await cmsAPI.createBlog({
                title: blogTitle,
                summary: blogSummary,
                content: blogContent,
                image_url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=600&q=80'
            });

            setBlogTitle('');
            setBlogSummary('');
            setBlogContent('');
            await fetchDashboardData();
            alert('Blog article created & published successfully!');
        } catch (err) {
            alert('Unable to publish blog at this time.');
        }
    };

    const handleDeletePackage = async (packageId) => {
        if (!window.confirm('Delete this tour package listing?')) return;
        try {
            await packagesAPI.delete(packageId);
            await fetchDashboardData();
            alert('Package deleted.');
        } catch (err) {
            alert('Unable to delete package at this time.');
        }
    };

    // Destinations CRUD
    const handleCreateDestination = async (payload) => {
        try {
            await packagesAPI.createDestination(payload);
            await fetchDashboardData();
            alert('Destination created');
        } catch (err) { alert('Unable to create destination.'); }
    };
    const handleUpdateDestination = async (id, payload) => {
        try { await packagesAPI.updateDestination(id, payload); await fetchDashboardData(); alert('Destination updated'); } catch { alert('Unable to update'); }
    };
    const handleDeleteDestination = async (id) => {
        if (!window.confirm('Delete this destination?')) return;
        try { await packagesAPI.deleteDestination(id); await fetchDashboardData(); alert('Destination deleted'); } catch { alert('Unable to delete'); }
    };

    // Trip Types CRUD
    const handleCreateTripType = async (payload) => { try { await packagesAPI.createTripType(payload); await fetchDashboardData(); alert('Trip type created'); } catch { alert('Unable to create trip type'); } };
    const handleUpdateTripType = async (id, payload) => { try { await packagesAPI.updateTripType(id, payload); await fetchDashboardData(); alert('Trip type updated'); } catch { alert('Unable to update trip type'); } };
    const handleDeleteTripType = async (id) => { if (!window.confirm('Delete this trip type?')) return; try { await packagesAPI.deleteTripType(id); await fetchDashboardData(); alert('Trip type deleted'); } catch { alert('Unable to delete trip type'); } };

    // Gallery CRUD
    const handleAddGalleryItem = async (payload) => { try { await cmsAPI.createGalleryItem(payload); await fetchDashboardData(); alert('Gallery item added'); } catch { alert('Unable to add gallery image'); } };
    const handleDeleteGalleryItem = async (id) => { if (!window.confirm('Delete this gallery image?')) return; try { await cmsAPI.deleteGalleryItem(id); await fetchDashboardData(); alert('Gallery item removed'); } catch { alert('Unable to remove'); } };

    // Recommendations
    const handleAddRecommendation = async (payload) => { try { await cmsAPI.updateRecommendations([...(recommendations || []), payload]); await fetchDashboardData(); alert('Recommendation saved'); } catch { alert('Unable to save recommendation'); } };

    // About
    const handleUpdateAbout = async (payload) => { try { await cmsAPI.updateAbout(payload); await fetchDashboardData(); alert('About page updated'); } catch { alert('Unable to update about content'); } };

    if (currentTab === 'overview') {
        return (
            <div className="dashboard-container">
                <div>
                    <h1 style={{ fontSize: '32px' }}>Manager Dashboard</h1>
                    <p>Track bookings, lead routing, catalog packaging, and blogs articles.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>📍 Manage Destinations</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input className="form-control" placeholder="Name" value={destName} onChange={e => setDestName(e.target.value)} />
                            <input className="form-control" placeholder="Image URL" value={destImage} onChange={e => setDestImage(e.target.value)} />
                            <input className="form-control" placeholder="Short description" value={destDesc} onChange={e => setDestDesc(e.target.value)} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary" onClick={async () => { await handleCreateDestination({ name: destName, image_url: destImage, description: destDesc }); setDestName(''); setDestImage(''); setDestDesc(''); }}>Add</button>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            {destinations.map(d => (
                                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <strong>{d.name}</strong>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.description}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" onClick={() => { const newName = prompt('New name', d.name); if (newName) handleUpdateDestination(d.id, { name: newName }); }}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteDestination(d.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>🏷️ Manage Trip Types</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input className="form-control" placeholder="Name" value={ttName} onChange={e => setTtName(e.target.value)} />
                            <input className="form-control" placeholder="Icon (emoji)" value={ttIcon} onChange={e => setTtIcon(e.target.value)} />
                            <input className="form-control" placeholder="Description" value={ttDesc} onChange={e => setTtDesc(e.target.value)} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary" onClick={async () => { await handleCreateTripType({ name: ttName, icon: ttIcon, description: ttDesc }); setTtName(''); setTtIcon(''); setTtDesc(''); }}>Add</button>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            {tripTypes.map(t => (
                                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <strong>{t.icon} {t.name}</strong>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.description}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary" onClick={() => { const name = prompt('New name', t.name); if (name) handleUpdateTripType(t.id, { name }); }}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteTripType(t.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>🖼️ Gallery</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input className="form-control" placeholder="Image URL" value={galleryImage} onChange={e => setGalleryImage(e.target.value)} />
                            <input className="form-control" placeholder="Caption" value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary" onClick={async () => { await handleAddGalleryItem({ image_url: galleryImage, caption: galleryCaption }); setGalleryImage(''); setGalleryCaption(''); }}>Upload</button>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            {gallery.map(g => (
                                <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <img src={g.image_url} alt={g.caption} style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                                        <div>
                                            <strong>{g.caption || 'Image #' + g.id}</strong>
                                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.image_url}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <button className="btn btn-danger" onClick={() => handleDeleteGalleryItem(g.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>📅 Monthly Recommendations</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input className="form-control" placeholder="Month (e.g. June)" value={recMonth} onChange={e => setRecMonth(e.target.value)} />
                            <input className="form-control" placeholder="Title" value={recTitle} onChange={e => setRecTitle(e.target.value)} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary" onClick={async () => { await handleAddRecommendation({ month: recMonth, title: recTitle }); setRecMonth(''); setRecTitle(''); }}>Save</button>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            {recommendations.map(r => (
                                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <div>
                                        <strong>{r.month}:</strong> {r.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ marginBottom: '12px' }}>🧾 About Page</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <textarea className="form-control" rows={6} placeholder="About content" value={aboutText} onChange={e => setAboutText(e.target.value)} />
                            <textarea className="form-control" rows={3} placeholder="Achievements (one per line)" value={aboutAchievements} onChange={e => setAboutAchievements(e.target.value)} />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button className="btn btn-primary" onClick={async () => { const achievements = aboutAchievements.split('\n').map(s => s.trim()).filter(Boolean); await handleUpdateAbout({ content: aboutText, achievements }); setAboutText(''); setAboutAchievements(''); }}>Update About</button>
                            </div>
                        </div>
                        <div style={{ marginTop: '12px' }}>
                            {aboutContent ? (
                                <div>
                                    <strong>Current heading:</strong> {aboutContent.heading}<br />
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{aboutContent.content}</div>
                                </div>
                            ) : <div style={{ color: 'var(--text-muted)' }}>No about content loaded.</div>}
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <span className="stat-label">Active Packages</span>
                            <span className="stat-value">{packages.length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎫</div>
                        <div className="stat-info">
                            <span className="stat-label">Pending Bookings</span>
                            <span className="stat-value">{bookings.filter(b => b.status === 'pending').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💬</div>
                        <div className="stat-info">
                            <span className="stat-label">Unassigned Leads</span>
                            <span className="stat-value">{inquiries.filter(i => !i.assigned_to).length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <span className="stat-label">Reviews Pending</span>
                            <span className="stat-value">{testimonials.filter(t => t.status === 'pending').length}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Pending Approvals</h3>
                        {bookings.filter(b => b.status === 'pending').length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '14px' }}>No bookings require attention.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {bookings.filter(b => b.status === 'pending').map(b => (
                                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                        <div>
                                            <span style={{ fontWeight: '700' }}>#{b.id}</span> - <strong>{b.package_name}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Traveler: {b.user_name} | {b.travel_date}</div>
                                        </div>
                                        <button onClick={() => handleConfirmBooking(b.id)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '12px', boxShadow: 'none' }}>
                                            Approve
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Assigned Consultant Leads</h3>
                        {inquiries.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No leads registered.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {inquiries.slice(0, 3).map(i => (
                                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)', alignItems: 'center', fontSize: '14px' }}>
                                        <div>
                                            <strong>{i.name}</strong>
                                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Assigned: {i.assigned_name}</div>
                                        </div>
                                        <span className={`badge ${i.status === 'resolved' ? 'badge-success' : 'badge-pending'}`}>{i.status}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (currentTab === 'packages') {
        return (
            <div className="dashboard-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ fontSize: '32px' }}>Catalog Packages Manager</h1>
                        <p>Create, update or delete platform packages.</p>
                    </div>
                    <button onClick={() => navigate('/packages/new')} className="btn btn-primary">
                        ➕ Create Package
                    </button>
                </div>

                <div className="table-container" style={{ marginTop: '20px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Destinations</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map(p => (
                                <tr key={p.id}>
                                    <td style={{ fontWeight: '700' }}>#{p.id}</td>
                                    <td style={{ fontWeight: '600' }}>{p.name}</td>
                                    <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{p.base_price?.toLocaleString()}</td>
                                    <td>{p.duration_days} Days</td>
                                    <td>{p.destinations?.map(d => d.name).join(', ') || 'None'}</td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => navigate(`/packages/${p.id}/edit`)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                            Edit ⚙️
                                        </button>
                                        <button onClick={() => handleDeletePackage(p.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '13px' }}>
                                            Delete 🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (currentTab === 'bookings') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>Booking Orders Registry</h1>
                <p>Approve pending travel requests or cancel non-responsive registrations.</p>

                <div className="table-container" style={{ marginTop: '20px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Package Title</th>
                                <th>Client Name</th>
                                <th>Date</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Approve/Revoke</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(b => (
                                <tr key={b.id}>
                                    <td style={{ fontWeight: '700' }}>#{b.id}</td>
                                    <td style={{ fontWeight: '600' }}>{b.package_name}</td>
                                    <td>{b.user_name}</td>
                                    <td>{b.travel_date}</td>
                                    <td>
                                        <span className={`badge ${b.payment_status === 'paid' ? 'badge-success' : 'badge-pending'}`}>
                                            {b.payment_status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${b.status === 'confirmed' ? 'badge-success' : b.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        {b.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleConfirmBooking(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--success)' }}>
                                                    Confirm Booking
                                                </button>
                                                <button onClick={() => handleCancelBooking(b.id)} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--danger)' }}>
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {b.status !== 'pending' && <span style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)' }}>Actioned</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (currentTab === 'inquiries') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>Customer Lead Inquiries Routing</h1>
                <p>Route customer questions and custom tours requirements to specific Consultants.</p>

                <div className="table-container" style={{ marginTop: '20px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Details</th>
                                <th>Requirement Message</th>
                                <th>Current Assignee</th>
                                <th>Lead Status</th>
                                <th>Assign Consultant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map(i => (
                                <tr key={i.id}>
                                    <td style={{ fontWeight: '700' }}>#{i.id}</td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{i.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i.email}</div>
                                    </td>
                                    <td style={{ maxWidth: '240px' }}>"{i.message}"</td>
                                    <td style={{ fontWeight: '600' }}>{i.assigned_name}</td>
                                    <td>
                                        <span className={`badge ${i.status === 'resolved' ? 'badge-success' : 'badge-pending'}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-control"
                                            value={i.assigned_to || ''}
                                            onChange={(e) => handleAssignInquiry(i.id, e.target.value)}
                                            style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                                        >
                                            <option value="">Unassigned</option>
                                            <option value="3">Amit Kumar (Consultant)</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (currentTab === 'cms') {
        return (
            <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '32px' }}>CMS & Landing Reviews Editor</h1>
                    <p>Approve testimonials and write travel blogs articles.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }}>
                    {/* Add Blog Form */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>📝 Write a Travel Blog Article</h3>
                        <form onSubmit={handleCreateBlog} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="form-group">
                                <label className="form-label">Article Title</label>
                                <input type="text" className="form-control" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} placeholder="e.g. Hiking the peaks of Ladakh" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Brief Summary</label>
                                <input type="text" className="form-control" value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)} placeholder="e.g. Essential guidelines for Leh high altitude hikes..." required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Main Content Markup</label>
                                <textarea className="form-control" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="Write details..." rows="5" required />
                            </div>
                            <button type="submit" className="btn btn-primary">Publish Blog Post</button>
                        </form>
                    </div>

                    {/* Testimonials checklist */}
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>⭐ Pending Testimonials Approvals</h3>
                        {testimonials.filter(t => t.status === 'pending').length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '14px' }}>No new customer reviews require approval.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {testimonials.filter(t => t.status === 'pending').map(t => (
                                    <div key={t.id} className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-app)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <strong>{t.name}</strong>
                                            <span style={{ color: '#ffb800' }}>★ {t.rating}/5</span>
                                        </div>
                                        <p style={{ fontSize: '13px', marginBottom: '12px' }}>"{t.feedback}"</p>
                                        <button onClick={() => handleApproveTestimonial(t.id)} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '12px', alignSelf: 'flex-start', boxShadow: 'none' }}>
                                            ✓ Approve review
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default ManagerDashboard;
