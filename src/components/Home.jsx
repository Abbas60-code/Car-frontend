import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Calendar, Compass, Shield, Award, Users, Star, ArrowRight, Sparkles, SlidersHorizontal, Zap } from 'lucide-react';
import ContactForm from './ContactForm';
import { defaultCars } from '../data/defaultCars';

const CATEGORIES = [
  { id: 'All', label: 'All Fleet', icon: '✨', count: 50, desc: 'Complete 50-vehicle luxury fleet' },
  { id: 'Sports', label: 'Sports', icon: '🏎️', count: 10, desc: 'High-octane track & performance supercars' },
  { id: 'Electric', label: 'Electric', icon: '⚡', count: 10, desc: 'Next-gen electric hypercars & GTs' },
  { id: 'Luxury', label: 'Luxury', icon: '💎', count: 10, desc: 'Ultra-exclusive grand tourers & VIP limousines' },
  { id: 'SUV', label: 'SUV', icon: '🚙', count: 10, desc: 'Super SUVs & high-end luxury off-roaders' },
  { id: 'Executive', label: 'Executive', icon: '👔', count: 10, desc: 'Pinnacle business & flagship executive sedans' },
];

export default function Home({ cars = [], onRentClick, onAdminSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState(2500);
  const [dbCars, setDbCars] = useState(() => {
    try {
      const cached = sessionStorage.getItem('velocity_cars');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return defaultCars;
    } catch {
      return defaultCars;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch(`${import.meta.env.VITE_API_URL || 'https://car-backend-psi.vercel.app'}/api/cars`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        clearTimeout(timeout);
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setDbCars(data.data);
          try { sessionStorage.setItem('velocity_cars', JSON.stringify(data.data)); } catch (_) {}
        }
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const checkAdminSearch = (query) => {
    if (query.trim() === '/admin') {
      if (onAdminSearch) {
        onAdminSearch();
        setSearchQuery('');
        return true;
      }
    }
    return false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      checkAdminSearch(searchQuery);
    }
  };

  const handleSearchClick = () => {
    checkAdminSearch(searchQuery);
  };

  const allCarsList = useMemo(() => {
    return (cars && cars.length > 0) ? cars : (dbCars && dbCars.length > 0 ? dbCars : defaultCars);
  }, [cars, dbCars]);

  // Extract unique brands from the fleet
  const popularBrands = useMemo(() => {
    const brandSet = new Set(['Porsche', 'Ferrari', 'Lamborghini', 'Tesla', 'Mercedes', 'BMW', 'Audi', 'Rolls-Royce', 'Bentley', 'Aston Martin']);
    allCarsList.forEach(c => {
      if (c.brand) brandSet.add(c.brand);
    });
    return Array.from(brandSet);
  }, [allCarsList]);

  // Compute counts per category dynamically
  const categoryCounts = useMemo(() => {
    const counts = { All: allCarsList.length, Sports: 0, Electric: 0, Luxury: 0, SUV: 0, Executive: 0 };
    allCarsList.forEach(c => {
      if (counts[c.type] !== undefined) {
        counts[c.type] += 1;
      }
    });
    return counts;
  }, [allCarsList]);

  const filteredCars = useMemo(() => {
    return allCarsList.filter((car) => {
      const carName = car.name || '';
      const carBrand = car.brand || '';
      const matchesSearch = !searchQuery.trim() ||
                            carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            carBrand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (car.type && car.type.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesBrand = selectedBrand === 'All' || carBrand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesType = selectedType === 'All' || car.type?.toLowerCase() === selectedType.toLowerCase();
      const carPrice = car.pricePerDay || car.price || 0;
      const matchesPrice = carPrice <= priceRange;

      return matchesSearch && matchesBrand && matchesType && matchesPrice;
    });
  }, [allCarsList, searchQuery, selectedBrand, selectedType, priceRange]);

  const renderImageStyle = (image) => {
    if (!image) return { background: 'linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)' };
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/') || image.startsWith('data:')) {
      return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: image };
  };

  const isCategorizedSectionView = selectedType === 'All' && selectedBrand === 'All' && !searchQuery.trim() && priceRange >= 2500;

  const renderCarCard = (car) => (
    <div className="car-card" key={car.id || car._id || car.name}>
      <div className="car-card-image" style={renderImageStyle(car.image)}>
        <div className="car-tag">{car.type}</div>
        <div className="car-card-specs-overlay">
          <span>{car.speed}</span>
          <span className="spec-dot"></span>
          <span>{car.acceleration} (0-100)</span>
        </div>
      </div>

      <div className="car-card-content">
        <div className="car-card-rating">
          <Star className="star-icon" size={14} fill="currentColor" />
          <span>{car.rating || 4.9}</span>
          <span className="review-count">({car.reviewsCount || car.reviews || 12} reviews)</span>
        </div>

        <h3 className="car-title">{car.name}</h3>

        <div className="car-specs-grid">
          <div className="spec-item">
            <span className="spec-label">Trans</span>
            <span className="spec-value">{car.transmission}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Engine</span>
            <span className="spec-value">{car.fuel}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Seats</span>
            <span className="spec-value">{car.seats} Seats</span>
          </div>
        </div>

        <div className="car-card-footer">
          <div>
            <span className="price-value">${car.pricePerDay || car.price}</span>
            <span className="price-period">/ day</span>
          </div>
          <button className="btn-rent-card" onClick={() => onRentClick(car)}>
            <span>Rent Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
          <div className="badge">
            <Sparkles size={14} className="mr-1" />
            <span>Unmatched Luxury & Performance</span>
          </div>
          <h1>
            Experience the Thrill of <br />
            <span className="gradient-text">50 Premium Supercars</span>
          </h1>
          <p className="hero-subtitle">
            10 Vehicles in each of 5 world-class categories: Sports, Electric, Luxury, SUV, and Executive sedans. Instant booking approval.
          </p>

          {/* Quick Category Jump Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', margin: '20px 0 30px' }}>
            {CATEGORIES.slice(1).map(cat => (
              <a
                key={cat.id}
                href="#showroom"
                onClick={() => setSelectedType(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '99px', padding: '6px 14px', fontSize: '13px', fontWeight: 600,
                  color: '#f3f4f6', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{ fontSize: '11px', background: 'rgba(0,242,254,0.15)', color: '#00f2fe', padding: '1px 6px', borderRadius: '10px' }}>
                  {categoryCounts[cat.id] || 10}
                </span>
              </a>
            ))}
          </div>

          {/* Quick Search Widget */}
          <div className="search-widget">
            <div className="widget-field">
              <Compass className="field-icon" />
              <div className="field-text">
                <span className="field-label">Search Fleet</span>
                <input
                  type="text"
                  placeholder="e.g. Porsche, Ferrari, Urus, Tesla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
            <div className="widget-divider"></div>
            <div className="widget-field">
              <MapPin className="field-icon" />
              <div className="field-text">
                <span className="field-label">Showroom Location</span>
                <input type="text" placeholder="Select showroom" defaultValue="New York HQ" />
              </div>
            </div>
            <div className="widget-divider"></div>
            <div className="widget-field">
              <Calendar className="field-icon" />
              <div className="field-text">
                <span className="field-label">Rental Duration</span>
                <input type="text" placeholder="Pick dates" defaultValue="Aug 25 - Aug 28" />
              </div>
            </div>
            <button className="btn-search-trigger" onClick={handleSearchClick}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Showroom Listings */}
      <section className="showroom-section" id="showroom">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="section-title">Explore Our 50-Car Fleet</h2>
            <p className="section-subtitle">10 world-class engineering marvels in every single category</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,242,254,0.08)', padding: '8px 18px', borderRadius: '99px', border: '1px solid rgba(0,242,254,0.2)' }}>
            <span style={{ fontSize: '14px', color: '#00f2fe', fontWeight: 800 }}>{filteredCars.length}</span>
            <span style={{ fontSize: '13px', color: '#9ca3af' }}>vehicles matched</span>
          </div>
        </div>

        {/* ── Category Primary Tabs ────────────────────────────────────────── */}
        <div style={{
          display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {CATEGORIES.map(cat => {
            const isActive = selectedType === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedType(cat.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: isActive ? 'linear-gradient(135deg, rgba(0,242,254,0.2), rgba(79,172,254,0.15))' : 'rgba(255,255,255,0.04)',
                  border: isActive ? '1px solid #00f2fe' : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#00f2fe' : '#9ca3af',
                  padding: '10px 18px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 20px rgba(0,242,254,0.2)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '11px',
                  background: isActive ? '#00f2fe' : 'rgba(255,255,255,0.1)',
                  color: isActive ? '#090a0f' : '#cbd5e1',
                  fontWeight: 800, padding: '2px 8px', borderRadius: '99px',
                }}>
                  {categoryCounts[cat.id] || (cat.id === 'All' ? 50 : 10)}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Secondary Brand & Price Filters ──────────────────────────────── */}
        <div className="filter-controls">
          <div className="filter-group" style={{ overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%' }}>
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center', marginRight: '4px' }}>Brand:</span>
            <button
              className={`filter-btn ${selectedBrand === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedBrand('All')}
            >
              All
            </button>
            {popularBrands.map((brand) => (
              <button
                key={brand}
                className={`filter-btn ${selectedBrand === brand ? 'active' : ''}`}
                onClick={() => setSelectedBrand(brand)}
              >
                {brand}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <div className="price-slider-wrapper">
              <span className="slider-label">Max Price: ${priceRange}/day</span>
              <input
                type="range"
                min="300"
                max="2500"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-slider"
              />
            </div>
          </div>
        </div>

        {/* ── Fleet Grid Display ─────────────────────────────────────────── */}
        {loading ? (
          // Skeleton Cards
          <div className="fleet-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="car-card" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: '200px', width: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                }} />
                <div style={{ padding: '22px' }}>
                  {[80, 140, 90].map((w, j) => (
                    <div key={j} style={{
                      height: j === 1 ? '22px' : '14px',
                      width: `${w}%`,
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '6px',
                      marginBottom: j === 2 ? 0 : '12px',
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : isCategorizedSectionView ? (
          // ── Categorized Sections View (When Viewing All) ────────────────
          <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {CATEGORIES.slice(1).map(cat => {
              const catCars = allCarsList.filter(c => c.type === cat.id);
              return (
                <div key={cat.id}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '12px',
                    marginBottom: '20px', paddingBottom: '12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{cat.icon}</span>
                      <div>
                        <h3 style={{ fontSize: 'clamp(17px, 3.5vw, 20px)', fontWeight: 800, color: '#fff', margin: 0 }}>
                          {cat.label} Fleet
                        </h3>
                        <p style={{ fontSize: '13px', color: '#9ca3af', margin: '2px 0 0' }}>{cat.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedType(cat.id)}
                      style={{
                        background: 'rgba(0,242,254,0.1)', border: '1px solid rgba(0,242,254,0.25)',
                        color: '#00f2fe', padding: '6px 14px', borderRadius: '8px',
                        fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      View All {catCars.length} {cat.label} →
                    </button>
                  </div>

                  <div className="fleet-grid">
                    {catCars.map(renderCarCard)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filteredCars.length > 0 ? (
          // ── Filtered Single Grid ────────────────────────────────────────
          <div>
            {selectedType !== 'All' && (
              <div style={{
                background: 'rgba(18,20,29,0.6)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px', padding: '16px 24px', marginBottom: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
              }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: 800, margin: 0 }}>
                    {CATEGORIES.find(c => c.id === selectedType)?.icon} {selectedType} Fleet ({filteredCars.length} Available)
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0' }}>
                    {CATEGORIES.find(c => c.id === selectedType)?.desc}
                  </p>
                </div>
                <button
                  onClick={() => { setSelectedType('All'); setSelectedBrand('All'); setSearchQuery(''); }}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#9ca3af', padding: '6px 14px', borderRadius: '8px',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  ← Show All 50 Cars
                </button>
              </div>
            )}

            <div className="fleet-grid">
              {filteredCars.map(renderCarCard)}
            </div>
          </div>
        ) : (
          <div className="no-cars-found">
            <h3>No Vehicles Found</h3>
            <p>Try adjusting your search filters, category, or price range to find a matching car.</p>
            <button
              className="btn-primary"
              style={{ marginTop: '16px', padding: '8px 20px' }}
              onClick={() => { setSelectedType('All'); setSelectedBrand('All'); setSearchQuery(''); setPriceRange(2500); }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="benefits-section">
        <h2 className="section-title text-center">Why Choose Velocity Rentals</h2>
        <p className="section-subtitle text-center">We offer an unmatched car rental experience with premium customer service</p>

        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>Premium Secure Insurance</h3>
            <p>Enjoy complete peace of mind on every journey with our comprehensive premium coverage insurance policies.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Award size={24} />
            </div>
            <h3>Best Rate Guarantee</h3>
            <p>We match any verified quote. Premium performance luxury vehicle rates at extremely competitive prices.</p>
          </div>

          <div className="benefit-card">
            <div className="benefit-icon-wrapper">
              <Users size={24} />
            </div>
            <h3>24/7 Roadside Assistance</h3>
            <p>Our dedicated support team and mechanics are ready to assist you anywhere, anytime of the day.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title text-center">What Our Clients Say</h2>
        <p className="section-subtitle text-center">Reviews from luxury enthusiasts who travel with us</p>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="star-icon" />
              ))}
            </div>
            <p className="testimonial-text">
              "Renting the Porsche 911 GT3 RS was an absolute dream. The pickup was seamless, and the car was in absolute pristine condition. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#3b82f6' }}>JS</div>
              <div>
                <h4>Jordan Sterling</h4>
                <span>Tech Entrepreneur</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" className="star-icon" />
              ))}
            </div>
            <p className="testimonial-text">
              "Outstanding customer support. Had to modify my reservation at the last minute and the team sorted it out in less than 5 minutes. Excellent service!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar" style={{ background: '#ec4899' }}>SR</div>
              <div>
                <h4>Sophia Reynolds</h4>
                <span>Creative Director</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact" style={{ padding: '80px 20px', position: 'relative', zIndex: 10 }}>
        <ContactForm />
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take the Wheel?</h2>
          <p>Sign up now to get 10% off your first luxury rental and unlock priority garage bookings.</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => onRentClick(null)}>
              Get Started Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
