import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ShieldCheck, Heart, LogIn, RefreshCw, Car } from 'lucide-react';

export default function MyGarage({ currentUser, setPage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:9000/api/bookings/my-bookings', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user bookings:', err);
        setLoading(false);
      });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center" style={{ maxWidth: '540px' }}>
          <div className="success-icon-wrapper" style={{ color: 'var(--primary)' }}>
            <Clock size={56} />
          </div>
          <div className="auth-header">
            <h2>Access Your Garage</h2>
            <p>Please sign in to view your reserved luxury fleet, active bookings, and rental history.</p>
          </div>
          <button
            type="button"
            className="btn-primary auth-submit mt-4"
            onClick={() => setPage('login')}
          >
            <LogIn size={16} className="mr-1" />
            <span>Sign In to Account</span>
          </button>
          <button
            type="button"
            className="btn-secondary auth-submit mt-2"
            onClick={() => setPage('home')}
          >
            Back to Showroom
          </button>
        </div>
      </div>
    );
  }

  const activeRentals = bookings.filter((b) => ['Confirmed', 'Pending'].includes(b.status));
  const pastRentals = bookings.filter((b) => ['Completed', 'Cancelled'].includes(b.status));

  const getCarImageStyle = (image) => {
    if (!image) return { background: 'linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)' };
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/') || image.startsWith('data:')) {
      return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: image };
  };

  return (
    <div className="showroom-section" style={{ minHeight: '70vh' }}>
      <div className="section-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h2 className="section-title">My Garage</h2>
          <p className="section-subtitle">Manage your premium rental reservations and active bookings</p>
        </div>
        <div className="user-badge" style={{ padding: '8px 20px', fontSize: '15px' }}>
          <User size={16} />
          <span>{currentUser.split('@')[0]}</span>
        </div>
      </div>

      {/* User Dashboard Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="benefit-card" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Bookings</h4>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-highlight)' }}>{bookings.length} {bookings.length === 1 ? 'Vehicle' : 'Vehicles'}</p>
        </div>
        <div className="benefit-card" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Active Rentals</h4>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>{activeRentals.length}</p>
        </div>
        <div className="benefit-card" style={{ padding: '24px' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Membership Status</h4>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-highlight)' }}>VIP Member</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading your garage reservations...</p>
        </div>
      ) : (
        <>
          {/* Active Rental Reservation */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-highlight)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary)' }} />
              <span>Active Reservations ({activeRentals.length})</span>
            </h3>

            {activeRentals.length === 0 ? (
              <div className="car-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Car size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <p style={{ margin: '0 0 12px', fontSize: '15px' }}>You have no active car reservations right now.</p>
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }} onClick={() => setPage('home')}>
                  Browse Fleet & Rent Now
                </button>
              </div>
            ) : (
              activeRentals.map((rental) => (
                <div key={rental._id} className="car-card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <div style={{ width: '240px', height: '140px', ...getCarImageStyle(rental.car?.image) }} className="car-card-image"></div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-highlight)' }}>{rental.car?.name || 'Luxury Vehicle'}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                          <Calendar size={14} />
                          <span>{new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.endDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <span className="car-tag" style={{ position: 'static' }}>{rental.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#00f2fe' }}>${rental.totalAmount?.toLocaleString()} Total</span>
                      <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>Ready for pickup</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* History */}
          {pastRentals.length > 0 && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-highlight)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={20} style={{ color: 'var(--text-muted)' }} />
                <span>Rental History ({pastRentals.length})</span>
              </h3>
              {pastRentals.map((rental) => (
                <div key={rental._id} className="car-card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', opacity: 0.85, marginBottom: '16px' }}>
                  <div style={{ width: '240px', height: '120px', ...getCarImageStyle(rental.car?.image) }} className="car-card-image"></div>
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-highlight)' }}>{rental.car?.name || 'Luxury Vehicle'}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <Calendar size={14} />
                          <span>{new Date(rental.startDate).toLocaleDateString()} → {new Date(rental.endDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 600 }}>{rental.status}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>${rental.totalAmount?.toLocaleString()} Total</span>
                      <button className="text-link-btn" onClick={() => setPage('home')}>Rent Again</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
