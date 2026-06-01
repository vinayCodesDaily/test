import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inquiriesAPI } from '../../api/endpoints/inquiries';
import { useAuth } from '../../context/AuthContext';

const PackageInquiry = ({ pkg }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: `Inquiry about package: ${pkg.name} (ID: ${pkg.id}). Please share availability and pricing.` });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { name: form.name || 'Anonymous', email: form.email || '', phone: form.phone || '', message: form.message };
            const res = await inquiriesAPI.submit(payload);
            if (res.data.success) {
                alert('Inquiry submitted. A support consultant will contact you shortly.');
                setForm({ name: '', email: '', phone: '', message: `Inquiry about package: ${pkg.name} (ID: ${pkg.id}). Please share availability and pricing.` });
                navigate('/dashboard');
            } else {
                alert(res.data.message || 'Failed to submit inquiry');
            }
        } catch (err) {
            console.error(err);
            alert('Error submitting inquiry.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated()) {
        return (
            <div>
                <p>Please <a href="/login">login</a> to submit an inquiry.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group">
                <label className="form-label">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Your full name" required />
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" placeholder="you@example.com" required />
                </div>
                <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-control" placeholder="Mobile number (optional)" />
                </div>
            </div>
            <div className="form-group">
                <label className="form-label">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Submit Inquiry'}</button>
        </form>
    );
};

export default PackageInquiry;
