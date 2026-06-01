export const Loading = ({ message = 'Loading, please wait...' }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            gap: '16px',
            width: '100%',
            minHeight: '200px'
        }}>
            <svg width="40" height="40" viewBox="0 0 38 38" stroke="var(--primary)" style={{
                animation: 'spin 1s linear infinite'
            }}>
                <defs>
                    <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                        <stop stopColor="var(--primary)" stopOpacity="0" offset="0%"/>
                        <stop stopColor="var(--primary)" stopOpacity=".631" offset="63.146%"/>
                        <stop stopColor="var(--primary)" offset="100%"/>
                    </linearGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)">
                        <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" strokeWidth="3" stroke="url(#a)"/>
                        <circle fill="var(--primary)" cx="36" cy="18" r="1"/>
                    </g>
                </g>
            </svg>
            <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--text-muted)'
            }}>{message}</span>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default Loading;
