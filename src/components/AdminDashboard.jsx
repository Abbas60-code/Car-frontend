import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, Car, Users, Calendar, TrendingUp, Settings,
  Plus, Edit2, Trash2, CheckCircle, XCircle, Clock, Shield,
  Upload, X, Search, ChevronDown, AlertCircle, RefreshCw, Star
} from 'lucide-react';

const API = 'http://localhost:9000/api';

const getToken = () => localStorage.getItem('admin_token') || localStorage.getItem('token');

const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  return res.json();
};

const statusColors = {
  Available: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Rented:    { bg: 'rgba(0,242,254,0.15)',  color: '#00f2fe',  border: 'rgba(0,242,254,0.3)' },
  Maintenance: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Confirmed: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Pending:   { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Completed: { bg: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: 'rgba(139,92,246,0.3)' },
  Cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444',  border: 'rgba(239,68,68,0.3)' },
  admin:     { bg: 'rgba(0,242,254,0.15)',  color: '#00f2fe',  border: 'rgba(0,242,254,0.3)' },
  user:      { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
};

const getCarImageStyle = (image) => {
  if (!image) return { background: 'linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)' };
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/') || image.startsWith('data:')) {
    return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
  }
  return { background: image };
};

function StatusBadge({ status }) {
  const s = statusColors[status] || statusColors['user'];
  return (
    <span style={{
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
      padding: '3px 10px', borderRadius: '99px',
      fontSize: '12px', fontWeight: 700, letterSpacing: '0.3px',
    }}>{status}</span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <div style={{
      background: 'rgba(18,20,29,0.8)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.2s, border-color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,242,254,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle at 80% 20%, ${accent || 'rgba(0,242,254,0.12)'}, transparent 70%)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{ background: accent ? `${accent}22` : 'rgba(0,242,254,0.1)', border: `1px solid ${accent || 'rgba(0,242,254,0.2)'}`, borderRadius: '10px', padding: '8px', color: accent || '#00f2fe' }}>
          <Icon size={20} />
        </div>
        <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
      <p style={{ fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{value}</p>
      {sub && <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
      {children}
    </div>
  );
}

// ─── Add / Edit Car Modal ─────────────────────────────────────────────────────
function CarModal({ car, onClose, onSave }) {
  const isEdit = !!car?._id;
  const [form, setForm] = useState({
    name: car?.name || '', brand: car?.brand || '', type: car?.type || 'Sports',
    pricePerDay: car?.pricePerDay || '', speed: car?.speed || '',
    acceleration: car?.acceleration || '', transmission: car?.transmission || 'Automatic',
    fuel: car?.fuel || 'Petrol', seats: car?.seats || 4,
    status: car?.status || 'Available', description: car?.description || '',
    image: car?.image || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(car?.image || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      let body;
      let fetchOpts;

      if (imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('image', imageFile);
        fetchOpts = {
          method: isEdit ? 'PUT' : 'POST',
          headers: { Authorization: `Bearer ${getToken()}` },
          body: fd,
        };
      } else {
        body = JSON.stringify(form);
        fetchOpts = {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body,
        };
      }

      const url = isEdit ? `${API}/cars/${car._id}` : `${API}/cars`;
      const res = await fetch(url, fetchOpts);
      const data = await res.json();

      if (!data.success) throw new Error(data.message || 'Failed to save car');
      onSave(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      backdropFilter: 'blur(6px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#12141d', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', width: '100%', maxWidth: '720px',
        maxHeight: '90vh', overflowY: 'auto', padding: '32px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 800, margin: 0 }}>
            {isEdit ? '✏️ Edit Car' : '🚗 Add New Car'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Car Name">
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Porsche 911 GT3 RS" required />
          </FormField>
          <FormField label="Brand">
            <input style={inputStyle} value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Porsche" required />
          </FormField>
          <FormField label="Type">
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
              {['Sports','Electric','Luxury','SUV','Executive'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Price Per Day ($)">
            <input style={inputStyle} type="number" value={form.pricePerDay} onChange={e => setForm(p => ({ ...p, pricePerDay: e.target.value }))} placeholder="e.g. 450" required />
          </FormField>
          <FormField label="Top Speed">
            <input style={inputStyle} value={form.speed} onChange={e => setForm(p => ({ ...p, speed: e.target.value }))} placeholder="e.g. 319 km/h" />
          </FormField>
          <FormField label="0-100 Acceleration">
            <input style={inputStyle} value={form.acceleration} onChange={e => setForm(p => ({ ...p, acceleration: e.target.value }))} placeholder="e.g. 3.2s" />
          </FormField>
          <FormField label="Transmission">
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.transmission} onChange={e => setForm(p => ({ ...p, transmission: e.target.value }))}>
              {['Automatic','Manual'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Fuel Type">
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.fuel} onChange={e => setForm(p => ({ ...p, fuel: e.target.value }))}>
              {['Petrol','Electric','Hybrid','Diesel'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Seats">
            <input style={inputStyle} type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: e.target.value }))} />
          </FormField>
          <FormField label="Status">
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {['Available','Rented','Maintenance'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FormField>

          <div style={{ gridColumn: '1/-1' }}>
            <FormField label="Image (Upload file or paste CSS gradient/URL)">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <label style={{
                  background: 'rgba(0,242,254,0.1)', border: '1px dashed rgba(0,242,254,0.4)',
                  borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', color: '#00f2fe',
                  fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                  flexShrink: 0,
                }}>
                  <Upload size={14} /> Upload Image
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                </label>
                <input style={{ ...inputStyle, flex: 1 }} value={form.image} onChange={e => { setForm(p => ({ ...p, image: e.target.value })); setPreview(e.target.value); }} placeholder="linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)" />
              </div>
            </FormField>
          </div>

          {preview && (
            <div style={{ gridColumn: '1/-1' }}>
              <div style={{
                height: '120px', borderRadius: '10px', overflow: 'hidden',
                background: preview.startsWith('http') ? `url(${preview}) center/cover` : preview,
                border: '1px solid rgba(255,255,255,0.1)',
              }} />
            </div>
          )}

          <div style={{ gridColumn: '1/-1' }}>
            <FormField label="Description (optional)">
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the car..." />
            </FormField>
          </div>

          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#9ca3af', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', border: 'none', color: '#0a0b10', fontWeight: 800, padding: '10px 28px', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontSize: '14px' }}>
              {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add to Fleet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Fleet Tab ────────────────────────────────────────────────────────────────
function FleetTab({ token }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCar, setModalCar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const data = await apiFetch('/cars');
    if (data.success) setCars(data.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this car from the fleet?')) return;
    const data = await apiFetch(`/cars/${id}`, { method: 'DELETE' });
    if (data.success) setCars(prev => prev.filter(c => c._id !== id));
  };

  const handleSave = (savedCar) => {
    setCars(prev => {
      const idx = prev.findIndex(c => c._id === savedCar._id);
      if (idx >= 0) { const updated = [...prev]; updated[idx] = savedCar; return updated; }
      return [savedCar, ...prev];
    });
    setShowModal(false); setModalCar(null);
  };

  const filtered = cars.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.brand?.toLowerCase().includes(search.toLowerCase()) ||
    c.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px 10px 38px', color: '#fff', fontSize: '14px', outline: 'none', width: '260px' }}
            placeholder="Search fleet..." value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button onClick={() => { setModalCar(null); setShowModal(true); }} style={{
          background: 'linear-gradient(135deg, #00f2fe, #4facfe)', border: 'none', color: '#0a0b10',
          fontWeight: 800, padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px',
        }}>
          <Plus size={16} /> Add New Car
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading fleet...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>
          <Car size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p style={{ fontSize: '16px' }}>{cars.length === 0 ? 'No cars in fleet yet. Add your first car!' : 'No cars match your search.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(car => (
            <div key={car._id} style={{
              background: 'rgba(18,20,29,0.8)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,242,254,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ height: '140px', position: 'relative', ...getCarImageStyle(car.image) }}>
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}><StatusBadge status={car.status} /></div>
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>{car.name}</h4>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{car.brand} · {car.type}</p>
                  </div>
                  <span style={{ color: '#00f2fe', fontWeight: 800, fontSize: '18px' }}>${car.pricePerDay}<span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 400 }}>/day</span></span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {[car.transmission, car.fuel, `${car.seats} Seats`].map(t => (
                    <span key={t} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '3px 9px', fontSize: '12px', color: '#9ca3af' }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => { setModalCar(car); setShowModal(true); }} style={{
                    flex: 1, background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)',
                    color: '#00f2fe', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => handleDelete(car._id)} style={{
                    flex: 1, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  }}>
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <CarModal car={modalCar} onClose={() => { setShowModal(false); setModalCar(null); }} onSave={handleSave} />}
    </div>
  );
}

// ─── Bookings Tab ─────────────────────────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/bookings/all').then(data => {
      if (data.success) setBookings(data.data);
      setLoading(false);
    });
  }, []);

  const updateStatus = async (id, status) => {
    const data = await apiFetch(`/bookings/${id}/status`, {
      method: 'PUT', body: JSON.stringify({ status }),
    });
    if (data.success) {
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking record?')) return;
    const data = await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
    if (data.success) {
      setBookings(prev => prev.filter(b => b._id !== id));
    } else {
      alert(data.message || 'Failed to delete booking');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>Loading bookings...</div>;
  if (bookings.length === 0) return (
    <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>
      <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
      <p>No bookings yet.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {bookings.map(b => (
        <div key={b._id} style={{
          background: 'rgba(18,20,29,0.8)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px', padding: '18px 22px',
          display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
        }}>
          <div style={{ width: '60px', height: '50px', borderRadius: '8px', flexShrink: 0, ...getCarImageStyle(b.car?.image) }} />
          <div style={{ flex: 1, minWidth: '180px' }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: '0 0 3px' }}>{b.car?.name || 'Unknown Car'}</p>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              {b.user?.name || 'Unknown'} · {b.user?.email}
            </p>
          </div>
          <div style={{ color: '#9ca3af', fontSize: '13px', minWidth: '160px' }}>
            <p style={{ margin: '0 0 2px' }}>{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</p>
            <p style={{ color: '#00f2fe', fontWeight: 700, margin: 0 }}>${b.totalAmount?.toLocaleString()}</p>
          </div>
          <StatusBadge status={b.status} />
          <div style={{ display: 'flex', gap: '8px' }}>
            {b.status === 'Pending' && (
              <button onClick={() => updateStatus(b._id, 'Confirmed')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> Confirm
              </button>
            )}
            {b.status === 'Confirmed' && (
              <button onClick={() => updateStatus(b._id, 'Completed')} style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={12} /> Complete
              </button>
            )}
            {!['Cancelled','Completed'].includes(b.status) && (
              <button onClick={() => updateStatus(b._id, 'Cancelled')} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <XCircle size={12} /> Cancel
              </button>
            )}
            <button onClick={() => deleteBooking(b._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} title="Delete Booking">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiFetch('/admin/users').then(data => {
      if (data.success) setUsers(data.data);
      setLoading(false);
    });
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    const data = await apiFetch(`/admin/users/${user._id}/role`, {
      method: 'PUT', body: JSON.stringify({ role: newRole }),
    });
    if (data.success) {
      setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) return;
    const data = await apiFetch(`/admin/users/${user._id}`, { method: 'DELETE' });
    if (data.success) {
      setUsers(prev => prev.filter(u => u._id !== user._id));
    } else {
      alert(data.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>Loading users...</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px 10px 38px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map(u => (
          <div key={u._id} style={{
            background: 'rgba(18,20,29,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: '14px',
          }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a0b10', fontWeight: 800, fontSize: '16px', flexShrink: 0 }}>
              {u.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '15px', margin: '0 0 2px' }}>{u.name}</p>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{u.email}</p>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0, minWidth: '120px' }}>
              Joined {new Date(u.createdAt).toLocaleDateString()}
            </p>
            <StatusBadge status={u.role} />
            {u._id !== currentUserId && u.email !== 'muhammadabbas09dec@gmail.com' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => toggleRole(u)} style={{
                  background: u.role === 'admin' ? 'rgba(245,158,11,0.1)' : 'rgba(0,242,254,0.1)',
                  border: `1px solid ${u.role === 'admin' ? 'rgba(245,158,11,0.3)' : 'rgba(0,242,254,0.3)'}`,
                  color: u.role === 'admin' ? '#f59e0b' : '#00f2fe',
                  padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                }}>
                  {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                </button>
                <button onClick={() => deleteUser(u)} style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#ef4444',
                  padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }} title="Delete User">
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/admin/stats').then(data => {
      if (data.success) setStats(data.stats);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', color: '#6b7280', padding: '60px 0' }}>Loading stats...</div>;
  if (!stats) return <div style={{ textAlign: 'center', color: '#ef4444', padding: '60px 0' }}>Failed to load stats.</div>;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <StatCard icon={TrendingUp} label="Total Revenue" value={`$${stats.totalRevenue?.toLocaleString() || 0}`} sub="From confirmed & completed bookings" accent="rgba(16,185,129,0.5)" />
        <StatCard icon={Calendar} label="Total Bookings" value={stats.totalBookings || 0} sub={`${stats.activeBookings || 0} currently active`} accent="rgba(0,242,254,0.5)" />
        <StatCard icon={Car} label="Fleet Size" value={stats.totalCars || 0} sub={`${stats.availableCars || 0} available now`} accent="rgba(139,92,246,0.5)" />
        <StatCard icon={Users} label="Registered Users" value={stats.totalUsers || 0} sub="Total platform members" accent="rgba(245,158,11,0.5)" />
      </div>

      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '18px', marginBottom: '16px' }}>Fleet Status</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Available', value: stats.availableCars, color: '#10b981' },
          { label: 'Rented', value: stats.rentedCars, color: '#00f2fe' },
          { label: 'Maintenance', value: stats.maintenanceCars, color: '#f59e0b' },
        ].map(item => (
          <div key={item.label} style={{ background: 'rgba(18,20,29,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }} />
              <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
            </div>
            <p style={{ color: item.color, fontSize: '28px', fontWeight: 800, margin: 0 }}>{item.value || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard({ currentUser }) {
  const [tab, setTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'fleet', label: 'Fleet Management', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const userId = (() => {
    try { return JSON.parse(localStorage.getItem('user'))?.id; } catch { return null; }
  })();

  return (
    <div style={{ minHeight: '100vh', background: '#0a0b10', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)', borderRadius: '12px', padding: '10px', color: '#0a0b10' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Welcome back, <span style={{ color: '#00f2fe' }}>{currentUser?.split('@')[0]}</span> — Velocity Control Center
            </p>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '6px', border: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '10px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                background: active ? 'linear-gradient(135deg, #00f2fe22, #4facfe22)' : 'transparent',
                color: active ? '#00f2fe' : '#6b7280',
                boxShadow: active ? 'inset 0 0 0 1px rgba(0,242,254,0.3)' : 'none',
              }}>
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {tab === 'overview' && <OverviewTab />}
          {tab === 'fleet' && <FleetTab />}
          {tab === 'bookings' && <BookingsTab />}
          {tab === 'users' && <UsersTab currentUserId={userId} />}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select option { background: #12141d; color: #fff; }
      `}</style>
    </div>
  );
}
