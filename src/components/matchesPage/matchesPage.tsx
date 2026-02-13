import { useState, useEffect } from 'react'
import type { Team } from '../../types'
import Navbar from '../layout/navbar/navbar'
import '../../styles/matchesPage.css'

interface Match {
  key: string
  match_number: number
  comp_level: string
  set_number?: number
  alliances: {
    red: { team_keys: string[]; score: number }
    blue: { team_keys: string[]; score: number }
  }
  time?: number
}

interface MatchesPageProps {
  setCurrentPage?: (page: 'home' | 'details' | 'matches') => void
  availableTeams?: Team[]
}

function MatchesPage({ setCurrentPage }: MatchesPageProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const eventKey = localStorage.getItem('eventKey') || '2025cc'

  const openTeamDetails = (teamId?: number) => {
    if (!teamId) return
    localStorage.setItem('selectedTeamId', String(teamId))
    window.dispatchEvent(new CustomEvent('openDetails', { detail: { teamId } }))
    setCurrentPage?.('details')
  }

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`,
          { headers: { 'X-TBA-Auth-Key': import.meta.env.VITE_TBA_API_KEY } }
        )
        if (!res.ok) throw new Error('API error')
        const data: Match[] = await res.json()

        // Sort matches
        const compOrder: Record<string, number> = { qm: 1, qf: 2, sf: 3, f: 4 }
        const sorted = data.sort((a, b) => {
          const aLevel = compOrder[a.comp_level] ?? 99
          const bLevel = compOrder[b.comp_level] ?? 99
          if (aLevel !== bLevel) return aLevel - bLevel
          return a.match_number - b.match_number
        })

        setMatches(sorted)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [eventKey])

  const renderMatch = (match: Match) => {
    const redTeams = match.alliances.red.team_keys.map(t => Number(t.replace('frc', '')))
    const blueTeams = match.alliances.blue.team_keys.map(t => Number(t.replace('frc', '')))
    const played = match.alliances.red.score >= 0 && match.alliances.blue.score >= 0

    let resultText = ''
    if (played) {
      if (match.alliances.red.score > match.alliances.blue.score) resultText = 'RED WIN'
      else if (match.alliances.red.score < match.alliances.blue.score) resultText = 'BLUE WIN'
      else resultText = 'TIE'
    }

    const scoreText = played
      ? `${match.alliances.red.score} - ${match.alliances.blue.score}`
      : match.time
      ? new Date(match.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Upcoming'

    const matchLabel = `${match.comp_level.toUpperCase()}${
      match.comp_level !== 'qm' && match.set_number ? match.set_number + '-' : ''
    }${match.match_number}`

    return (
      <div key={match.key} className={`matches-page-row ${played ? 'played' : 'upcoming'}`}>
        <div className="match-meta">{matchLabel}</div>

        <div className="match-teams">
          <div className="team-chips">
            {redTeams.map(id => (
              <span
                key={`r-${id}`}
                className="team-chip red"
                onClick={() => openTeamDetails(id)}
                role="button"
                title={`Open details for ${id}`}
              >
                {id}
              </span>
            ))}
          </div>

          <div className="match-result">
            <div>{scoreText}</div>
            {played && <div className="match-winner">{resultText}</div>}
          </div>

          <div className="team-chips">
            {blueTeams.map(id => (
              <span
                key={`b-${id}`}
                className="team-chip blue"
                onClick={() => openTeamDetails(id)}
                role="button"
                title={`Open details for ${id}`}
              >
                {id}
              </span>
            ))}
          </div>
        </div>

        <div className="match-key">{match.key}</div>
      </div>
    )
  }

  return (
    <>
      <Navbar currentPage="matches" setCurrentPage={setCurrentPage ?? (() => {})} />
      <div className="matches-page-container">
        <h1 className="matches-page-title">Matches</h1>

        {loading && <div className="matches-loading">Loading...</div>}
        {error && <div className="matches-error">{error}</div>}

        {/* Center the list */}
        <div className="matches-page-list-wrapper">
          <div className="matches-page-list">{matches.map(renderMatch)}</div>
        </div>
      </div>
    </>
  )
}

export default MatchesPage
