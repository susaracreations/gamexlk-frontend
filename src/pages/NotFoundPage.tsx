import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    useEffect(() => {
        document.title = '404 Not Found — Gamexlk Store';
    }, []);

    return (
        <main className="container section" style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: 500, width: '100%' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛸</div>
                <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>404 Not Found</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
                    The page you are looking for seems to have drifted into deep space.
                </p>
                <Link to="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', justifyContent: 'center' }}>
                    Back to Store
                </Link>
            </div>
        </main>
    );
};

export default NotFoundPage;