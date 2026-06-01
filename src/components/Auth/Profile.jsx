import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export const Profile = () => {
    const { user, updateProfile, changePassword } = useAuth();
    
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileError('');
        setProfileSuccess('');

        const res = await updateProfile({ name, email });
        if (res.success) {
            setProfileSuccess('Profile updated successfully!');
        } else {
            setProfileError(res.error || 'Failed to update profile');
        }
        setProfileLoading(false);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('New password and confirmation do not match');
            setPasswordLoading(false);
            return;
        }

        const res = await changePassword(currentPassword, newPassword, confirmPassword);
        if (res.success) {
            setPasswordSuccess('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setPasswordError(res.error || 'Failed to change password');
        }
        setPasswordLoading(false);
    };

    return (
        <div style={{ padding: '40px 24px', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Profile Settings</h1>
                <p>Manage your account settings, personal details and password verification.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                
                {/* Profile Details Card */}
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Account Information</h2>
                    
                    {profileError && <div className="alert alert-danger" style={{ marginBottom: '16px' }}>❌ {profileError}</div>}
                    {profileSuccess && <div className="alert alert-success" style={{ marginBottom: '16px' }}>🎉 {profileSuccess}</div>}

                    <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assigned Role</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user?.role?.name || 'Customer'}
                                disabled
                                style={{ backgroundColor: 'var(--bg-sidebar)', cursor: 'not-allowed' }}
                            />
                        </div>

                        <button type="submit" disabled={profileLoading} className="btn btn-primary" style={{ marginTop: '10px' }}>
                            {profileLoading ? 'Saving...' : 'Save Details'}
                        </button>
                    </form>
                </div>

                {/* Password Change Card */}
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Security & Credentials</h2>
                    
                    {passwordError && <div className="alert alert-danger" style={{ marginBottom: '16px' }}>❌ {passwordError}</div>}
                    {passwordSuccess && <div className="alert alert-success" style={{ marginBottom: '16px' }}>🎉 {passwordSuccess}</div>}

                    <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={passwordLoading} className="btn btn-primary" style={{ marginTop: '10px' }}>
                            {passwordLoading ? 'Updating Password...' : 'Update Password'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Profile;
