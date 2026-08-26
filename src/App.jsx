import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, LogIn, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MyGarage from './components/MyGarage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import RentModal from './components/RentModal';
import ContactForm from './components/ContactForm';

function App() {
  const [page, setPage] = useState('home');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser).email : null;
    } catch {
      return null;
    }
  });
  const [notification, setNotification] = useState(null);
  const [carToRent, setCarToRent] = useState(null);
  const [resetEmail, setResetEmail] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ─── Separate Admin State ──────────────────────────────────
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ─── User Auth Handlers ────────────────────────────────────
  const handleLoginSuccess = (email) => {
    setCurrentUser(email);
    setPage('home');
    showNotification(`Welcome back, ${email.split('@')[0]}!`);
  };

  const handleRegisterSuccess = (email) => {
    setPage('login');
    showNotification('Account created successfully! Please sign in.');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setPage('home');
    showNotification('Logged out successfully.');
  };

  // ─── Admin Navigation & Session Handler ─────────────────────
  const enterAdminPanelDirectly = () => {
    const savedAdminUser = localStorage.getItem('admin_user');
    const savedAdminToken = localStorage.getItem('admin_token');
    if (savedAdminUser && savedAdminToken) {
      try {
        setAdminUser(JSON.parse(savedAdminUser));
      } catch (_) {}
      setPage('admin-dashboard');
    } else {
      setPage('admin-login');
    }
  };

  const handleAdminLogin = (user, token) => {
    setAdminUser(user);
    setPage('admin-dashboard');
    showNotification('Admin Dashboard accessed successfully!');
  };

  useEffect(() => {
    const checkUrlForAdmin = () => {
      if (window.location.hash === '#/admin' || window.location.hash === '#admin' || window.location.pathname.endsWith('/admin')) {
        window.location.hash = '';
        if (window.location.pathname.endsWith('/admin')) {
          try { window.history.replaceState(null, '', '/'); } catch (_) {}
        }
        enterAdminPanelDirectly();
      }
    };
    checkUrlForAdmin();
    window.addEventListener('hashchange', checkUrlForAdmin);
    return () => window.removeEventListener('hashchange', checkUrlForAdmin);
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
    setPage('home');
    showNotification('Admin session ended.');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRentCar = (car) => {
    if (!currentUser) {
      setPage('login');
      showNotification('Please log in to reserve a car.');
    } else {
      setCarToRent(car);
    }
  };

  if (page === 'admin-login') {
    return <AdminLogin onAdminLogin={handleAdminLogin} onCancel={() => setPage('home')} />;
  }

  if (page === 'admin-dashboard' && adminUser) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0b10' }}>
        {/* Admin-only top bar */}
        <div style={{
          background: 'rgba(18,20,29,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => { setPage('home'); }} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
            }}>
              ← Back to Site
            </button>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.15)',
              borderRadius: '8px', padding: '5px 12px',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0a0b10', fontWeight: 800, fontSize: '12px',
              }}>
                {adminUser.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>{adminUser.name}</span>
              <span style={{
                fontSize: '10px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.3)', borderRadius: '4px',
                padding: '1px 6px', fontWeight: 700,
              }}>ADMIN</span>
            </div>
            <button onClick={handleAdminLogout} style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#ef4444', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600,
            }}>
              Logout
            </button>
          </div>
        </div>
        <AdminDashboard currentUser={adminUser.email} />
      </div>
    );
  }

  // ─── Normal User Pages ──────────────────────────────────────
  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(18, 20, 29, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 600,
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease'
        }}>
          <Sparkles size={16} style={{ color: '#00f2fe' }} />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="main-header">
        <a href="#" className="logo-wrapper" onClick={(e) => { e.preventDefault(); setPage('home'); setMobileMenuOpen(false); }}>
          <Shield className="logo-icon" size={26} />
          <span className="logo-text">VELOCITY<span className="logo-accent">.</span></span>
        </a>

        <nav className="nav-links">
          <span className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>Home</span>
          <a href="#showroom" className="nav-link" onClick={() => setPage('home')}>Showroom</a>
          <span className={`nav-link ${page === 'garage' ? 'active' : ''}`} onClick={() => setPage('garage')}>My Garage</span>
          <span
            className={`nav-link ${page === 'contact' ? 'active' : ''}`}
            onClick={() => {
              if (page === 'home') {
                const el = document.getElementById('contact');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
              }
              setPage('contact');
            }}
          >
            Contact
          </span>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-badge" onClick={() => setPage('garage')}>
                <span className="user-avatar">{currentUser[0].toUpperCase()}</span>
                <span>{currentUser.split('@')[0]}</span>
              </div>
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={handleLogout}>
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setPage('login')}>
                <LogIn size={15} />
                <span>Login</span>
              </button>
              <button className="btn-primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={() => setPage('register')}>
                Sign Up
              </button>
            </>
          )}
          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(o => !o)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <span className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>🏠 Home</span>
        <span className="nav-link" onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>🚗 Showroom</span>
        <span className={`nav-link ${page === 'garage' ? 'active' : ''}`} onClick={() => { setPage('garage'); setMobileMenuOpen(false); }}>🔑 My Garage</span>
        <span className={`nav-link ${page === 'contact' ? 'active' : ''}`} onClick={() => {
          if (page === 'home') {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          } else {
            setPage('contact');
          }
          setMobileMenuOpen(false);
        }}>📬 Contact</span>
        {!currentUser && (
          <>
            <span className="nav-link" onClick={() => { setPage('login'); setMobileMenuOpen(false); }}>🔐 Login</span>
            <span className="nav-link" onClick={() => { setPage('register'); setMobileMenuOpen(false); }}>✨ Sign Up</span>
          </>
        )}
        {currentUser && (
          <span className="nav-link" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>🚪 Logout</span>
        )}
      </nav>

      {/* Render selected view */}
      <main style={{ flexGrow: 1 }}>
        {page === 'home' && <Home onRentClick={handleRentCar} onAdminSearch={enterAdminPanelDirectly} />}
        {page === 'login' && <Login setPage={setPage} onLoginSuccess={handleLoginSuccess} />}
        {page === 'register' && <Register setPage={setPage} onRegisterSuccess={handleRegisterSuccess} />}
        {page === 'forgot-password' && <ForgotPassword setPage={setPage} onOtpSent={(email) => { setResetEmail(email); setPage('reset-password'); }} />}
        {page === 'reset-password' && <ResetPassword setPage={setPage} resetEmail={resetEmail} />}
        {page === 'garage' && <MyGarage currentUser={currentUser} setPage={setPage} />}
        {page === 'contact' && (
          <div style={{ padding: '60px 20px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ContactForm onSuccessNotification={showNotification} />
          </div>
        )}
      </main>

      {/* Rent Booking Modal */}
      {carToRent && (
        <RentModal
          car={carToRent}
          currentUser={currentUser}
          onClose={() => setCarToRent(null)}
          onBookingSuccess={(booking) => {
            showNotification(`🎉 Reservation for ${carToRent.name} confirmed! Check My Garage.`);
            setCarToRent(null);
          }}
          onRequireLogin={() => {
            setCarToRent(null);
            setPage('login');
            showNotification('Please log in to complete your booking.');
          }}
        />
      )}

      {/* Main Footer */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>VELOCITY<span className="logo-accent">.</span></h3>
            <p>Premium car rental fleet in North America. Rent executive sedans, supercars, and high-performance models online.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><span className="nav-link" onClick={() => setPage('home')}>Home</span></li>
              <li><a href="#showroom" className="nav-link" onClick={() => setPage('home')}>Showroom Fleet</a></li>
              <li><span className="nav-link" onClick={() => setPage('login')}>Member Login</span></li>
              <li><span className="nav-link" onClick={() => setPage('garage')}>My Garage</span></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact Info</h4>
            <ul>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>Support: +1 (555) 019-2834</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>Location: Manhattan, New York</li>
              <li style={{ fontSize: '14px', color: '#9ca3af' }}>Email: booking@velocity.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Velocity Showroom Rentals. All rights reserved.</p>
          <div className="footer-socials">
            <span className="nav-link">Twitter</span>
            <span className="nav-link">Instagram</span>
            <span className="nav-link">LinkedIn</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
