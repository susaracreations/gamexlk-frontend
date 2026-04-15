import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

interface ReviewSectionProps {
  onToast: (msg: string, type: string) => void;
}

interface Review {
  id?: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
  createdAt?: any;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ onToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reviews'));
      const fetched: Review[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Review);
      });
      
      // Shuffle and take up to 10 random reviews to show in the scrolling track
      const shuffled = [...fetched].sort(() => 0.5 - Math.random());
      setReviews(shuffled.slice(0, 10));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      onToast('Please fill all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        name: formData.name,
        email: formData.email,
        comment: formData.comment,
        rating: formData.rating,
        createdAt: Timestamp.now()
      });
      
      onToast('Thank you! Your review has been submitted.', 'success');
      setFormData({ name: '', email: '', comment: '', rating: 5 });
      setShowModal(false);
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      onToast('Error connecting to server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarsForDisplay = (rating: number) => {
    return [1, 2, 3, 4, 5].map((num) => (
      <span key={num} style={{ color: num <= rating ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.1)', fontSize: '1.2rem' }}>★</span>
    ));
  };

  const renderStarsForForm = () => {
    return [1, 2, 3, 4, 5].map((num) => (
      <span 
        key={num} 
        style={{ 
          cursor: 'pointer', 
          fontSize: '1.8rem', 
          color: num <= formData.rating ? 'var(--accent-yellow)' : 'rgba(255,255,255,0.1)',
          marginRight: '8px',
          transition: 'transform 0.2s ease, color 0.2s ease',
          display: 'inline-block'
        }}
        onClick={() => setFormData({ ...formData, rating: num })}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        ★
      </span>
    ));
  };

  return (
    <section id="reviews" className="review-section" style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(5, 5, 16, 0.4)', position: 'relative' }}>
      <style>{`
        .review-section {
          padding: 4rem 0;
        }
        .review-mask {
          display: flex;
          overflow: hidden;
          user-select: none;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          padding: 1rem 0;
          width: 100%;
        }
        .review-track {
          display: flex;
          flex-shrink: 0;
          gap: 2rem;
          width: max-content;
          animation: scroll-reviews 60s linear infinite;
        }
        .review-track:hover {
          animation-play-state: paused;
        }
        .review-card {
          flex: 0 0 350px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 200px;
        }
        .review-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          border: 1px solid var(--glass-border);
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .review-modal-card {
          padding: 3rem;
          max-width: 600px;
          width: 100%;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes scroll-reviews {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .review-section {
            padding: 2.5rem 0 1.5rem 0; /* Tighter padding on mobile */
          }
          .review-section .container {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .review-header {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 1.5rem;
          }
          .review-card {
            flex: 0 0 280px;
            padding: 1.25rem;
            gap: 0.75rem;
          }
          .review-avatar {
            width: 36px;
            height: 36px;
            font-size: 1rem;
          }
          .review-modal-card {
            padding: 1.5rem;
          }
        }
      `}</style>
      <div className="container">
        
        {/* Header Section */}
        <div className="review-header">
          <div>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>Community Reviews</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>What our gamers say about us.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
            Add Review
          </button>
        </div>

        {/* Existing Reviews Display */}
        {reviews.length > 0 ? (
          <div className="review-mask">
            <div className="review-track">
              {[...reviews, ...reviews].map((review, i) => (
                <div key={`${review.id}-${i}`} className="glass-card review-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="review-avatar">
                      👤
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {review.name}
                        </h4>
                        <div style={{ display: 'flex' }}>
                          {renderStarsForDisplay(review.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem', fontStyle: 'italic', flex: 1 }}>
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        )}

        {/* Modal Popup for Form */}
        {showModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem'
          }}>
            <div className="glass-card fade-in review-modal-card">
              
              <button 
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 className="section-title" style={{ fontSize: '1.8rem', margin: 0 }}>Add Review</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.5rem' }}>We value your feedback!</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-control" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Your Rating</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex' }}>{renderStarsForForm()}</div>
                    <span style={{ fontWeight: 800, color: 'white', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '8px', minWidth: '50px', textAlign: 'center' }}>{formData.rating} / 5</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Comment</label>
                  <textarea className="form-control" placeholder="Tell us about your experience..." style={{ minHeight: '100px' }} value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} required />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting Review...' : 'Post Review'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewSection;