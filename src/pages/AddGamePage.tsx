import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';

interface AddGamePageProps {
  onToast: (msg: string, type: string) => void;
}

const GENRES = ['Action', 'Adventure', 'RPG', 'Strategy', 'Sports', 'Racing', 'Fighting', 'Horror', 'Simulation', 'Puzzle', 'FPS', 'MOBA', 'Other'];
const PLATFORMS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Multi-platform'];

const AddGamePage: React.FC<AddGamePageProps> = ({ onToast }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editId = new URLSearchParams(location.search).get('edit');
  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '', price: '', genre: 'Action', platform: 'PC',
    rating: '5', publisher: '', releaseDate: '', description: '', trailer: '', tags: '',
  });

  useEffect(() => {
    document.title = isEdit ? 'Edit Game — Gamexlk Store' : 'Add Game — Gamexlk Store';
    if (!localStorage.getItem('authToken')) { navigate('/login'); return; }
    if (isEdit) {
      api.get<any>(`/api/games/${editId}`).then(data => {
        if (!data.success) throw new Error(data.error);
        const g = data.game;
        setForm({
          title: g.title, price: g.price, genre: g.genre, platform: g.platform,
          rating: g.rating, publisher: g.publisher, releaseDate: g.releaseDate,
          description: g.description, trailer: g.trailer || '', tags: (g.tags || []).join(', '),
        });
        if (g.image) setPreviewSrc(g.image);
      }).catch(e => onToast('Failed to load game: ' + e.message, 'error'));
    }
  }, [editId, isEdit, navigate, onToast]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreviewSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      (fileInputRef.current as any).files = dt.files;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/games/${editId}` : '/api/games';
      let data: any;

      const hasFile = fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0;

      if (isEdit && !hasFile) {
        // If editing and no new image, send as JSON to avoid server issues with empty file fields
        data = await api.put<any>(url, { ...form } as any);
      } else {
        const fd = new FormData(e.target as HTMLFormElement);
        if (!hasFile) fd.delete('image'); // Ensure empty file field is removed
        data = isEdit ? await api.put<any>(url, fd) : await api.post<any>(url, fd);
      }

      if (data.success) {
        onToast(data.message || 'Game saved!', 'success');
        setTimeout(() => navigate(`/game/${data.game.id}`), 1200);
      } else throw new Error(data.error || 'Failed to save game');
    } catch (err: any) {
      onToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <main className="container section" style={{ paddingTop: '90px', maxWidth: 800 }}>
      <h1 id="formTitle">{isEdit ? '✏️ Edit Game' : '＋ Add a Game'}</h1>
      <div className="glass-card" style={{ marginTop: '1.5rem', padding: '2rem' }}>
        <form id="addGameForm" onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className="form-control" name="title" value={form.title} onChange={set('title')} required placeholder="Game Title" />
            </div>
            <div className="form-group">
              <label className="form-label">Price (LKR) *</label>
              <input className="form-control" name="price" type="number" value={form.price} onChange={set('price')} required min="0" step="0.01" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label className="form-label">Genre *</label>
              <select className="form-control filter-select" name="genre" value={form.genre} onChange={set('genre')}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Platform *</label>
              <select className="form-control filter-select" name="platform" value={form.platform} onChange={set('platform')}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Rating ({parseFloat(form.rating).toFixed(1)} ⭐)</label>
              <input className="form-control" name="rating" type="range" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
            </div>
            <div className="form-group">
              <label className="form-label">Publisher *</label>
              <input className="form-control" name="publisher" value={form.publisher} onChange={set('publisher')} required placeholder="Publisher name" />
            </div>
            <div className="form-group">
              <label className="form-label">Release Date *</label>
              <input className="form-control" name="releaseDate" type="date" value={form.releaseDate} onChange={set('releaseDate')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Trailer URL</label>
              <input className="form-control" name="trailer" value={form.trailer} onChange={set('trailer')} placeholder="YouTube URL" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Tags (comma-separated)</label>
              <input className="form-control" name="tags" value={form.tags} onChange={set('tags')} placeholder="Action, Multiplayer, Open World" />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={form.description} onChange={set('description')} rows={4} placeholder="Describe the game..." />
            </div>

            {/* Image Upload */}
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Cover Image</label>
              <div
                id="fileUpload"
                className={`file-upload${isDragging ? ' dragover' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault(); setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
              >
                {previewSrc
                  ? <img src={previewSrc} alt="Preview" style={{ maxHeight: 160, borderRadius: 8, marginBottom: 8 }} />
                  : <div className="file-upload-text"><strong>Click or drag to upload</strong><br /><span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>PNG, JPG, WEBP up to 10MB</span></div>}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="gameImage"
                  name="image"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" id="submitBtn" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : (isEdit ? 'Save Changes' : 'Add Game')}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/admin')}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddGamePage;
