import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import SiteBuilder from './pages/SiteBuilder'
import ClientSite from './pages/ClientSite'
import LeadForm from './components/LeadForm'
import './App.css'

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleOpenForm = () => {
    setShowLeadForm(true)
  }

  return (
    <div className="app">
      {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}

      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo gradient-text">Powerful Solutions</div>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <a href="#results" className="nav-link">Results</a>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Login</Link>
          </div>
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <span className="hamburger"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <span className="hero-tagline animate-float">AI-Powered Business Growth</span>
          <h1 className="gradient-text animate-fade">
            Supercharge Your Lead Gen with AI-Powered Websites
          </h1>
          <p className="animate-fade" style={{ animationDelay: '0.2s' }}>
            We build websites powered by AI to generate you leads. Get 5 star reviews,
            automate follow-ups, and dominate your market.
          </p>
          <div className="cta-group animate-fade" style={{ animationDelay: '0.4s' }}>
            <button className="btn btn-primary" onClick={handleOpenForm}>Build My Site</button>
            <button className="btn btn-secondary" onClick={handleOpenForm}>See Demo</button>
          </div>

          <div className="hero-visual animate-float" style={{ marginTop: '4rem' }}>
            <img src="/hero.png" alt="AI Dashboard Interface" className="glass-card" style={{ maxWidth: '80%', borderRadius: '1rem' }} />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats" id="results">
        <div className="container stats-grid">
          <div className="stat-item">
            <h4>10x</h4>
            <p>More Leads</p>
          </div>
          <div className="stat-item">
            <h4>24/7</h4>
            <p>AI Availability</p>
          </div>
          <div className="stat-item">
            <h4>98%</h4>
            <p>5-Star Reviews</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="gradient-text">Why Choose Powerful Solutions?</h2>
            <p style={{ color: 'var(--text-muted)' }}>Everything you need to scale your business, automated.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">🚀</div>
              <h3>AI Lead Capture</h3>
              <p>Never miss a lead again. Our AI engages visitors instantly and books appointments on autopilot.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">⭐</div>
              <h3>Review Automation</h3>
              <p>Turn happy customers into 5-star Google reviews. Automatically request and filter feedback.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">📊</div>
              <h3>Smart Analytics</h3>
              <p>Know exactly what is working. Track ROI, lead sources, and conversion rates in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="roi">
        <div className="container roi-content">
          <div className="roi-text">
            <span className="hero-tagline" style={{ marginBottom: '1rem' }}>Revenue Engine</span>
            <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Automate Your 5-Star Reviews</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Stop chasing customers for reviews. Our system automatically follows up via SMS and Email to get you more social proof.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Higher Google Rankings</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ More Trust = More Sales</li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>✅ Completely Hands-Off</li>
            </ul>
            <button className="btn btn-primary" onClick={handleOpenForm}>Start Automating</button>
          </div>
          <div className="roi-image animate-float">
            <img src="/dashboard.png" alt="Reviews Dashboard" className="glass-card" />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews" id="reviews">
        <div className="container">
          <div className="section-header">
            <h2 className="gradient-text">Trusted by Industry Leaders</h2>
          </div>
          <div className="reviews-grid">
            <div className="review-card glass-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="review-content">"The AI lead capture is a game changer. We went from 5 leads a week to over 50. Highly recommended!"</p>
              <div className="reviewer">
                <div className="reviewer-avatar"></div>
                <div>
                  <strong>Sarah Jenkins</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CEO, TechFlow</p>
                </div>
              </div>
            </div>
            <div className="review-card glass-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="review-content">"Powerful Solutions automated our entire review process. We are now #1 in our city on Google Maps."</p>
              <div className="reviewer">
                <div className="reviewer-avatar"></div>
                <div>
                  <strong>Mark Thompson</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Owner, Elite HVAC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="logo gradient-text" style={{ marginBottom: '1rem' }}>Powerful Solutions</div>
              <p style={{ color: 'var(--text-muted)' }}>Empowering businesses with <br />next-gen AI tools.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Features</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Pricing</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Case Studies</a>
              </div>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" style={{ color: 'var(--text-muted)' }}>About</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
                <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Powerful Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/site-builder" element={<SiteBuilder />} />
        <Route path="/site/:slug" element={<ClientSite />} />
      </Routes>
    </Router>
  )
}

export default App
