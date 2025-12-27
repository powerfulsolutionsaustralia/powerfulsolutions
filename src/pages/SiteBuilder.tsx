import { useState } from 'react'
import { Rocket, Wand2, Monitor, ArrowLeft, CheckCircle } from 'lucide-react'
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
        slug: '',
        primary_color: '#4f46e5',
        headline: '',
        subheadline: ''
    })

    // "AI" Generator - simple heuristic for now
    const generateContent = () => {
        setLoading(true)
        setTimeout(() => {
            const industry = formData.industry || 'Business'
            setFormData(prev => ({
                ...prev,
                headline: `Premium ${industry} Services You Can Trust`,
                subheadline: `We provide top-tier ${industry.toLowerCase()} solutions with a focus on quality, reliability, and customer satisfaction. Get a free quote today.`,
                slug: (prev.business_name || 'site').toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
            }))
            setLoading(false)
        }, 1000)
    }

    const handleDeploy = async () => {
        setDeploying(true)

        // Simulate deployment steps for "Wow" factor
        const steps = [
            'Initializing container...',
            'Allocating resources...',
            'Installing SSL certificate...',
            'Optimizing assets...',
            'Deploying to edge network...'
        ]

        for (const s of steps) {
            setDeployStep(s)
            await new Promise(r => setTimeout(r, 800))
        }

        // Actual save to DB
        const { error } = await supabase.from('sites').insert([formData])

        if (error) {
            alert('Deployment failed: ' + error.message)
            setDeploying(false)
        } else {
            setDeployedUrl(`${window.location.origin}/site/${formData.slug}`)
            setStep(3) // Success step
            setDeploying(false)
        }
    }

    return (
        <div className="dashboard-layout" style={{ background: 'var(--background)' }}>
            <div className="builder-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                    <Link to="/dashboard" style={{ marginRight: '1rem', color: 'var(--text-muted)' }}><ArrowLeft /></Link>
                    <h1 className="gradient-text">Site Builder Studio</h1>
                </div>

                {/* Wizard Steps */}
                {step === 1 && (
                    <div className="glass-card animate-fade">
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div className="icon-circle" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)' }}>
                                <Rocket size={32} />
                            </div>
                            <h2>Create a New Client Site</h2>
                            <p className="text-muted">Enter the business details below to generate a landing page.</p>
                        </div>

                        <div className="form-group">
                            <label>Business Name</label>
                            <input
                                className="glass-input"
                                value={formData.business_name}
                                onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                                placeholder="e.g. Acme Plumbing"
                            />
                        </div>

                        <div className="form-group">
                            <label>Industry</label>
                            <input
                                className="glass-input"
                                value={formData.industry}
                                onChange={e => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="e.g. Plumbing, Solar, HVAC"
                            />
                        </div>

                        <button
                            className="btn btn-secondary"
                            onClick={generateContent}
                            disabled={!formData.business_name || !formData.industry || loading}
                            style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <Wand2 size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Generating...' : 'Auto-Generate Content with AI'}
                        </button>

                        {formData.headline && (
                            <div className="animate-fade">
                                <div className="form-group">
                                    <label>Slug (URL)</label>
                                    <input
                                        className="glass-input"
                                        value={formData.slug}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Hero Headline</label>
                                    <input
                                        className="glass-input"
                                        value={formData.headline}
                                        onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Brand Color</label>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            type="color"
                                            value={formData.primary_color}
                                            onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                                            style={{ background: 'transparent', border: 'none', width: '50px', height: '50px', cursor: 'pointer' }}
                                        />
                                        <span>{formData.primary_color}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    onClick={handleDeploy}
                                    disabled={deploying}
                                    style={{ width: '100%', marginTop: '1rem' }}
                                >
                                    {deploying ? 'Deploying...' : 'Launch Site 🚀'}
                                </button>

                                {deploying && (
                                    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                        <div style={{ color: '#10b981' }}>&gt; {deployStep}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Success Step */}
                {step === 3 && (
                    <div className="glass-card animate-fade" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                            <CheckCircle size={48} />
                        </div>
                        <h2 className="gradient-text">Site Deployed Successfully!</h2>
                        <p className="text-muted" style={{ margin: '1rem 0 2rem' }}>Your client's site is live and ready to accept leads.</p>

                        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--glass-border)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{deployedUrl}</span>
                            <a href={deployedUrl} target="_blank" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Open <Monitor size={16} style={{ marginLeft: '5px' }} /></a>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={() => setStep(1)}>Build Another Site</button>
                            <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
