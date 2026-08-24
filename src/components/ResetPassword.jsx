import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, KeyRound, AlertCircle, RefreshCw } from 'lucide-react';

export default function ResetPassword({ setPage, resetEmail }) {
  const [email, setEmail] = useState(resetEmail || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !otp || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError('OTP must be a 6-digit number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:9000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Could not connect to server. Make sure the backend is running.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="success-icon-wrapper">
            <CheckCircle size={56} className="success-icon" />
          </div>
          <div className="auth-header">
            <h2>Password Reset Successful</h2>
            <p>Your password has been changed successfully. You can now log in with your new password.</p>
          </div>
          <button
            type="button"
            className="btn-primary auth-submit mt-4"
            onClick={() => setPage('login')}
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Enter the OTP sent to your email and choose a new password</p>
        </div>

        {error && (
          <div className="auth-error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Field (pre-filled if from forgot page) */}
          <div className="form-group">
            <label htmlFor="reset-email">Email Address</label>
            <div className="input-icon-wrapper">
              <KeyRound className="input-icon" size={18} />
              <input
                type="email"
                id="reset-email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* OTP Field */}
          <div className="form-group">
            <label htmlFor="reset-otp">6-Digit OTP Code</label>
            <div className="input-icon-wrapper">
              <KeyRound className="input-icon" size={18} />
              <input
                type="text"
                id="reset-otp"
                placeholder="Enter 6-digit OTP from your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
                style={{ letterSpacing: otp.length > 0 ? '6px' : 'normal', fontWeight: 700 }}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="reset-password">New Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="reset-password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reset-confirm-password">Confirm New Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="reset-confirm-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary auth-submit ${isLoading ? 'btn-loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Resetting Password...</span>
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', margin: '0' }}>
            Didn't receive OTP?{' '}
            <span
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => setPage('forgot-password')}
            >
              Resend OTP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
