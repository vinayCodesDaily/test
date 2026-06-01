import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ currentTab, setCurrentTab }) => {
    const { user, isSuperAdmin, isManager, isConsultant, isCustomer } = useAuth();

    const renderRoleLinks = () => {
        if (isSuperAdmin()) {
            return (
                <>
                    <div className="sidebar-heading">System Admin</div>
                    <div 
                        className={`sidebar-link ${currentTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('overview')}
                    >
                        📊 System Overview
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'users' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('users')}
                    >
                        👥 User Accounts
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'packages' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('packages')}
                    >
                        📦 System Packages
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'logs' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('logs')}
                    >
                        ⚙️ System Configuration
                    </div>
                </>
            );
        }

        if (isManager()) {
            return (
                <>
                    <div className="sidebar-heading">Management</div>
                    <div 
                        className={`sidebar-link ${currentTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('overview')}
                    >
                        📈 Dashboard Stats
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'packages' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('packages')}
                    >
                        🗺️ Tour Packages
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('bookings')}
                    >
                        🎫 Booking Requests
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('inquiries')}
                    >
                        💬 Customer Inquiries
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'cms' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('cms')}
                    >
                        📰 CMS (Blogs & Reviews)
                    </div>
                </>
            );
        }

        if (isConsultant()) {
            return (
                <>
                    <div className="sidebar-heading">Consultation</div>
                    <div 
                        className={`sidebar-link ${currentTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('overview')}
                    >
                        📊 Assigned Work
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('inquiries')}
                    >
                        ✉️ Assigned Inquiries
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('bookings')}
                    >
                        🗃️ Bookings Overview
                    </div>
                </>
            );
        }

        if (isCustomer()) {
            return (
                <>
                    <div className="sidebar-heading">My Account</div>
                    <div 
                        className={`sidebar-link ${currentTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('bookings')}
                    >
                        ✈️ My Travel Bookings
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'inquiries' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('inquiries')}
                    >
                        ❓ My Help Inquiries
                    </div>
                    <div 
                        className={`sidebar-link ${currentTab === 'testimonials' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('testimonials')}
                    >
                        ⭐ Write a Review
                    </div>
                </>
            );
        }

        return null;
    };

    return (
        <aside className="sidebar">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '22px',
                    boxShadow: 'var(--shadow-primary)'
                }}>
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{user?.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.email}</span>
            </div>
            
            {renderRoleLinks()}
        </aside>
    );
};

export default Sidebar;
