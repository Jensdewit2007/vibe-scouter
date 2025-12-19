import type { Team } from '../../types'
import TierRow from './tier_row' 

interface TierlistProps {
  tierTeams: { [key: string]: Team[] }
  onAddTeam: (tierName: string, team: Team) => void
  onRemoveTeam: (tierName: string, teamId: number) => void
  useTeamColors: boolean
}

function Tierlist({
  tierTeams,
  onAddTeam,
  onRemoveTeam,
  useTeamColors,
}: TierlistProps) {
  return (
    <div className="tierlist">
      {Object.entries(tierTeams).map(([tierName, teams]) => (
        <TierRow
          key={tierName}
          TierName={tierName}
          teams={teams}
          onAddTeam={team => onAddTeam(tierName, team)}
          onRemoveTeam={teamId => onRemoveTeam(tierName, teamId)}
          useTeamColors={useTeamColors}
        />
      ))}
    </div>
  )
}

export default Tierlist
