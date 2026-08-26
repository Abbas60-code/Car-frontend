import React, { useState } from 'react';
import { X, Calendar, DollarSign, Clock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RentModal({ car, currentUser, onClose, onBookingSuccess, onRequireLogin }) {
  // Default start date = today, default end date = 3 days from now
  const todayStr = new Date().toISOString().split('T')[0];
  const next3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(next3Days);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!car) return null;

  const pricePerDay = car.pricePerDay || car.price || 300;

  // Calculate days between start and end
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalAmount = days * pricePerDay;

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    if (!token || !currentUser) {
      onRequireLogin();
      return;
    }

    if (end <= start) {
      setError('Return date must be after pickup date.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          carId: car._id,
          startDate,
          endDate,
          totalAmount,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onBookingSuccess) onBookingSuccess(data.data);
          onClose();
        }, 1800);
      } else {
        setError(data.message || 'Could not complete reservation. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('Network error while creating booking. Make sure backend is running.');
      console.error('Booking error:', err);
    }
  };

  const getCarImageStyle = (image) => {
    if (!image) return { background: 'linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)' };
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/') || image.startsWith('data:')) {
      return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: image };
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      backdropFilter: 'blur(8px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#12141d', border: '1px solid rgba(0,242,254,0.25)',
        borderRadius: '24px', width: '100%', maxWidth: '560px',
        maxHeight: '92vh', overflowY: 'auto', padding: '32px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,242,254,0.1)',
        position: 'relative',
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9ca3af',
          borderRadius: '50%', width: '36px', height: '36px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <X size={18} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '40px 10px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)', border: '2px solid #10b981',
              color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>
              Reservation Confirmed!
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '15px', margin: '0 0 16px' }}>
              Your booking for <strong style={{ color: '#00f2fe' }}>{car.name}</strong> has been registered in the system.
            </p>
            <p style={{ color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
              Redirecting you to showroom...
            </p>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <span style={{
                background: 'rgba(0,242,254,0.1)', color: '#00f2fe',
                border: '1px solid rgba(0,242,254,0.3)', padding: '4px 12px',
                borderRadius: '99px', fontSize: '12px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>
                Instant Reservation
              </span>
              <h2 style={{ color: '#fff', fontSize: '24px', fontWeight: 800, margin: '10px 0 4px' }}>
                Rent {car.name}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                {car.brand} · {car.type} Category
              </p>
            </div>

            {/* Car Preview Banner */}
            <div style={{
              height: '140px', borderRadius: '14px', marginBottom: '24px',
              ...getCarImageStyle(car.image),
              border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', bottom: '12px', right: '12px',
                background: 'rgba(10,11,16,0.85)', backdropFilter: 'blur(8px)',
                padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                color: '#00f2fe', fontWeight: 800, fontSize: '16px',
              }}>
                ${pricePerDay} <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>/ day</span>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444', borderRadius: '12px', padding: '12px 16px',
                marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px',
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleBooking}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                      padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Return Date
                  </label>
                  <input
                    type="date"
                    min={startDate || todayStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px',
                      padding: '10px 14px', color: '#fff', fontSize: '14px', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Pricing Breakdown Summary */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#9ca3af', fontSize: '14px' }}>
                  <span>Rental Duration</span>
                  <strong style={{ color: '#fff' }}>{days} {days === 1 ? 'Day' : 'Days'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#9ca3af', fontSize: '14px' }}>
                  <span>Rate</span>
                  <span>${pricePerDay} × {days} days</span>
                </div>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '12px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>Total Amount</span>
                  <span style={{ color: '#00f2fe', fontWeight: 900, fontSize: '24px' }}>${totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                  border: 'none', color: '#0a0b10', fontWeight: 800, fontSize: '16px',
                  padding: '14px 20px', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 8px 25px rgba(0,242,254,0.3)',
                }}
              >
                <ShieldCheck size={20} />
                <span>{loading ? 'Processing Reservation...' : 'Confirm & Rent Vehicle'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
