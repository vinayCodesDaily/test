import { useState, useEffect } from 'react';
import Sidebar from '../Common/Sidebar';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import CustomerDashboard from './CustomerDashboard';

// Inline Consultant Dashboard for thoroughness
const ConsultantDashboard = ({ currentTab }) => {
    const [inquiries, setInquiries] = useState([]);
    
    useEffect(() => {
        const localInqs = JSON.parse(localStorage.getItem('mock_inquiries') || '[]');
        // Filter inquiries assigned to Consultant (ID 3)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInquiries(localInqs.filter(i => i.assigned_to === 3));
    }, [currentTab]);

    const handleUpdateStatus = (id, newStatus) => {
        const localInqs = JSON.parse(localStorage.getItem('mock_inquiries') || '[]');
        const idx = localInqs.findIndex(i => i.id === id);
        if (idx !== -1) {
            localInqs[idx].status = newStatus;
            localStorage.setItem('mock_inquiries', JSON.stringify(localInqs));
            setInquiries(localInqs.filter(i => i.assigned_to === 3));
            alert('Inquiry status updated successfully.');
        }
    };

    if (currentTab === 'overview') {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1 style={{ fontSize: '32px' }}>Consultant Hub</h1>
                        <p>Track assigned customer leads and active itineraries consultation.</p>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">✉️</div>
                        <div className="stat-info">
                            <span className="stat-label">My Active Leads</span>
                            <span className="stat-value">{inquiries.filter(i => i.status !== 'resolved').length}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✓</div>
                        <div className="stat-info">
                            <span className="stat-label">Resolved Inquiry Slots</span>
                            <span className="stat-value">{inquiries.filter(i => i.status === 'resolved').length}</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Recent Lead Updates</h3>
                    {inquiries.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No inquires currently assigned. Check in with the manager!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {inquiries.slice(0, 3).map(i => (
                                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{i.name}</div>
                                        <p style={{ fontSize: '13px' }}>"{i.message}"</p>
                                    </div>
                                    <span className={`badge ${i.status === 'resolved' ? 'badge-success' : 'badge-pending'}`}>{i.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (currentTab === 'inquiries') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>Assigned Customer Inquiries</h1>
                <p>Respond to customer custom package requirements.</p>

                <div className="table-container" style={{ marginTop: '20px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Lead ID</th>
                                <th>Customer details</th>
                                <th>Requirement Message</th>
                                <th>Lead status</th>
                                <th>Action Panel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inquiries.map(i => (
                                <tr key={i.id}>
                                    <td style={{ fontWeight: '700' }}>#{i.id}</td>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{i.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i.email} | {i.phone}</div>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>"{i.message}"</td>
                                    <td>
                                        <span className={`badge ${i.status === 'resolved' ? 'badge-success' : i.status === 'in_progress' ? 'badge-info' : 'badge-pending'}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td style={{ display: 'flex', gap: '8px' }}>
                                        {i.status !== 'resolved' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(i.id, 'resolved')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--success)' }}>
                                                    Mark Resolved
                                                </button>
                                                <button onClick={() => handleUpdateStatus(i.id, 'in_progress')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--primary)' }}>
                                                    Progress Lead
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1 style={{ fontSize: '32px' }}>Unavailable Tab</h1>
            <p>Select another action item from the sidebar menu.</p>
        </div>
    );
};

export const Dashboard = () => {
    const { user, isSuperAdmin, isManager, isConsultant } = useAuth();
    // Default tabs depending on role
    const [currentTab, setCurrentTab] = useState('overview');

    useEffect(() => {
        // Customer defaults to bookings
        if (!isSuperAdmin() && !isManager() && !isConsultant()) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentTab('bookings');
        } else {
            setCurrentTab('overview');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const renderDashboardContent = () => {
        if (isSuperAdmin()) {
            return <AdminDashboard currentTab={currentTab} setCurrentTab={setCurrentTab} />;
        }
        if (isManager()) {
            return <ManagerDashboard currentTab={currentTab} setCurrentTab={setCurrentTab} />;
        }
        if (isConsultant()) {
            return <ConsultantDashboard currentTab={currentTab} setCurrentTab={setCurrentTab} />;
        }
        // Customer
        return <CustomerDashboard currentTab={currentTab} setCurrentTab={setCurrentTab} />;
    };

    return (
        <div className="layout-with-sidebar">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <div className="dashboard-content" style={{ flex: 1, overflowY: 'auto' }}>
                {renderDashboardContent()}
            </div>
        </div>
    );
};

export default Dashboard;
