import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../utils/cart';
import { api } from '../utils/api';
import { CartItem } from '../types';

import SubHero from '../components/SubHero';

interface CheckoutPageProps {
  onToast: (msg: string, type: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onToast }) => {
  const [items, setItems] = useState<CartItem[]>(Cart.get());
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    discord: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Checkout | GamexLK Store';
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const total = items.reduce((s, i) => s + Number(i.price), 0);

  const handleRemove = (id: string) => {
    Cart.remove(id);
    setItems(Cart.get());
    onToast('Item removed', 'info');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        buyer_name: formData.fullName,
        buyer_email: formData.email,
        buyer_whatsapp: formData.whatsapp,
        buyer_discord: formData.discord,
        total_amount: total,
        items: items
      };

      const res = await api.post<any>('/api/orders', payload);
      if (res.success) {
        onToast('Order placed successfully!', 'success');
        items.forEach(i => Cart.remove(i.id));
        setItems([]);
        setTimeout(() => navigate('/'), 2000);
      } else {
        onToast(res.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      onToast('Failed to connect to server', 'error');
    }
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      onToast('Please allow popups to generate invoice', 'error');
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - Gamexlk Store</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1f2937; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f3f4f6; }
            .brand { font-size: 24px; font-weight: 700; color: #7c3aed; letter-spacing: -0.5px; }
            .invoice-details { text-align: right; }
            .invoice-title { font-size: 32px; font-weight: 800; color: #111; margin: 0 0 10px 0; }
            .meta { color: #6b7280; font-size: 14px; margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            th { text-align: left; padding: 12px; border-bottom: 2px solid #e5e7eb; color: #4b5563; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
            td { padding: 16px 12px; border-bottom: 1px solid #f3f4f6; }
            .price { text-align: right; font-family: monospace; font-size: 15px; }
            .total-row td { border-top: 2px solid #111; border-bottom: none; font-weight: 700; font-size: 18px; padding-top: 20px; color: #111; }
            .footer { text-align: center; color: #9ca3af; font-size: 13px; margin-top: 60px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">Gamexlk Store</div>
            <div class="invoice-details">
              <h1 class="invoice-title">INVOICE</h1>
              <p class="meta">Date: ${new Date().toLocaleDateString()}</p>
              <p class="meta">Order ID: #${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
              <p class="meta">Billed To: ${formData.fullName || 'Guest'}</p>
            </div>
          </div>
          <table>
            <thead><tr><th>Item Description</th><th style="text-align: right">Price</th></tr></thead>
            <tbody>
              ${items.map(i => `<tr><td>${i.title}</td><td class="price">${formatMoney(i.price)}</td></tr>`).join('')}
            </tbody>
            <tfoot><tr class="total-row"><td>Total</td><td class="price">LKR ${total.toFixed(2)}</td></tr></tfoot>
          </table>
          <div class="footer"><p>Thank you for your purchase!</p><p>Gamexlk Store Digital Invoice</p></div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(
      `Hi, I'm ${formData.fullName || 'a customer'}. I'd like to place an order:\n\n` +
      items.map(i => `• ${i.title} - LKR ${i.price}`).join('\n') +
      `\n\nTotal: LKR ${total.toFixed(2)}` +
      (formData.discord ? `\nDiscord: ${formData.discord}` : '')
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const formatMoney = (v: string | number) => {
    const p = parseFloat(String(v));
    return p === 0 ? 'FREE' : `LKR ${p.toFixed(2)}`;
  };

  return (
    <div className="fade-in">
      <SubHero 
        title="Checkout"
        subtitle="Complete your purchase and start gaming. We offer instant delivery for almost all products."
        breadcrumbItems={[
          { label: 'Home', onClick: () => navigate('/') },
          { label: 'Checkout' }
        ]}
      />
      <main className="container section">
        {items.length === 0 ? (
          <div className="empty-state glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Looks like you haven't added any games yet.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>Browse Store</button>
          </div>
        ) : (
          <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem' }}>
            {/* Cart Items List */}
            <div style={{ gridColumn: 'span 8' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Your Selection</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {items.map(item => (
                  <div key={item.id} className="glass-card cart-item-row" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '1.5rem', position: 'relative' }}>
                    <img
                      src={item.image || '/default-game.svg'}
                      alt={item.title}
                      style={{ width: '120px', height: '68px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                      onError={(e: any) => { e.target.src = '/default-game.svg'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <a href={`/product/${item.id}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', display: 'block', marginBottom: '4px' }}>{item.title}</a>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-purple-light)' }}>{formatMoney(item.price)}</div>
                    </div>
                    <button
                      className="btn-danger remove-btn"
                      style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '1rem' }}
                      onClick={() => handleRemove(item.id)}
                      title="Remove Item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Form Sidebar */}
            <div style={{ gridColumn: 'span 4' }}>
              <div className="glass-card" style={{ padding: '2.5rem', position: 'sticky', top: '7rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Order Summary</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="order-summary-row" style={{ color: 'var(--text-secondary)' }}>
                    <span>Subtotal</span>
                    <span>LKR {total.toFixed(2)}</span>
                  </div>
                  <div className="order-summary-row" style={{ color: 'var(--text-secondary)' }}>
                    <span>Instant Delivery</span>
                    <span style={{ color: 'var(--accent-green)' }}>FREE</span>
                  </div>
                  <div className="order-summary-row" style={{ paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', fontSize: '1.2rem', fontWeight: 900, color: 'white' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent-purple-light)' }}>LKR {total.toFixed(2)}</span>
                  </div>
                </div>

                <form onSubmit={handlePayment}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      className="form-control"
                      placeholder="+94 7X XXX XXXX"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discord <span style={{ opacity: 0.5 }}>(Optional)</span></label>
                    <input
                      type="text"
                      name="discord"
                      className="form-control"
                      placeholder="Username#0000"
                      value={formData.discord}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}>Place Order</button>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={generatePDF} style={{ justifyContent: 'center' }}>Invoice</button>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={sendWhatsApp} style={{ justifyContent: 'center', color: '#25D366' }}>WhatsApp</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .checkout-grid { width: 100% !important; margin: 0 !important; }
        
        @media (max-width: 1024px) {
          .checkout-grid { 
            grid-template-columns: 1fr !important; 
            gap: 1.5rem !important; 
          }
          .checkout-grid > div { grid-column: span 12 !important; }
        }
        @media (max-width: 768px) {
          .checkout-grid { gap: 1rem !important; }
          .checkout-grid .glass-card { 
            padding: 1.25rem !important; 
            width: 100% !important;
            overflow: hidden !important;
          }
          .checkout-grid .glass-card h2 { font-size: 1.25rem !important; }
          
          /* Prevent price labels from splitting/overflowing */
          .order-summary-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            font-size: 0.9rem;
          }
          .order-summary-row span:last-child {
            text-align: right;
            word-break: break-all;
          }

          /* Stack cart items vertically on mobile */
          .checkout-grid .cart-item-row { 
            flex-direction: column !important; 
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          .checkout-grid .cart-item-row img {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 16/9;
          }
          .checkout-grid .cart-item-row .remove-btn {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;
