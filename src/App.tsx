import './App.css'
import Navbar from './components/navbar/navbar'
import Teams from './components/teams/teams'
import Tierlist from './components/tierlist/tierlist'
import Topbar from './components/topbar/topbar'
import { useState, useEffect } from 'react'

type Team = { id: number; name: string }

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

  const apiKey = import.meta.env.VITE_TBA_API_KEY
  const eventKey = localStorage.getItem('eventKey') || '2025cur'

  useEffect(() => {
    setLoading(true)
    setError(null)
    
    fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`, {
      headers: {
        'X-TBA-Auth-Key': apiKey,
      },
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
        setAvailableTeams(teams)
        setError(null)
      })
      .catch(err => {
        setError(err.message)
        setAvailableTeams([])
      })
      .finally(() => setLoading(false))
  }, [eventKey, apiKey])

  const filteredTeams = availableTeams.filter(team =>
    team.name.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => a.id - b.id)

  const addTeamToTier = (tierName: string, team: Team) => {
    setAvailableTeams(prev => prev.filter(t => t.id !== team.id))

    setTierTeams(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(t => {
        updated[t] = updated[t].filter(x => x.id !== team.id)
      })
      if (!updated[tierName].find(x => x.id === team.id)) {
        updated[tierName] = [...updated[tierName], team]
      }
      return updated
    })
  }

  const removeTeamFromTier = (tierName: string, teamId: number) => {
    setTierTeams(prev => {
      const teamToRemove = prev[tierName].find(t => t.id === teamId)
      const updated = { ...prev, [tierName]: prev[tierName].filter(t => t.id !== teamId) }
      if (teamToRemove) {
        setAvailableTeams(prevA => {
          if (prevA.find(t => t.id === teamToRemove.id)) return prevA
          return [...prevA, teamToRemove]
        })
      }
      return updated
    })
  }

  return (
    <>
      <Topbar />
      <Tierlist
        tierTeams={tierTeams}
        onAddTeam={(tier, team) => addTeamToTier(tier, team)}
        onRemoveTeam={(tier, id) => removeTeamFromTier(tier, id)}
      />
      {loading && <p>Loading teams...</p>}
      {error && <p>Error loading teams: {error}</p>}
      <div style={{ position: 'fixed', bottom: '22%', left: '50%', transform: 'translateX(-50%)' }}>
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '2px solid black' }}
        />
      </div>
      <Teams teams={filteredTeams} />
      <Navbar />
    </>
  )
}

export default App
