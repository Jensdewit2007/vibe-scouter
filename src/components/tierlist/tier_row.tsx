import { useState } from "react";

interface Team {
  id: number;
  name: string;
}

interface TierRowProps {
  TierName: string;
  teams: Team[];
  onAddTeam: (team: Team) => void;
  onRemoveTeam: (teamId: number) => void;
}

function TierRow({ TierName, teams, onAddTeam, onRemoveTeam }: TierRowProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const teamId = parseInt(e.dataTransfer.getData("teamId"));
    const teamName = e.dataTransfer.getData("teamName");
    onAddTeam({ id: teamId, name: teamName });
  };

  const handleTeamDragStart = (e: React.DragEvent<HTMLSpanElement>, teamId: number, teamName: string) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("teamId", teamId.toString());
    e.dataTransfer.setData("teamName", teamName);
  };

  return (
    <>
      <div className="tier-row">
        <div className="tier-label">{TierName}</div>
        <div
          className={`tier-content ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {teams.map((team) => (
            <span
              key={team.id}
              className="tier-team-item"
              draggable
              onDragStart={(e) => handleTeamDragStart(e, team.id, team.name)}
              onClick={() => onRemoveTeam(team.id)}
              title="Click to remove or drag to move"
            >
              {team.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export default TierRow;