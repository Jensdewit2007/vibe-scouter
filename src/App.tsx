import './App.css'
import Navbar from './components/navbar/navbar'
import Teams from './components/teams/teams'
import Tierlist from './components/tierlist/tierlist'
import Topbar from './components/topbar/topbar'
import { useState, useEffect } from 'react'
import type { Team } from './types'

type SavedTierState = {
  availableTeams: Team[]
  tierTeams: { [key: string]: Team[] }
}

function App() {
  const [availableTeams, setAvailableTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [tierTeams, setTierTeams] = useState<{ [key: string]: Team[] }>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
  })
  const [useTeamColors, setUseTeamColors] = useState(
    localStorage.getItem('useTeamColors') === 'true'
  )

  const apiKey = import.meta.env.VITE_TBA_API_KEY
  const eventKey = localStorage.getItem('eventKey') || '2025cur'
  const STORAGE_KEY = `tierlist_${eventKey}`

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed: SavedTierState = JSON.parse(saved)
      setAvailableTeams(parsed.availableTeams)
      setTierTeams(parsed.tierTeams)
      setLoading(false)
      return
    }

    fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`, {
      headers: { 'X-TBA-Auth-Key': apiKey },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch teams')
        return res.json()
      })
      .then((data: any[]) => {
        const teams: Team[] = data.map(team => ({
          id: team.team_number,
          name: String(team.team_number),
        }))

        // Fetch colors from color API
        const teamNumbers = teams.map(t => t.id)
        const colorUrl =
          'https://api.frc-colors.com/v1/team?' +
          teamNumbers.map(tn => `team=${tn}`).join('&')

        fetch(colorUrl)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch colors')
            return res.json()
          })
          .then(colorData => {
            const colorTeams = teams.map(team => {
              const colorInfo = colorData.teams?.[team.id]
              if (colorInfo && colorInfo.colors?.verified) {
                return {
                  ...team,
                  primaryColor: colorInfo.colors.primaryHex,
                  secondaryColor: colorInfo.colors.secondaryHex,
                }
              }
              return team
            })

            setAvailableTeams(colorTeams)
            setTierTeams({ S: [], A: [], B: [], C: [], D: [] })

            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                availableTeams: colorTeams,
                tierTeams: { S: [], A: [], B: [], C: [], D: [] },
              })
            )
          })
          .catch(err => {
            console.error(err)
            setAvailableTeams(teams)
            setTierTeams({ S: [], A: [], B: [], C: [], D: [] })
            setError('Failed to fetch team colors, showing teams without colors.')
          })
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [eventKey, apiKey, STORAGE_KEY])

  // Persist changes
  useEffect(() => {
    if (loading) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ availableTeams, tierTeams }))
  }, [availableTeams, tierTeams, STORAGE_KEY, loading])

  const filteredTeams = availableTeams
    .filter(team => team.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.id - b.id)

  const addTeamToTier = (tierName: string, team: Team) => {
    setAvailableTeams(prev => prev.filter(t => t.id !== team.id))

    setTierTeams(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(t => {
        updated[t] = updated[t].filter(x => x.id !== team.id)
      })
      updated[tierName] = [...updated[tierName], team]
      return updated
    })
  }

  const removeTeamFromTier = (tierName: string, teamId: number) => {
    setTierTeams(prev => {
      const team = prev[tierName].find(t => t.id === teamId)
      const updated = {
        ...prev,
        [tierName]: prev[tierName].filter(t => t.id !== teamId),
      }

      if (team) {
        setAvailableTeams(prevA =>
          prevA.find(t => t.id === team.id) ? prevA : [...prevA, team]
        )
      }

      return updated
    })
  }

  return (
    <>
      <Topbar useTeamColors={useTeamColors} setUseTeamColors={setUseTeamColors} />

      <Tierlist
        tierTeams={tierTeams}
        onAddTeam={addTeamToTier}
        onRemoveTeam={removeTeamFromTier}
        useTeamColors={useTeamColors}
      />

      {loading && <p>Loading teams...</p>}
      {error && <p>Error loading teams: {error}</p>}

      <div className="search-teams-container">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-teams"
        />
      </div>

      <Teams teams={filteredTeams} useTeamColors={useTeamColors} />
      <Navbar />
    </>
  )
}

export default App
