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

function MatchesPage({ setCurrentPage, availableTeams }: MatchesPageProps) {
  const [data, setData] = useState<any[]>([])
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
    setLoading(true)
    setError(null)
    fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
      headers: { 'X-TBA-Auth-Key': import.meta.env.VITE_TBA_API_KEY },
    })
      .then(res => {
        if (!res.ok) throw new Error('API error')
        return res.json()
      })
      .then((data: Match[]) => {
        setData(data)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [eventKey])

  const compOrder: Record<string, number> = { qm: 1, qf: 2, sf: 3, f: 4 }

  const sortedMatches = [...data].sort((a, b) => {
    const aLevel = compOrder[a.comp_level] ?? 99
    const bLevel = compOrder[b.comp_level] ?? 99
    if (aLevel !== bLevel) return aLevel - bLevel
    return a.match_number - b.match_number
  })

  return (
    <>
      <Navbar currentPage="matches" setCurrentPage={setCurrentPage ?? (() => {})} />
      <div className="matches-page-container">
        <h1 className="matches-page-title">Matches</h1>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="matches-page-list">
          {[...sortedMatches]
            .sort((a, b) => {
              const aLevel = compOrder[a.comp_level] ?? 99
              const bLevel = compOrder[b.comp_level] ?? 99
              if (aLevel !== bLevel) return aLevel - bLevel
              return a.match_number - b.match_number
            })
            .map(match => {
              const played = match.alliances.red.score !== -1 && match.alliances.blue.score !== -1
              const redFirst = match.alliances.red.team_keys?.[0]
              const blueFirst = match.alliances.blue.team_keys?.[0]
              const redTeamId = redFirst ? Number(redFirst.replace('frc', '')) : undefined
              const blueTeamId = blueFirst ? Number(blueFirst.replace('frc', '')) : undefined

              let result = ''
              if (played) {
                if (match.alliances.red.score > match.alliances.blue.score) result = 'RED WIN'
                else if (match.alliances.red.score < match.alliances.blue.score) result = 'BLUE WIN'
                else result = 'TIE'
              }

              const redTeams = (match.alliances.red.team_keys || []).map((k: string) => Number(k.replace('frc', '')))
              const blueTeams = (match.alliances.blue.team_keys || []).map((k: string) => Number(k.replace('frc', '')))

              return (
                <div key={match.key} className={`matches-page-row ${played ? 'played' : 'upcoming'}`}>
                  <div className="match-meta">
                    {match.comp_level?.toUpperCase()} {match.comp_level !== "qm" && match.set_number ? `${match.set_number}-` : ""}{match.match_number}
                  </div>

                  <div className="match-teams">
                    <div className="team-chips">
                      {redTeams.map(id => (
                        <span key={`r-${id}`} className="team-chip red" onClick={() => openTeamDetails(id)} role="button" title={`Open details for ${id}`}>
                          {id}
                        </span>
                      ))}
                    </div>

                    <div className="match-result">
                      {played ? result : (match.time ? new Date(match.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Upcoming')}
                    </div>

                    <div className="team-chips">
                      {blueTeams.map(id => (
                        <span key={`b-${id}`} className="team-chip blue" onClick={() => openTeamDetails(id)} role="button" title={`Open details for ${id}`}>
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="match-key">{match.key}</div>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}

export default MatchesPage
