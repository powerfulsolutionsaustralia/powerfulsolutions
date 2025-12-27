import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { X, Send, CheckCircle } from 'lucide-react'

interface LeadFormProps {
    onClose: () => void
}

export default function LeadForm({ onClose }: LeadFormProps) {
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
            setTimeout(onClose, 3000)
        }
    }

    return (
        <div className="modal-overlay animate-fade">
            <div className="modal-content glass-card animate-float">
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                {!submitted ? (
                    <>
                        <h2 className="gradient-text">Launch Your Project</h2>
                        <p className="text-muted">Tell us about your business and let's build something powerful.</p>

                        <form onSubmit={handleSubmit} className="lead-form">
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

                            <div className="form-row">
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
                            </div>

                            <div className="form-group">
                                <label>Tell us about your business goals</label>
                                <textarea
                                    rows={4}
                                    placeholder="I want to double my leads in 3 months..."
                                    className="glass-input"
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            {error && <p className="error-message">{error}</p>}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                                {loading ? 'Sending...' : 'Get My Free Strategy'} <Send size={18} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <CheckCircle size={64} color="#10b981" />
                        <h2 className="gradient-text">Message Received!</h2>
                        <p>Our AI specialists will review your industry and reach out within 24 hours.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
