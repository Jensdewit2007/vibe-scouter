import { useState, useEffect } from 'react'
import type { Team } from '../../types'
import TeamDropdown from './teamDropdown'
import MatchesList from './matchesList'
import '../../styles/detailsPage.css'

interface DetailsPageProps {
  availableTeams: Team[]
  tierTeams: { [key: string]: Team[] }
  teamDescriptions: {
    [tierName: string]: {
      [teamId: number]: { description: string; scoutName: string }
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
    ...Object.values(tierTeams).flat()
  ]
    .filter((team, index, self) => index === self.findIndex(t => t.id === team.id))
    .sort((a, b) => a.id - b.id)

  const selectedTeam = allTeams.find(t => t.id === selectedTeamId)

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

  const nextMatch = matches.find(
    m => m.alliances.red.score === -1 && m.alliances.blue.score === -1
  )

  return (
    <div className="details-page-container">
      {/* Centered dropdown */}
      <TeamDropdown
        teams={allTeams}
        selectedTeam={selectedTeam || null}
        onTeamSelect={(team) => setSelectedTeamId(team.id)}
      />

      {/* Right-aligned matches area */}
      <div className="details-content-row">
        {selectedTeam ? (
          <MatchesList
            nextMatch={nextMatch}
            allMatches={matches}
            selectedTeam={selectedTeam}
          />
        ) : (
          <div className="no-team-selected">
            Select a team to view their matches
          </div>
        )}
      </div>
    </div>
  )
}

export default DetailsPage
