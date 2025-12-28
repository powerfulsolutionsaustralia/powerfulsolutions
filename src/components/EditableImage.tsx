import { useState } from 'react'
import { Upload, Link as LinkIcon, X, Sparkles, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { generateHeroImage } from '../lib/generateImage'

interface EditableImageProps {
    value: string
    onSave: (newUrl: string) => void
    alt?: string
    style?: React.CSSProperties
    className?: string
    businessName?: string
    industry?: string
}

export default function EditableImage({
    value,
    onSave,
    alt = 'Image',
    style = {},
    className = '',
    businessName = '',
    industry = ''
}: EditableImageProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [uploading, setUploading] = useState(false)
    const [generating, setGenerating] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const fileName = `${Date.now()}-${file.name}`
            const { error } = await supabase.storage
                .from('site-images')
                .upload(fileName, file)

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('site-images')
                .getPublicUrl(fileName)

            onSave(publicUrl)
            setShowModal(false)
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload image. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleUrlSave = () => {
        if (urlInput.trim()) {
            onSave(urlInput.trim())
            setUrlInput('')
            setShowModal(false)
        }
    }

    const handleAIGenerate = async () => {
        if (!businessName || !industry) {
            alert('Business name and industry are required for AI generation.')
            return
        }

        setGenerating(true)
        try {
            const imageUrl = await generateHeroImage(businessName, industry)
            if (imageUrl) {
                onSave(imageUrl)
                setShowModal(false)
            } else {
                alert('AI image generation failed. Please try again.')
            }
        } catch (error) {
            console.error('AI generation failed:', error)
            alert('AI image generation failed. Please try again.')
        } finally {
            setGenerating(false)
        }
    }

    const canGenerateAI = businessName && industry

    return (
        <>
            <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={value}
                    alt={alt}
                    style={style}
                    className={className}
                />
                {isHovered && (
                    <div
                        onClick={() => setShowModal(true)}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            borderRadius: 'inherit'
                        }}
                    >
                        <div
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Upload size={20} /> Change Image
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="glass-card"
                        style={{ padding: '2rem', maxWidth: '500px', width: '90%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3>Change Image</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* AI Generate Option */}
                        {canGenerateAI && (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <button
                                        onClick={handleAIGenerate}
                                        disabled={generating}
                                        className="btn"
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                            border: 'none',
                                            color: 'white',
                                            padding: '1rem'
                                        }}
                                    >
                                        {generating ? (
                                            <>
                                                <Loader size={20} className="animate-spin" />
                                                Generating with Nano Banana Pro...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={20} />
                                                Generate with AI (Nano Banana Pro)
                                            </>
                                        )}
                                    </button>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', textAlign: 'center' }}>
                                        Uses Gemini 3 Pro to create a unique image for {businessName}
                                    </p>
                                </div>

                                <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
                                    OR
                                </div>
                            </>
                        )}

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label
                                htmlFor="file-upload"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                            >
                                <Upload size={20} />
                                {uploading ? 'Uploading...' : 'Upload from Computer'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                disabled={uploading}
                                style={{ display: 'none' }}
                            />
                        </div>

                        <div style={{ textAlign: 'center', margin: '1rem 0', color: 'var(--text-muted)' }}>
                            OR
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Image URL
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="glass-input"
                                    style={{ flex: 1 }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUrlSave()}
                                />
                                <button
                                    onClick={handleUrlSave}
                                    className="btn btn-primary"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <LinkIcon size={16} /> Use URL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
