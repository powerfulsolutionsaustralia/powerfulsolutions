import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save, Eye, Settings, Palette, FileText, Loader } from 'lucide-react'
import EditableText from '../components/EditableText'
import EditableImage from '../components/EditableImage'
import EditableList from '../components/EditableList'

interface SiteConfig {
    id: string
    user_id: string
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
    hero_image_url: string
    testimonials: { name: string, text: string }[]
}

export default function SiteEditor() {
    const { slug } = useParams()
    const [site, setSite] = useState<SiteConfig | null>(null)
    const [draftState, setDraftState] = useState<SiteConfig | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState<'general' | 'content' | 'theme'>('general')

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
            } else {
                setSite(data)
                setDraftState(data)
            }
            setLoading(false)
        }

        fetchSite()
    }, [slug])

    const hasChanges = JSON.stringify(site) !== JSON.stringify(draftState)

    const updateField = (field: keyof SiteConfig, value: any) => {
        if (!draftState) return
        setDraftState({ ...draftState, [field]: value })
    }

    const handleSave = async () => {
        if (!draftState || !hasChanges) return

        setSaving(true)
        try {
            const { error } = await supabase
                .from('sites')
                .update(draftState)
                .eq('id', draftState.id)

            if (error) throw error

            setSite(draftState)
            alert('Changes saved successfully!')
        } catch (error) {
            console.error('Save failed:', error)
            alert('Failed to save changes. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <Loader className="animate-spin" size={40} style={{ color: 'var(--primary)' }} />
            </div>
        )
    }

    if (!draftState) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="gradient-text">Site Not Found</h1>
                    <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '2rem' }}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    const industryImage = draftState.hero_image_url || `https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200`

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)', color: 'var(--text)' }}>
            {/* Sidebar */}
            <div
                className="glass-card"
                style={{
                    width: '350px',
                    padding: '2rem',
                    borderRadius: 0,
                    borderRight: '1px solid var(--glass-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    overflowY: 'auto'
                }}
            >
                <div>
                    <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                    <h2 className="gradient-text" style={{ fontSize: '1.5rem' }}>Site Editor</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Edit your site visually</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setActiveTab('general')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: activeTab === 'general' ? 'var(--primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Settings size={16} /> General
                    </button>
                    <button
                        onClick={() => setActiveTab('content')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: activeTab === 'content' ? 'var(--primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <FileText size={16} /> Content
                    </button>
                    <button
                        onClick={() => setActiveTab('theme')}
                        style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: activeTab === 'theme' ? 'var(--primary)' : 'transparent',
                            border: 'none',
                            borderRadius: '0.5rem',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Palette size={16} /> Theme
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{ flex: 1 }}>
                    {activeTab === 'general' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Business Name</label>
                                <input
                                    type="text"
                                    value={draftState.business_name}
                                    onChange={(e) => updateField('business_name', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Industry</label>
                                <input
                                    type="text"
                                    value={draftState.industry}
                                    onChange={(e) => updateField('industry', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Phone</label>
                                <input
                                    type="text"
                                    value={draftState.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Address</label>
                                <input
                                    type="text"
                                    value={draftState.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>URL Slug</label>
                                <input
                                    type="text"
                                    value={draftState.slug}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Opening Hours</label>
                                <textarea
                                    value={draftState.opening_hours}
                                    onChange={(e) => updateField('opening_hours', e.target.value)}
                                    className="glass-input"
                                    style={{ minHeight: '100px', fontFamily: 'monospace' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Description</label>
                                <textarea
                                    value={draftState.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    className="glass-input"
                                    style={{ minHeight: '100px' }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'theme' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Primary Color</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={draftState.primary_color}
                                        onChange={(e) => updateField('primary_color', e.target.value)}
                                        style={{ width: '60px', height: '60px', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={draftState.primary_color}
                                        onChange={(e) => updateField('primary_color', e.target.value)}
                                        className="glass-input"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Logo URL</label>
                                <input
                                    type="text"
                                    value={draftState.logo_url}
                                    onChange={(e) => updateField('logo_url', e.target.value)}
                                    className="glass-input"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a
                        href={`/site/${draftState.slug}`}
                        target="_blank"
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                        <Eye size={16} /> Preview Live Site
                    </a>
                </div>
            </div>

            {/* Canvas */}
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                {/* Save Bar */}
                {hasChanges && (
                    <div
                        style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 100,
                            background: 'var(--primary)',
                            padding: '1rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        <span style={{ fontWeight: 'bold' }}>You have unsaved changes</span>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn"
                            style={{
                                background: 'white',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}

                {/* Editable Site Preview */}
                <div style={{ padding: '2rem', background: '#020617', minHeight: '100vh' }}>
                    {/* Hero Section */}
                    <section style={{ padding: '4rem 0', textAlign: 'center' }}>
                        <EditableText
                            value={draftState.headline}
                            onSave={(val) => updateField('headline', val)}
                            variant="h1"
                            className="gradient-text"
                            style={{ fontSize: '3rem', marginBottom: '1rem' }}
                        />
                        <EditableText
                            value={draftState.subheadline}
                            onSave={(val) => updateField('subheadline', val)}
                            variant="p"
                            multiline
                            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 2rem' }}
                        />

                        <div style={{ marginTop: '3rem', maxWidth: '1200px', margin: '3rem auto' }}>
                            <EditableImage
                                value={industryImage}
                                onSave={(val) => updateField('hero_image_url', val)}
                                alt="Hero"
                                style={{ width: '100%', borderRadius: '1rem', maxHeight: '500px', objectFit: 'cover' }}
                                businessName={draftState.business_name}
                                industry={draftState.industry}
                            />
                        </div>
                    </section>

                    {/* About Section */}
                    <section style={{ padding: '4rem 0', maxWidth: '800px', margin: '0 auto' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>About Us</h2>
                        <EditableText
                            value={draftState.value_proposition || draftState.description}
                            onSave={(val) => updateField('value_proposition', val)}
                            variant="p"
                            multiline
                            style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}
                        />
                    </section>

                    {/* Testimonials */}
                    <section style={{ padding: '4rem 0' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '3rem', textAlign: 'center' }}>What Our Clients Say</h2>
                        <EditableList
                            items={draftState.testimonials || []}
                            onUpdate={(items) => updateField('testimonials', items)}
                        />
                    </section>
                </div>
            </div>
        </div>
    )
}
