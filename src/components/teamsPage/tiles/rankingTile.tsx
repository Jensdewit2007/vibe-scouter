interface RankingTileProps {
  teamNumber: number | null
}

function RankingTile({ teamNumber }: RankingTileProps) {
  return (
    <div className="metric-tile wide-tile">
        {teamNumber ? (
            <span className="ranking-text">
            Team <span className="highlight">{teamNumber}</span> is ranked{' '}
            <span className="highlight">1st</span> with an average RP of{' '}
            <span className="highlight">4.5</span>
            </span>
        ) : (
            'Select a team to view ranking'
        )}
    </div>
  )
}

export default RankingTile