import { useState, useRef, useEffect } from 'react'
import { Check, X, Edit2 } from 'lucide-react'

interface EditableTextProps {
    value: string
    onSave: (newValue: string) => void
    variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
    className?: string
    style?: React.CSSProperties
    multiline?: boolean
    placeholder?: string
}

export default function EditableText({
    value,
    onSave,
    variant = 'p',
    className = '',
    style = {},
    multiline = false,
    placeholder = 'Click to edit...'
}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const [isHovered, setIsHovered] = useState(false)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const handleSave = () => {
        if (editValue.trim() !== value) {
            onSave(editValue.trim())
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditValue(value)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    if (isEditing) {
        const inputStyle = {
            ...style,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid var(--primary)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            color: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontFamily: 'inherit',
            resize: multiline ? 'vertical' : 'none',
            minHeight: multiline ? '100px' : 'auto'
        } as React.CSSProperties

        return (
            <div style={{ position: 'relative' }}>
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        className={className}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={inputStyle}
                        className={className}
                    />
                )}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Check size={16} /> Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <X size={16} /> Cancel
                    </button>
                </div>
            </div>
        )
    }

    const Tag = variant
    const displayValue = value || placeholder

    return (
        <div
            style={{ position: 'relative', cursor: 'pointer' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsEditing(true)}
        >
            <Tag
                className={className}
                style={{
                    ...style,
                    outline: isHovered ? '2px solid var(--primary)' : 'none',
                    outlineOffset: '4px',
                    borderRadius: '4px',
                    transition: 'outline 0.2s ease',
                    opacity: value ? 1 : 0.5
                }}
            >
                {displayValue}
            </Tag>
            {isHovered && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        pointerEvents: 'none'
                    }}
                >
                    <Edit2 size={12} />
                </div>
            )}
        </div>
    )
}
