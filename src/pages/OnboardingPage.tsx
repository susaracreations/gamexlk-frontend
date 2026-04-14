import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import SubHero from '../components/SubHero';
import Loader from '../components/Loader';

interface OnboardingPageProps {
  onToast: (msg: string, type: string) => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    discord: ''
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Complete Your Profile | GamexLK Store';
    
    // Check if user is logged in
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/signin');
        return;
      }
      
      // Optional: Check if already onboarded to prevent re-onboarding
      if (user.email) {
        const userRef = doc(db, 'users', user.email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().onboardingComplete) {
          navigate('/');
        }
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user || !user.email) {
      onToast('Session expired. Please sign in again.', 'error');
      navigate('/signin');
      return;
    }

    try {
      // Create/Update document with email as ID as requested
      const userRef = doc(db, 'users', user.email);
      await setDoc(userRef, {
        name: formData.name,
        whatsapp: formData.whatsapp,
        discord: formData.discord,
        email: user.email,
        uid: user.uid,
        onboardingComplete: true,
        updatedAt: new Date().toISOString(),
        role: 'user'
      }, { merge: true });

      onToast('Profile completed! Welcome to GamexLK.', 'success');
      navigate('/');
    } catch (error: any) {
      onToast(error.message || 'Failed to save profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <Loader fullScreen message="Checking profile status..." />;

  return (
    <div className="fade-in">
      <SubHero 
        title="Welcome to the Community"
        subtitle="Just a few more details so we can give you the best experience and support."
        breadcrumbItems={[
          { label: 'Sign In', onClick: () => navigate('/signin') },
          { label: 'Onboarding' }
        ]}
      />
      
      <main className="container section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Complete Your Profile</h2>
            <p style={{ color: 'var(--text-secondary)' }}>We use these details for order fulfillment and support.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Display Name / Full Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number</label>
              <input
                name="whatsapp"
                type="tel"
                className="form-control"
                placeholder="+94 7X XXX XXXX"
                value={formData.whatsapp}
                onChange={handleChange}
                required
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>We'll use this to send your digital product keys.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Discord Username <span style={{ opacity: 0.5 }}>(Optional)</span></label>
              <input
                name="discord"
                type="text"
                className="form-control"
                placeholder="username#0000"
                value={formData.discord}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
              disabled={loading}
            >
              {loading ? 'Saving Profile...' : 'Complete Registration'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;
