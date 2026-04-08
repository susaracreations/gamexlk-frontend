import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubHero from '../components/SubHero';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'About Us | GamexLK Store';
    }, []);

    return (
        <>
            <SubHero 
                title="About GamexLK"
                subtitle="Your ultimate destination for digital games, software, and gift cards in Sri Lanka. We are dedicated to providing the best gaming experience with instant delivery."
                breadcrumbItems={[
                    { label: 'Home', onClick: () => navigate('/') },
                    { label: 'About Us' }
                ]}
            />
            <main className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ maxWidth: '800px', margin: '4rem auto 0' }}>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Instant Delivery</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Get your game keys and codes delivered to your email instantly after payment.</p>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>Secure Payments</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>We support trusted local payment methods ensuring your data is always safe.</p>
                    </div>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', textAlign: 'center', transition: 'transform 0.2s' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎧</div>
                        <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>24/7 Support</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Our team is always ready to assist you with any issues or questions you might have.</p>
                    </div>
                </div>

                {/* Our Story / Mission */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
                    <div style={{ padding: '2.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary-color)' }}>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Our Mission</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                            Founded with a passion for gaming, Gamexlk Store aims to make premium games accessible to everyone in Sri Lanka.
                            We understand the difficulties of purchasing international digital goods locally, and we are here to bridge that gap.
                            Whether you are a casual gamer or a hardcore enthusiast, we strive to offer a vast library of titles across all major platforms including Steam, Origin, Ubisoft Connect, and more at competitive prices.
                        </p>
                    </div>
                </div>

                {/* Contact CTA */}
                <div style={{
                    padding: '3rem',
                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #2563eb 100%)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 700 }}>Have Questions?</h3>
                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Need help with an order or have a general inquiry? We are here to help.
                    </p>
                    <button
                        onClick={() => window.location.href = 'mailto:[EMAIL_ADDRESS]'}
                        style={{ background: 'white', color: 'black', fontWeight: 600, padding: '1rem 2rem', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s' }}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </main>
    </>
  );
};

export default AboutPage;
