import { useState, useEffect, useCallback } from 'react'
import { LayoutDashboard, Users, Star, Settings, LogOut, Menu, RefreshCcw, CheckCircle, Clock, Hammer, Globe, ArrowRight } from 'lucide-react'
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
    const [leads, setLeads] = useState<Lead[]>([])
    const [sites, setSites] = useState<Site[]>([])
    const [loading, setLoading] = useState(true)
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

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <span className="logo-text gradient-text">Powerful Solutions</span>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className="sidebar-link active">
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </a>
                    <Link to="/site-builder" className="sidebar-link">
                        <Hammer size={20} />
                        <span>Site Builder</span>
                    </Link>
                    <a href="#" className="sidebar-link">
                        <Users size={20} />
                        <span>Leads</span>
                    </a>
                    <a href="#" className="sidebar-link">
                        <Star size={20} />
                        <span>Reviews</span>
                    </a>
                    <a href="#" className="sidebar-link">
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="sidebar-link logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-bar">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-btn">
                        <Menu size={24} />
                    </button>
                    <div className="user-profile">
                        <button className="refresh-btn" onClick={fetchData} disabled={loading}>
                            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="avatar">A</div>
                        <span>Admin Control</span>
                    </div>
                </header>

                <div className="content-area">
                    <div className="content-header">
                        <h1>Dashboard Overview</h1>
                        <p className="text-muted">Real-time performance metrics</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card glass-card">
                            <div className="stat-header">
                                <h3>Total Inquiries</h3>
                                <Users className="stat-icon" />
                            </div>
                            <div className="stat-value">{stats.total_leads}</div>
                            <div className="stat-change positive">{stats.new_leads} new today</div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-header">
                                <h3>Active Sites</h3>
                                <Globe className="stat-icon" />
                            </div>
                            <div className="stat-value">{stats.total_sites}</div>
                            <div className="stat-change positive">100% Uptime</div>
                        </div>

                        <div className="stat-card glass-card">
                            <div className="stat-header">
                                <h3>Create New</h3>
                                <Hammer className="stat-icon" />
                            </div>
                            <Link to="/site-builder" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
                                Open Builder
                            </Link>
                        </div>
                    </div>

                    {/* Sites Section */}
                    <div className="glass-card" style={{ marginTop: '2rem', padding: '0' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Deployed Client Sites</h2>
                            <span className="badge">{sites.length} Active</span>
                        </div>

                        <div className="table-container">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th>Business Name</th>
                                        <th>Industry</th>
                                        <th>URL Slug</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && sites.length === 0 ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading sites...</td></tr>
                                    ) : sites.length === 0 ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No sites deployed yet.</td></tr>
                                    ) : (
                                        sites.map(site => (
                                            <tr key={site.id}>
                                                <td style={{ fontWeight: 500 }}>{site.business_name}</td>
                                                <td>{site.industry}</td>
                                                <td style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>/{site.slug}</td>
                                                <td>
                                                    <span className="status-badge new">
                                                        <CheckCircle size={12} />
                                                        Live
                                                    </span>
                                                </td>
                                                <td>
                                                    <Link to={`/site/${site.slug}`} target="_blank" className="action-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                                        View Live <ArrowRight size={14} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Leads Section */}
                    <div className="glass-card" style={{ marginTop: '2rem', padding: '0' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2>Recent Inquiries</h2>
                            <span className="badge">{leads.length} Leads</span>
                        </div>

                        <div className="table-container">
                            <table className="leads-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && leads.length === 0 ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Fetching data...</td></tr>
                                    ) : leads.length === 0 ? (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No leads yet. Start marketing!</td></tr>
                                    ) : (
                                        leads.map(lead => (
                                            <tr key={lead.id}>
                                                <td>
                                                    <div className="lead-name">{lead.name}</div>
                                                    <div className="lead-phone">{lead.phone || 'No phone'}</div>
                                                </td>
                                                <td>{lead.email}</td>
                                                <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`status-badge ${lead.status}`}>
                                                        {lead.status === 'new' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {lead.status === 'new' ? (
                                                        <button className="action-btn" onClick={() => updateStatus(lead.id, 'contacted')}>
                                                            Mark Contacted
                                                        </button>
                                                    ) : (
                                                        <button className="action-btn secondary" onClick={() => updateStatus(lead.id, 'new')}>
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
                    </div>
                </div>
            </main>
        </div>
    )
}
