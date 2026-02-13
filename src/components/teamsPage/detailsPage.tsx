import { useState, useEffect } from 'react'
import type { Team, ScoutNotes } from '../../types'
import TeamDropdown from './teamDropdown'
import MatchesList from './matchesList'
import PointsTile from './tiles/pointsTile'
import StatusTile from './tiles/statusTile'
import RankingTile from './tiles/rankingTile'
import '../../styles/detailsPage.css'
import '../../../public/test.jpeg'

interface DetailsPageProps {
  availableTeams: Team[]
  tierTeams: { [key: string]: Team[] }
  teamDescriptions: {
    [tierName: string]: {
      [teamId: number]: { notes: ScoutNotes; scoutName: string }
    }
  }
  useTeamColors: boolean
}

interface Match {
  match_number: number
  comp_level: string
  key: string
  alliances: {
    red: { team_keys: string[]; score: number }
    blue: { team_keys: string[]; score: number }
  }
}

function DetailsPage({ availableTeams, tierTeams }: DetailsPageProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [matches, setMatches] = useState<Match[]>([])

  const eventKey = localStorage.getItem('eventKey') || '2026tuis'
  const apiKey = import.meta.env.VITE_TBA_API_KEY

  const allTeams = [
    ...availableTeams,
    ...Object.values(tierTeams).flat(),
  ]
    .filter((team, index, self) => index === self.findIndex(t => t.id === team.id))
    .sort((a, b) => a.id - b.id)

  const selectedTeam = allTeams.find(t => t.id === selectedTeamId) || null

  useEffect(() => {
    if (!selectedTeam) {
      setMatches([])
      return
    }

    fetch(
      `https://www.thebluealliance.com/api/v3/team/frc${selectedTeam.id}/event/${eventKey}/matches`,
      { headers: { 'X-TBA-Auth-Key': apiKey } }
    )
      .then(res => res.json())
      .then(data => setMatches(data || []))
      .catch(err => {
        console.error('Failed to fetch matches:', err)
        setMatches([])
      })
  }, [selectedTeam, eventKey, apiKey])

  // Set selected team if user clicked team in Matches page
  useEffect(() => {
    // If opened from matches page, read persisted id
    const stored = localStorage.getItem('selectedTeamId')
    if (stored) {
      setSelectedTeamId(Number(stored))
      localStorage.removeItem('selectedTeamId')
    }

    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail?.teamId
      if (id) setSelectedTeamId(id)
    }
    window.addEventListener('openDetails', handler)
    return () => window.removeEventListener('openDetails', handler)
  }, [])

  const nextMatch = matches.find(
    m => m.alliances.red.score === -1 && m.alliances.blue.score === -1
  )

  return (
    <>
      {/* LEFT COLUMN — Tiles */}
      <div className="details-left">
        <div className="details-tiles-container">
          <div className="tiles-column">
            <PointsTile teamNumber={selectedTeam?.id || 0} eventKey={eventKey} title="Auto" metric="auto_points" />
            <PointsTile teamNumber={selectedTeam?.id || 0} eventKey={eventKey} title="Teleop" metric="teleop_points" />
            <PointsTile teamNumber={selectedTeam?.id || 0} eventKey={eventKey} title="Endgame" metric="endgame_points" />
            <PointsTile teamNumber={selectedTeam?.id || 0} eventKey={eventKey} title="Total" metric="total_points" />

            <PointsTile teamNumber={selectedTeam?.id || 0} eventKey={eventKey} title="OPR" metric="opr" />
            <StatusTile title="Trench" status="good" />

            <RankingTile teamNumber={selectedTeam?.id || null} />
          </div>
        </div>
      </div>

      <div className="details-center">
        <div className="dropdown-wrapper">
          <TeamDropdown
            teams={allTeams}
            selectedTeam={selectedTeam}
            onTeamSelect={team => setSelectedTeamId(team.id)}
          />
        </div>
  
        {/* Middle column image */}
        <img
          src="/test.jpeg"
          alt="Team Visual"
          className="center-image"
        />
      </div>

      {/* RIGHT COLUMN — Matches */}
      <div className="details-right">
        <MatchesList
          selectedTeam={selectedTeam}
          allMatches={matches}
          nextMatch={nextMatch}
        />
      </div>
    </>
  )
}

export default DetailsPage
