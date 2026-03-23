import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';
import { Cart } from '../utils/cart';
import { formatPrice } from '../utils/api';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const navigate = useNavigate();
  const items: CartItem[] = Cart.get();

  if (!isOpen) return null;

  const total = items.reduce((s, i) => s + parseFloat(String(i.price)), 0);
  const price = (v: string | number) => parseFloat(String(v)) === 0 ? 'FREE' : `LKR ${parseFloat(String(v)).toFixed(2)}`;

  const handleRemove = (id: string) => {
    Cart.remove(id);
    onUpdate();
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: 'flex' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>🛒 Your Cart</h2>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>✕</button>
        </div>

        <div id="cartItems" style={{ maxHeight: '50vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="icon">🛒</div>
              <h3>Cart is empty</h3>
              <p>Add some games!</p>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
                <div style={{ width: 60, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i.image
                    ? <img src={i.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).parentElement!.innerHTML = '🎮'; }} alt={i.title} />
                    : '🎮'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i.title}</div>
                  <div style={{ color: 'var(--accent-purple-light)', fontWeight: 700, fontSize: '0.9rem' }}>{price(i.price)}</div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemove(i.id)}>✕</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{items.length} item{items.length !== 1 ? 's' : ''}</div>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-purple-light)' }}>LKR {total.toFixed(2)}</div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => { onClose(); navigate('/checkout'); }}
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
