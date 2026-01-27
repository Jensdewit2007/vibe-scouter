import { useState } from 'react'
import type { Team } from '../../types'
import '../../styles/teams.css'

interface TeamsProps {
  teams: Team[]
  useTeamColors: boolean
  onTeamDrop?: (team: Team) => void 
}

function Teams({ teams, useTeamColors, onTeamDrop }: TeamsProps) {
  const [dragTarget, setDragTarget] = useState<number | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleDragStart = (
    event: React.DragEvent<HTMLLIElement>,
    id: number,
    teamName: string
  ) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('teamId', id.toString())
    event.dataTransfer.setData('teamName', teamName)
    setDragTarget(id)
  }

  const handleDragEnd = () => {
    setDragTarget(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const teamId = Number(e.dataTransfer.getData('teamId'))
    const teamName = e.dataTransfer.getData('teamName')
    if (onTeamDrop) onTeamDrop({ id: teamId, name: teamName })
  }

  return (
    <div
      className={`teams-component ${dragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ul className="team-list">
        {teams.map(team => {
          const style = useTeamColors
            ? {
                backgroundColor: team.primaryColor || 'white',
                color: team.secondaryColor || 'black',
                borderColor: team.primaryColor || 'black',
              }
            : {}

          return (
            <li
              key={team.id}
              className={`team-item ${dragTarget === team.id ? 'dragging' : ''}`}
              draggable
              onDragStart={e => handleDragStart(e, team.id, team.name)}
              onDragEnd={handleDragEnd}
              style={style}
            >
              {team.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Teams
