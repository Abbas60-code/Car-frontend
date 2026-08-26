import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, User, MessageSquare, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

export default function ContactForm({ onSuccessNotification }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const data = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
    };

    try {
      // API call exact request structure:
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/contact`, data);

      if (response.data.success) {
        setStatus({
          type: 'success',
          message: response.data.message || 'Message sent successfully!'
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        if (onSuccessNotification) {
          onSuccessNotification(response.data.message || 'Message sent successfully!');
        }
      } else {
        setStatus({
          type: 'error',
          message: response.data.message || 'Something went wrong.'
        });
      }
    } catch (err) {
      console.error('Contact form submission failed:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit form. Please try again.';
      setStatus({
        type: 'error',
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-container" style={{
      background: 'linear-gradient(135deg, rgba(18, 20, 29, 0.8), rgba(26, 30, 46, 0.95))',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '24px',
      padding: '36px',
      maxWidth: '650px',
      margin: '0 auto',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(16px)',
      color: '#fff'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.2)',
          color: '#00f2fe',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>Get In Touch</span>
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px 0', background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Contact Our Concierge
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
          Have questions or custom requests? Send us a message and our team will reply within 24 hours.
        </p>
      </div>

      {status && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '14px',
          fontWeight: 500,
          background: status.type === 'success' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${status.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: status.type === 'success' ? '#4ade80' : '#f87171'
        }}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                name="name"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Subject</label>
            <div style={{ position: 'relative' }}>
              <MessageSquare size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                name="subject"
                placeholder="Inquiry / Special Request"
                value={formData.subject}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', color: '#9ca3af', fontWeight: 500 }}>Message *</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Type your message here..."
            value={formData.message}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
            color: '#0a0b10',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(0, 242, 254, 0.3)',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <span>Sending...</span>
          ) : (
            <>
              <Send size={16} />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
