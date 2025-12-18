import TierRow from "./tier_row"

interface Team {
  id: number;
  name: string;
}

interface TierlistProps {
  tierTeams: { [key: string]: Team[] };
  onAddTeam: (tierName: string, team: Team) => void;
  onRemoveTeam: (tierName: string, teamId: number) => void;
}

function Tierlist({ tierTeams, onAddTeam, onRemoveTeam }: TierlistProps) {
  return (
    <>
      <div className="tierlist">
        <TierRow
          TierName="S"
          teams={tierTeams.S}
          onAddTeam={(team) => onAddTeam("S", team)}
          onRemoveTeam={(teamId) => onRemoveTeam("S", teamId)}
        />
        <TierRow
          TierName="A"
          teams={tierTeams.A}
          onAddTeam={(team) => onAddTeam("A", team)}
          onRemoveTeam={(teamId) => onRemoveTeam("A", teamId)}
        />
        <TierRow
          TierName="B"
          teams={tierTeams.B}
          onAddTeam={(team) => onAddTeam("B", team)}
          onRemoveTeam={(teamId) => onRemoveTeam("B", teamId)}
        />
        <TierRow
          TierName="C"
          teams={tierTeams.C}
          onAddTeam={(team) => onAddTeam("C", team)}
          onRemoveTeam={(teamId) => onRemoveTeam("C", teamId)}
        />
        <TierRow
          TierName="D"
          teams={tierTeams.D}
          onAddTeam={(team) => onAddTeam("D", team)}
          onRemoveTeam={(teamId) => onRemoveTeam("D", teamId)}
        />
      </div>
    </>
  );
}

export default Tierlist