import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import EditableText from './EditableText'

interface ListItem {
    name: string
    text: string
}

interface EditableListProps {
    items: ListItem[]
    onUpdate: (newItems: ListItem[]) => void
}

export default function EditableList({ items, onUpdate }: EditableListProps) {
    const [isHovered, setIsHovered] = useState(false)

    const handleAddItem = () => {
        onUpdate([...items, { name: 'New Person', text: 'Add your testimonial here...' }])
    }

    const handleRemoveItem = (index: number) => {
        onUpdate(items.filter((_, i) => i !== index))
    }

    const handleUpdateItem = (index: number, field: 'name' | 'text', value: string) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        onUpdate(newItems)
    }

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ position: 'relative' }}
        >
            {isHovered && (
                <button
                    onClick={handleAddItem}
                    className="btn btn-primary"
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        zIndex: 10
                    }}
                >
                    <Plus size={16} /> Add Testimonial
                </button>
            )}

            <div className="features-grid">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="glass-card"
                        style={{
                            padding: '3rem',
                            textAlign: 'left',
                            position: 'relative',
                            outline: isHovered ? '2px solid var(--primary)' : 'none',
                            outlineOffset: '4px',
                            transition: 'outline 0.2s ease'
                        }}
                    >
                        {isHovered && (
                            <>
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        left: '1rem',
                                        color: 'var(--text-muted)',
                                        cursor: 'grab'
                                    }}
                                >
                                    <GripVertical size={20} />
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(239, 68, 68, 0.2)',
                                        border: '1px solid rgba(239, 68, 68, 0.5)',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ef4444',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </>
                        )}

                        <div style={{ color: '#f59e0b', display: 'flex', marginBottom: '1.5rem' }}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>

                        <EditableText
                            value={item.text}
                            onSave={(newValue) => handleUpdateItem(index, 'text', newValue)}
                            variant="p"
                            multiline
                            style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', fontStyle: 'italic' }}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold'
                                }}
                            >
                                {item.name[0]}
                            </div>
                            <div>
                                <EditableText
                                    value={item.name}
                                    onSave={(newValue) => handleUpdateItem(index, 'name', newValue)}
                                    variant="span"
                                    style={{ fontWeight: 'bold', display: 'block' }}
                                />
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Client</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
