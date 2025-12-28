import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin + '/dashboard',
                },
            })

            if (error) throw error
            setMessage('Check your email for the magic link!')
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during login'
            setMessage(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Temporary function to bypass auth for development/demo (admin)
    // In production, this would be a real password login
    const handleDevLogin = async () => {
        // NOTE: For now we just route to dashboard to show structure
        // Real auth logic will be added when user accounts are set up
        navigate('/dashboard')
    }

    return (
        <div className="login-container">
            <div className="login-box glass-card animate-fade">
                <h2 className="gradient-text">Welcome Back</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to manage your empire</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@powerfulsolutions.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="glass-input"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
                        {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                    </button>

                    <div className="divider">
                        <span>OR</span>
                    </div>

                    <button type="button" onClick={handleDevLogin} className="btn btn-secondary" style={{ width: '100%' }}>
                        Access Demo Dashboard
                    </button>

                    {message && <p className="message">{message}</p>}
                </form>
            </div>
        </div>
    )
}
