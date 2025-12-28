import { useState } from 'react'
import { Wand2, Monitor, ArrowLeft, CheckCircle, Store, MapPin, Phone, Clock, Image as ImageIcon, Briefcase, Sparkles, Layout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function SiteBuilder() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [deploying, setDeploying] = useState(false)
    const [deployStep, setDeployStep] = useState('')
    const [deployedUrl, setDeployedUrl] = useState('')

    const [formData, setFormData] = useState({
        business_name: '',
        industry: '',
        address: '',
        phone: '',
        description: '',
        opening_hours: 'Mon-Fri: 9am - 5pm\nSat: 10am - 2pm\nSun: Closed',
        logo_url: '/logo-placeholder.png',
        primary_color: '#6366f1',
        slug: '',
        headline: '',
        subheadline: '',
        value_proposition: '',
        testimonials: [
            { name: 'John Doe', text: 'Amazing service! Highly recommend this business.' },
            { name: 'Jane Smith', text: 'Very professional and responsive. Great quality.' }
        ]
    })

    const generateContent = () => {
        setLoading(true)
        setTimeout(() => {
            const industry = formData.industry || 'Business'
            setFormData(prev => ({
                ...prev,
                headline: `Premium ${industry} Services in ${prev.address.split(',')[0] || 'Your Area'}`,
                subheadline: `Specializing in professional ${industry.toLowerCase()} solutions. ${prev.description}`,
                value_proposition: `Why Choose ${prev.business_name}? We pride ourselves on reliability, excellence, and our deep roots in the ${industry.toLowerCase()} industry. Our team of experts is dedicated to providing you with the best experience possible.`,
                slug: (prev.business_name || 'site').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
            }))
            setLoading(false)
            setStep(3) // Move to Brand step
        }, 1500)
    }

    const handleDeploy = async () => {
        setDeploying(true)

        const steps = [
            'Analyzing business profile...',
            'Generating SEO meta tags...',
            'Optimizing industry imagery...',
            'Building responsive layout...',
            'Establishing database connection...',
            'Deploying to global edge network...'
        ]

        for (const s of steps) {
            setDeployStep(s)
            await new Promise(r => setTimeout(r, 600))
        }

        const { error } = await supabase.from('sites').insert([formData])

        if (error) {
            alert('Deployment failed: ' + error.message)
            setDeploying(false)
        } else {
            setDeployedUrl(`${window.location.origin}/site/${formData.slug}`)
            setStep(4) // Success step
            setDeploying(false)
        }
    }

    return (
        <div className="dashboard-layout" style={{ background: 'var(--background)', color: 'var(--text)' }}>
            <div className="builder-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/dashboard" style={{ marginRight: '1rem', color: 'var(--text-muted)' }}><ArrowLeft /></Link>
                        <div>
                            <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>Site Engine V2</h1>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Convert business data into premium landing pages</p>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: '0.5rem 1rem', display: 'flex', gap: '1rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>1. Info</div>
                        <div style={{ color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>2. Details</div>
                        <div style={{ color: step >= 3 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 'bold' }}>3. Brand</div>
                    </div>
                </div>

                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="glass-card animate-fade" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="icon-circle" style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <Store size={24} />
                            </div>
                            <h3>Business Identity</h3>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Business Name</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.business_name}
                                        onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                                        placeholder="e.g. Skyline Solar Solutions"
                                    />
                                    <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Industry</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.industry}
                                        onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                        placeholder="e.g. Solar Energy, Plumbing"
                                    />
                                    <Sparkles size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Business Address</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="123 Business Way, Queensland 4000"
                                    />
                                    <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+61 400 000 000"
                                    />
                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
                                </div>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            onClick={() => setStep(2)}
                            disabled={!formData.business_name || !formData.industry}
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Next Step: Business Logic
                        </button>
                    </div>
                )}

                {/* Step 2: Details & Opening Hours */}
                {step === 2 && (
                    <div className="glass-card animate-fade" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="icon-circle" style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <Clock size={24} />
                            </div>
                            <h3>What Your Business Does</h3>
                        </div>

                        <div className="form-group">
                            <label>Short Description of Services</label>
                            <textarea
                                className="glass-input"
                                style={{ minHeight: '100px', resize: 'vertical' }}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what you do in 1-2 sentences. This pre-fills the landing page copy."
                            />
                        </div>

                        <div className="form-group">
                            <label>Opening Hours</label>
                            <textarea
                                className="glass-input"
                                style={{ minHeight: '100px', fontFamily: 'monospace' }}
                                value={formData.opening_hours}
                                onChange={e => setFormData({ ...formData, opening_hours: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                onClick={generateContent}
                                disabled={loading}
                            >
                                <Wand2 size={18} className={loading ? 'animate-spin' : ''} />
                                {loading ? 'Thinking...' : 'AI Generate Site Content'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Brand & Customization */}
                {step === 3 && (
                    <div className="glass-card animate-fade" style={{ padding: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div className="icon-circle" style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899' }}>
                                <Layout size={24} />
                            </div>
                            <h3>Refine Your Brand</h3>
                        </div>

                        <div className="form-row" style={{ alignItems: 'flex-start' }}>
                            <div className="form-group">
                                <label>Brand Logo URL</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="glass-input"
                                        style={{ paddingLeft: '3rem' }}
                                        value={formData.logo_url}
                                        onChange={e => setFormData({ ...formData, logo_url: e.target.value })}
                                    />
                                    <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '1.2rem', color: 'var(--text-muted)' }} />
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Upload or paste your logo link.</p>
                            </div>
                            <div className="form-group">
                                <label>Theme Primary Color</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={formData.primary_color}
                                        onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                        style={{ background: 'transparent', border: 'none', width: '60px', height: '60px', cursor: 'pointer' }}
                                    />
                                    <div className="glass-input" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>{formData.primary_color}</div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>AI Generated Headline</label>
                            <input
                                className="glass-input"
                                value={formData.headline}
                                onChange={e => setFormData({ ...formData, headline: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Generated URL Slug</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span className="text-muted">/site/</span>
                                <input
                                    className="glass-input"
                                    value={formData.slug}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
                            <button
                                className="btn btn-primary"
                                onClick={handleDeploy}
                                disabled={deploying}
                                style={{ flex: 2 }}
                            >
                                {deploying ? 'Deploying to Vercel Edge...' : 'Launch Site 🚀'}
                            </button>
                        </div>

                        {deploying && (
                            <div style={{ marginTop: '2rem', background: '#0f172a', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="animate-spin"><Wand2 size={20} /></div>
                                    <div style={{ fontFamily: 'monospace', color: '#10b981' }}>{deployStep}</div>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                                    <div className="progress-bar-fill" style={{ height: '100%', background: 'var(--primary)', width: '60%', transition: 'width 0.5s ease' }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="glass-card animate-fade" style={{ textAlign: 'center', padding: '5rem 3rem' }}>
                        <div className="icon-circle" style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
                            <CheckCircle size={60} />
                        </div>
                        <h2 className="gradient-text" style={{ fontSize: '2.5rem' }}>Your Site is Live!</h2>
                        <p className="text-muted" style={{ fontSize: '1.1rem', margin: '1rem 0 3rem' }}>
                            We've pre-filled everything for {formData.business_name}. Your client is going to love it.
                        </p>

                        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PRODUCTION URL</div>
                                <div style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>{deployedUrl}</div>
                            </div>
                            <a href={deployedUrl} target="_blank" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                View Live <Monitor size={20} />
                            </a>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <Link to="/dashboard" className="btn btn-secondary">Go to Dashboard</Link>
                            <button className="btn btn-primary" onClick={() => setStep(1)}>Create Another Client Site</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
