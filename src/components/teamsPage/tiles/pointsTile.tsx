import { useState, useEffect } from 'react'

type PointsMetric = 'auto_points' | 'teleop_points' | 'endgame_points' | 'total_points'

interface PointsTileProps {
  teamNumber: number | null
  eventKey: string
  title: string
  metric: PointsMetric
}

interface StatboticsResponse {
  epa: {
    breakdown: {
      auto_points: number
      teleop_points: number
      endgame_points: number
      total_points: number
    }
  }
}

function PointsTile({ teamNumber, eventKey, title, metric }: PointsTileProps) {
  const [value, setValue] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const year = parseInt(eventKey.slice(0, 4))

  useEffect(() => {
    if (!teamNumber || !year) {
      setValue(null)
      return
    }

    setLoading(true)

    fetch(`https://api.statbotics.io/v3/team_year/${teamNumber}/${year}`)
      .then(res => res.json())
      .then((data: StatboticsResponse) => {
        const val = data?.epa?.breakdown?.[metric] ?? null
        setValue(val)
      })
      .catch(err => {
        console.error(`Failed to fetch ${title}:`, err)
        setValue(null)
      })
      .finally(() => setLoading(false))
  }, [teamNumber, year, metric, title])

  return (
    <div className="metric-tile">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{loading ? '—' : value !== null ? value.toFixed(1) : 'N/A'}</div>
      <div className="metric-subtext">Statbotics</div>
    </div>
  )
}

export default PointsTile
