import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cart } from '../utils/cart';
import { CartItem } from '../types';

interface CheckoutPageProps {
  onToast: (msg: string, type: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onToast }) => {
  const [items, setItems] = useState<CartItem[]>(Cart.get());
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Checkout — Gamexlk Store';
  }, []);

  const total = items.reduce((s, i) => s + Number(i.price), 0);

  const handleRemove = (id: string) => {
    Cart.remove(id);
    setItems(Cart.get());
    onToast('Item removed', 'info');
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    onToast('Order placed successfully! (Demo)', 'success');
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
      "Hi, I'd like to place an order:\n\n" +
      items.map(i => `• ${i.title} - LKR ${i.price}`).join('\n') +
      `\n\nTotal: LKR ${total.toFixed(2)}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const formatMoney = (v: string | number) => {
    const p = parseFloat(String(v));
    return p === 0 ? 'FREE' : `LKR ${p.toFixed(2)}`;
  };

  return (
    <main className="container section" style={{ paddingTop: '100px', minHeight: '90vh' }}>
      {items.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="icon">🛒</div>
          <h3>Your Cart is Empty</h3>
          <p>Looks like you haven't added any games yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Browse Store</button>
        </div>
      ) : (
        <>
          <h1 className="section-title">Checkout</h1>

          <div className="checkout-grid">
            {/* Cart Items */}
            <div className="cart-list">
              {items.map(item => (
                <div key={item.id} className="cart-item glass-card">
                  <img
                    src={item.image || '/default-game.svg'}
                    alt={item.title}
                    className="cart-item-img"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-game.svg'; }}
                  />
                  <div className="cart-item-info">
                    <a href={`/game/${item.id}`} className="cart-item-title">{item.title}</a>
                    <div className="cart-item-price">{formatMoney(item.price)}</div>
                  </div>
                  <button
                    className="btn-icon-danger"
                    onClick={() => handleRemove(item.id)}
                    title="Remove Item"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="checkout-sidebar glass-card">
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Order Summary</h2>

              <div className="summary-row"><span>Subtotal</span><span>LKR {total.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax (Estimated)</span><span>LKR 0.00</span></div>
              <div className="summary-row summary-total"><span>Total</span><span style={{ color: 'var(--accent-purple-light)' }}>LKR {total.toFixed(2)}</span></div>

              <form className="checkout-form" onSubmit={handlePayment}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="john@example.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Card Details</label>
                  <input type="text" className="form-control" placeholder="0000 0000 0000 0000" maxLength={19} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <input type="text" className="form-control" placeholder="MM/YY" maxLength={5} required />
                    <input type="text" className="form-control" placeholder="CVC" maxLength={4} required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>Confirm Payment</button>
                <div className="payment-methods">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={generatePDF}>📄 PDF</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={sendWhatsApp} style={{ color: '#25D366', borderColor: 'rgba(37, 211, 102, 0.3)' }}>💬 WhatsApp</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default CheckoutPage;
