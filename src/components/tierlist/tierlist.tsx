import type { Team } from '../../types'
import TierRow from './tier_row'

interface TierlistProps {
  tierTeams: { [key: string]: Team[] }
  teamDescriptions: { [tierName: string]: { [teamId: number]: { description: string; scoutName: string } } }
  onAddTeam: (tierName: string, team: Team, description: string) => void
  onRemoveTeam: (tierName: string, teamId: number) => void
  useTeamColors: boolean
  userName: string
}

function Tierlist({
  tierTeams,
  teamDescriptions,
  onAddTeam,
  onRemoveTeam,
  useTeamColors,
  userName,
}: TierlistProps) {
  return (
    <div className="tierlist">
      {Object.entries(tierTeams).map(([tierName, teams]) => (
        <TierRow
          key={tierName}
          TierName={tierName}
          teams={teams}
          teamDescriptions={teamDescriptions[tierName] || {}}
          onAddTeam={(team, description) => onAddTeam(tierName, team, description)}
          onRemoveTeam={teamId => onRemoveTeam(tierName, teamId)}
          useTeamColors={useTeamColors}
          userName={userName}
        />
      ))}
    </div>
  )
}

export default Tierlist
