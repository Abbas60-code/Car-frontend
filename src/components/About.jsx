import React, { useState, useEffect } from 'react';
import { 
  Shield, Award, Users, Star, Zap, CheckCircle2, MapPin, Clock, Phone, 
  Mail, ChevronDown, ChevronUp, Sparkles, Car, Compass, ArrowRight, 
  Globe, HeartPulse, Key, Building, Target, TrendingUp, Check, ExternalLink, MessageSquare
} from 'lucide-react';

const STATS = [
  { id: 'fleet', value: '50+', label: 'Luxury & Supercars', icon: Car, change: '+12 this year' },
  { id: 'clients', value: '12,450+', label: 'Satisfied VIP Clients', icon: Users, change: '99.8% satisfaction' },
  { id: 'delivery', value: '15 Min', label: 'Express Delivery Time', icon: Clock, change: '24/7 Availability' },
  { id: 'locations', value: '5 Global', label: 'Flagship Showrooms', icon: Globe, change: 'NYC, LA, Miami, London, Dubai' },
  { id: 'rating', value: '4.98★', label: 'Average Client Rating', icon: Star, change: 'Over 3,500+ reviews' },
];

const VALUES = [
  {
    icon: Shield,
    title: 'Uncompromising Safety & Security',
    subtitle: 'Bank-Grade Telematics & Coverage',
    desc: 'Every vehicle in our fleet undergoes a 120-point mechanical inspection before each trip and includes comprehensive $5M VIP insurance policy coverage.'
  },
  {
    icon: Zap,
    title: 'White-Glove Instant Delivery',
    subtitle: 'Direct to Hangar, Estate, or Hotel',
    desc: 'Our dedicated logistics team delivers your chosen supercar straight to your location within 15–45 minutes, fully detailed, fueled, and calibrated.'
  },
  {
    icon: Award,
    title: 'Pinnacle Vehicle Curation',
    subtitle: 'Only Exclusive & Ultra-Rare Trims',
    desc: 'We do not offer base models. Our lineup consists strictly of high-horsepower GTs, performance-tuned S/RS/AMG models, electric hypercars, and flagship limousines.'
  },
  {
    icon: HeartPulse,
    title: '24/7 VIP Concierge Support',
    subtitle: 'Personalized Lifestyle Manager',
    desc: 'Enjoy direct access to a dedicated concierge manager for route suggestions, track day bookings, chauffeur requests, and instant roadside assistance.'
  },
  {
    icon: TrendingUp,
    title: 'Next-Gen Eco-Performance',
    subtitle: '30%+ Zero-Emissions Hypercars',
    desc: 'We are pioneering sustainable ultra-luxury mobility with electric powerhouses like Taycan Turbo S, Model S Plaid, and electric hypercar concepts.'
  },
  {
    icon: Key,
    title: 'Seamless Digital Key Access',
    subtitle: 'App-Controlled Unlock & Start',
    desc: 'Lock, unlock, pre-condition climate, and monitor telemetry directly from the Velocity mobile app with end-to-end encrypted digital key access.'
  }
];

const MILESTONES = [
  {
    year: '2018',
    title: 'Velocity Founded in Manhattan',
    desc: 'Started with 5 exotic supercars in New York City with a mission to revolutionize luxury vehicle rentals with ultra-transparent pricing and zero paperwork delays.',
    highlights: ['First 5 supercars acquired', '100% digital booking process launched', 'NYC VIP Concierge inaugurated']
  },
  {
    year: '2020',
    title: 'Fleet Expansion & West Coast Launch',
    desc: 'Expanded into Beverly Hills and Miami, bringing our curated high-performance fleet to executive travelers and entertainment industry VIPs.',
    highlights: ['Beverly Hills VIP Center opened', 'Fleet expanded to 25 supercars', 'Launched door-to-door delivery']
  },
  {
    year: '2022',
    title: 'Sustainable Luxury & EV Hypercars',
    desc: 'Introduced high-octane electric GTs and hypercars to our fleet, reducing our carbon footprint while boosting instant torque experiences.',
    highlights: ['30% fleet electric transition', 'Partnerships with top luxury hotels', 'Over 5,000 completed reservations']
  },
  {
    year: '2024',
    title: 'Global Showroom Network',
    desc: 'Opened international hubs in London Mayfair and Dubai Marina, enabling seamless cross-border concierge service for global executive members.',
    highlights: ['Mayfair & Dubai showrooms', 'Real-time telemetry app', '10,000+ satisfied clients']
  },
  {
    year: '2026',
    title: 'Autonomous VIP & Next-Gen Fleet',
    desc: 'Celebrating 50+ luxury models, instant AI concierge matching, and 24/7 dynamic booking with instant verification.',
    highlights: ['50+ flagship models', 'AI vehicle matching algorithm', 'Ranked #1 luxury car rental service']
  }
];

const TEAM = [
  {
    name: 'Alexander Vance',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    bio: 'Former GT3 endurance racing driver with 15+ years of experience in exotic automotive management and VIP concierge services.',
    favCar: 'Porsche 911 GT3 RS',
    quote: 'Luxury is not just driving a fast car; it is the effortless feeling of perfection from reservation to return.'
  },
  {
    name: 'Elena Rostova',
    role: 'Chief Fleet Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees our $25M+ vehicle inventory, multi-point digital telemetry inspections, and vehicle acquisition pipeline globally.',
    favCar: 'Lamborghini Revuelto',
    quote: 'We maintain our supercars to factory motorsport standards so every client experiences peak performance.'
  },
  {
    name: 'Marcus Sterling',
    role: 'VP of VIP Client Concierge',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: 'Veteran luxury hospitality executive who spent a decade orchestrating private jet charters and luxury estate access across North America and Europe.',
    favCar: 'Rolls-Royce Spectre',
    quote: 'No detail is too small. If a client needs a car delivered to a private runway at 3 AM, we make it happen flawlessly.'
  },
  {
    name: 'Dr. Sophia Chen',
    role: 'Head of EV & Technology',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'MIT engineer and former EV powertrain specialist leading our tech platform, app keyless integration, and zero-emission fleet transition.',
    favCar: 'Rimac Nevera / Lucid Air Sapphire',
    quote: 'Combining electric hypercar performance with instant digital access is the future of luxury transportation.'
  }
];

const SHOWROOMS = [
  {
    id: 'nyc',
    city: 'New York City',
    name: 'Manhattan Flagship Hub',
    address: '450 West 33rd St, Manhattan, NY 10001',
    phone: '+1 (212) 555-0192',
    hours: 'Mon - Sun: 7:00 AM - 11:00 PM',
    status: 'Open Today',
    featured: 'Ferrari SF90, Rolls-Royce Spectre, Porsche 911 GT3 RS',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'la',
    city: 'Los Angeles',
    name: 'Beverly Hills VIP Center',
    address: '9600 Wilshire Blvd, Beverly Hills, CA 90212',
    phone: '+1 (310) 555-0841',
    hours: 'Mon - Sun: 24/7 VIP Service',
    status: 'Open 24/7',
    featured: 'Lamborghini Revuelto, McLaren 750S, G 63 AMG',
    image: 'https://images.unsplash.com/photo-1580654712603-eb43273aff33?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'miami',
    city: 'Miami Beach',
    name: 'South Beach Luxury Pavilion',
    address: '1100 Ocean Drive, Miami Beach, FL 33139',
    phone: '+1 (305) 555-0377',
    hours: 'Mon - Sun: 8:00 AM - 12:00 AM',
    status: 'Open Today',
    featured: 'Ferrari F8 Spider, Aston Martin DB12 Volante',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'london',
    city: 'London',
    name: 'Mayfair Executive Showroom',
    address: '14 Berkeley Square, Mayfair, London W1J 6CB',
    phone: '+44 20 7946 0912',
    hours: 'Mon - Sat: 8:00 AM - 10:00 PM',
    status: 'Open Today',
    featured: 'Bentley Continental GT, Aston Martin DBS, Range Rover SV',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dubai',
    city: 'Dubai',
    name: 'Downtown Marina Hub',
    address: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
    phone: '+971 4 800 9000',
    hours: 'Mon - Sun: 24/7 VIP Access',
    status: 'Open 24/7',
    featured: 'Bugatti Chiron, Lamborghini Urus Performante, Rolls-Royce Cullinan',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  }
];

const FAQS = [
  {
    question: 'What is required to rent a supercar or luxury vehicle from Velocity?',
    answer: 'To reserve a vehicle, drivers must be at least 21 years of age (25+ for top-tier supercars like Ferrari SF90 or Lamborghini Revuelto), possess a valid driver’s license, provide proof of active auto insurance coverage, and submit a valid credit card for the security deposit.'
  },
  {
    question: 'How does door-to-door delivery work?',
    answer: 'Our white-glove delivery service will transport your vehicle directly to your home, office, hotel, or private airport terminal. Upon delivery, our specialist provides a 5-minute walkthrough of vehicle controls and features before handing over the keys.'
  },
  {
    question: 'Is insurance included in the daily rental rate?',
    answer: 'Comprehensive primary and secondary insurance options are available during checkout. If you already have premium auto insurance with high limits or credit card coverage, our team can quickly verify your policy within minutes.'
  },
  {
    question: 'Can I rent a car for photo shoots, VIP weddings, or corporate events?',
    answer: 'Yes! We offer flexible single-day, multi-day, weekend, and monthly rental packages for VIP events, film productions, private transport, and corporate luxury travel. Special chauffeur services are also available upon request.'
  },
  {
    question: 'What is your security deposit policy?',
    answer: 'Security deposits vary based on the vehicle tier ($1,000 to $5,000). The hold is authorized on your credit card at pickup and automatically released immediately upon safe return and inspection of the vehicle.'
  }
];

export default function About({ setPage, initialTab = 'story' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeMilestone, setActiveMilestone] = useState(4); // default latest 2026
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedShowroom, setSelectedShowroom] = useState(SHOWROOMS[0]);
  const [bookingLocationMsg, setBookingLocationMsg] = useState('');

  useEffect(() => {
    if (window.location.hash === '#showrooms' || window.location.hash === '#locations') {
      setActiveTab('showrooms');
      setTimeout(() => {
        document.querySelector('.about-main-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleShowroomVisit = (showroom) => {
    setBookingLocationMsg(`Visit request noted for ${showroom.name}! Our concierge will contact you shortly.`);
    setTimeout(() => setBookingLocationMsg(''), 5000);
  };

  const handleStatClick = (statId) => {
    if (statId === 'locations') {
      setActiveTab('showrooms');
      document.querySelector('.about-main-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (statId === 'fleet') {
      setPage('home');
      setTimeout(() => {
        document.getElementById('showroom')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (statId === 'clients') {
      setActiveTab('story');
      document.querySelector('.about-main-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('pillars');
      document.querySelector('.about-main-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="about-page-wrapper">
      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-backdrop"></div>
        <div className="about-hero-content">
          <div className="about-badge-tag">
            <Sparkles size={14} className="sparkle-icon" />
            <span>THE APEX OF AUTOMOTIVE LUXURY & PERFORMANCE</span>
          </div>

          <h1 className="about-hero-title">
            Driven by Passion. <br />
            <span className="text-gradient">Defined by Engineering Excellence.</span>
          </h1>

          <p className="about-hero-subtitle">
            Velocity is North America’s premier luxury and exotic vehicle showroom. 
            We connect executive travelers, enthusiasts, and VIP clients with an uncompromised 
            fleet of over 50 hand-curated supercars, electric hypercars, and ultra-luxury SUVs.
          </p>

          <div className="about-hero-cta">
            <button className="btn-primary" onClick={() => setPage('home')}>
              <span>Explore Fleet Showroom</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => {
              setPage('contact');
            }}>
              <MessageSquare size={16} />
              <span>Contact VIP Concierge</span>
            </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="about-stats-grid">
          {STATS.map((stat) => {
            const IconComp = stat.icon;
            return (
              <div 
                className="stat-card" 
                key={stat.id}
                onClick={() => handleStatClick(stat.id)}
                style={{ cursor: 'pointer' }}
                title={`Click to view ${stat.label}`}
              >
                <div className="stat-icon-box">
                  <IconComp size={22} />
                </div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-change-tag">{stat.change}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Navigation Tabs for Interactive Section ─────────────────── */}
      <section className="about-main-section">
        <div className="about-tab-bar">
          <button 
            className={`about-tab-btn ${activeTab === 'story' ? 'active' : ''}`}
            onClick={() => setActiveTab('story')}
          >
            <Building size={16} />
            <span>Our Story & Vision</span>
          </button>
          <button 
            className={`about-tab-btn ${activeTab === 'pillars' ? 'active' : ''}`}
            onClick={() => setActiveTab('pillars')}
          >
            <Target size={16} />
            <span>Core Values & Quality</span>
          </button>
          <button 
            className={`about-tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
            onClick={() => setActiveTab('milestones')}
          >
            <TrendingUp size={16} />
            <span>Fleet Milestones</span>
          </button>
          <button 
            className={`about-tab-btn ${activeTab === 'showrooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('showrooms')}
          >
            <Globe size={16} />
            <span>Global Showrooms</span>
          </button>
        </div>

        {/* TAB 1: OUR STORY */}
        {activeTab === 'story' && (
          <div className="tab-content-container fade-in">
            <div className="story-grid">
              <div className="story-text-col">
                <span className="section-subheading">ESTABLISHED 2018</span>
                <h2 className="section-heading">
                  Reinventing How High-Net-Worth Individuals Experience Supercars
                </h2>
                <p className="story-p">
                  Founded in New York City in 2018, Velocity was built on a simple yet uncompromising principle: 
                  <strong> renting an exotic vehicle should feel as seamless and exhilarating as owning one.</strong>
                </p>
                <p className="story-p">
                  Traditional luxury rentals were plagued by rigid paperwork, hidden fees, poor vehicle maintenance, 
                  and generic customer service. Velocity eliminated all friction by building a 100% digital reservation engine, 
                  telemetry-backed vehicle health monitoring, and a white-glove concierge delivery network.
                </p>

                <div className="story-checklist">
                  <div className="check-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <span>Every car is handpicked, spec’d with premium options, and ceramic coated</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <span>Strict 120-point digital mechanical safety inspection prior to every key handover</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <span>100% transparent pricing with zero surprise mileage fees or hidden penalties</span>
                  </div>
                  <div className="check-item">
                    <CheckCircle2 size={18} className="check-icon" />
                    <span>24/7 instant roadside protection & luxury replacement car guarantee</span>
                  </div>
                </div>
              </div>

              <div className="story-card-col">
                <div className="quote-glass-card">
                  <div className="quote-icon">“</div>
                  <p className="quote-body">
                    We don’t just rent supercars. We curate unforgettable driving memories for executives, 
                    racing enthusiasts, and visionaries across the globe.
                  </p>
                  <div className="quote-author">
                    <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" 
                      alt="Alexander Vance"
                      className="author-avatar" 
                    />
                    <div>
                      <div className="author-name">Alexander Vance</div>
                      <div className="author-title">Founder & CEO, Velocity Showroom</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CORE PILLARS & VALUES */}
        {activeTab === 'pillars' && (
          <div className="tab-content-container fade-in">
            <div className="text-center-header">
              <span className="section-subheading">THE VELOCITY PROMISE</span>
              <h2 className="section-heading">Our Core Pillars of Excellence</h2>
              <p className="section-subtext">
                Designed to deliver absolute peace of mind, high performance, and uncompromised VIP luxury.
              </p>
            </div>

            <div className="values-cards-grid">
              {VALUES.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div className="value-card" key={idx}>
                    <div className="value-card-header">
                      <div className="value-icon-wrapper">
                        <IconComp size={24} />
                      </div>
                      <span className="value-index">0{idx + 1}</span>
                    </div>
                    <h3 className="value-title">{item.title}</h3>
                    <div className="value-subtitle">{item.subtitle}</div>
                    <p className="value-desc">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: FLEET MILESTONES */}
        {activeTab === 'milestones' && (() => {
          const currentMilestone = MILESTONES[activeMilestone] || MILESTONES[0];
          return (
            <div className="tab-content-container fade-in">
              <div className="text-center-header">
                <span className="section-subheading">OUR JOURNEY & INNOVATION</span>
                <h2 className="section-heading">Evolution of Velocity (2018 - 2026)</h2>
                <p className="section-subtext">Select a year below to explore how we scaled into North America's leading exotic showroom.</p>
              </div>

              {/* Timeline selector */}
              <div className="timeline-selector-bar">
                {MILESTONES.map((m, idx) => (
                  <button
                    key={m.year}
                    className={`timeline-year-btn ${activeMilestone === idx ? 'active' : ''}`}
                    onClick={() => setActiveMilestone(idx)}
                  >
                    <span className="year-number">{m.year}</span>
                    <span className="year-dot"></span>
                  </button>
                ))}
              </div>

              {/* Selected Milestone Card */}
              <div className="milestone-display-card">
                <div className="milestone-content-left">
                  <div className="milestone-year-badge">{currentMilestone.year} MILESTONE</div>
                  <h3 className="milestone-title">{currentMilestone.title}</h3>
                  <p className="milestone-desc">{currentMilestone.desc}</p>
                  
                  <h4 className="milestone-highlights-heading">Key Achievements:</h4>
                  <ul className="milestone-highlights-list">
                    {(currentMilestone.highlights || []).map((h, i) => (
                      <li key={i}>
                        <Check size={16} className="h-icon" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="milestone-content-right">
                  <div className="milestone-stats-box">
                    <Sparkles size={32} className="milestone-sparkle" />
                    <div className="milestone-box-num">Stage 0{activeMilestone + 1}</div>
                    <div className="milestone-box-label">Continuous Automotive Innovation</div>
                    <div className="milestone-progress-bar">
                      <div 
                        className="milestone-progress-fill" 
                        style={{ width: `${((activeMilestone + 1) / MILESTONES.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="milestone-progress-txt">{((activeMilestone + 1) / MILESTONES.length) * 100}% Completion</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* TAB 4: GLOBAL SHOWROOMS */}
        {activeTab === 'showrooms' && (() => {
          const currentShowroom = selectedShowroom || SHOWROOMS[0];
          return (
            <div className="tab-content-container fade-in">
              <div className="text-center-header">
                <span className="section-subheading">WORLDWIDE PRESENCE</span>
                <h2 className="section-heading">Our Flagship Hubs & Locations</h2>
                <p className="section-subtext">Visit any of our state-of-the-art showrooms for a private vehicle viewing or lounge key pickup.</p>
              </div>

              {bookingLocationMsg && (
                <div className="showroom-alert-box">
                  <Sparkles size={18} />
                  <span>{bookingLocationMsg}</span>
                </div>
              )}

              <div className="showrooms-layout">
                {/* Showrooms List */}
                <div className="showrooms-list">
                  {SHOWROOMS.map((s) => (
                    <div 
                      key={s.id} 
                      className={`showroom-list-item ${currentShowroom.id === s.id ? 'active' : ''}`}
                      onClick={() => setSelectedShowroom(s)}
                    >
                      <div className="s-city-row">
                        <span className="s-city">{s.city}</span>
                        <span className="s-status-badge">{s.status}</span>
                      </div>
                      <div className="s-name">{s.name}</div>
                      <div className="s-address"><MapPin size={14} /> {s.address}</div>
                    </div>
                  ))}
                </div>

                {/* Showroom Detail Preview Card */}
                <div className="showroom-preview-card">
                  <div className="showroom-img-container">
                    <img 
                      src={currentShowroom.image} 
                      alt={currentShowroom.name} 
                      className="showroom-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="showroom-img-overlay">
                      <span className="showroom-city-tag">{currentShowroom.city}</span>
                    </div>
                  </div>

                  <div className="showroom-body">
                    <h3>{currentShowroom.name}</h3>
                    <div className="s-detail-row">
                      <MapPin size={16} className="s-icon" />
                      <span>{currentShowroom.address}</span>
                    </div>
                    <div className="s-detail-row">
                      <Phone size={16} className="s-icon" />
                      <span>{currentShowroom.phone}</span>
                    </div>
                    <div className="s-detail-row">
                      <Clock size={16} className="s-icon" />
                      <span>{currentShowroom.hours}</span>
                    </div>

                    <div className="featured-models-box">
                      <span className="fm-label">Featured Models on Floor:</span>
                      <p className="fm-text">{currentShowroom.featured}</p>
                    </div>

                    <div className="showroom-actions">
                      <button className="btn-primary" onClick={() => handleShowroomVisit(currentShowroom)}>
                        <Calendar size={16} style={{ marginRight: '6px' }} />
                        Book Private Viewing
                      </button>
                      <a href={`tel:${currentShowroom.phone}`} className="btn-secondary">
                        <Phone size={16} style={{ marginRight: '6px' }} />
                        Call Hub
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ─── Executive Leadership Team Section ──────────────────────── */}
      <section className="about-team-section">
        <div className="text-center-header">
          <span className="section-subheading">MEET THE VISIONARIES</span>
          <h2 className="section-heading">Executive Leadership</h2>
          <p className="section-subtext">The automotive leaders, engineers, and concierge experts behind Velocity.</p>
        </div>

        <div className="team-grid">
          {TEAM.map((member, idx) => (
            <div className="team-card" key={idx} onClick={() => setSelectedTeamMember(member)}>
              <div className="team-img-wrapper">
                <img src={member.image} alt={member.name} className="team-img" />
                <div className="team-overlay">
                  <span className="fav-car-badge">🏎️ {member.favCar}</span>
                </div>
              </div>
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-bio-snippet">{member.bio.slice(0, 85)}...</p>
                <button className="team-view-btn">
                  <span>View Full Profile</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Interactive Team Member Modal ───────────────────────────── */}
      {selectedTeamMember && (
        <div className="modal-backdrop" onClick={() => setSelectedTeamMember(null)}>
          <div className="modal-content team-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedTeamMember(null)}>✕</button>
            <div className="team-modal-grid">
              <div className="team-modal-img-col">
                <img src={selectedTeamMember.image} alt={selectedTeamMember.name} />
                <div className="fav-car-box">
                  <Car size={16} />
                  <span>Favorite Drive: <strong>{selectedTeamMember.favCar}</strong></span>
                </div>
              </div>

              <div className="team-modal-text-col">
                <span className="section-subheading">{selectedTeamMember.role}</span>
                <h2>{selectedTeamMember.name}</h2>
                
                <blockquote className="modal-quote">
                  “{selectedTeamMember.quote}”
                </blockquote>

                <h4>Background & Expertise:</h4>
                <p>{selectedTeamMember.bio}</p>

                <div className="team-modal-actions">
                  <button className="btn-primary" onClick={() => {
                    setSelectedTeamMember(null);
                    setPage('contact');
                  }}>
                    Contact Executive Office
                  </button>
                  <button className="btn-secondary" onClick={() => setSelectedTeamMember(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Frequently Asked Questions (Accordion) ──────────────────── */}
      <section className="about-faq-section">
        <div className="text-center-header">
          <span className="section-subheading">TRANSPARENCY FIRST</span>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subtext">Everything you need to know about reserving a vehicle with Velocity.</p>
        </div>

        <div className="faq-container">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                <div className="faq-header" onClick={() => toggleFaq(idx)}>
                  <h3 className="faq-question">{faq.question}</h3>
                  <div className="faq-icon-box">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {isOpen && (
                  <div className="faq-answer-body fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Call to Action (CTA) ────────────────────────────── */}
      <section className="about-cta-banner">
        <div className="cta-glass-card">
          <div className="cta-badge">
            <Zap size={14} />
            <span>READY FOR YOUR NEXT DRIVE?</span>
          </div>

          <h2>Experience Pure Automotive Exhilaration</h2>
          <p>
            Choose from over 50+ supercars, luxury SUVs, and GTs available for instant delivery to your location.
          </p>

          <div className="cta-btn-group">
            <button className="btn-primary btn-lg" onClick={() => setPage('home')}>
              <span>Browse Fleet & Reserve</span>
              <ArrowRight size={18} />
            </button>
            <button className="btn-secondary btn-lg" onClick={() => setPage('contact')}>
              <Phone size={18} />
              <span>Speak with Concierge</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
