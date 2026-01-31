import type { Team } from '../../types'
import '../../styles/teamDropdown.css'

interface TeamDropdownProps {
  teams: Team[]
  selectedTeam: Team | null
  onTeamSelect: (team: Team) => void
}

function TeamDropdown({ teams, selectedTeam, onTeamSelect }: TeamDropdownProps) {
  const sortedTeams = [...teams].sort((a, b) => a.id - b.id)

  return (
    <div className="team-dropdown-container">
      <label>Select Team:</label>
      <select
        className="team-dropdown"
        value={selectedTeam?.id || ''}
        onChange={(e) => {
          const team = teams.find(t => t.id === parseInt(e.target.value))
          if (team) onTeamSelect(team)
        }}
      >
        <option value="">-- Choose a team --</option>
        {sortedTeams.map(team => (
          <option key={team.id} value={team.id}>
            Team {team.id}
          </option>
        ))}
      </select>
    </div>
  )
}

export default TeamDropdown
