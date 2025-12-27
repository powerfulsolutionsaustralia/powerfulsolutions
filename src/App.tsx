import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">
            <span className="gradient-text">Powerful</span> Solutions
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <a href="#results" className="nav-link">Results</a>
          </div>
          <button className="btn btn-primary">Get Started</button>
        </div>
      </nav>

      <header className="hero">
        <div className="container">
          <div className="hero-tagline animate-fade">Future of Growth is Here</div>
          <h1 className="animate-fade">
            Supercharge Your Lead Gen with <span className="gradient-text">AI-Powered</span> Websites
          </h1>
          <p className="animate-fade">
            We build high-converting websites powered by AI to generate you leads. Get 5-star reviews and scale your business on autopilot.
          </p>
          <div className="cta-group animate-fade">
            <button className="btn btn-primary">Build My Site</button>
            <button className="btn btn-secondary">See Demo</button>
          </div>
          
          <div className="hero-image-container animate-float" style={{ marginTop: '4rem' }}>
            <img 
              src="/hero.png" 
              alt="AI Hero Illustration" 
              style={{ width: '100%', maxWidth: '800px', borderRadius: '2rem', boxShadow: '0 20px 50px rgba(99, 102, 241, 0.2)' }} 
            />
          </div>
        </div>
      </header>

      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item">
            <h4>10x</h4>
            <p>More Leads</p>
          </div>
          <div className="stat-item">
            <h4>500+</h4>
            <p>Sites Built</p>
          </div>
          <div className="stat-item">
            <h4>98%</h4>
            <p>5-Star Reviews</p>
          </div>
          <div className="stat-item">
            <h4>2.5M</h4>
            <p>Leads Generated</p>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Scale</h2>
            <p style={{ color: 'var(--text-muted)' }}>Cutting-edge AI tools designed to capture every opportunity.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Lead Capture</h3>
              <p>Intelligent forms and chatbots that pre-qualify every visitor before they even hit your inbox.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">⭐</div>
              <h3>Review Automation</h3>
              <p>Seamlessly gather and showcase 5-star reviews across Google, Yelp, and Facebook automatically.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon">📈</div>
              <h3>Smart Analytics</h3>
              <p>Real-time insights into your marketing performance with AI-driven conversion optimization.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className="roi">
        <div className="container roi-content">
          <div className="roi-text">
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Automate Your <span className="gradient-text">5-Star Reviews</span></h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Building trust shouldn't be manual. Our AI agents follow up with your customers at the perfect moment to secure that 5-star review, boosting your local SEO and credibility instantly.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Automated customer sentiment analysis
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Instant multi-platform distribution
              </li>
              <li style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span> Negative review protection & alerting
              </li>
            </ul>
            <button className="btn btn-primary">Start Automating</button>
          </div>
          <div className="roi-image">
            <img src="/dashboard.png" alt="Review Dashboard" className="glass-card" />
          </div>
        </div>
      </section>

      <section id="reviews" className="reviews">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Leaders</h2>
          </div>
          <div className="reviews-grid">
            <div className="review-card glass-card">
              <div className="stars">★★★★★</div>
              <p className="review-content">"The AI lead capture is a game changer. We've seen a 300% increase in qualified leads in just the first month."</p>
              <div className="reviewer">
                <div className="reviewer-avatar"></div>
                <div>
                  <div style={{ fontWeight: 600 }}>Sarah Jenkins</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>CEO, TechFlow</div>
                </div>
              </div>
            </div>
            <div className="review-card glass-card">
              <div className="stars">★★★★★</div>
              <p className="review-content">"Finally, a website that actually works for us. The review automation is worth the price alone."</p>
              <div className="reviewer">
                <div className="reviewer-avatar" style={{ background: 'var(--secondary)' }}></div>
                <div>
                  <div style={{ fontWeight: 600 }}>Mark Thompson</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Founder, SolarDirect</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div>
              <div className="logo" style={{ marginBottom: '1rem' }}>
                <span className="gradient-text">Powerful</span> Solutions
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Building the future of lead generation with artificial intelligence.
              </p>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Product</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" className="nav-link">AI Lead Gen</a>
                <a href="#" className="nav-link">Review Management</a>
                <a href="#" className="nav-link">Case Studies</a>
              </nav>
            </div>
            <div>
              <h4 style={{ marginBottom: '1rem' }}>Company</h4>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a href="#" className="nav-link">About Us</a>
                <a href="#" className="nav-link">Contact</a>
                <a href="#" className="nav-link">Privacy Policy</a>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Powerful Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
