import { useState, useEffect } from 'react'
import type { Team } from '../../types'

interface DetailsPageProps {
  availableTeams: Team[]
  tierTeams: { [key: string]: Team[] }
  teamDescriptions: { [tierName: string]: { [teamId: number]: { description: string; scoutName: string } } }
  useTeamColors: boolean
}

function DetailsPage({ availableTeams, tierTeams }: DetailsPageProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [teamName, setTeamName] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const eventKey = localStorage.getItem('eventKey') || '2026tuis'
  const apiKey = import.meta.env.VITE_TBA_API_KEY

  // Combine all teams (ranked + unranked)
  const allTeams = [
    ...availableTeams,
    ...Object.values(tierTeams).flat()
  ].filter((team, index, self) => index === self.findIndex(t => t.id === team.id))
  .sort((a, b) => a.id - b.id)

  const selectedTeam = allTeams.find(t => t.id === selectedTeamId)

  // Fetch team matches when team is selected
  useEffect(() => {
    if (!selectedTeam) {
      setMatches([])
      setTeamName('')
      return
    }

    setLoading(true)

    // Fetch team name
    fetch(`https://www.thebluealliance.com/api/v3/team/frc${selectedTeam.id}`, {
      headers: { 'X-TBA-Auth-Key': apiKey },
    })
      .then(res => res.json())
      .then(data => setTeamName(data.nickname || `Team ${selectedTeam.id}`))
      .catch(err => {
        console.error('Failed to fetch team name:', err)
        setTeamName(`Team ${selectedTeam.id}`)
      })

    // Fetch matches for this team
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
      .finally(() => setLoading(false))
  }, [selectedTeam, eventKey, apiKey])

  // Helper: Get alliance color and scores
  function getAlliance(match: any) {
    const color = match.alliances.red.team_keys.includes(`frc${selectedTeam?.id}`) ? 'red' : 'blue'
    const score = match.alliances[color].score
    const oppScore = match.alliances[color === 'red' ? 'blue' : 'red'].score
    let result = ''
    if (score > oppScore) result = 'WIN'
    else if (score < oppScore) result = 'LOSS'
    else result = 'TIE'
    return { color, score, oppScore, result }
  }

  // Find next match (no score yet)
  const nextMatch = matches.find(m => m.alliances.red.score === -1 && m.alliances.blue.score === -1)

  const compLevelOrder: Record<string, number> = { qm: 1, qf: 2, sf: 3, f: 4 }

  return (
    <div className="details-page-container">
      {/* Team Selector - Under Title, Centered */}
      <div className="details-team-selector">
        <label>Select Team:</label>
        <select
          value={selectedTeamId || ''}
          onChange={e => setSelectedTeamId(e.target.value ? parseInt(e.target.value) : null)}
          className="team-dropdown"
        >
          <option value="">-- Select a team --</option>
          {allTeams.map(team => (
            <option key={team.id} value={team.id}>
              Team {team.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right Side - Matches */}
      <div className="details-matches-container">
        {selectedTeam ? (
          <>
            <div className="matches-header">
              <h2>{teamName}</h2>
            </div>

            {/* Next Match */}
            <div className="next-match-section">
              <h3>Next Match</h3>
              {loading ? (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>Loading...</p>
              ) : nextMatch ? (
                <div className="next-match-display">
                  <div className="match-badge">
                    {nextMatch.comp_level?.toUpperCase()} {nextMatch.match_number}
                  </div>
                  <div className="match-badge">
                    {nextMatch.key}
                  </div>
                </div>
              ) : (
                <div className="no-upcoming">No upcoming matches</div>
              )}
            </div>

            {/* All Matches */}
            <div className="all-matches-section">
              <h3>All Matches</h3>
              {loading ? (
                <p style={{ fontSize: '0.9rem', color: '#999' }}>Loading...</p>
              ) : matches.length === 0 ? (
                <p className="no-matches">No matches found</p>
              ) : (
                <div className="matches-list">
                  {[...matches]
                    .sort((a, b) => {
                      const aOrder = compLevelOrder[a.comp_level as string] ?? 99
                      const bOrder = compLevelOrder[b.comp_level as string] ?? 99
                      if (aOrder !== bOrder) return aOrder - bOrder
                      if ((a.set_number ?? 0) !== (b.set_number ?? 0))
                        return (a.set_number ?? 0) - (b.set_number ?? 0)
                      return a.match_number - b.match_number
                    })
                    .map(match => {
                      const { color, score, oppScore, result } = getAlliance(match)
                      const played = score !== -1 && oppScore !== -1
                      const isNextMatch = !played && nextMatch && nextMatch.key === match.key
                      const allianceClass = color === 'red' ? 'red-alliance' : 'blue-alliance'
                      const resultClass = result === 'WIN' ? 'win' : result === 'LOSS' ? 'loss' : 'tie'
                      const matchStatusClass = played ? 'played' : isNextMatch ? 'next-match' : 'upcoming'

                      return (
                        <div key={match.key} className={`match-row ${matchStatusClass}`}>
                          <div className={`match-number ${allianceClass}`}>
                            {match.comp_level?.toUpperCase()}{' '}
                            {match.comp_level !== 'qm' && match.set_number ? `${match.set_number}-` : ''}
                            {match.match_number}
                          </div>
                          <div className="match-key">
                            {match.key}
                          </div>
                          {played ? (
                            <>
                              <div className="score red-score">
                                {match.alliances.red.score}
                              </div>
                              <div className="score blue-score">
                                {match.alliances.blue.score}
                              </div>
                              <div className={`result ${resultClass}`}>
                                {result}
                              </div>
                            </>
                          ) : (
                            <div className="match-time">
                              {match.time
                                ? new Date(match.time * 1000).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })
                                : ''}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          </>
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