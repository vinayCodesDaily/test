import { useNavigate } from 'react-router-dom';

export const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '24px'
        }}>
            <div className="card" style={{ padding: '40px', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <span style={{ fontSize: '56px' }}>🔒</span>
                <h1 style={{ fontSize: '28px' }}>Access Denied</h1>
                <p>You do not have the required permissions to view this dashboard workspace.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Login Screen</button>
                    <button onClick={() => navigate('/')} className="btn btn-secondary">Go Home</button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
