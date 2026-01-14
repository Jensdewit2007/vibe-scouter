import type { Team } from '../../types'
import '../../styles/matchesList.css'

interface Match {
  match_number: number
  comp_level: string
  key: string
  alliances: {
    red: { team_keys: string[]; score: number }
    blue: { team_keys: string[]; score: number }
  }
}

interface MatchesListProps {
  nextMatch: Match | undefined
  allMatches: Match[]
  selectedTeam: Team | null
}

function MatchesList({ nextMatch, allMatches, selectedTeam }: MatchesListProps) {
  if (!selectedTeam) {
    return <div className="no-team-selected">Select a team to view matches</div>
  }

  const getAlliance = (match: Match) => {
    const color = match.alliances.red.team_keys.includes(`frc${selectedTeam.id}`) ? 'red' : 'blue'
    const score = match.alliances[color].score
    const oppScore = match.alliances[color === 'red' ? 'blue' : 'red'].score
    let result = ''
    if (score > oppScore) result = 'WIN'
    else if (score < oppScore) result = 'LOSS'
    else result = 'TIE'
    return { color, score, oppScore, result }
  }

  const compLevelOrder: Record<string, number> = { qm: 1, qf: 2, sf: 3, f: 4 }

  const sortedMatches = [...allMatches].sort((a, b) => {
    const aLevel = compLevelOrder[a.comp_level] || 999
    const bLevel = compLevelOrder[b.comp_level] || 999
    if (aLevel !== bLevel) return aLevel - bLevel
    return a.match_number - b.match_number
  })

  return (
    <div className="details-matches-container">
      <div className="matches-header">
        <h2>Team {selectedTeam.id} Matches</h2>
      </div>

      {nextMatch && (
        <div className="next-match-section">
          <h3>Next Match</h3>
          <div className="next-match-display">
            <div className="match-badge">
              {nextMatch.comp_level.toUpperCase()} {nextMatch.match_number}
            </div>
          </div>
        </div>
      )}

      <div className="all-matches-section">
        <h3>All Matches</h3>
        {sortedMatches.length === 0 ? (
          <div className="no-matches">No matches found</div>
        ) : (
          <div className="matches-list">
            {sortedMatches.map(match => {
              const { color, score, oppScore, result } = getAlliance(match)
              const isPlayed = score !== -1
              const isNext = nextMatch?.key === match.key

              return (
                <div
                  key={match.key}
                  className={`match-row ${isNext ? 'next-match' : isPlayed ? 'played' : 'upcoming'}`}
                >
                  <span className={`match-number ${color}-alliance`}>
                    {match.comp_level.toUpperCase()} {match.match_number}
                  </span>
                  {isPlayed && (
                    <>
                      <span className={`score ${color}-score`}>{score}</span>
                      <span className={`score ${color === 'red' ? 'blue' : 'red'}-score`}>{oppScore}</span>
                      <span className={`result ${result.toLowerCase()}`}>{result}</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchesList
