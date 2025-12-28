import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import LeadForm from '../components/LeadForm'
import { CheckCircle, MapPin, Phone, Clock, Star, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react'

interface SiteConfig {
    slug: string
    business_name: string
    industry: string
    primary_color: string
    headline: string
    subheadline: string
    address: string
    phone: string
    description: string
    opening_hours: string
    logo_url: string
    value_proposition: string
    testimonials: { name: string, text: string }[]
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
                document.documentElement.style.setProperty('--primary', data.primary_color)
                document.documentElement.style.setProperty('--primary-hover', adjustColor(data.primary_color, -20))
            }
            setLoading(false)
        }

        fetchSite()

        return () => {
            document.documentElement.style.removeProperty('--primary')
            document.documentElement.style.removeProperty('--primary-hover')
        }
    }, [slug])

    const adjustColor = (color: string, amount: number) => {
        try {
            return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
        } catch (e) {
            return color
        }
    }

    if (loading) return <div className="layout-center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }}></div>
    </div>

    if (error || !site) return <div className="layout-center" style={{ textAlign: 'center', padding: '5rem' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem' }}>404</h1>
        <p className="text-muted">The site you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>Go Home</Link>
    </div>

    const industryImage = `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200` // Default premium architecture/business look

    return (
        <div className="app" style={{ background: '#020617', color: 'white', overflowX: 'hidden' }}>
            {showLeadForm && <LeadForm onClose={() => setShowLeadForm(false)} />}

            {/* Header */}
            <nav className="navbar" style={{ padding: '1rem 0', background: 'rgba(2, 6, 23, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container nav-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {site.logo_url && site.logo_url !== '/logo-placeholder.png' ? (
                            <img src={site.logo_url} alt={site.business_name} style={{ height: '40px', width: 'auto' }} />
                        ) : (
                            <div className="logo gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{site.business_name}</div>
                        )}
                    </div>
                    <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <a href="#services" className="nav-link" style={{ fontSize: '0.9rem' }}>Services</a>
                        <a href="#about" className="nav-link" style={{ fontSize: '0.9rem' }}>About</a>
                        <a href="#contact" className="nav-link" style={{ fontSize: '0.9rem' }}>Contact</a>
                        <button className="btn btn-primary" onClick={() => setShowLeadForm(true)} style={{ padding: '0.6rem 1.2rem' }}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero" style={{ padding: '10rem 0 6rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                {/* Background Decoration */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '60%', background: 'var(--primary)', filter: 'blur(150px)', opacity: '0.1', zIndex: 0 }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
                    <div className="animate-fade">
                        <span className="hero-tagline" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.5rem 1rem' }}>
                            {site.industry} Experts
                        </span>
                        <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginTop: '1.5rem', lineHeight: '1.1', fontWeight: 800 }}>
                            {site.headline}
                        </h1>
                        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', margin: '1.5rem 0 2.5rem', maxWidth: '600px' }}>
                            {site.subheadline}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ color: '#f59e0b', display: 'flex' }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>5.0 Rating</span>
                            </div>
                            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Trusted by 200+ Clients</span>
                        </div>

                        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', display: 'flex', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <MapPin size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LOCATION</div>
                                    <div style={{ fontSize: '0.9rem' }}>{site.address || 'Global Service'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CALL US</div>
                                    <div style={{ fontSize: '0.9rem' }}>{site.phone || 'Contact Online'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="animate-float" style={{ animationDelay: '0.3s' }}>
                        <LeadForm isEmbed={true} />
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section id="about" style={{ padding: '8rem 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={industryImage}
                            alt="Industry"
                            style={{ width: '100%', borderRadius: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                        <div className="glass-card" style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', padding: '2rem', maxWidth: '300px' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.5rem' }}>15+</div>
                            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>Years of excellence in the {site.industry.toLowerCase()} sector.</div>
                        </div>
                    </div>
                    <div>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Excellence in Everything We Do</h2>
                        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.8', marginBottom: '2rem' }}>
                            {site.value_proposition || site.description}
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem' }}>
                            {[
                                'Fully certified and insured professionals',
                                'Industry-leading technology and tools',
                                'Transparent pricing with no hidden costs',
                                '24/7 priority customer support'
                            ].map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontSize: '1rem' }}>
                                    <CheckCircle size={20} style={{ color: '#10b981' }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Learn More <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Opening Hours & Contact */}
            <section id="contact" style={{ padding: '8rem 0' }}>
                <div className="container">
                    <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                        <div className="glass-card" style={{ padding: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <Clock size={32} style={{ color: 'var(--primary)' }} />
                                <h3 style={{ fontSize: '1.8rem' }}>Opening Hours</h3>
                            </div>
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '2' }}>
                                {site.opening_hours}
                            </div>
                        </div>
                        <div className="glass-card" style={{ padding: '4rem', background: 'var(--primary)', color: 'white' }}>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Direct Contact</h3>
                            <p style={{ marginBottom: '2.5rem', opacity: 0.9 }}>Ready to start your project? Call us directly or visit our office.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>PHONE NUMBER</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{site.phone}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>OFFICE ADDRESS</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{site.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ padding: '8rem 0', background: 'rgba(255,255,255,0.02)' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '4rem' }}>What Our Clients Say</h2>
                    <div className="features-grid">
                        {(site.testimonials || []).map((t, i) => (
                            <div key={i} className="glass-card" style={{ padding: '3rem', textAlign: 'left' }}>
                                <div style={{ color: '#f59e0b', display: 'flex', marginBottom: '1.5rem' }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                                </div>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', fontStyle: 'italic' }}>"{t.text}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Client</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer" style={{ padding: '6rem 0 3rem', background: '#020617' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            <div className="logo gradient-text" style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{site.business_name}</div>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
                                Leading provider of {site.industry.toLowerCase()} services. Committed to quality, integrity, and exceptional customer results.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Facebook size={20} /></div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Twitter size={20} /></div>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Instagram size={20} /></div>
                            </div>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2.5' }}>
                                <li>Home</li>
                                <li>Services</li>
                                <li>About Us</li>
                                <li>Contact</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Services</h4>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2.5' }}>
                                <li>Consultation</li>
                                <li>Installation</li>
                                <li>Maintenance</li>
                                <li>Support</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '1.5rem' }}>Company</h4>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2.5' }}>
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                                <li>Careers</li>
                                <li>Blog</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        &copy; 2024 {site.business_name}. Built by <span style={{ color: 'var(--primary)' }}>Powerful Solutions</span>.
                    </div>
                </div>
            </footer>
        </div>
    )
}
