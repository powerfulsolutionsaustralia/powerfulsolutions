import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LeadForm from '../components/LeadForm'
import { CheckCircle, ArrowRight } from 'lucide-react'

interface SiteConfig {
    slug: string
    business_name: string
    industry: string
    primary_color: string
    headline: string
    subheadline: string
}

export default function ClientSite() {
    const { slug } = useParams()
    const [site, setSite] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [showLeadForm, setShowLeadForm] = useState(false)

    useEffect(() => {
        const fetchSite = async () => {
            if (!slug) return
            const { data, error } = await supabase
                .from('sites')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error || !data) {
                console.error('Site not found:', error)
                setError(true)
            } else {
                setSite(data)
                // Dynamically set the primary color for this page
                document.documentElement.style.setProperty('--primary', data.primary_color)
                document.documentElement.style.setProperty('--primary-hover', adjustColor(data.primary_color, -20))
            }
            setLoading(false)
        }

        fetchSite()

        // Cleanup styles when leaving
        return () => {
            document.documentElement.style.removeProperty('--primary')
            document.documentElement.style.removeProperty('--primary-hover')
        }
    }, [slug])

    // Helper to darken color for hover state
    const adjustColor = (color: string, amount: number) => {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    if (loading) return <div className="layout-center">Loading site...</div>
    if (error || !site) return <div className="layout-center">
        <h1>404 - Site Not Found</h1>
        <p>The site you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Go Home</Link>
    </div>

    return (
        <div className="app">
            {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}

            <nav className="navbar">
                <div className="container nav-content">
                    <div className="logo gradient-text" style={{ fontSize: '1.5rem' }}>{site.business_name}</div>
                    <div className="nav-links">
                        <button className="btn btn-primary" onClick={() => setShowLeadForm(true)}>Get Quote</button>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="container">
                    <span className="hero-tagline animate-float">{site.industry} Experts</span>
                    <h1 className="gradient-text animate-fade" style={{ fontSize: '4rem', marginTop: '1rem' }}>
                        {site.headline}
                    </h1>
                    <p className="animate-fade" style={{ animationDelay: '0.2s', maxWidth: '700px', margin: '1.5rem auto' }}>
                        {site.subheadline}
                    </p>
                    <div className="cta-group animate-fade" style={{ animationDelay: '0.4s' }}>
                        <button className="btn btn-primary" onClick={() => setShowLeadForm(true)}>Get Started</button>
                        <button className="btn btn-secondary">Our Services</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <h2>Why Choose {site.business_name}?</h2>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card glass-card">
                            <div className="feature-icon"><CheckCircle /></div>
                            <h3>Professional Service</h3>
                            <p>Top-rated {site.industry.toLowerCase()} services tailored to your needs.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon"><CheckCircle /></div>
                            <h3>Fast Response</h3>
                            <p>We value your time. Same-day replies and quick turnaround.</p>
                        </div>
                        <div className="feature-card glass-card">
                            <div className="feature-icon"><CheckCircle /></div>
                            <h3>Satisfaction Guaranteed</h3>
                            <p>We aren't happy until you're happy. 100% committed to quality.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container footer-bottom">
                    <p>&copy; 2024 {site.business_name}. Powered by Powerful Solutions.</p>
                </div>
            </footer>
        </div>
    )
}
