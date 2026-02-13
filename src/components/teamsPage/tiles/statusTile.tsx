interface StatusTileProps {
  title: string
  status: 'good' | 'bad'
}

function StatusTile({ title, status }: StatusTileProps) {
  return (
    <div className="metric-tile">
      <div className="metric-title">{title}</div>
      <div className="metric-value">
        {status === 'good' ? '✅' : '❌'}
      </div>
      <div className="metric-subtext">Scouting data</div>
    </div>
  )
}

export default StatusTile