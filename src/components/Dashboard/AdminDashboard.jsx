import { useState, useEffect } from 'react';

export const AdminDashboard = ({ currentTab, setCurrentTab }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Build user base if not stored
        if (!localStorage.getItem('mock_users')) {
            const defaultUsers = [
                { id: 1, name: 'Aditya Sen', email: 'admin@travel.com', role: 'Super Admin', status: 'active' },
                { id: 2, name: 'Priya Patel', email: 'manager@travel.com', role: 'Manager', status: 'active' },
                { id: 3, name: 'Amit Kumar', email: 'consultant@travel.com', role: 'Consultant', status: 'active' },
                { id: 4, name: 'Rahul Sharma', email: 'customer@travel.com', role: 'Customer', status: 'active' }
            ];
            localStorage.setItem('mock_users', JSON.stringify(defaultUsers));
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsers(JSON.parse(localStorage.getItem('mock_users')));
    }, [currentTab]);

    const handleRoleChange = (userId, newRole) => {
        const localUsers = [...users];
        const idx = localUsers.findIndex(u => u.id === userId);
        if (idx !== -1) {
            localUsers[idx].role = newRole;
            localStorage.setItem('mock_users', JSON.stringify(localUsers));
            setUsers(localUsers);
            alert(`User role updated to ${newRole} successfully.`);
        }
    };

    if (currentTab === 'overview') {
        return (
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div>
                        <h1 style={{ fontSize: '32px' }}>Super Admin Center</h1>
                        <p>Configure system directories, manage user roles, and monitor system metrics.</p>
                    </div>
                </div>

                {/* Metrics */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <span className="stat-label">Total Platform Users</span>
                            <span className="stat-value">{users.length + 128}</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✈️</div>
                        <div className="stat-info">
                            <span className="stat-label">Total Bookings Completed</span>
                            <span className="stat-value">546</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <span className="stat-label">Gross Revenue Value</span>
                            <span className="stat-value">₹12.4L</span>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-info">
                            <span className="stat-label">System Gateway Status</span>
                            <span className="stat-value" style={{ color: 'var(--success)', fontSize: '20px' }}>Online</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginTop: '16px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>System Access Log</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>[AUTH]</span> Token issued to <strong>admin@travel.com</strong> from IP 192.168.1.10 - <span style={{ color: 'var(--text-muted)' }}>Just now</span>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <span style={{ color: 'var(--success)', fontWeight: '700' }}>[BOOKING]</span> Booking ID #102 created for Goa Coastal - <span style={{ color: 'var(--text-muted)' }}>10 mins ago</span>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                                <span style={{ color: 'var(--warning)', fontWeight: '700' }}>[API]</span> Mock mode activated for endpoints - <span style={{ color: 'var(--text-muted)' }}>30 mins ago</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>System Modules</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Package catalog API</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>User Auth directory</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                <span>Payment gateway mock</span>
                                <span className="badge badge-success">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (currentTab === 'users') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>Platform User Accounts</h1>
                <p>Modify and assign security access credentials for platform employees and customers.</p>

                <div className="table-container" style={{ marginTop: '20px' }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Current Role</th>
                                <th>Modify Role Access</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: '700' }}>#{u.id}</td>
                                    <td style={{ fontWeight: '600' }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'Super Admin' ? 'badge-danger' : u.role === 'Manager' ? 'badge-warning' : u.role === 'Consultant' ? 'badge-info' : 'badge-success'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className="form-control"
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            style={{ padding: '6px 12px', fontSize: '13px', width: 'auto' }}
                                        >
                                            <option value="Customer">Customer</option>
                                            <option value="Consultant">Consultant</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Super Admin">Super Admin</option>
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

    if (currentTab === 'packages') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>System Package Registry</h1>
                <p>Manage default tour catalog directories.</p>
                <button onClick={() => setCurrentTab('overview')} className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                    Configure Packages in Manager Tab
                </button>
            </div>
        );
    }

    if (currentTab === 'logs') {
        return (
            <div className="dashboard-container">
                <h1 style={{ fontSize: '32px' }}>System Configuration</h1>
                <p>Configure general variables and API structures.</p>
                
                <div className="card" style={{ padding: '24px', marginTop: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Platform Application Name</label>
                        <input type="text" className="form-control" defaultValue="VoyageWay Travel Portal" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">System Support Contact Email</label>
                        <input type="email" className="form-control" defaultValue="support@voyageway.com" />
                    </div>
                    <button className="btn btn-primary" onClick={() => alert('Settings saved successfully (Mock)')} style={{ alignSelf: 'flex-start' }}>
                        Save Platform Configuration
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default AdminDashboard;
