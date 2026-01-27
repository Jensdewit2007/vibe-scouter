import { useState } from 'react'
import type { Team, ScoutNotes } from '../../types'
import DescriptionModal from './descriptionModal'

interface TierRowProps {
  TierName: string
  teams: Team[]
  teamDescriptions: {
    [teamId: number]: { notes: ScoutNotes; scoutName: string }
  }
  onAddTeam: (team: Team, notes: ScoutNotes) => void
  onRemoveTeam: (teamId: number) => void // <-- keep this
  useTeamColors: boolean
  userName: string
}

function TierRow({
  TierName,
  teams,
  teamDescriptions,
  onAddTeam,
  useTeamColors,
  userName,
}: TierRowProps) {
  const [dragOver, setDragOver] = useState(false)
  const [pendingTeam, setPendingTeam] = useState<Team | null>(null)
  const [editingTeam, setEditingTeam] = useState<Team & { notes?: ScoutNotes } | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    const teamId = Number(e.dataTransfer.getData('teamId'))
    const teamName = e.dataTransfer.getData('teamName')

    setPendingTeam({ id: teamId, name: teamName })
  }

  const handleConfirm = (notes: ScoutNotes, team: Team) => {
    onAddTeam(team, notes)
    setPendingTeam(null)
    setEditingTeam(null)
  }

  const handleTeamClick = (team: Team) => {
    const existingNotes = teamDescriptions[team.id]?.notes
    setEditingTeam({ ...team, notes: existingNotes })
  }

  return (
    <>
      <div className="tier-row">
        <div className="tier-label">{TierName}</div>
        <div
          className={`tier-content ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {teams.map(team => {
            const style = useTeamColors
              ? {
                  backgroundColor: team.primaryColor || '#646cff',
                  color: team.secondaryColor || 'white',
                }
              : {}

            return (
              <span
                key={team.id}
                className="tier-team-item"
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('teamId', team.id.toString())
                  e.dataTransfer.setData('teamName', team.name)
                }}
                onClick={() => handleTeamClick(team)}
                style={style}
                title={teamDescriptions[team.id]?.notes?.driverSkill}
              >
                {team.name}
              </span>
            )
          })}
        </div>
      </div>

      {pendingTeam && (
        <DescriptionModal
          team={pendingTeam}
          tierName={TierName}
          userName={userName}
          onConfirm={notes => handleConfirm(notes, pendingTeam)}
          onCancel={() => setPendingTeam(null)}
        />
      )}

      {editingTeam && (
        <DescriptionModal
          team={editingTeam}
          tierName={TierName}
          userName={userName}
          onConfirm={notes => handleConfirm(notes, editingTeam)}
          onCancel={() => setEditingTeam(null)}
        />
      )}
    </>
  )
}

export default TierRow
