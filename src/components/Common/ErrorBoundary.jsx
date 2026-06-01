import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('Error caught in Boundary:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    textAlign: 'center'
                }}>
                    <div className="card" style={{
                        maxWidth: '480px',
                        padding: '40px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            color: 'var(--danger)',
                            animation: 'bounce 2s infinite'
                        }}>⚠️</div>
                        <h1 style={{ fontSize: '28px', color: 'var(--text-main)' }}>Something went wrong</h1>
                        <p style={{ fontSize: '15px', color: 'var(--text-muted)' }}>
                            We encountered an unexpected crash: <code>{this.state.error?.message || 'Unknown Application Error'}</code>
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
                                className="btn btn-primary"
                            >
                                Reload App
                            </button>
                            <button
                                onClick={() => { window.location.href = '/'; }}
                                className="btn btn-secondary"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                    <style>{`
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                        }
                    `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
