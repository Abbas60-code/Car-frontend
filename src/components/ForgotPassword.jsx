import React, { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, Send, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';

// ─── Step Indicator ──────────────────────────────────────────────
function StepIndicator({ currentStep }) {
  const steps = ['Email', 'Verify OTP', 'New Password'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', gap: 0 }}>
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <React.Fragment key={step}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isDone
                  ? 'linear-gradient(135deg, #00f2fe, #4facfe)'
                  : isActive
                    ? 'rgba(0,242,254,0.15)'
                    : 'rgba(255,255,255,0.06)',
                border: isDone
                  ? 'none'
                  : isActive
                    ? '2px solid #00f2fe'
                    : '2px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isDone ? '#0a0b10' : isActive ? '#00f2fe' : '#4b5563',
                fontWeight: 800, fontSize: '13px', transition: 'all 0.3s',
              }}>
                {isDone ? <CheckCircle size={16} /> : step}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: isActive ? '#00f2fe' : isDone ? '#9ca3af' : '#4b5563', whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                height: '2px', flex: 1, maxWidth: '60px', margin: '0 6px 18px',
                background: step < currentStep ? 'linear-gradient(90deg, #00f2fe, #4facfe)' : 'rgba(255,255,255,0.08)',
                transition: 'all 0.3s',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── OTP Input Boxes ──────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const handleKey = (e, idx) => {
    const key = e.key;
    if (/^\d$/.test(key)) {
      const arr = value.split('').slice(0, 6);
      arr[idx] = key;
      const newVal = arr.join('').slice(0, 6);
      onChange(newVal);
      if (idx < 5) setTimeout(() => inputs.current[idx + 1]?.focus(), 10);
    } else if (key === 'Backspace') {
      const arr = value.split('');
      arr[idx] = '';
      onChange(arr.join(''));
      if (idx > 0) setTimeout(() => inputs.current[idx - 1]?.focus(), 10);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          onFocus={(e) => e.target.select()}
          style={{
            width: '48px', height: '56px', borderRadius: '12px', textAlign: 'center',
            fontSize: '22px', fontWeight: 900, color: '#fff',
            background: d.trim() ? 'rgba(0,242,254,0.12)' : 'rgba(255,255,255,0.05)',
            border: d.trim() ? '2px solid #00f2fe' : '2px solid rgba(255,255,255,0.1)',
            outline: 'none', transition: 'all 0.2s', cursor: 'text',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function ForgotPassword({ setPage, onOtpSent }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  // ── Step 1: Send OTP ──────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setStep(2);
        startResendCooldown();
      } else {
        showError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setIsLoading(false);
      showError('Cannot connect to server. Make sure the backend is running.');
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      showError('Please enter the complete 6-digit OTP.');
      return;
    }
    // We just proceed to step 3; actual OTP+password verification happens at step 3
    setStep(3);
  };

  // ── Step 3: Reset Password ────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      showError('Please fill in both password fields.');
      return;
    }
    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setStep(4); // success
      } else {
        showError(data.message || 'Invalid OTP or it has expired. Go back and try again.');
      }
    } catch {
      setIsLoading(false);
      showError('Cannot connect to server. Make sure the backend is running.');
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setError('');
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setIsLoading(false);
      setOtp('');
      startResendCooldown();
    } catch {
      setIsLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="success-icon-wrapper">
            <CheckCircle size={56} className="success-icon" />
          </div>
          <div className="auth-header">
            <h2>Password Reset!</h2>
            <p>Your password has been changed successfully. You can now log in with your new password.</p>
          </div>
          <button className="btn-primary auth-submit mt-4" onClick={() => setPage('login')}>
            Login Now →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        {/* Header */}
        <div className="auth-header" style={{ marginBottom: '8px' }}>
          <h2>
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Enter OTP'}
            {step === 3 && 'Set New Password'}
          </h2>
          <p>
            {step === 1 && 'Enter your email and we\'ll send a 6-digit OTP to your inbox'}
            {step === 2 && `Enter the OTP sent to ${email}`}
            {step === 3 && 'Almost done! Choose your new password'}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Error Alert */}
        {error && (
          <div className="auth-error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-group">
              <label htmlFor="fp-email">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="fp-email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            </div>
            <button
              type="submit"
              className={`btn-primary auth-submit ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : <><Send size={16} /><span>Send OTP to Email</span></>}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP Verification ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{
                background: 'rgba(0,242,254,0.08)', border: '1px solid rgba(0,242,254,0.2)',
                borderRadius: '10px', padding: '10px 16px', display: 'inline-block',
              }}>
                <span style={{ color: '#9ca3af', fontSize: '13px' }}>OTP sent to: </span>
                <strong style={{ color: '#00f2fe', fontSize: '13px' }}>{email}</strong>
              </div>
            </div>

            <OtpInput value={otp} onChange={setOtp} />

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={otp.length !== 6}
            >
              <ShieldCheck size={16} />
              <span>Verify OTP</span>
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              {resendCooldown > 0 ? (
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                  Resend OTP in <strong style={{ color: '#f59e0b' }}>{resendCooldown}s</strong>
                </p>
              ) : (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                  onClick={handleResend}
                >
                  <RefreshCw size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="fp-newpwd">New Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="fp-newpwd"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
                <button type="button" className="password-toggle-btn" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="fp-confirmpwd">Confirm New Password</label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  id="fp-confirmpwd"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            <button
              type="submit"
              className={`btn-primary auth-submit ${isLoading ? 'btn-loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Back Button */}
        {step < 4 && (
          <div className="auth-footer">
            <button
              type="button"
              className="back-to-login-btn"
              onClick={() => step === 1 ? setPage('login') : setStep(step - 1)}
            >
              <ArrowLeft size={16} />
              <span>{step === 1 ? 'Back to Login' : 'Go Back'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
