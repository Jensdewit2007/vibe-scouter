import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Team } from '../../types'

interface DescriptionModalProps {
  team: Team
  tierName: string
  userName: string
  onConfirm: (description: string) => void
  onCancel: () => void
}

function DescriptionModal({ team, tierName, userName, onConfirm, onCancel }: DescriptionModalProps) {
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    if (!description.trim()) {
      alert('Please enter a description')
      return
    }
    onConfirm(description)
  }

  return createPortal(
    <div className="overlay" onClick={onCancel}>
      <div className="modal description-modal" onClick={e => e.stopPropagation()}>
        <h3>Rate Team {team.name}</h3>
        <p>Tier: <strong>{tierName}</strong></p>
        <p>Scout: <strong>{userName || 'Unknown'}</strong></p>
        
        <label className="event-text">Why did you rank this team here?</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter your reasoning..."
          className="description-textarea"
          rows={4}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={handleSubmit} className="confirm-button">Confirm</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default DescriptionModal