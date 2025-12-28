import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Send, CheckCircle } from 'lucide-react'

interface LeadFormProps {
    onClose?: () => void
    isEmbed?: boolean
}

export default function LeadForm({ onClose, isEmbed }: LeadFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error: submitError } = await supabase
            .from('leads')
            .insert([formData])

        if (submitError) {
            setError('Something went wrong. Please try again.')
            setLoading(false)
        } else {
            setSubmitted(true)
            setLoading(false)
            if (onClose) setTimeout(onClose, 3000)
        }
    }

    const content = (
        <div className={`glass-card ${!isEmbed ? 'animate-float' : ''}`} style={isEmbed ? { background: 'rgba(255,255,255,0.03)', padding: '2rem', border: '1px solid var(--glass-border)' } : { padding: '3rem' }}>
            {!isEmbed && onClose && <button className="close-btn" onClick={onClose}><X size={24} /></button>}

            {!submitted ? (
                <>
                    <h2 className="gradient-text" style={{ fontSize: isEmbed ? '1.5rem' : '2rem' }}>{isEmbed ? 'Get a Free Quote' : 'Launch Your Project'}</h2>
                    <p className="text-muted" style={{ fontSize: isEmbed ? '0.9rem' : '1rem' }}>{isEmbed ? 'Fill out the form below and we will get back to you.' : 'Tell us about your business and let\'s build something powerful.'}</p>

                    <form onSubmit={handleSubmit} className="lead-form" style={{ marginTop: isEmbed ? '1rem' : '2rem' }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                className="glass-input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                placeholder="john@example.com"
                                className="glass-input"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="glass-input"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                rows={isEmbed ? 3 : 4}
                                placeholder="Tell us about your needs..."
                                className="glass-input"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Submit Request'} <Send size={18} style={{ marginLeft: '0.5rem' }} />
                        </button>
                    </form>
                </>
            ) : (
                <div className="success-message">
                    <CheckCircle size={64} color="#10b981" />
                    <h2 className="gradient-text">Message Received!</h2>
                    <p>We'll be in touch shortly.</p>
                </div>
            )}
        </div>
    )

    if (isEmbed) return content

    return (
        <div className="modal-overlay animate-fade">
            <div className="modal-content">
                {content}
            </div>
        </div>
    )
}
