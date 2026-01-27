import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Team, ScoutNotes } from '../../types'

interface DescriptionModalProps {
  team: Team & { notes?: ScoutNotes } 
  tierName: string
  userName: string
  onConfirm: (notes: ScoutNotes) => void
  onCancel: () => void
}

function DescriptionModal({
  team,
  tierName,
  userName,
  onConfirm,
  onCancel,
}: DescriptionModalProps) {
  const [notes, setNotes] = useState<ScoutNotes>({
    driverSkill: '',
    hardwareElectro: '',
    communication: '',
    basicGameKnowledge: '',
    underTrench: false,
    ...team.notes, 
  })

  useEffect(() => {
    setNotes({
      driverSkill: '',
      hardwareElectro: '',
      communication: '',
      basicGameKnowledge: '',
      underTrench: false,
      ...team.notes,
    })
  }, [team])

  const handleSubmit = () => {
    onConfirm(notes)
  }

  return createPortal(
    <div className="overlay" onClick={onCancel}>
      <div
        className="modal description-modal"
        onClick={e => e.stopPropagation()}
      >
        <h3>Rate Team {team.name}</h3>
        <p>Tier: <strong>{tierName}</strong></p>
        <p>Scout: <strong>{userName || 'Unknown'}</strong></p>

        <label>Driver Skill</label>
        <textarea
          className="description-textarea"
          value={notes.driverSkill}
          onChange={e => setNotes({ ...notes, driverSkill: e.target.value })}
        />

        <label>Hardware / Electrical</label>
        <textarea
          className="description-textarea"
          value={notes.hardwareElectro}
          onChange={e =>
            setNotes({ ...notes, hardwareElectro: e.target.value })
          }
        />

        <label>Communication</label>
        <textarea
          className="description-textarea"
          value={notes.communication}
          onChange={e =>
            setNotes({ ...notes, communication: e.target.value })
          }
        />

        <label>Basic Game Knowledge</label>
        <textarea
          className="description-textarea"
          value={notes.basicGameKnowledge}
          onChange={e =>
            setNotes({ ...notes, basicGameKnowledge: e.target.value })
          }
        />

        <label className="modal-checkbox">
          <input
            type="checkbox"
            checked={notes.underTrench}
            onChange={e =>
              setNotes({ ...notes, underTrench: e.target.checked })
            }
          />
          Under Trench?
        </label>

        <div className="modal-buttons">
          <button className="confirm-button" onClick={handleSubmit}>
            Confirm
          </button>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DescriptionModal
