import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, Users, Star, Settings, LogOut, Menu, RefreshCcw, CheckCircle, Clock, Hammer, Globe, ExternalLink, Copy, Check } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Lead {
    id: string
    created_at: string
    name: string
    email: string
    phone: string | null
    message: string | null
    status: string
}

interface Site {
    id: string
    business_name: string
    industry: string
    slug: string
    status: string
    created_at: string
}

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [leads, setLeads] = useState<Lead[]>([])
    const [sites, setSites] = useState<Site[]>([])
    const [loading, setLoading] = useState(true)
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
    const [stats, setStats] = useState({ total_leads: 0, new_leads: 0, total_sites: 0 })
    const navigate = useNavigate()

    const fetchData = useCallback(async () => {
        setLoading(true)

        // Fetch Leads
        const { data: leadsData, error: leadsError } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })

        if (leadsError) console.error('Error fetching leads:', leadsError)

        // Fetch Sites
        const { data: sitesData, error: sitesError } = await supabase
            .from('sites')
            .select('*')
            .order('created_at', { ascending: false })

        if (sitesError) console.error('Error fetching sites:', sitesError)

        const currentLeads = leadsData || []
        const currentSites = sitesData || []

        setLeads(currentLeads)
        setSites(currentSites)

        setStats({
            total_leads: currentLeads.length,
            new_leads: currentLeads.filter(l => l.status === 'new').length,
            total_sites: currentSites.length
        })

        setLoading(false)
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData()

        const leadsChannel = supabase.channel('public:leads')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, fetchData)
            .subscribe()

        const sitesChannel = supabase.channel('public:sites')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, fetchData)
            .subscribe()

        return () => {
            supabase.removeChannel(leadsChannel)
            supabase.removeChannel(sitesChannel)
        }
    }, [fetchData])

    const copyToClipboard = (slug: string) => {
        const url = `${window.location.origin}/site/${slug}`
        navigator.clipboard.writeText(url)
        setCopiedSlug(slug)
        setTimeout(() => setCopiedSlug(null), 2000)
    }

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) {
            console.error('Error updating lead status:', error)
        } else {
            fetchData()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/')
    }

    const renderLeadsTable = (limit?: number) => {
        const displayedLeads = limit ? leads.slice(0, limit) : leads
        return (
            <div className="table-container">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Prospect</th>
                            <th>Contact Info</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedLeads.length === 0 ? (
                            <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No inquiries found.</td></tr>
                        ) : (
                            displayedLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td>
                                        <div className="lead-name">{lead.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {lead.message || 'No message provided'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{lead.email}</div>
                                        <div className="lead-phone">{lead.phone || '-'}</div>
                                    </td>
                                    <td style={{ fontSize: '0.9rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${lead.status}`}>
                                            {lead.status === 'new' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                            {lead.status}
                                        </span>
                                    </td>
                                    <td>
                                        {lead.status === 'new' ? (
                                            <button className="action-btn" style={{ padding: '0.4rem 0.8rem' }} onClick={() => updateStatus(lead.id, 'contacted')}>
                                                Contacted
                                            </button>
                                        ) : (
                                            <button className="action-btn secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => updateStatus(lead.id, 'new')}>
                                                Undo
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderSitesTable = () => (
        <div className="table-container">
            <table className="leads-table">
                <thead>
                    <tr>
                        <th>Brand & Industry</th>
                        <th>Path / Live URL</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sites.length === 0 ? (
                        <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No sites built yet.</td></tr>
                    ) : (
                        sites.map(site => (
                            <tr key={site.id}>
                                <td>
                                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{site.business_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{site.industry}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>/site/{site.slug}</code>
                                        <button
                                            onClick={() => copyToClipboard(site.slug)}
                                            style={{ background: 'transparent', color: copiedSlug === site.slug ? '#10b981' : 'var(--text-muted)', padding: '0.2rem' }}
                                            title="Copy full URL"
                                        >
                                            {copiedSlug === site.slug ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <span className="status-badge contacted" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                        <Globe size={12} /> Active
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <Link to={`/site/${site.slug}`} target="_blank" className="action-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem' }}>
                                            Visit <ExternalLink size={14} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="icon-circle" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem', flexShrink: 0 }}>
                        <Hammer size={18} color="white" />
                    </div>
                    <span className="logo-text gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800, whiteSpace: 'nowrap' }}>PowerOps</span>
                </div>

                <nav className="sidebar-nav">
                    <button onClick={() => setActiveTab('overview')} className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </button>
                    <button onClick={() => setActiveTab('sites')} className={`sidebar-link ${activeTab === 'sites' ? 'active' : ''}`}>
                        <Globe size={20} />
                        <span>My Websites</span>
                    </button>
                    <button onClick={() => setActiveTab('leads')} className={`sidebar-link ${activeTab === 'leads' ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Lead Pipeline</span>
                    </button>
                    <div style={{ margin: '1rem 0', height: '1px', background: 'var(--glass-border)' }}></div>
                    <Link to="/site-builder" className="sidebar-link">
                        <Hammer size={20} />
                        <span>Site Builder</span>
                    </Link>
                    <button className="sidebar-link">
                        <Star size={20} />
                        <span>Reviews</span>
                    </button>
                    <button className="sidebar-link">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link logout-btn">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px' }}>
                            <Menu size={20} />
                        </button>
                        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            {activeTab === 'overview' ? 'Command Center' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                    </div>
                    <div className="user-profile">
                        <button className="refresh-btn" onClick={fetchData} disabled={loading} title="Refresh Live Data" style={{ marginRight: '0.5rem' }}>
                            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 0.5rem' }}></div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', marginRight: '0.5rem' }}>Admin</span>
                        <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>AS</div>
                    </div>
                </header>

                <div className="content-area">
                    {activeTab === 'overview' && (
                        <div className="animate-fade">
                            <div className="content-header" style={{ marginBottom: '2.5rem' }}>
                                <h1 style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>Global Performance</h1>
                                <p className="text-muted">Tracking 24h business metrics and automation status.</p>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card glass-card">
                                    <div className="stat-header">
                                        <h3>Total Inquiries</h3>
                                        <Users className="stat-icon" size={20} />
                                    </div>
                                    <div className="stat-value">{stats.total_leads}</div>
                                    <div className="stat-change positive">+{stats.new_leads} new prospects</div>
                                </div>

                                <div className="stat-card glass-card">
                                    <div className="stat-header">
                                        <h3>Active Deployments</h3>
                                        <Globe className="stat-icon" size={20} />
                                    </div>
                                    <div className="stat-value">{stats.total_sites}</div>
                                    <div className="stat-change positive">Global Edge Live</div>
                                </div>

                                <div className="stat-card glass-card" style={{ border: '1px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
                                    <div className="stat-header">
                                        <h3 style={{ color: 'var(--primary)' }}>Quick Actions</h3>
                                        <Hammer className="stat-icon" size={20} style={{ color: 'var(--primary)' }} />
                                    </div>
                                    <Link to="/site-builder" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '1rem', borderRadius: '12px' }}>
                                        Build New Site
                                    </Link>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                                <div className="glass-card" style={{ padding: '0' }}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>Active Client Sites</h3>
                                        <Link to="#" onClick={() => setActiveTab('sites')} style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>View All Sites</Link>
                                    </div>
                                    {renderSitesTable()}
                                </div>

                                <div className="glass-card" style={{ padding: '0' }}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>Recent Activity</h3>
                                        <Link to="#" onClick={() => setActiveTab('leads')} style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>View All Leads</Link>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        {leads.length === 0 ? (
                                            <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>No recent leads.</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                                {leads.slice(0, 4).map(lead => (
                                                    <div key={lead.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                            {lead.status === 'new' ? <Clock size={18} color="var(--primary)" /> : <CheckCircle size={18} color="#10b981" />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{lead.name}</div>
                                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lead.email}</div>
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                            {new Date(lead.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sites' && (
                        <div className="animate-fade">
                            <div className="content-header" style={{ marginBottom: '2.5rem' }}>
                                <h1>Website Management</h1>
                                <p className="text-muted">Direct control over your deployed business assets and global hosting status.</p>
                            </div>
                            <div className="glass-card" style={{ padding: '0' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Global Deployments</h2>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span className="badge" style={{ padding: '0.5rem 1rem' }}>{sites.length} URLs Active</span>
                                        <Link to="/site-builder" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>Deploy New Site</Link>
                                    </div>
                                </div>
                                {renderSitesTable()}
                            </div>
                        </div>
                    )}

                    {activeTab === 'leads' && (
                        <div className="animate-fade">
                            <div className="content-header" style={{ marginBottom: '2.5rem' }}>
                                <h1>Lead Tracking</h1>
                                <p className="text-muted">High-priority inquiries captured from your customer landing pages.</p>
                            </div>
                            <div className="glass-card" style={{ padding: '0' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h2>Pipeline Overview</h2>
                                    <span className="badge" style={{ padding: '0.5rem 1rem' }}>{leads.length} Active Leads</span>
                                </div>
                                {renderLeadsTable()}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
