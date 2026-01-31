import Menu from './menu'

interface TopbarProps {
  useTeamColors: boolean
  setUseTeamColors: (val: boolean) => void
  userName: string
  setUserName: (name: string) => void
}

function Topbar({ useTeamColors, setUseTeamColors, userName, setUserName }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-menu">
        <Menu 
          useTeamColors={useTeamColors} 
          setUseTeamColors={setUseTeamColors}
          userName={userName}
          setUserName={setUserName}
        />
      </div>
      <h1 className="topbar-title">2026 scouting tool</h1>
    </div>
  )
}

export default Topbar
