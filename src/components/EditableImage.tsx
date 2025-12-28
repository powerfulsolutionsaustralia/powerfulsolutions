import { useState } from 'react'
import { Upload, Link as LinkIcon, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface EditableImageProps {
    value: string
    onSave: (newUrl: string) => void
    alt?: string
    style?: React.CSSProperties
    className?: string
}

export default function EditableImage({
    value,
    onSave,
    alt = 'Image',
    style = {},
    className = ''
}: EditableImageProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [urlInput, setUrlInput] = useState('')
    const [uploading, setUploading] = useState(false)

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
