import { useState } from 'react'
import type { Team } from '../../types'
import DescriptionModal from '../tierlist/descriptionModal'

interface TierRowProps {
  TierName: string
  teams: Team[]
  teamDescriptions: { [teamId: number]: { description: string; scoutName: string } }
  onAddTeam: (team: Team, description: string) => void
  onRemoveTeam: (teamId: number) => void
  useTeamColors: boolean
  userName: string
}

function TierRow({
  TierName,
  teams,
  teamDescriptions,
  onAddTeam,
  onRemoveTeam,
  useTeamColors,
  userName,
}: TierRowProps) {
  const [dragOver, setDragOver] = useState(false)
  const [pendingTeam, setPendingTeam] = useState<Team | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)

    const teamId = parseInt(e.dataTransfer.getData('teamId'))
    const teamName = e.dataTransfer.getData('teamName')
    const team = { id: teamId, name: teamName }
    
    setPendingTeam(team)
  }

  const handleDescriptionSubmit = (description: string) => {
    if (pendingTeam) {
      onAddTeam(pendingTeam, description)
      setPendingTeam(null)
    }
  }

  const handleTeamDragStart = (
    e: React.DragEvent<HTMLSpanElement>,
    teamId: number,
    teamName: string
  ) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('teamId', teamId.toString())
    e.dataTransfer.setData('teamName', teamName)
  }

  return (
    <>
      <div className="tier-row">
        <div className="tier-label">{TierName}</div>
        <div
          className={`tier-content ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
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
                onDragStart={e => handleTeamDragStart(e, team.id, team.name)}
                onClick={() => onRemoveTeam(team.id)}
                style={style}
                title={teamDescriptions[team.id]?.description}
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
          onConfirm={handleDescriptionSubmit}
          onCancel={() => setPendingTeam(null)}
        />
      )}
    </>
  )
}

export default TierRow
