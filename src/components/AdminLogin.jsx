import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';

export default function AdminLogin({ onAdminLogin, onCancel }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter admin credentials.');
      return;
    }

    if (email !== 'muhammadabbas09dec@gmail.com' || password !== 'abbas123') {
      setError('Invalid admin credentials.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (response.ok && data.success) {
        if (data.user?.role !== 'admin') {
          setError('Access Denied. This account does not have administrator privileges.');
          return;
        }
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token); // set token for API calls
        onAdminLogin(data.user, data.token);
      } else {
        setError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Could not connect to server. Ensure backend is running.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07080d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(circle at 30% 20%, rgba(0,242,254,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139,92,246,0.05) 0%, transparent 50%)',
      }} />
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px', width: '500px', height: '500px',
        borderRadius: '50%', border: '1px solid rgba(0,242,254,0.06)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Admin Shield Icon */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 20px',
            background: 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(139,92,246,0.15))',
            border: '1px solid rgba(0,242,254,0.25)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px rgba(0,242,254,0.1)',
          }}>
            <Shield size={32} style={{ color: '#00f2fe' }} />
          </div>
          <h1 style={{
            color: '#fff', fontSize: '28px', fontWeight: 900,
            margin: '0 0 8px', letterSpacing: '-0.5px',
          }}>
            Admin Console
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Velocity Control Center — Authorized Access Only
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(18,20,29,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
              color: '#ef4444', fontSize: '13px', fontWeight: 600,
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block', color: '#9ca3af', fontSize: '12px',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#4b5563',
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '12px 14px 12px 42px',
                    color: '#fff', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block', color: '#9ca3af', fontSize: '12px',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                marginBottom: '8px',
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)', color: '#4b5563',
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', padding: '12px 44px 12px 42px',
                    color: '#fff', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', color: '#4b5563', cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                color: '#0a0b10',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginBottom: '10px'
              }}
            >
              {isLoading ? 'Authenticating...' : 'Access Dashboard'}
              {!isLoading && <ArrowRight size={16} />}
            </button>

            <button
              type="button"
              onClick={onCancel}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px',
                color: '#9ca3af',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
