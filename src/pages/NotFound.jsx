import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
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
                <span style={{ fontSize: '56px' }}>🏝️</span>
                <h1 style={{ fontSize: '28px' }}>Page Not Found</h1>
                <p>We couldn't find the coordinates of this page. It might have moved or been deleted.</p>
                <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '8px' }}>
                    Return to Safe Shore
                </button>
            </div>
        </div>
    );
};

export default NotFound;
