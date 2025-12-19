import Menu from '../topbar/menu'

interface TopbarProps {
  useTeamColors: boolean
  setUseTeamColors: (val: boolean) => void
}

function Topbar({ useTeamColors, setUseTeamColors }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-menu">
        <Menu useTeamColors={useTeamColors} setUseTeamColors={setUseTeamColors} />
      </div>
      <h1 className="topbar-title">67</h1>
    </div>
  )
}

export default Topbar
