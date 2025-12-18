import { useState } from "react";

type Team = { id: number; name: string }

function Teams({ teams }: { teams: Team[] }) {
  const [dragTarget, setDragTarget] = useState<number | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLLIElement>, id: number, teamName: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("teamId", id.toString());
    event.dataTransfer.setData("teamName", teamName);
    setDragTarget(id);
  };

  const handleDragEnd = () => {
    setDragTarget(null);
  };

  return (
    <div className="teams-component">
      <ul className="team-list">
        {teams.map((team) => (
          <li
            key={team.id}
            className={`team-item ${dragTarget === team.id ? "dragging" : ""}`}
            draggable
            onDragStart={(e) => handleDragStart(e, team.id, team.name)}
            onDragEnd={handleDragEnd}
          >
            {team.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;