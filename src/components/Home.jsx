import React, { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, Calendar, Compass, Shield, Award, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import ContactForm from './ContactForm';

export default function Home({ cars = [], onRentClick, onAdminSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [priceRange, setPriceRange] = useState(1000);
  const [dbCars, setDbCars] = useState(() => {
    try {
      const cached = sessionStorage.getItem('velocity_cars');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = sessionStorage.getItem('velocity_cars');
      return !(cached && JSON.parse(cached).length > 0);
    } catch {
      return true;
    }
  });

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

  const filteredCars = useMemo(() => {
    const list = (cars && cars.length > 0) ? cars : dbCars;
    return list.filter((car) => {
      const carName = car.name || '';
      const carBrand = car.brand || '';
      const matchesSearch = carName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            carBrand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'All' || carBrand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesType = selectedType === 'All' || car.type?.toLowerCase() === selectedType.toLowerCase();
      const carPrice = car.pricePerDay || car.price || 0;
      const matchesPrice = carPrice <= priceRange;

      return matchesSearch && matchesBrand && matchesType && matchesPrice;
    });
  }, [cars, dbCars, searchQuery, selectedBrand, selectedType, priceRange]);

  const renderImageStyle = (image) => {
    if (!image) return { background: 'linear-gradient(135deg, #1e1e24 0%, #a82c35 100%)' };
    if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('/') || image.startsWith('data:')) {
      return { backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { background: image };
  };

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
            <span className="gradient-text">Premium Velocity</span>
          </h1>
          <p className="hero-subtitle">
            Rent elite sports cars, state-of-the-art electric vehicles, and executive SUVs. Seamless booking with instant approval.
          </p>

          {/* Quick Search Widget */}
          <div className="search-widget">
            <div className="widget-field">
              <Compass className="field-icon" />
              <div className="field-text">
                <span className="field-label">Search Cars</span>
                <input
                  type="text"
                  placeholder="e.g. Porsche, Tesla..."
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
                <span className="field-label">Location</span>
                <input type="text" placeholder="Select showroom" defaultValue="New York HQ" />
              </div>
            </div>
            <div className="widget-divider"></div>
            <div className="widget-field">
              <Calendar className="field-icon" />
              <div className="field-text">
                <span className="field-label">Date & Time</span>
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
        <div className="section-header">
          <div>
            <h2 className="section-title">Explore Our Premium Fleet</h2>
            <p className="section-subtitle">Choose from the finest automotive engineering marvels in the world</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <button
              className={`filter-btn ${selectedBrand === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedBrand('All')}
            >
              All Brands
            </button>
            {['Porsche', 'Tesla', 'BMW', 'Mercedes', 'Audi'].map((brand) => (
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
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Sports">Sports</option>
              <option value="Electric">Electric</option>
              <option value="Luxury">Luxury</option>
              <option value="SUV">SUV</option>
            </select>

            <div className="price-slider-wrapper">
              <span className="slider-label">Max Price: ${priceRange}/day</span>
              <input
                type="range"
                min="200"
                max="600"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="price-slider"
              />
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        {loading ? (
          // ── Skeleton Cards ──────────────────────────────────
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
                      animation: 'shimmer 1.4s infinite',
                      backgroundSize: '200% 100%',
                      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
                    }} />
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{ height: '28px', width: '80px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)' }} />
                    <div style={{ height: '36px', width: '100px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', animation: 'shimmer 1.4s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="fleet-grid">
            {filteredCars.map((car) => (
              <div className="car-card" key={car.id || car._id}>
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
            ))}
          </div>
        ) : (
          <div className="no-cars-found">
            <h3>No Vehicles Found</h3>
            <p>Try adjusting your search filters or price range to find a matching car.</p>
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
